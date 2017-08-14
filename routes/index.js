
var express = require('express');
var router = express.Router();
var apis = require('../routes/apis');

/* GET home page. */
router.get('/', function(req, callback, next) {

    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];

    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    //apis.getPending();

    apis.getActive( function(res) {

        callback.render('index', {
            title: 'Express',
            tagline: tagline,
            drinks: drinks,
            payload : JSON.parse(res)
        });
    })
});

/* Present active users */
router.get('/active', function(req, callback) {

    apis.getActive( function(res) {

        callback.render('active', {
            title: 'Active Mobile users',
            payload : JSON.parse(res)
        });
    })
});

/* Present pending users list */
router.get('/pending', function(req, callback) {

    apis.getPending( function(res) {

        callback.render('pending', {
            title: 'Pending Mobile users',
            payload : JSON.parse(res)
        });
    })
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});

module.exports = router;
