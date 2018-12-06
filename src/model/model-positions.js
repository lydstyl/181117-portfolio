const fs = require('fs')
const path = require('path')

function getPositions() {
    const positionsPath = path.join( __dirname, '../data/positions.json' )
    let positions = require( positionsPath )

    let dataFiles = fs.readdirSync( path.join( __dirname, '../data/' ) )
    dataFiles.pop( 'positions.json' )
    for ( const file of dataFiles ) {
        if ( !positions.includes( file ) ) {
            positions.unshift( file )
        }
    }

    const json = JSON.stringify( positions, '', 3 )
    fs.writeFileSync( positionsPath, json, (err) => {
        if( err ) {
            return console.log( err )
        }
        console.log( "The file was saved!" )
    })

    return positions
}

// function addPosition(fileName) {
//     positions = getPositions();
//     //position.push
//     setFilesNames(positions);
// }
// function getPosition(fileName) {
    
// }
// function setPositions(positions) {
//     // {
//     //     "positions": ["one", "two"]
//     // }
//     setFilesNames(positions);
// }
// function rmPosition(fileName) {
//     setFilesNames(positions);
// }

// function setFilesNames(positions) {
//     console.log('setFilesNames ...');
//     console.log(positions);
// }

module.exports = {
    getPositions: getPositions,
    //setPositions: setPositions
}