/**
 * Created by Owner on 8/14/2017.
 */
var http = require('http');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

// Set up proxy agent =======================================
var proxyOptions = {
    host: 'genproxy',
    port: 8080
};

var proxyAgent = new HttpsProxyAgent(proxyOptions);

var httpsOptions = {
    host: 'amgate.itahs.com',
    path: '',
    method: 'GET',
    agent: proxyAgent
};

var httpOptions = {
    host: 'localhost',
    path: "",
    method: 'GET',
};


module.exports = {

    emailAccount: function (account, callback) {
        console.log("GET-EMAIL");
    },

    getAccounts: function (accountType, callback) {

        console.log("GET-ACTIVE");

        var workstr = "";
        var payload = "";

        if (accountType === 'pending') {
            method = '/node/pending?appcode=amgate&mode=json';
        }
        else if (accountType === 'active') {
            method = '/node/listactive?appcode=amgate&mode=json';
        }
        else if (accountType === 'locked') {
            method = '/node/locked?appcode=amgate&mode=json';
        }
        else if (accountType === 'rejected') {
            method = '/node/rejected?appcode=amgate&mode=json';
        }

        httpsOptions.path = method;

        console.log("GET-METHOD" + method);

        https.request(httpsOptions, function (res) {

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

        httpsOptions.path = method;

        console.log("UPDATE-METHOD:" + method);

        https.request(httpsOptions, function (res) {

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

    }


}

