const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  const testFolder = path.dirname(require.main.filename) + '/data/';
  let files = fs.readdirSync( testFolder );
  let posts = [];
  for (let i in files) {
    let file = files[i];
    file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + file, 'utf8' );
    posts.push( JSON.parse(file) )
  }
  res.render('index', { title: 'Portfolio Gabriel Brun', message: 'Bienvenu sur mon portfolio!', posts: posts })
})

router.get('/page:nb', (req, res) =>{
  res.render('index', { title: 'Portfolio Gabriel Brun', message: `Tu as demandé la page ${req.params.nb}` })
})

router.get('/admin', (req, res) =>{
  res.render('admin', { title: 'Portfolio admin', message: `Admin` })
})

router.post('/admin', (req, res) =>{
  if ( bcrypt.compareSync(req.body.pass, '$2a$10$cwTTXf2EVi3Q3wBHKBC3n.I2BnJFZR9PTAffccpjMtQFhywgRWgba') ) {
    req.session.admin = 'admin'
    res.redirect('/'); 
  }
  else{
    res.redirect('/admin')
  }
})
router.get('/logout', (req, res) =>{
  req.session = null
  res.redirect('/');
})

module.exports = router;