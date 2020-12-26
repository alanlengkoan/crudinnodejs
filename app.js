var http = require('http');
var fs = require('fs');
var url = require('url');
var qString = require('querystring');
var router = require('routes')();
var swig = require('swig');
var mysql = require('mysql');

// untuk koneksi
var mysqli = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "my_root",
    password: "my_pass",
    database: "db_node",
});

function view(kode, path, data, request, response) {
    var file = swig.compileFile(path)(data);
    response.writeHead(kode, {
        'Content-Type': 'text/html'
    });
    response.end(file);
}

router.addRoute("/", function (request, response) {
    var data = {
        halaman: 'Beranda',
        title: 'Beranda'
    };
    view(200, './views/base.html', data, request, response);
});

router.addRoute("/tentang", function (request, response) {
    mysqli.query("SELECT * FROM tb_data", function (error, results, fields) {
        var data = {
            halaman: 'Tentang',
            title: 'Tentang',
            data: results
        };
        view(200, './views/tentang.html', data, request, response);
    });
});

router.addRoute("/kontak", function (request, response) {
    var data = {
        halaman: 'Kontak',
        title: 'Kontak'
    };
    view(200, './views/kontak.html', data, request, response);
});

// begin:: route for admin
router.addRoute("/admin", function (request, response) {
    var data = {
        halaman: 'Dashboard',
        title: 'Dashboard Admin'
    };
    view(200, './views/admin/base.html', data, request, response);
});

router.addRoute("/admin/crud", function (request, response) {
    mysqli.query("SELECT * FROM tb_data", function (error, results, fields) {
        var data = {
            halaman: 'CRUD',
            title: 'CRUD',
            data: results
        };
        view(200, './views/admin/crud/view.html', data, request, response);
    });
});

// untuk form dan proses tambah data
router.addRoute("/admin/crud/add", function (request, response) {
    var method = request.method;

    if (method == 'POST') {
        var id_data = Math.floor(Math.random() * 6) + 1;
        var data_post = '';
        request.on('data', function (params) {
            data_post += params;
        });

        request.on('end', function () {
            data_post = qString.parse(data_post);
            mysqli.query('INSERT INTO tb_data SET ?', {
                id_data: id_data,
                judul: data_post.judul,
                link: data_post.link,
                text: data_post.text,
            }, function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    var json = JSON.stringify({
                        title: 'Berhasil!',
                        text: 'Data ditambahkan',
                        icon: 'success',
                        button: 'Ok!'
                    });
                }
                response.end(json);
            });
        });
    } else {
        var data = {
            halaman: 'Tambah Data',
            title: 'Tambah Data'
        };
        view(200, './views/admin/crud/add.html', data, request, response);
    }
});

// untuk form ubah
router.addRoute("/admin/crud/upd/:id", function (request, response) {
    mysqli.query("SELECT * FROM tb_data WHERE id_data = '" + this.params.id + "'", function (error, results, fields) {
        var data = {
            halaman: 'Ubah Data',
            title: 'Ubah Data',
            data: results
        };
        view(200, './views/admin/crud/upd.html', data, request, response);
    });
});

// untuk proses ubah data
router.addRoute("/admin/crud/upd", function (request, response) {
    var method = request.method;

    if (method == 'POST') {
        var data_post = '';
        request.on('data', function (params) {
            data_post += params;
        });

        request.on('end', function () {
            data_post = qString.parse(data_post);
            mysqli.query('UPDATE tb_data SET judul = ?, link = ?, text = ? WHERE id_data = ?', [data_post.judul, data_post.link, data_post.text, data_post.id_data], function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    var json = JSON.stringify({
                        title: 'Berhasil!',
                        text: 'Data diubah',
                        icon: 'success',
                        button: 'Ok!'
                    });
                }
                response.end(json);
            });
        });
    }
});

// untuk hapus data
router.addRoute("/admin/crud/del", function (request, response) {
    var method = request.method;

    if (method == 'POST') {
        var data_post = '';
        request.on('data', function (params) {
            data_post += params;
        });

        request.on('end', function () {
            data_post = qString.parse(data_post);
            mysqli.query('DELETE FROM tb_data WHERE id_data = "' + data_post.id + '"', function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    var json = JSON.stringify({
                        title: 'Berhasil!',
                        text: 'Data dihapus!',
                        icon: 'success',
                        button: 'Ok!'
                    });
                }
                response.end(json);
            })
        });
    }
});
// end:: route for admin

// untuk host
http.createServer(function (request, response) {
    var urlRequest = url.parse(request.url);
    var path = urlRequest.pathname;
    var match = router.match(path);

    if (match) {
        match.fn(request, response);
    } else {
        var data = {}
        view(404, './views/404.html', data, request, response);
    }
}).listen(8000, '127.0.0.1');

console.log('Server sedang berjalan');