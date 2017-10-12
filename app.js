"use strict";

var express = require('express');
var app = express();
var http = require('http');
var request = require('request');

var remoteDbBaseUrl = 'http://127.0.0.1:5984';


app.get('/db/**', function(req, res){
    //console.log (req.url.split('/'));
    var url = remoteDbBaseUrl + '/' + req.url.substring(4);
    console.log (url);
    var r = request(url);
    r.on('error', (err)=>{
        console.log ('get error:' + err);
    });
    r.pipe(res);
    
});

app.post('/db/**', function(req, res){
    //console.log (req.url.split('/'));
    var url = remoteDbBaseUrl + '/' + req.url.substring(4);
    console.log ('post:' + url);
    var r = r = request.post({uri: url, json: req.body});
    r.on('error', (err)=>{
        console.log ('post error:' + err);
        res.end();
    });
    req.pipe(r).pipe(res);
    
});

app.put('/db/**', function(req, res){
    //console.log (req.url.split('/'));
    var url = remoteDbBaseUrl + '/' + req.url.substring(4);
    console.log ('put:' + url);
    var r = r = request.put({uri: url, json: req.body});

    r.on('error', (err)=>{
        console.log ('put error:' + err);
    });
    req.pipe(r).pipe(res);
    
});

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static('public'));

app.on('error', function(er){
    console.log ('Error in express:' + er);
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});