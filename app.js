var createError = require('http-errors');
var express = require('express');
var path = require('path');
var hbs = require('hbs');
var indexRouter = require('./server/routes/indexRouter');



hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});


var app = express();

/** Роутер **/
app.use('/', indexRouter);


// Порт сервера
app.set('port', 3000);


// клиентский шаблонизатор или view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


/** Статические файлы **/
app.use(express.static(path.join(__dirname, 'public')));


// Ошибка сервера 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(app.get('port'), function(){
    console.log('Сервер работает на порту: '+app.get('port'));
});
