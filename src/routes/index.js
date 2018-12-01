const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const getPosts = require('../helper/post-mgr')

router.get('/', (req, res) => {
  let postsAndPageNb = getPosts(req);
  res.render('index', { 
    title: 'Portfolio Gabriel Brun', 
    message: 'Bienvenu sur mon portfolio!', 
    posts: postsAndPageNb.posts, 
    pageNb: postsAndPageNb.pageNb 
  })
})

router.get('/page:nb', (req, res) =>{
  if (req.params.nb == 1) {
    res.redirect('/') // TODO Cannot set headers after they are sent to the client
  }
  let postsAndPageNb = getPosts(req);
  if (!postsAndPageNb.posts.length) {
    res.redirect('/') // TODO Cannot set headers after they are sent to the client
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

module.exports = router;