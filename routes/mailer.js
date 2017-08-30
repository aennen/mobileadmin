/**
 * Created by Owner on 8/14/2017.
 */

var fs = require('fs');
var exec = require('child_process').spawn;

module.exports = {

    showUser: function (account, jsonobj, cb) {

        var data = "";
        var message = "";

        var text = "Sent to: " + jsonobj[0].login;

        var message = "Login    \t: " + jsonobj[0].login + "\n";
        message += "Password \t: " + jsonobj[0].password + "\n";
        message += "Secret   \t: " + jsonobj[0].secret;

        dialog.info(message, "User Info", function (exitCode) {
            if (exitCode == 0) {
                console.log("User clicked ok");
            }
        });

    },

    sendMessage: function (account, jsonobj, messagefile, cb) {

        var data = "";
        var message = "";

        console.log("SENDMESSAGE-METHOD:" + JSON.stringify(jsonobj) + ":" + jsonobj[0].login);

        var filename = 'routes/' + messagefile;

        fs.readFile(filename, function (err, data) {

            if (err) {
                console.log("ERROR:" + err);
            }

            var tempfile = 'tmp-message-' + account + '.txt';

            //console.log("READ:" + data);

            message = data.toString();
            message = message.replace("$LOGINID$", jsonobj[0].login);
            message = message.replace("$PASSWORD$", jsonobj[0].password);
            message = message.replace("$SECRETWORD$", jsonobj[0].secret);

            console.log("MESSAGE-BODY:" + message);

            fs.writeFile(tempfile, message, function (err) {
                if (err) {
                    console.log("WriteError:" + err);
                }

                var text = "Sent to: " + jsonobj[0].login;

                console.log("File Saved");
            });

            cb();
            //cb.data = message;
        });

        console.log("SENDMESSAGE-DONE");
    },

    sendMessageNode: function (account, jsonobj, cb) {

        var data = "";
        var message = "";

        httpsOptions.path = '/node/showuser?login=' + account + '&appcode=amgate&mode=json';

        console.log("SENDMESSAGE-METHOD:" + JSON.stringify(jsonobj) + ":" + jsonobj[0].login);

        fs.readFile('routes/forgot.txt', function (err, data) {

            if (err) {
                console.log("ERROR:" + err);
            }

            //console.log("READ:" + data);

            message = data.toString();
            message = message.replace("$LOGINID$", jsonobj[0].login);
            message = message.replace("$PASSWORD$", jsonobj[0].password);
            message = message.replace("$SECRETWORD$", jsonobj[0].secret);

            console.log("READ2:" + message);

            //cb.data = message;
        });


        console.log("SENDMESSAGE-DONE");


        var mailOptions = {

            from: 'MobileDashboard@amdocs.com',
            to: 'aennen@amdocs.com',
            subject: 'Mobile Dashboard login info',
            html: 'Mail of test sendmail ',
            text: 'Hello'
        }

        email.sendMail(mailOptions, function (err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });

        cb();
    }

}
