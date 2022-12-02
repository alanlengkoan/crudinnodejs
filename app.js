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

const server = http.createServer(serverCallback);
const port = 8080;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});