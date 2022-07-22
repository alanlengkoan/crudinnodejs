var http = require('http');
var url = require('url');
var myFunction = require('./helpers/my_function.js');

// untuk routes
var router = require('./routes/routes');
// untuk host
function serverCallback(request, response) {
    var urlRequest = url.parse(request.url);
    var path = urlRequest.pathname;
    var match = router.match(path);

    if (match) {
        match.fn(request, response);
    } else {
        var data = {}
        myFunction.view(404, '404.ejs', data, request, response);
    }
}

http.createServer(serverCallback).listen(8080, '127.0.0.1');

console.log('Server sedang berjalan..');