const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

router.get('/add', (req, res) =>{
    if (req.session.admin == 'admin') {
        res.render('add', {  })
    }else{
        res.redirect('/admin')
    }
})

// C
router.post('/add', (req, res) =>{

    // write json for 1 name or one post
    //req.session.test = 'add ' + req.body.name;
    const id = uniqid();
    const filePath = path.dirname(require.main.filename) + '/data/' + id + '.json';
    let json = {
        id: id,
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

// R in home page ...


// U

router.post('/update', (req, res) =>{
    
    console.log('EDIT POST' + req.body.name);


    res.redirect('/'); 
})
router.get('/edit/:id', (req, res) =>{
    
    let file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json', 'utf8' );
    file = JSON.parse(file)
    
    console.log(`Edit ${req.params.id}`);
    console.log(file);

    res.render('add', { title: 'Portfolio admin', file: file })
})

// D
router.get('/del/:id', (req, res) =>{
    fs.unlinkSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json' );
    res.redirect('/'); 
})


module.exports = router;