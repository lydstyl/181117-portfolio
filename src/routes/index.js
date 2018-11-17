// const express = require('express')
// let router = express.Router()

// // Params property on the request object
// // localhost:3000/person/thomas
// router.get('/page/:number', (req, res) =>{
//     res.send(`You have requested the page number ${req.params.name}`)
// })


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;