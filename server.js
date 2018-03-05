var express = require('express');
const SerialPort = require('serialport-v4');

let port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (client) {
    console.log("Socket connected !");
    let status;
    client.on("start", function (data) {
        status = data.status;
        console.log("status :", status);
        /**
         * Body Temparature Measurement
         * Taking temperature as input from frontend in String format
         *
         * Send 1 from node.js to arduino for communication 
         */
        if (status == "temperature") {
            let buffer = new Buffer(1);
            buffer.writeInt8(1);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("Temperature error :", error);
                } else {
                    console.log("Temperature :", buffer.toString('hex'));
                    if (buffer.toString('hex')) {
                        port.on('data', function (data) {
                            console.log("arduino data :", data.toString());
                            client.emit('value',
                                { "value": data.toString(), "status": status });
                        });
                    }
                }
            });
        }
        /**
         * GSR Measurement
         * Taking gsr as input from frontend in String format
         *
         * Send 2 from node.js to arduino for communication
         */
        if (status == "gsr") {
            let buffer = new Buffer(1);
            buffer.writeInt8(2);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("gsr error :", error);
                } else {
                    console.log("gsr :", buffer.toString('hex'));
                    if (buffer.toString()) {
                        port.on('data', function (data) {
                            console.log("arduino data :", data.toString());
                            client.emit('value',
                                { "value": data.toString(), "status": status });
                        });
                    }
                }
            });
        }
    });
});

const PORT = 7000;
server.listen(PORT, function () {
    console.log("Server started");
});
