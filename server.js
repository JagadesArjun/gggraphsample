const express = require('express');
const path = require('path');

var app = express();
var server = require('http').Server(app);

app.set('port', (process.env.PORT || 5000));

app.use(express.static('build'));

server.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

