const path = require('path')
const modelPositions = require( path.join('../model/model-positions') )
const noData = require( path.join('../helper/no-data') )
module.exports = function (req,  res) {
    let posts = []
    if ( !noData() ) {
      posts = modelPositions.getPositions()
    }
    res.render('manage', {
      posts: posts
    })    
}