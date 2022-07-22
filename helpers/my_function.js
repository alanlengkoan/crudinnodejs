var ejs = require('ejs');
var fs = require('fs');

// untuk fungsi
module.exports = {
    view: function (kode, path, data, request, response) {
        var htmlContent = fs.readFileSync(__dirname + '/../views/' + path, 'utf8');
        var htmlRenderized = ejs.render(htmlContent, data);
        response.writeHead(kode, {
            'Content-Type': 'text/html'
        });
        response.write(htmlRenderized);
        response.end();
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