var http = require('http');
var url = require('url');
var fs = require('fs');
var myFunction = require('./helpers/my_function.js');

var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

// untuk routes
var router = require('./routes/routes');
// untuk host
http.createServer(function (request, response) {
    var urlRequest = url.parse(request.url);
    var path = urlRequest.pathname;
    var match = router.match(path);

    if (match) {
        match.fn(request, response);
    } else {
        var data = {}
        myFunction.view(404, './views/404.html', data, request, response);
    }
}).listen(8000, '127.0.0.1');

console.log('Server sedang berjalan..');