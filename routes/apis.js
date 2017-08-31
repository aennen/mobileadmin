/**
 * Created by Owner on 8/14/2017.
 */

var http = require('http');
var https = require('https');
//var HttpsProxyAgent = require('https-proxy-agent');

// Set up proxy agent =======================================
var proxyOptions = {
    host: 'genproxy',
    port: 8080
};


//var httpsOptions = {
//    host: 'amgate.itahs.com',
//    path: "",
//    method: 'GET',
//    agent: proxyAgent
//};

var httpOptions = {
    host: 'localhost',
    port: 8080,
    path: "",
    method: 'GET',
};


//var proxyAgent = new HttpsProxyAgent(proxyOptions);

module.exports = {

    getAccount: function (account, callback) {

        var workstr = "";
        var payload = "";

        console.log("email:" + account);

        method = '/node/showuser?login=' + account + '&appcode=amgate&mode=json';

        httpOptions.path = method;

        console.log("PATH:" + method);


        http.request(httpOptions, function (res) {

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                workstr += chunk;
                //console.log('ACTIVE-BODY: ' + chunk);
            });

            res.on('end', function () {

                var jobj = JSON.parse(workstr);

                if (jobj.status === "No Rows") {
                    console.log("No Rows");
                    payload = "";
                }
                else {
                    payload = JSON.parse(workstr);
                }

                callback(payload);
            })

        }).end(function () {
            console.log("GET-ACTIVE-END");
        });
    },


    getAccounts: function (accountType, callback) {

        console.log("GET-ACTIVE");

        var workstr = "";
        var payload = "";

        if (accountType === 'requests') {
            method = '/node/listRequests?appcode=amgate&mode=json';
        }
        else if (accountType === 'active') {
            method = '/node/listActive?appcode=amgate&mode=json';
        }
        else if (accountType === 'all') {
            method = '/node/listActive?appcode=amgate&mode=json&showall=yes';
        }
        else if (accountType === 'locked') {
            method = '/node/listLocked?appcode=amgate&mode=json';
        }
        else if (accountType === 'rejected') {
            method = '/node/listRejected?appcode=amgate&mode=json';
        }
        else if (accountType === 'pending') {
            method = '/node/listPending?appcode=amgate&mode=json';
        }

        httpOptions.path = method;

        console.log("GET-METHOD" + method);

        http.request(httpOptions, function (res) {

            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                workstr += chunk;
                //console.log('ACTIVE-BODY: ' + chunk);
            });

            res.on('end', function () {

                var jobj = JSON.parse(workstr);

                if (jobj.status === "No Rows") {
                    console.log("No Rows");
                    payload = "";
                }
                else {
                    payload = JSON.parse(workstr);
                }

                callback(payload);
            })

        }).end(function () {
            console.log("GET-ACTIVE-END");
        });
    },

    // common method for all actions ////////////////////////////////////////////////////////

    updateAccount: function (account, action, callback) {

        console.log("UPDATE-ACCOUNT");

        var payload = "";

        if (action === 'approve') {
            method = '/node/activate?login=' + account + '&appcode=amgate';
        }
        else if (action === 'reject') {
            method = '/node/reject?login=' + account + '&appcode=amgate';
        }
        else if (action === 'lock') {
            method = '/node/lock?login=' + account + '&appcode=amgate';
        }
        else if (action === 'unlock') {
            method = '/node/unlock?login=' + account + '&appcode=amgate';
        }
        else if (action === 'delete') {
            method = '/node/delete?login=' + account + '&appcode=amgate';
        }
        else if (action === 'reset') {
            method = '/node/reset?login=' + account + '&appcode=amgate';
        }

        httpOptions.path = method;

        console.log("UPDATE-METHOD:" + method);

        http.request(httpOptions, function (res) {

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                payload += chunk;
            });

            res.on('end', function() {
                console.log("END");
                callback();
            })

        }).end(function() {
            console.log("END");
        });

    },

    sendMessage: function (sendTo, login, password, secretword, res) {

        var data = "";
        var message = "";

        message = fs.readFile('routes/forgot.html', function (err, data) {

            if (err) {
                console.log("ERROR:" + err);
            }

            //console.log("READ:" + data);

            message = data.toString();
            message = message.replace("$LOGINID$", login);
            message = message.replace("$PASSWORD$", password);
            message = message.replace("$SECRETWORD$", secretword);

            //console.log("READ2:" + message);
        });

    }

}

