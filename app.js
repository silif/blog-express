var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routers/index');
const pug = require('pug');
app.set('view engine', 'pug');

// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

app.get('/aaa', function(req, res) {
    res.json({
        msg:"success"
    })
})
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