var swig = require('swig');

// untuk fungsi
module.exports = {
    view: function (kode, path, data, request, response) {
        var file = swig.compileFile(path)(data);
        response.writeHead(kode, {
            'Content-Type': 'text/html'
        });
        response.end(file);
    },

    dateTime: function () {
        var date = new Date();
        
        var bulan = date.getUTCMonth() + 1;
        var hari = date.getUTCDate();
        var tahun = date.getUTCFullYear();
        var jam = date.getHours();
        var menit = date.getMinutes();
        var detik = date.getSeconds();

        var newDate = `${tahun}-${bulan}-${hari} ${jam}:${menit}:${detik}`;
        return newDate;
    },

    date: function () {
        var date = new Date();

        var bulan = date.getUTCMonth() + 1;
        var hari = date.getUTCDate();
        var tahun = date.getUTCFullYear();

        var newDate = `${tahun}-${bulan}-${hari}`;
        return newDate;
    }
}