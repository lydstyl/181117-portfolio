var express = require('express')
var path = require('path');
// var pug = require('pug');
var indexRouter = require('./routes/index');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use('/', indexRouter);
var router = express.Router();

/* GET home page. */
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})