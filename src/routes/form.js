const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const resizeImg = require('resize-img');
const cliTruncate = require('cli-truncate');

const DateId = require('../helper/maintenant.js');
const getFiles = require('../model/model-post')
const modelPositions = require('../model/model-positions')
const uploadDir = './public/img';

const router = express.Router();
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
    let filePath = path.join( path.dirname(require.main.filename), 'data', id + '.json' );
    if (fs.existsSync(filePath)) {
        position ++;
        id = position  + '-' + dateId.name + '-' + name
        filePath = path.join( path.dirname(require.main.filename), 'data', id + '.json' );
    }
    let json = {
        id: id,
        position: position,
        postCreationDate: date,
        name: req.body.name,
        description: 'my description',
        imgsrc: 'https://lydstyl.github.io/CV_WEB_DEV/portfolio/img/html.jpg'
    }
    json = JSON.stringify(json, '', 3);
    fs.writeFileSync(filePath, json, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    modelPositions.addPosition( id + '.json' )
    res.redirect('/'); 
})

// R in home page ...


// U

router.post('/updateimg', upload.single('myimage'), (req, res, next) => {
    // todo simplify
    // req.file is the `myimage` file
    // req.body will hold the text fields, if there were any
    let ext = req.file.originalname.split('.');
    ext = ext[ext.length - 1];
    const filename1 = uploadDir + '/' + req.file.filename;
    const justFilname2 = req.body.id + '.' + ext
    const filename2 = uploadDir + '/' + justFilname2;
    fs.rename(filename1, filename2, (err) => {
        if (err) throw err;
        console.log('renamed complete');
    });
    
    const imgDir = '../public/img/'
    const lastJustFileName = req.body.id + '-sm.' + ext
    file1 = path.join( path.dirname(require.main.filename), imgDir, justFilname2 );
    file2 = path.join( path.dirname(require.main.filename), imgDir, lastJustFileName );
    
    resizeImg(fs.readFileSync(file1), {width: 510, height: 340}).then(buf => {
        fs.writeFileSync( file2, buf);
    });

    if (fs.existsSync(file1)) {
        fs.unlinkSync( file1 );
    }
    
    // update src 
    const src = 'img/' + lastJustFileName
    const filePath = path.join( path.dirname(require.main.filename), 'data', req.body.id + '.json')
    let json = fs.readFileSync( filePath );
    json = JSON.parse(json)
    json.imgsrc = src;
    json = JSON.stringify(json, '', 3);
    fs.writeFileSync(filePath, json, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    console.log('Well done via ajax :-)');
    res.json({success : "Updated Successfully", status : 200});

})

router.post('/update', (req, res) =>{
    const filePath = path.join( __dirname, '../data', req.body.id + '.json' )
    let json = fs.readFileSync( filePath );
    json = JSON.parse(json)

    json.name = req.body.name;
    json.link = req.body.link;
    json.lgdesc = req.body.lgdesc;
    json.smdesc = cliTruncate(req.body.lgdesc, 50);
    
    json = JSON.stringify(json, '', 3);
    fs.writeFileSync(filePath, json, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    res.redirect('/'); 
})

router.get('/edit/:id', (req, res) =>{
    
    let file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json', 'utf8' );
    file = JSON.parse(file)
    res.render('add', { title: 'Portfolio admin', file: file })
})

// D
router.get('/del/:id', (req, res) =>{
    const jsonPath = path.join(__dirname , '../data' , req.params.id + '.json')
    if ( fs.existsSync(jsonPath) ) {
        fs.unlinkSync( jsonPath );
    }

    const imgPath = path.join(__dirname , '../../public/img' , req.params.id);
    if (fs.existsSync(imgPath + '-sm.png')) {
        fs.unlinkSync( imgPath + '-sm.png' );
    }
    if (fs.existsSync(imgPath + '-sm.jpg')) {
        fs.unlinkSync( imgPath + '-sm.jpg' );
    }

    modelPositions.rmPosition( req.params.id + '.json') // or updateJsonPositions() might work too

    res.redirect('/'); 
})

router.post('/update-positions', (req, res) =>{
    console.log('/update-positions');
    modelPositions.writeJsonPositions( req.body.positions, req )
})

module.exports = router;