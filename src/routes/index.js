const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const modelPost = require('../model/model-post')

const getPosts = modelPost.getPosts
const modelPositions = require( path.join('../model/model-positions') )

const router = express.Router();

/**
 * Return false if there is no data/postxx.json or true otherway
 */
function dataPost() {
  const files = modelPost.getFiles()
  if (files.length == 1 && files[0] == 'positions.json') return false
  return true
}

router.get('/', (req, res) => {
  if ( !dataPost() ) {
    modelPost.initFirstPost(res)
  }
  modelPositions.mirrorDataPositions()
  let postsAndPageNb = getPosts(req);

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
    posts: dataPost() ? modelPositions.getPositions() : []
  });
});

router.get('/page:nb', (req, res) =>{
  if (req.params.nb == 1) {
    res.redirect('/')
  }
  let postsAndPageNb = getPosts(req);
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