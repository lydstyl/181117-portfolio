const fs = require('fs')
const path = require('path')

const positionsPath = path.join( __dirname, '../data/positions.json' )

function writeJsonPositions(positions) {
    if (typeof positions == 'string') {
        positions = JSON.parse(positions)
    }
    positions = JSON.stringify( positions, '', 3 )
    fs.writeFileSync( positionsPath, positions, (err) => {
        if( err ) {
            return console.log( err )
        }
        console.log( "The file was saved!" )
    })
}

function getPositions() {
    let positions = require( positionsPath )
    let dataFiles = fs.readdirSync( path.join( __dirname, '../data/' ) )
    dataFiles.pop( 'positions.json' )
    for ( let file of dataFiles ) {
        if ( !positions.includes( file ) ) {
            positions.unshift( file )
        }
    }
    writeJsonPositions(positions)
    return positions
}

// function addPosition(fileName) {
//     positions = getPositions();
//     //position.push
//     setFilesNames(positions);
// }
// function getPosition(fileName) {
    
// }
function setPositions(positions) {
    writeJsonPositions(positions)
}
// function rmPosition(fileName) {
//     setFilesNames(positions);
// }

// function setFilesNames(positions) {
//     console.log('setFilesNames ...');
//     console.log(positions);
// }

module.exports = {
    getPositions: getPositions,
    updatePositions: setPositions
    //setPositions: setPositions
}