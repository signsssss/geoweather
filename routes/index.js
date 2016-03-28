var express = require('express');
var xml2js = require('xml2js');
var http = require('http');
var querystring = require('querystring');
var router = express.Router();
// var getWeather = require('./weather.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/geo', function(req, res, next) {
    console.log(req.body);

    var http_get = function(url, data, callback) {

        var query = querystring.stringify(data);
        if (query !== '')
            url = url + '&' + query;

        //console.log(url);

        http.get(url, function(res) {
                var body = '';
                res.setEncoding('utf8');

                res.on('readable', function() {
                    var chunk = this.read() || '';

                    body += chunk;
                });

                res.on('end', function() {
                    callback(body);
                });

                res.on('error', function(e) {
                    console.log('error', e.message);
                });
            });
    };

    http_get('http://www.kma.go.kr/wid/queryDFS.jsp?gridx=' + req.body.latitude + '&gridy=' + req.body.longitude, {}, function(resData) {
        xml2js.parseString(resData, function(err, obj) {
            if (err) {
                // callback(err, topObj, midObj, leafObj, null);
                console.log(err);
            } else {
                console.log('hour: ' + obj.wid.body[0].data[0].hour + '시');
                console.log('temperature: ' + obj.wid.body[0].data[0].temp + '섭씨');
                console.log('forecast: ' + obj.wid.body[0].data[0].wfKor);
                console.log('wind: ' + obj.wid.body[0].data[0].wdKor);
                res.json(obj.wid.body[0].data[0]);
                // callback(null, topObj, midObj, leafObj, obj.wid.body[0].data[0]);
            }
        });
    });

    // res.send('success');
});

module.exports = router;
