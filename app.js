var express = require('express');
var app = express();

app.use(express.static(__dirname + '/.tmp'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/demo'));

app.listen(process.env.PORT || 3000);