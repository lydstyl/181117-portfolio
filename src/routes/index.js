const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Portfolio Gabriel Brun', message: 'Bienvenu sur mon portfolio!' })
})
router.get('/page:nb', (req, res) =>{
  res.render('index', { title: 'Portfolio Gabriel Brun', message: `Tu as demandé la page ${req.params.nb}` })
})


router.get('/admin', (req, res) =>{
  res.render('admin', { title: 'Portfolio admin', message: `Admin` })
})
router.post('/admin', (req, res) =>{
  if (req.body.pass == 'vado') {
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