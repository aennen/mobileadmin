/**
 * Created by Owner on 8/14/2017.
 */
var http = require('http');
var https = require('https');
var fs = require('fs');
var config = require('../public/config');
var HttpsProxyAgent = require('https-proxy-agent');

// Set up proxy agent =======================================
var proxyOptions = {
    host: 'genproxy',
    port: 8080
};

// HTTP setup options =======================================
var httpsOptions = {
    host: '',
    path: '',
    method: 'GET',
    agent: ''
};

if (config.proxy) {
    var proxyAgent = new HttpsProxyAgent(proxyOptions);
    httpsOptions.agent = proxyAgent;
}

httpsOptions.host = config.host;

module.exports = {

    emailAccount: function (account, callback) {
        console.log("GET-EMAIL");
    },

    getAccount: function (account, callback) {

        var workstr = "";
        var payload = "";

        console.log("GET-ACCOUNT:" + account);

        method = '/node/showuser?login=' + account + '&appcode=amgate&mode=json';

        httpsOptions.path = method;

        console.log("PATH:" + method);

        https.request(httpsOptions, function (res) {

            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                workstr += chunk;
                //console.log('ACCOUNT-BODY: ' + chunk);
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
                console.log("GET-ACCOUNT-END:");
                callback(payload);
            })

        }).end(function () {
            console.log("GET-ACCOUNT-END-FUNC:");
        });
    },

    getAccounts: function (accountType, callback) {

        console.log("GET-ACCOUNTS");

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

        httpsOptions.path = method;

        console.log("GET-METHOD" + method);

        https.request(httpsOptions, function (res) {

            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                workstr += chunk;
                console.log('ACCOUNTS-BODY: ' + chunk);
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
            console.log("GET-ACCOUNTS-END");
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
        else if (action === 'email') {
            console.log("email:" + account);
            //method = '/node/showuser?login=' + account + '&appcode=amgate&mode=json';
            sendMessage(account, function (res) {
                console.log("Sent Mail" + res);
                callback();
            });
        }

        httpsOptions.path = method;

        console.log("UPDATE-METHOD:" + method);

        https.request(httpsOptions, function (res) {

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                payload += chunk;
            });

            res.on('end', function() {
                console.log("UPDATE-END:" + payload);
                callback();
            })

        }).end(function() {
            console.log("END");
        });

    }

}
