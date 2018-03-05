var express = require('express');
const SerialPort = require('serialport-v4');

let i = 10;

let port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});

var app = express();

setTimeout(function () {
    let buffer = new Buffer(1);
    buffer.writeInt8(5);
    port.write(buffer, function (error) {
        if (error) {
            console.log("port error :", error);
        } else {
            console.log("buffer :", buffer.toString('hex'));
            // port.update({
            //     baudRate: 115200
            // }, function (data) {
            //     console.log("port updated to 115200");
            //     buffer.writeInt8(5);
            //     port.write(buffer, function (error) {
            //         if (error) {
            //             console.log("port error :", error);
            //         } else {
            //             console.log("buffer :", buffer.toString('hex'));
            //         }
            //     });
            // });
        }
    });
}, 5000);

app.listen(7000, function () {
    console.log("Server started");
});
