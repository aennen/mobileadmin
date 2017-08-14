/**
 * Created by Owner on 8/14/2017.
 */
var https = require('https');

module.exports = {

    getPending : function(callback) {
        var payload ="";

        console.log("GETPENDING");

        var options = {
            hostname: 'amgate.itahs.com',
            path: '/node/pending?appcode=amgate&mode=json',
            method: 'GET'
        };

        https.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                payload += chunk;
                console.log('PENDGIN-BODY: ' + chunk);
            });

            res.on('end', function() {
                console.log("END");
                callback(payload);
            })

        }).end(function() {
            console.log("PENDGIN-END");
        });
    },

    getActive : function (callback) {

        console.log("GET-ACTIVE");

        var payload ="";

        var options = {
            hostname: 'amgate.itahs.com',
            path: '/node/listactive?appcode=amgate&mode=json',
            method: 'GET'
        };

        https.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                payload += chunk;
                console.log('ACTIVE-BODY: ' + chunk);
            });

            res.on('end', function() {
                console.log("END");
                callback(payload);
            })

        }).end(function() {
            console.log("GET-ACTIVE-END");
        });


    }

}

