var express = require('express');
var app = express();
var createError = require('http-errors');
var path = require('path');
const pug = require('pug');
var logger = require('morgan');
var cors = require('cors')
var helmet = require('helmet')
app.use(logger('dev'));
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'articles')));
app.set('view engine', 'pug');
app.use(cors())
var routes = require('./routers/index');
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);
app.use(function (req, res, next) {
	next(createError(404));
});
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});