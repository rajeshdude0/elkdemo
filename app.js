var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require("fs");
var request = require('request');
var http = require('http');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



app.use(express.static(__dirname + '/public'));
app.use('/', router);

router.post('/init', function (req, res) {
    console.log("Creating log file for " + req.body.browserid);
    var options = {};
    options.flag = 'wx';
    console.log(req.body.browserid);

    return res.status(200).send();

})
router.post('/send', function (req, res) {

    request({
        url: 'http://elkdemo.ml:31311/elkdemo/' + req.body.browserid,
        method: "PUT",
        json: {
            'data': req.body
        }
    }, function (error, response, body) {
        console.log(body);
    })

    res.send("Posted Successfully");
})

router.get('/getlogmetrics', function (req, res) {
    request({
        url: 'http://elkdemo.ml:9600/_node/stats/pipeline',
        method: 'GET'
    }, function (error, response, body) {

        if (error) {
            console.log(error);
            return res.send(500).send();
        }
        res.send(body)
    })
});



var server = http.createServer(app);



module.exports = {
    start: function (port) {

        var ip = "";
        var callback = "";

        var ip = arguments[1];
        if (typeof arguments[arguments.length - 1] === "function")
            callback = arguments[arguments.length - 1];
        else
            ip = arguments[arguments.length - 1];

        if (!port) {
            throw "PORT not Specified!!";
        }


        var resCallBack = function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('ELK-Demo Server listening at http://' + host + ':' + port);
            if(callback)
            callback();
        };

        if (ip) {

            server.listen(port, ip, resCallBack);
        } else {
            server.listen(port, resCallBack);
        }




    }



}