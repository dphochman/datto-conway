/**
 * Conway's Game of Life
 * @param [String] filePath - local filespec.
 * @param [String] options - g: generate input, i: display input, t: display times, s: suppress output, r: return output.
 * @return [String] new state.
 * 
 * USAGE
 * To display the next generation from a file.
 *     conway filename
 * To display the input and four generations.
 *     conway filename i 4
 * To generate a random 5x5 matrix.
 *     conway . g
 */

var output = '',
    timer = new DPHTimer(),
    filePath = (process.argv[2] || ""),
    options = (process.argv[3] || ""),
    generations = (process.argv[4] || 1),
    input = '',
    grid = [],
    counts = [];

// Display the help.
if (options.indexOf('h') > -1 || filePath === "") {
    console.log("conway filepath [options] [generations]");
    console.log("options: g: generate input,\n\t h: display help,\n\t i: display input,\n\t t: display times,\n\t s: suppress output,\n\t r: return output.");
    console.log("generations: number of generations to calculate.");
    return;
}

// Get the initial raw input.
if (options.indexOf("g") > -1) {
    input = getRandomInput();
} else {
    input = getInputFromPath(filePath);
}
if (options.indexOf("i") > -1) console.log(input, "\n");

do {
    grid = getGridFromText(input); // Build a grid.
    if (options.indexOf("t") > -1) timer.lap('readInput:');

    counts = getCounts(grid); // Count the neighbors.
    if (options.indexOf("t") > -1) timer.lap('getCounts:');

    output = getOutput(grid, counts); // Calculate the next generation.
    if (options.indexOf("t") > -1) timer.lap('getOutput:');

    if (options.indexOf('s') === -1) {
        console.log(output, "\n"); // Display the output.
        if (options.indexOf("t") > -1) timer.lap('logOutput:');
    }

    input = output; // Setup the next generation.
    generations -= 1;
} while (generations >= 1);

if (options.indexOf("r") > -1) {
    return output;
}

/**
 * getInputFromPath - Return the file contents from a local file path.
 * @param String filePath - Local file path.
 * @return String fileData - text file contents.
 */
function getInputFromPath(filePath) {
    var fs = require('fs'),
        fileOptions = {encoding:'utf8', flag:'r'},
        fileData = '';

    filePath = filePath || "./input.txt";

    try {
        fileData = fs.readFileSync(filePath, fileOptions);
    } catch(e1) {
        try {
            // Read an alternative file.
            fileData = fs.readFileSync(filePath + ".txt", fileOptions);
        } catch (e2) {
            console.log(e1.toString());
            console.log(e2.toString());
            throw new Error("Cannot read file.");
        }
    }
    fs = fileOptions = null;
    return (fileData);
}

function getRandomInput(width, height) {
    if (typeof width !== "number" || width < 1 || width > 9) {width = 5;}
    if (typeof height !== "number" || height < 1 || height > 9) {height = width;}
    var input = Object.keys(Array.apply(null, Array(height))).map(function () {
        return (Object.keys(Array.apply(null, Array(width))).map(function () {
            return (Math.floor(Math.random() * 2).toString());
        })).join('');
    }).join('\n');
    return input;
}

/**
 * getGridFromText - Convert text input into a 2-dimensional grid.
 * @param String input - raw input text.
 * @return [[String]] grid - 2-dimensional array of single characters.
 */
function getGridFromText(input) {
    var grid = input.split(/\r?\n/).map(function (row) {return (row.split(''));});
    return grid;
}

/**
 * getCounts - Count live neighbors.
 * @param [[String]] grid - 2-dimensional array of cells.
 * @return [[Number]] counts - 2-dimensional array of number of live neighbors.
 */
function getCounts(grid) {
    return (grid.map(function (row, rowIndex) {
        return (row.map(function (cell, colIndex) {
            var _row,
                _count = 0;

            _row = grid[rowIndex - 1]; // Previous row
            if (_row !== undefined) {
                if (_row[colIndex - 1] === '1') {_count += 1;}
                if (_row[colIndex + 0] === '1') {_count += 1;}
                if (_row[colIndex + 1] === '1') {_count += 1;}
            }

            _row = grid[rowIndex + 0]; // Current row
            if (_row[colIndex - 1] === '1') {_count += 1;}
            if (_row[colIndex + 1] === '1') {_count += 1;}

            _row = grid[rowIndex + 1]; // Next row
            if (_row !== undefined) {
                if (_row[colIndex - 1] === '1') {_count += 1;}
                if (_row[colIndex + 0] === '1') {_count += 1;}
                if (_row[colIndex + 1] === '1') {_count += 1;}
            }

            return _count;
        }));
    }));
}

/**
 * getOutput - Generate the next generation.
 * @param [[String]] grid - Current state.
 * @param [[Number]] counts - Number of live neighbors
 * @return String - New state.
 */
function getOutput(grid, counts) {
    var cell;
    return (counts.map(function (row, rowIndex) {
        return (row.map(function (count, colIndex) {
            if (count === 3) {
                return '1';
            } else {
                cell = grid[rowIndex][colIndex];
                return (cell === '1' && count === 2 ? '1' : '0');
            }
        }).join(''));
    }).join('\n'));
}

/**
 * DPHTimer - Lap timer for runtime statistics.
 */
function DPHTimer() {
    this.cpu0 = process.cpuUsage();
    this.now0 = (new Date()).getTime();
    this.lap = function (title) {
        var now1 = (new Date()).getTime();
        this.cpu0 = process.cpuUsage(this.cpu0);

        this.cpu = (this.cpu0.user + this.cpu0.system);
        this.cpums = Math.floor(this.cpu / 1000);
        this.time = (now1 - this.now0);
        this.now0 = now1;
        console.log((title || 'Lap:') + this.time, 'CPU:'+this.cpu);
    };
    return this;
}
