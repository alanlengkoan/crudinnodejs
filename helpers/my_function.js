var swig = require('swig');

// untuk fungsi
module.exports = {
    view: function (kode, path, data, request, response) {
        var file = swig.compileFile(path)(data);
        response.writeHead(kode, {
            'Content-Type': 'text/html'
        });
        response.end(file);
    }
}