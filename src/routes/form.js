const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const DateId = require('../helper/maintenant.js');
const getFiles = require('../model/model-post')
const multer = require('multer');

const uploadDir = './public/img/upload';
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
        imgsrc: 'my/src/img' // https://lydstyl.github.io/CV_WEB_DEV/portfolio/img/html.jpg
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
    // req.file is the `myimage` file
    // req.body will hold the text fields, if there were any
    const filename1 = uploadDir + '/' + req.file.filename;
    const filename2 = uploadDir + '/' + req.body.id + '.jpg';
    // todo redim image ici
    fs.rename(filename1, filename2, (err) => {
        if (err) throw err;
        console.log('renamed complete');
    });
    res.redirect('/');
})

router.post('/update', (req, res) =>{
    const filePath = path.dirname(require.main.filename) + '/data/' + req.body.id + '.json';
    let json = {
        id: req.body.id,
        filePath: filePath,
        name: req.body.name,
        description: 'my description',
        imgsrc: 'my/src/img'
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
    fs.unlinkSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json' );
    res.redirect('/'); 
})

module.exports = router;