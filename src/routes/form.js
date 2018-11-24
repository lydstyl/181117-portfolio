const express = require('express');
const router = express.Router();



router.get('/add', (req, res) =>{
    if (req.session.admin == 'admin') {
        res.render('add', {  })
    }else{
        res.redirect('/admin')
    }
})

// C
router.post('/add', (req, res) =>{
    req.session.test = 'add ' + req.body.name;
    res.redirect('/'); 
})

// R

// U

// D


module.exports = router;