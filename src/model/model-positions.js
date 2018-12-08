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
    return positions
}

function getDataFiles() {
    let dataFiles = fs.readdirSync( path.join( __dirname, '../data/' ) )
    dataFiles.pop( 'positions.json' )
    return dataFiles
}
function getPositions() {
    return require( positionsPath )
}
function addDataFilesInPositions() {
    const dataFiles = getDataFiles()
    let positions = getPositions()
    for ( let file of dataFiles ) {
        if ( !positions.includes( file ) ) {
            positions.unshift( file )
        }
    }
    writeJsonPositions(positions)
    return positions
}
function rmPositionsNotInData() {
    const dataFiles = getDataFiles()
    let positions = getPositions()
    let newPositions = []
    for ( let file of positions ) {
        if ( dataFiles.includes( file ) ) {
            newPositions.push(file)
        }
    }
    writeJsonPositions(newPositions)
    return newPositions
}
function mirrorDataPositions() {
    let positions = addDataFilesInPositions()
    positions = rmPositionsNotInData()
    return positions
}

module.exports = {
    getPositions: getPositions,
    updatePositions: writeJsonPositions,
    mirrorDataPositions: mirrorDataPositions
}