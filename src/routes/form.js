const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const sizeOf = require('image-size');
const resizeImg = require('resize-img')
const cliTruncate = require('cli-truncate')

const DateId = require('../helper/maintenant.js')
const getFiles = require('../model/model-post')
const modelPositions = require('../model/model-positions')
const uploadDir = './public/img'

const router = express.Router()
const upload = multer({ dest: uploadDir })

function updateJsonPositions() {
    modelPositions.writeEmptyPositions()
    modelPositions.addDataFilesInPositions()
}

router.get('/add', (req, res) =>{
    if (req.session.admin == 'admin') {
        res.render('add', {  })
    }else{
        res.redirect('/admin')
    }
})

// C
router.post('/add', (req, res) =>{
    const date = new Date()
    const dateId = new DateId( date )
    let position = getFiles.getFiles().length
    let name = req.body.name.substring(0, 9)
    name = name.replace(/\s/g, '_')
    let id = position  + '-' + dateId.name + '-' + name
    let filePath = path.join( path.dirname(require.main.filename), 'data', id + '.json' )
    if (fs.existsSync(filePath)) {
        position ++
        id = position  + '-' + dateId.name + '-' + name
        filePath = path.join( path.dirname(require.main.filename), 'data', id + '.json' )
    }
    let json = {
        id: id,
        position: position,
        postCreationDate: date,
        name: req.body.name,
        description: 'my description',
        imgsrc: 'https://lydstyl.github.io/CV_WEB_DEV/portfolio/img/html.jpg'
    }
    json = JSON.stringify(json, '', 3)
    fs.writeFileSync(filePath, json, function(err) {
        if(err) {
            return console.log(err)
        }
        console.log("The file was saved!")
    }); 
    modelPositions.addPosition( id + '.json' )
    modelPositions.writeLastUpdate()
    res.redirect('/'); 
})

// R in home page ...


// U

router.post('/updateimg', upload.single('myimage'), (req, res, next) => {
    // todo simplify
    // req.file is the `myimage` file
    // req.body will hold the text fields, if there were any
    let ext = req.file.originalname.split('.')
    ext = ext[ext.length - 1]
    const filename1 = uploadDir + '/' + req.file.filename
    const justFilname2 = req.body.id + '.' + ext
    const filename2 = uploadDir + '/' + justFilname2
    fs.rename(filename1, filename2, (err) => {
        if (err) throw err
        console.log('renamed complete')
    })
    
    const imgDir = '../public/img/'
    const lastJustFileName = req.body.id + '-sm.' + ext
    const expected = {
        width: 510,
        height: 340
    }
    file1 = path.join( path.dirname(require.main.filename), imgDir, justFilname2 )
    file2 = path.join( path.dirname(require.main.filename), imgDir, lastJustFileName )

    const dimensions = sizeOf( file1 );
    function reduceImg() {
        if (dimensions.width > expected.width) {
            return {
                width : expected.width,
                height: dimensions.height * expected.width / dimensions.width
            }
        }
        else{
            return dimensions
        }
    }
    const newDim = reduceImg()
    
    resizeImg(fs.readFileSync(file1), {width: newDim.width, height: newDim.height}).then(buf => {
        fs.writeFileSync( file2, buf)
    })

    if (fs.existsSync(file1)) {
        fs.unlinkSync( file1 )
    }
    
    // update src 
    const src = 'img/' + lastJustFileName
    const filePath = path.join( path.dirname(require.main.filename), 'data', req.body.id + '.json')
    let json = fs.readFileSync( filePath )
    json = JSON.parse(json)
    json.imgsrc = src
    json = JSON.stringify(json, '', 3)
    fs.writeFileSync(filePath, json, function(err) {
        if(err) {
            return console.log(err)
        }
        console.log("The file was saved!")
    }); 
    console.log('Well done via ajax :-)')
    res.json({success : "Updated Successfully", status : 200})

})

router.post('/update', (req, res) =>{
    const filePath = path.join( __dirname, '../data', req.body.id + '.json' )
    let json = fs.readFileSync( filePath )
    json = JSON.parse(json)

    json.name = req.body.name.trim()
    json.link = encodeURI( req.body.link.trim() )
    json.lgdesc = req.body.lgdesc.trim()
    json.smdesc = cliTruncate(req.body.lgdesc, 50)
    
    json = JSON.stringify(json, '', 3)
    fs.writeFileSync(filePath, json, (err) => {
        if(err) {
            return console.log(err)
        }
        console.log("The file was saved!")
    }); 

    res.redirect('/')
})

router.get('/edit/:id', (req, res) =>{
    
    let file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json', 'utf8' )
    file = JSON.parse(file)
    res.render('add', { title: 'Portfolio admin', file: file })
})

// D
router.get('/del/:id', (req, res) =>{
    const dataJson = req.params.id + '.json'
    const jsonPath = path.join(__dirname , '../data' , dataJson)
    modelPositions.rmImg( dataJson )
    if ( fs.existsSync( jsonPath) ) {
        fs.unlinkSync( jsonPath )
    }

    modelPositions.rmPosition( req.params.id + '.json') // or updateJsonPositions() might work too

    res.redirect('/')
})

router.post('/update-positions', (req, res) =>{
    console.log('/update-positions')
    modelPositions.writeJsonPositions( req.body.positions, req )
})

module.exports = router;