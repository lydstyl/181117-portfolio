const express = require('express')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const modelPost = require( path.join('../model/model-post') )
const initialiseData = require( path.join('../model/model-initialise-data') )

const sendEmail = require( path.join('../controller/sendEmail') )
const Manage = require( path.join('../controller/Manage') )

const router = express.Router()

router.get('/', (req, res) => {
  initialiseData()
  let postsAndPageNb = modelPost.getPosts(req)
  if (!req.session.emailed) {
    req.session.emailed = true
    sendEmail(req)
  }
  res.render('index', { 
    title: 'Portfolio Gabriel Brun', 
    bodyClass: 'home-page',
    message: 'Bienvenu sur mon portfolio!', 
    posts: postsAndPageNb.posts, 
    pageNb: postsAndPageNb.pageNb 
  })
})

router.get('/manage', Manage)

router.get('/page:nb', (req, res) =>{
  if (req.params.nb == 1) {
    res.redirect('/')
  }
  let postsAndPageNb = modelPost.getPosts(req)
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
  if ( bcrypt.compareSync(req.body.pass, '$2a$10$K37Lxbrm5UIlwKJgMBTEh.bjRXPdOlpriF70JnYeOuUlBvtdibm1e') ) {
    req.session.admin = 'admin'
    res.redirect('/') 
  }
  else{
    res.redirect('/admin')
  }
})
router.get('/logout', (req, res) =>{
  req.session = null
  res.redirect('/')
})

router.get('/experience/:id', (req, res) =>{
  let file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + req.params.id + '.json', 'utf8' )
  file = JSON.parse(file)
  let srcSlash = '/'
  if (file.imgsrc.includes('http')) {
    srcSlash = ''
  }
  res.render('experience', { title: 'Portfolio admin', file: file, srcSlash: srcSlash })
})

module.exports = router