var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

/** Библиотека для работы с POST запросами **/
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

/**  Подключение к базе данных **/
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_mti"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


/* Роутинг */
/* Главная страница */
router.get('/', function(req, res, next) {
    console.log('---front ---');

    res.render('index', { title: 'Express' });
});

/* Cтраница классов */
router.get('/classes', function(req, res, next) {
    console.log('---classes ---');

    con.query("SELECT * FROM classes", function (err, result, fields) {
        if (err)  res.render('classes', err);

        console.log(result);
        res.render('classes', {classes:result});
    });
});


/*********************************       Создание      ********************************************/

// /** Страница формы **/
router.get('/add_class', function(req, res, next) {
    res.render('forms/add_class_form', {});
});

/** Создать направление. Роутер для создания записи в базе данных **/
router.post('/create', function(req, res, next) {
    var data = req.body;
    console.log('----- POST /create ----', data);


    con.query("INSERT INTO classes SET ?", data, function (err, result) {
        if (err) res.render('/forms/add_class_form', {error:err});
        res.redirect('/classes');
    });
});



/*********************************       Редактирование      ********************************************/

/** Страница формы **/
router.get('/edit/:id', function(req, res, next) {
    var record_id = req.params.id;

    con.query("SELECT * FROM classes WHERE id = "+record_id+"", function (err, result) {
        if (err) res.render('forms/edit_class_form', {error:err});

        var data = Object.assign({},result[0] );
        res.render('forms/edit_class_form', data);
    });
});

// /** POST метод  **/
router.post('/edit', function(req, res, next) {
    var data = req.body;

    var sql = "UPDATE classes SET napravlenie = '"+data.napravlenie+"', fakultet = '"+data.fakultet+"', type_of_education = '"+data.type_of_education+"'  WHERE id =  "+data.id+" ";
    con.query(sql, function (err, result) {
        if (err) res.render('add_class_form', {error:err});
        res.redirect('/classes');
    });
});



/*********************************       Удаление      ********************************************/
/** Удалить направление. **/
router.get('/delete/:id', function(req, res, next) {
    var record_id = req.params.id;

    con.query("DELETE FROM classes WHERE id = "+record_id+"", function (err, result) {
        if (err){
            res.render('forms/edit_class_form', {error:err});
        } else{
            res.redirect('/classes');
        }
    });
});


module.exports = router;
