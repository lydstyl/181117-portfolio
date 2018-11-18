const cookieSession = require('cookie-session')
const express = require('express')
const path = require('path');
const indexRouter = require('./routes/index');

// var bodyParser = require('body-parser')

let app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  // Cookie Options
  maxAge: 8 * 60 * 60 * 1000 // 8 hours
}))

/* give your templates access to your session */
app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use(express.urlencoded({extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000! --> http://localhost:3000/')
})