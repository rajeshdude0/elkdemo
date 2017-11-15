var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require("fs");
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(3000, function(){
     var host = server.address().address;
     var port = server.address().port;
     console.log('Server listening at http://'+host+':'+port);
});

app.use(express.static(__dirname + '/public'));
app.use('/', router);

router.post('/init', function(req, res){
    console.log("Creating log file for "+ req.body.browserid);
    var options = {};
    options.flag = 'wx';
    console.log(req.body.browserid);
    fs.writeFile('./logs/'+req.body.browserid+'.log', '', options, function(err){
        if( err && err.code=='EEXIST'){
            console.log("File already existed!");
            return res.status(200).send();
        }
        return res.status(200).send();
    })
})
router.post('/send', function(req, res){   
      
    request({
        url : 'http://35.194.23.189:31311/elkdemo/'+ req.body.browserid,
        method: "PUT",
        json:{'data':req.body}
    }, function(error, response, body ){
        console.log(body);
    })
   
    res.send("Posted Successfully");
})

router.get('/getlogmetrics', function(req, res){
   request({
       url: 'http://35.194.23.189:9600/_node/stats/pipeline',
       method:'GET'
   }, function(error, response, body){
       
       if(error){
        console.log(error);
           return res.send(500).send();
       }
       res.send(body)
   })
});



