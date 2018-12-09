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
    let tmp = fs.readdirSync( path.join( __dirname, '../data/' ) )
    let dataFiles = []
    tmp.forEach(file => {
        if ( !(file == 'positions.json') ) {
            dataFiles.push(file)
        }
    });
    return dataFiles
}
function writeEmptyPositions() {
    json = JSON.stringify('[]', '', 3)
    fs.writeFileSync( positionsPath, json, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
}
function getPositions() {
    if ( !fs.existsSync(positionsPath) ) {
        writeEmptyPositions()
    }
    return require( positionsPath )
}
function addDataFilesInPositions() {
    const dataFiles = getDataFiles()
    let positions = getPositions()
    if (typeof positions == 'string') {
        positions = JSON.parse(positions)
    }
    for ( let file of dataFiles ) {
        if ( !positions.includes( file ) && file != 'positions.json' ) {
            if ( !(positions.length) ) {
                positions.unshift( file )
            }
            else{
                positions.push(file)
            }
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
function rmPosition(position) {
    let positions = getPositions()
    let newPositions = []
    positions.forEach(pos => {
        if (pos != position) {
            newPositions.push(pos)
        }
    });
    writeJsonPositions(newPositions)
    return newPositions
}
function addPosition(position) {
    let positions = getPositions()
    positions = positions.unshift(position)
    writeJsonPositions( positions )
    return positions
}

module.exports = {
    getPositions: getPositions,
    writeJsonPositions: writeJsonPositions,
    mirrorDataPositions: mirrorDataPositions,
    rmPosition: rmPosition,
    addPosition: addPosition,
    addDataFilesInPositions: addDataFilesInPositions,
    writeEmptyPositions: writeEmptyPositions
}