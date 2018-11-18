const express = require('express')
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})