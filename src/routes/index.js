var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

router.get('/page/:nb', (req, res) =>{
  res.render('index', { message: `You have requested page ${req.params.nb}` })
})
module.exports = router;