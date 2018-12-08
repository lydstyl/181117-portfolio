const path = require( 'path' )

const modelPost = require( path.join('../model/model-post') )

/**
 * Return true if there is no data/<post>.json or fase otherway
 */
module.exports = function noData() {
    const files = modelPost.getFiles()
    if ( !files.length || (files.length == 1 && files[0] == 'positions.json') ) {
        return true
    }
    return false
}