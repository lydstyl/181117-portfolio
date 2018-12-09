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
    })
    return dataFiles
}
function writeEmptyPositions() {
    json = JSON.stringify('[]', '', 3)
    fs.writeFileSync( positionsPath, json, (err) => {
        if(err) {
            return console.log(err)
        }
        console.log("The file was saved!")
    })
}
function getPositions() {
    if ( !fs.existsSync(positionsPath) ) {
        writeEmptyPositions()
    }
    const positions = JSON.parse( fs.readFileSync( path.dirname(require.main.filename) + '/data/positions.json', 'utf8' ) ) // because require( positionsPath ) stays in cache ...
    return positions
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
    })
    writeJsonPositions(newPositions)
    return newPositions
}
function rmImg(position) {
    const imgSrc = getImgSrc(position)
    if (!imgSrc || imgSrc.includes('http')) {
        console.log('No image to remove');
        return
    }
    const imgPath = path.join( __dirname, '../../public', imgSrc )
    try {
        fs.unlinkSync(imgPath)
        console.log(`Image ${imgPath} removed`);
    } catch(err) {
        console.error(err)
    }
}
function getImgSrc(position) {
    let filePath = path.join(path.dirname(require.main.filename), 'data', position )
    if (fs.existsSync( filePath )) {
        let imgSrc = fs.readFileSync( filePath, 'utf8' )
        imgSrc = JSON.parse(imgSrc)
        imgSrc = imgSrc.imgsrc
        return imgSrc
    }
    return false
}
function addPosition(position) {
    let positions = getPositions()
    positions.unshift(position)
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
    writeEmptyPositions: writeEmptyPositions,
    rmImg: rmImg
}