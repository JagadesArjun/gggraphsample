const express = require('express');
const path = require('path');
var cors = require('cors');
var bodyParser = require("body-parser");
var request = require('request');

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());

app.use(cors());

app.set('port', (process.env.PORT || 5000));

app.use(express.static('build'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/build/index.html')
});

app.get("/data/adrequests", function (req, resp) {
    request('http://104.197.128.152/data/adrequests?from=' + req.query.from + '&to=' + req.query.to + '', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resp.json(JSON.parse(body))
        } else {
            resp.status(400);
            resp.send('Some error occurred');
        }
    })
});

server.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

