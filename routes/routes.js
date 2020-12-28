// package
var routes = require('routes')();
var qString = require('querystring');
var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');
var myFunction = require('./../helpers/my_function.js');

// untuk koneksi
var mysqli = require('./../configs/connect');
mysqli.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL terkoneksi..");
    }
});

routes.addRoute("/", function (request, response) {
    var data = {
        halaman: 'Beranda',
        title: 'Beranda'
    };
    myFunction.view(200, './views/base.html', data, request, response);
});

routes.addRoute("/tentang", function (request, response) {
    var data = {
        halaman: 'Tentang',
        title: 'Tentang',
    };
    myFunction.view(200, './views/tentang.html', data, request, response);
});

routes.addRoute("/kontak", function (request, response) {
    var data = {
        halaman: 'Kontak',
        title: 'Kontak'
    };
    myFunction.view(200, './views/kontak.html', data, request, response);
});

routes.addRoute("/masuk", function (request, response) {
    var data = {
        halaman: 'Masuk',
        title: 'Masuk'
    };
    myFunction.view(200, './views/masuk.html', data, request, response);
});

routes.addRoute("/daftar", function (request, response) {
    var method = request.method;

    if (method == 'POST') {
        var data_post = '';
        request.on('data', function (params) {
            data_post += params;
        });

        request.on('end', function () {
            data_post = qString.parse(data_post);

            // hash password
            async function hashPassword(password, round) {
                try {
                    let hashPassword = await bcryptjs.hash(password, round);
                    return hashPassword;
                } catch (err) {
                    return err;
                }
            };

            hashPassword(data_post.password, 8).then((resultPassword) => {
                mysqli.query('INSERT INTO tb_users SET ?', {
                    nama: data_post.nama,
                    username: data_post.username,
                    password: resultPassword,
                    level: 'users',
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
                    response.end();
                });
            });
        });
    } else {
        var data = {
            halaman: 'Daftar',
            title: 'Daftar'
        };
        myFunction.view(200, './views/daftar.html', data, request, response);
    }
});

// begin:: route for admin
routes.addRoute("/admin", function (request, response) {
    var data = {
        halaman: 'Dashboard',
        title: 'Dashboard Admin'
    };
    myFunction.view(200, './views/admin/base.html', data, request, response);
});

routes.addRoute("/admin/crud", function (request, response) {
    mysqli.query("SELECT * FROM tb_data", function (error, results, fields) {
        var data = {
            halaman: 'CRUD',
            title: 'CRUD',
            data: results
        };
        myFunction.view(200, './views/admin/crud/view.html', data, request, response);
    });
});

// untuk form dan proses tambah data
routes.addRoute("/admin/crud/add", function (request, response) {
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
        myFunction.view(200, './views/admin/crud/add.html', data, request, response);
    }
});

// untuk form ubah
routes.addRoute("/admin/crud/upd/:id", function (request, response) {
    mysqli.query("SELECT * FROM tb_data WHERE id_data = '" + this.params.id + "'", function (error, results, fields) {
        var data = {
            halaman: 'Ubah Data',
            title: 'Ubah Data',
            data: results
        };
        myFunction.view(200, './views/admin/crud/upd.html', data, request, response);
    });
});

// untuk proses ubah data
routes.addRoute("/admin/crud/upd", function (request, response) {
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
routes.addRoute("/admin/crud/del", function (request, response) {
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

module.exports = routes;