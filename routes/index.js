
var express = require('express');
var router = express.Router();
var apis = require('../routes/apis');

/* GET home page. */
router.get('/', function(req, callback, next) {

    var tagline = "Amodcs mobile user administration tool.";

    //apis.getPending();

        callback.render('index', {
            title: 'Express',
            tagline: tagline
        });

});

/* Present active users */
router.get('/active', function(req, callback) {

    apis.getActive( function(res) {

        callback.render('active', {
            title: 'Active Mobile users',
            message: "Showing all active mobile users",
            payload : JSON.parse(res)
        });
    })
});

/* Present pending users list */
router.get('/pending', function(req, callback) {

    apis.getPending( function(res) {

        callback.render('pending', {
            title: 'Pending Mobile users',
            message: "Select users you want to approve or disaprove",
            payload : JSON.parse(res)
        });
    })
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});

module.exports = router;
