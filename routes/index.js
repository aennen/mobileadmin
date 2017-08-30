
var express = require('express');
var router = express.Router();
var apis = require('../routes/apis');
var email = require('../routes/mailer');
var util = require('util');
var extend = require('util')._extend;
//var popupS = require('popups');

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


    apis.getAccounts('all', function (res) {

        callback.render('active', {
            title: 'Active Mobile users',
            message: "Showing all active mobile users, you can lock an account from here",
            payload: res
        });
    })
});

/* Present pending users list */
router.get('/requests', function (req, callback) {

    apis.getAccounts('requests', function (res) {

        callback.render('requests', {
            title: 'New Mobile user Account Requests',
            message: "Select users you want to approve or disaprove",
            payload: res
        });
    })
});

/* Present emailed users list */
router.get('/pending', function (req, callback) {

    apis.getAccounts('pending', function (res) {

        callback.render('pending', {
            title: 'Pending Mobile users',
            message: "Approved users who have not authenticated yet",
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

router.get('/about', function (req, res) {

    apis.getAccounts('rejected', function (res) {

        res.render('reject', {
            title: 'Rejected Mobile users',
            message: "Select users you want to delete or resubmit",
            payload: res
        });
    })

    res.render('about', { title: 'Express' });
});

router.post('/emailUser', function (req, callback) {

    console.log("EMAIL:");
    var messagefile;
    var backURL = req.header('Referer');

    var input = JSON.parse(JSON.stringify(req.body));

    if (input.reminder) {
        delete input['reminder'];
        messagefile = 'reminder.txt';
    }
    else if (input.email) {
        delete input['email'];
        messagefile = 'forgot.txt';
    }

    console.log("REFERER:" + req.header('Referer'));


    Object.keys(input).forEach(function (key) {
        console.log("key:" + key + ":" + input[key]);

        apis.getAccount(key, function (data) {
            console.log("KEY:" + key + ":" + ":" + messagefile + ":" + JSON.stringify(data));
            email.sendMessage(key, data, messagefile, function (res) {
                console.log("EMAIL-DONE");
            })
        })

    });


    callback.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    callback.redirect(backURL);
});


router.post('/showUser', function (req, callback) {

    var userdata = "";
    var input = JSON.parse(JSON.stringify(req.body));

    delete input['show'];

    var i = Object.keys(input).length;

    Object.keys(input).forEach(function (key) {

        console.log("key:" + key + ":" + input[key] + ":" + i);

        apis.getAccount(key, function (res) {
            userdata += JSON.stringify(res);
            userdata = userdata.replace('][', ',');
            //console.log("\nprocessed:" + userdata + "\n");
            //console.log(util.inspect(userdata, false, 4, true));

            i--;

            if (i <= 0) {
                //console.log("DONE:" + i);

                callback.render('show', {
                    title: 'Show Mobile user',
                    message: "Approved users who have not authenticated yet",
                    payload: JSON.parse(userdata)
                });
            }
        })


    })
    //callback.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    //callback.redirect('active');
});


router.post(['/pendingUser', '/activeUser', '/lockUser', '/rejectUser'], function (req, callback) {

    var input = JSON.parse(JSON.stringify(req.body));
    var method;
    var redirectURL;

    //console.log(util.inspect(input, false, 4, true));

    // Pending User actions
    if (input.approve) {
        console.log("APPROVE INPUT:" + input.approve);
        method = "approve";
        redirectURL = "pending";
    }
    else if (input.reject) {
        console.log("REJECT INPUT:" + input.reject);
        method = "reject";
        redirectURL = "pending";
    }

    // Active User actions
    else if (input.email) {
        console.log("EMAIL INPUT:" + input.email);
        method = "email";
        redirectURL = "active";
    }
    else if (input.lock) {
        console.log("LOCK INPUT:" + input.reject);
        method = "lock";
        redirectURL = "active";
    }

    // Locked User actions
    else if (input.unlock) {
        console.log("UNLOCK INPUT:" + input.lock);
        method = "unlock";
        redirectURL = "locked"
    }
    else if (input.reject) {
        console.log("REJECT INPUT:" + input.reject);
        method = "reject";
        redirectURL = "locked"
    }

    // Rejected User actions
    if (input.delete) {
        console.log("DELETE INPUT:" + input.delete);
        method = "delete";
        redirectURL = "rejected"
    }
    else if (input.reset) {
        console.log("RESET INPUT:" + input.reset);
        method = "reset";
        redirectURL = "rejected"
    }

    delete input[method];

    Object.keys(input).forEach(function (key) {

        console.log("key:" + key + ":" + input[key]);

        apis.updateAccount(key, method, function (res) {
            console.log("Done");
        });

    });

    callback.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    callback.redirect(redirectURL);

});

module.exports = router;
