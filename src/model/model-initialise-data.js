const fs = require('fs')
const path = require('path')

const modelPost = require( path.join('../model/model-post') )
const modelPosition = require( path.join('../model/model-positions') )

/**
 * Return true if there is no data/<post>.json or fase otherway
 */
function noData() {
    const files = modelPost.getFiles()
    if ( !files.length || (files.length == 1 && files[0] == 'positions.json') ) {
        return true
    }
    return false
}

module.exports = function () {
    console.log('initializing...')
    let missing = ''
    if ( !fs.existsSync( path.join( __dirname, '../data/positions.json') ) ) {
        missing += '-positions'
    }
    if ( noData() ) {
        missing += '-data'
    }
    switch (missing) {
        case '-positions':
            console.log('creating positions');
            if ( noData() ) {
                modelPost.writeInitPositions()
            }
            else {
                modelPosition.addDataFilesInPositions()
            }
            break;
        case '-data':
            console.log('creating data');
            modelPost.initFirstPost()
            modelPost.writeInitPositions()
            break;
        case '-positions-data':
            console.log('creating positions and data');
            modelPost.initFirstPost()
            modelPost.writeInitPositions()
            break;
    
        default:
            console.log('nothing to create');
            break;
    }
}