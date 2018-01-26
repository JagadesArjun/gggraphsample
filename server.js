const express = require('express');
const path = require('path');
var cors = require('cors');
var bodyParser = require("body-parser");

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());

app.use(cors());

app.set('port', (process.env.PORT || 5000));

app.use(express.static('build'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/build/index.html')
});

server.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

