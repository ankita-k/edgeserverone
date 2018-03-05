var express = require('express');
const SerialPort = require('serialport-v5');

let i = 10;

let port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});


var app = express();

setInterval(function () {
    let buffer = new Buffer(1);
    buffer.writeInt8(1);
    port.write(buffer, function (error) {
        if (error) {
            console.log("port error :", error);
        } else {
            console.log("buffer is :", buffer.toString('hex'));
        }
    });
}, 5000);

app.listen(7000, function () {
    console.log("Server started");
});
