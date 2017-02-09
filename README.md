# datto-conway
Conway's Game of Life

# Examples
To display the next generation from a file:
 `conway input.txt`
 
To display the 2nd input file and four generations:
`conway input2.txt i 4`

To generate a random 5x5 matrix, display it and the next generation:
`conway . gi`

# Usage
conway filepath [options] [generations]

options: 
* g: generate input,
* h: display help,
* i: display input,
* t: display times,
* s: suppress output,
* r: return output.

generations: number of generations to calculate.

# Requirements
node (NodeJS 4+).

Author: David P. Hochman
