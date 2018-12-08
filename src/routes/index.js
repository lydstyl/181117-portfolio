const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const modelPost = require( path.join('../model/model-post') )
const modelPositions = require( path.join('../model/model-positions') )
const initialiseData = require( path.join('../model/model-initialise-data') )

const noData = require( path.join('../helper/no-data') )

const router = express.Router();



router.get('/', (req, res) => {
  initialiseData()

  let postsAndPageNb = modelPost.getPosts(req);

  res.render('index', { 
    title: 'Portfolio Gabriel Brun', 
    bodyClass: 'home-page',
    message: 'Bienvenu sur mon portfolio!', 
    posts: postsAndPageNb.posts, 
    pageNb: postsAndPageNb.pageNb 
  })
})

router.get('/manage', (req, res) => {
  res.render('manage', {
    posts: !noData() ? modelPositions.getPositions() : []
  });
});

router.get('/page:nb', (req, res) =>{
  if (req.params.nb == 1) {
    res.redirect('/')
  }
  let postsAndPageNb = modelPost.getPosts(req);
  if (!postsAndPageNb.posts.length) {
    res.redirect('/')
  }else{
    res.render('index', { title: 'Portfolio Gabriel Brun', message: `Tu as demandé la page ${req.params.nb}`, posts: postsAndPageNb.posts, pageNb: postsAndPageNb.pageNb })
  }
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

router.get('/experience/:id', (req, res) =>{
  let file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json', 'utf8' );
  file = JSON.parse(file)
  res.render('experience', { title: 'Portfolio admin', file: file })
})

module.exports = router;