const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const resizeImg = require('resize-img');

const DateId = require('../helper/maintenant.js');
const getFiles = require('../model/model-post')
const uploadDir = './public/img/upload';

const router = express.Router();
const upload = multer({ dest: uploadDir })

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
    let id = position  + '-' + dateId.name + '-' + req.body.name.substring(0, 9)
    let filePath = path.join( path.dirname(require.main.filename), 'data', id + '.json' );
    if (fs.existsSync(filePath)) {
        position ++;
        id = position  + '-' + dateId.name + '-' + req.body.name.substring(0, 9)
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
    
    const upDir = '../public/img/upload/'
    const imgDir = '../public/img/'
    const lastJustFileName = req.body.id + '-sm.' + ext
    file1 = path.join( path.dirname(require.main.filename), upDir, justFilname2 );
    file2 = path.join( path.dirname(require.main.filename), imgDir, lastJustFileName );
    
    resizeImg(fs.readFileSync(file1), {width: 510, height: 340}).then(buf => {
        fs.writeFileSync( file2, buf);
    });
    
    // update src 
    const src = 'img/' + lastJustFileName
    const filePath = path.dirname(require.main.filename) + '/data/' + req.body.id + '.json';
    let json = fs.readFileSync( filePath );
    json = JSON.parse(json)
    json.imgsrc = src;
    json = JSON.stringify(json);
    fs.writeFileSync(filePath, json, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    res.redirect('/');
})

router.post('/update', (req, res) =>{
    // todo update uniquement les infos qu'on a exemple ne pas update imgsrc ... name doit pas etre required ici
    const filePath = path.dirname(require.main.filename) + '/data/' + req.body.id + '.json';
    let json = {
        id: req.body.id,
        filePath: filePath,
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

    res.redirect('/'); 
})

module.exports = router;