const fs = require('fs');

function getPositions() {
    return require('./positions.json').positions;
}

function addPosition(fileName) {
    positions = getPositions();
    
    setFilesNames(positions);
}
function getPosition(fileName) {
    
}
function setPositions(positions) {
    // {
    //     "positions": ["one", "two"]
    // }
    setFilesNames(positions);
}
function rmPosition(fileName) {
    setFilesNames(positions);
}

function setFilesNames(positions) {
    console.log('setFilesNames ...');
    console.log(positions);
}


addPosition('three');

console.log( getPositions() );


module.exports = {
    getPositions: getPositions,
    setPositions: setPositions
}