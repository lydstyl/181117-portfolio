const express = require('express')
const path = require('path');
const cookieSession = require('cookie-session')

const indexRouter = require('./routes/index');
const form = require('./routes/form');

let app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  // Cookie Options
  maxAge: 3 * 60 * 60 * 1000 // 3 hours
}))

/* give your templates access to your session */
app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use(express.urlencoded({extended: true}));

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
app.use( express.static( path.join(__dirname, '../public') ) );

app.use('/', indexRouter);
app.use('/form', form);

const port = 8080;
app.listen(port, () => {
  console.log('Listening on port ' + port + '! --> http://localhost:' + port + '/')
})