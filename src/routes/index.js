const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

function getPagesNumber(items, pageIems) {
  let tmp = items / pageIems;
  tmp = tmp.toString().split('.');
  let pages = tmp[0];
  if (tmp[1] > 0) {
      pages ++;
  }
  return pages;
}
function getFilesForPage( itemsByPage, pageNumber ) {
  const dataFolder = path.dirname(require.main.filename) + '/data/';
  let files = fs.readdirSync( dataFolder );
  
  const pageNb = getPagesNumber(files.length, 9);

  let index1 = (pageNumber - 1) * itemsByPage;
  let index2 = index1 + itemsByPage;
  files = files.slice(index1, index2);

  let filesAndPageNb = {
    files: files,
    pageNb: pageNb
  }
  return filesAndPageNb
}
function getPosts(req) {
  let PageNum = 1;
  if (req.params.nb) {
    PageNum = req.params.nb;
  }
  let filesAndPageNb = getFilesForPage( 9, PageNum )
  let files = filesAndPageNb.files
  let posts = [];
  for (let i in files) {
    let file = files[i];
    file = fs.readFileSync( path.dirname(require.main.filename) + '/data/' + file, 'utf8' );
    posts.push( JSON.parse(file) )
  }

  // return posts;
  let postsAndPageNb = {
    posts: posts,
    pageNb: filesAndPageNb.pageNb
  }
  return postsAndPageNb
}

router.get('/', (req, res) => {
  let postsAndPageNb = getPosts(req);
  res.render('index', { title: 'Portfolio Gabriel Brun', message: 'Bienvenu sur mon portfolio!', posts: postsAndPageNb.posts, pageNb: postsAndPageNb.pageNb })
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