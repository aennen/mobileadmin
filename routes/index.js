
var express = require('express');
var router = express.Router();
var apis = require('../routes/apis');
var util = require('util');

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

    apis.getAccounts('active', function (res) {

        callback.render('active', {
            title: 'Active Mobile users',
            message: "Showing all active mobile users, you can lock an account from here",
            payload: res
        });
    })
});

/* Present pending users list */
router.get('/pending', function(req, callback) {

    apis.getAccounts('pending', function (res) {

        callback.render('pending', {
            title: 'Pending Mobile users',
            message: "Select users you want to approve or disaprove",
            payload: res
        });
    })
});

/* Present locked users list */
router.get('/locked', function (req, callback) {

    apis.getAccounts('locked', function (res) {

        callback.render('locked', {
            title: 'Locked Mobile users',
            message: "Select users you want to unlock",
            payload: res
        });
    })
});

/* Present locked users list */
router.get('/rejected', function (req, callback) {

    apis.getAccounts('rejected', function (res) {

        callback.render('reject', {
            title: 'Rejected Mobile users',
            message: "Select users you want to delete or resubmit",
            payload: res
        });
    })
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});

router.post('/pendingUser', function (req, callback) {

    var input = JSON.parse(JSON.stringify(req.body));

    console.log(util.inspect(input, false, 4, true));

    if (input.approve) {

        delete input['approve'];

        console.log("APPROVE INPUT:" + input.approve);

        Object.keys(input).forEach(function (key) {
            console.log("key:" + key + ":" + input[key]);
            //https://amgate.itahs.com/node/activate?login=oded.levinstein@amdocs.com&appcode=amgate
            apis.updateAccount(key, 'approve', function (res) {
                console.log("Done");
            });
        });
    }
    else if (input.reject) {

        console.log("REJECT INPUT:" + input.reject);

        delete input['reject'];

        Object.keys(input).forEach(function (key) {
            console.log("key:" + key + ":" + input[key]);
            // https://amgate.itahs.com/node/reject?login=xxx&appcode=amgate
            apis.updateAccount(key, 'reject', function (res) {
                console.log("Done");
            });
        });

    }

    callback.redirect('pending');
});

//LOCK: User account
router.post('/activeUser', function (req, callback) {

    var input = JSON.parse(JSON.stringify(req.body));

    console.log(util.inspect(input, false, 4, true));


    if (input.email) {

        delete input['email'];

        Object.keys(input).forEach(function (key) {
            console.log("key:" + key + ":" + input[key]);
            apis.emailAccount(key, 'lock', function (res) {
                console.log("Done");
            });
        });
    }
    else {
        delete input['lock'];

        console.log("LOCK INPUT:" + input.approve);

        Object.keys(input).forEach(function (key) {
            console.log("key:" + key + ":" + input[key]);
            //https://amgate.itahs.com/node/activate?login=oded.levinstein@amdocs.com&appcode=amgate
            apis.updateAccount(key, 'lock', function (res) {
                console.log("Done");
            });
        });
    }
    callback.redirect('active');
});

// LOCK: user account
router.post('/lockUser', function (req, callback) {

    var input = JSON.parse(JSON.stringify(req.body));

    console.log(util.inspect(input, false, 4, true));

    console.log("UNLOCK INPUT:" + input.lock);

    delete input['unlock'];

    Object.keys(input).forEach(function (key) {
        console.log("key:" + key + ":" + input[key]);
        // https://amgate.itahs.com/node/reject?login=xxx&appcode=amgate
        apis.updateAccount(key, 'unlock', function (res) {
            console.log("Done");
        });
    });

    callback.redirect('locked');
});


router.post('/rejectUser', function (req, callback) {

    var input = JSON.parse(JSON.stringify(req.body));

    console.log(util.inspect(input, false, 4, true));

    if (input.delete) {

        delete input['delete'];

        console.log("DELETE INPUT:" + input.delete);

        Object.keys(input).forEach(function (key) {
            console.log("key:" + key + ":" + input[key]);
            //https://amgate.itahs.com/node/activate?login=oded.levinstein@amdocs.com&appcode=amgate
            apis.updateAccount(key, 'delete', function (res) {
                console.log("Done");
            });
        });
    }
    else if (input.reset) {

        console.log("RESET INPUT:" + input.reset);

        delete input['reset'];

        Object.keys(input).forEach(function (key) {
            console.log("key:" + key + ":" + input[key]);
            // https://amgate.itahs.com/node/reject?login=xxx&appcode=amgate
            apis.updateAccount(key, 'reset', function (res) {
                console.log("Done");
            });
        });

    }

    callback.redirect('rejected');
});

module.exports = router;
