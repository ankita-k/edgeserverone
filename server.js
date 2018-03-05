var express = require('express');
const SerialPort = require('serialport-v5');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
const Readline = SerialPort.parsers.Readline;

let i = 10;

// let port = new SerialPort('/dev/ttyACM0');

let port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});


var app = express();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// const parser = port.pipe(new Readline({ delimiter: '\r\n' }));


/**
 * Import vitalStats model
*/
let vitalStats = require('./models/vitalStats');

/**
 * connect to mongodb
*/
// mongoose.connect('mongodb://127.0.0.1:27017/edge');
// mongoose.connect('mongodb://test:password@ds211558.mlab.com:11558/ionic_chat');

// //on successful connection
// mongoose.connection.on('connected', () => {
//     console.log('Connected to mongodb!!');
// });

// //on error
// mongoose.connection.on('error', (err) => {
//     if (err) {
//         console.log('Error in db is :' + err);
//     }
// });

//middleware
app.use(cors());
//body-parser
app.use(bodyParser.json());

// if (i == 10) {
//     let buffer = new Buffer(1);
//     buffer.writeInt8(1);
//     port.write(buffer);
// }

setTimeout(function () {
    let buffer = new Buffer(1);
    buffer.writeInt8(1);
    port.write(buffer, function (error) {
        if (error) {
            console.log("port error :", error);
        } else {
            // console.log(port.options.baudRate);
            console.log("buffer is :", buffer.toString('hex'));
            // if (buffer.toString('hex')) {
            //     updatePort();
            //     port.on('data', function (data) {
            //         // console.log(data.toString());

            //         if (data.toString() != 'a' && data.toString() != 'e' && data.toString() != 'i') {
            //             console.log("Signal from arduino :", data.toString());
            //             // let value = data.toString().replace('a', '');
            //             // console.log(value);
            //         }
            //     });
            // }
        }
    });
}, 5000);

function updatePort() {
    port.update({
        baudRate: 19200
    }, function (data) {
        console.log("port updated");
    });
}

function updatePort1() {
    port.update({
        baudRate: 19200
    }, function (data) {
        console.log("port updated to 19200");
    });
}

/**Update baudrate for normal presure  */
function updatePortNormal() {
    port.update({
        baudRate: 115200
    }, function (data) {
        console.log("port updated to 115200");
function closePort(currentPort) {
    currentPort.close(function () {
        console.log("Port 9600 exit");
        getData();
    });
}

function getData() {
    let newPort = new SerialPort('/dev/ttyACM0', {
        baudRate: 115200
    });
    // newPort.on('open', function () {
    //     console.log("Port with baudrate 115200 open");
    //     newPort.on('data', function (data) {
    //         console.log(data.toString());
    //     });
    // });
    newPort.open(function () {
        console.log("Port with baudrate 115200 open");
        newPort.on('data', function (data) {
            console.log(data.toString());
        });
    });
}

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
                        updatePortNormal();
                        port.on('data', function (data) {
                            console.log("arduino data :", data.toString());
                            client.emit('value',
                                { "value": data.toString(), "status": status });
                        });
                    }
                }
            });
        }

        // baud rate test
        // if (status == "temperature") {
        //     let buffer = new Buffer(1);
        //     buffer.writeInt8(1);
        //     port.update({
        //         baudRate: 19200
        //     }, function (data) {
        //         console.log("port updated to 115200");
        //         port.write(buffer, function (error) {
        //             if (error) {
        //                 console.log("Temperature error :", error);
        //             } else {
        //                 port.update({
        //                     baudRate: 115200
        //                 }, function (data) {
        //                     console.log("port updated to 115200");
        //                     port.write(buffer, function (error) {
        //                         if (error) {
        //                             console.log("Temperature error :", error);
        //                         } else {
        //                             console.log("Temperature :", buffer.toString('hex'));
        //                             if (buffer.toString('hex')) {
        //                                 updatePortNormal();
        //                                 port.on('data', function (data) {
        //                                     console.log("arduino data :", data.toString());
        //                                     client.emit('value',
        //                                         { "value": data.toString(), "status": status });
        //                                 });
        //                             }
        //                         }
        //                     });
        //                 });
        //             }
        //         });
        //     });

        // }

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

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }
        /**
         * Glucometer Measurement
         * Taking glucometer as input from frontend in String format
         *
         * Send 3 from node.js to arduino for communication
         */
        if (status == "glucometer") {
            let buffer = new Buffer(1);
            buffer.writeInt8(3);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("glucometer error :", error);
                } else {
                    console.log("glucometer :", buffer.toString('hex'));

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }
        /**
         * Body Position Measurement
         * Taking bodyposition as input from frontend in String format
         *
         * Send 4 from node.js to arduino for communication
         */
        if (status == "bodyposition") {
            let buffer = new Buffer(1);
            buffer.writeInt8(4);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("bodyposition error :", error);
                } else {
                    console.log("bodyposition :", buffer.toString('hex'));

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }
        /**
         * Blood Presure Measurement
         * Taking bp as input from frontend in String format
         *
         * Send 5 from node.js to arduino for communication
         */
        if (status == "bp") {
            let buffer = new Buffer(1);
            buffer.writeInt8(5);
            port.write(buffer, function (error,result) {
                if (error) {
                    console.log("bp error :", error);
                } else {
                    console.log("bp :", result);
                    if (buffer.toString('hex')) {
                        updatePort1();
                        port.on('data', function (data) {
                            if (data.toString() != 'a' || data.toString() != 'e' || data.toString() != 'i') {
                                console.log("arduino data :", data.toString());
                                client.emit('value',
                                    { "value": data.toString(), "status": status });
                            }
                        });
                    }
                }
            });
        }
        /**
         * ECG Measurement
         * Taking ecg as input from frontend in String format
         *
         * Send 6 from node.js to arduino for communication
         */
        if (status == "ecg") {
            let buffer = new Buffer(1);
            buffer.writeInt8(6);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("ecg error :", error);
                } else {
                    console.log("ecg :", buffer.toString('hex'));

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }
        /**
         * EMG Measurement
         * Taking emg as input from frontend in String format
         *
         * Send 7 from node.js to arduino for communication
         */
        if (status == "emg") {
            let buffer = new Buffer(1);
            buffer.writeInt8(7);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("emg error :", error);
                } else {
                    console.log("emg :", buffer.toString('hex'));

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }
        /**
         * Airflow Measurement
         * Taking airflow as input from frontend in String format
         *
         * Send 8 from node.js to arduino for communication
         */
        if (status == "airflow") {
            let buffer = new Buffer(1);
            buffer.writeInt8(8);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("airflow error :", error);
                } else {
                    console.log("airflow :", buffer.toString('hex'));

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }
        /**
         * Snore Measurement
         * Taking snore as input from frontend in String format
         *
         * Send 9 from node.js to arduino for communication
         */
        if (status == "snore") {
            let buffer = new Buffer(1);
            buffer.writeInt8(9);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("snore error :", error);
                } else {
                    console.log("snore :", buffer.toString('hex'));

                    port.on('data', function (data) {
                        console.log("arduino data :", data.toString());
                        client.emit('value',
                            { "value": data.toString(), "status": status });
                    });
                }
            });
        }

        /**
         * spirometer Measurement
         * Taking spirometer as input from frontend in String format
         *
         * Send 0 from node.js to arduino for communication
         */
        if (status == "spirometer") {
            let buffer = new Buffer(1);
            buffer.writeInt8(0);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("snore error :", error);
                } else {
                    console.log("snore :", buffer.toString('hex'));
                    if (buffer.toString('hex')) {
                        updatePortSpirometer();
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
// port.on('open', function (err) {
//     let _base = this;
//     console.log("a");
//     if (err) {
//         console.log('Error opening port: ', err);
//     } else {
//         console.log(baudRate);
//         setTimeout(function () {
//             if (i == 10) {
//                 console.log("b");
//                 port = new SerialPort(arduinoPort, {
//                     baudRate: 115200
//                 });
//                 let buffer = new Buffer(1);
//                 buffer.writeInt8(1);
//                 port.write(buffer, function (error) {
//                     console.log("c");
//                     if (error) {
//                         console.log("port error :", error);
//                     } else {
//                         console.log("d");
//                         console.log("buffer :", buffer.toString('hex'));
//                     }
//                 });
//             }
//         }, 5000);
//     }
// });



// if (i == 10) {
//     let _base = this;
//     _base.baudRate = 115200;
//     console.log("temperature" + " " + _base.baudRate);
//     console.log(1);
//     setTimeout(function () {
//         let buffer = new Buffer(1);
//         buffer.writeInt8(1);
//         port.write(buffer);
//     }, 100)
// }



// io.on('connection', function (client) {
//     console.log("Socket connected !");
//     let status;
//     let _base = this;
//     client.on("start", function (data) {
//         status = data.status;
//         console.log("status :", status);
//         /**
//          * Body Temparature Measurement
//          * Taking temperature as input from frontend in String format
//          *
//          * Send 1 from node.js to arduino for communication
//          */
//         if (status == "temperature") {
//             // _base.baudRate = 115200;
//             // console.log("temperature" + ' ' + _base.baudRate);
//             var buffer = new Buffer(1);
//             buffer.writeInt8(1);
//             port.write(buffer);
//         }
//         /**
//          * GSR Measurement
//          * Taking gsr as input from frontend in String format
//          *
//          * Send 2 from node.js to arduino for communication
//          */
//         if (status == "gsr") {
//             // _base.baudRate = 115200;
//             // console.log("gsr" + ' ' + _base.baudRate);
//             var buffer = new Buffer(1);
//             buffer.writeInt8(2);
//             port.write(buffer);
//         }
//         /**
//          * Glucometer Measurement
//          * Taking glucometer as input from frontend in String format
//          *
//          * Send 3 from node.js to arduino for communication
//          */
//         if (status == "glucometer") {
//             // _base.baudRate = 115200;
//             // console.log("glucometer" + ' ' + _base.baudRate);
//             var buffer = new Buffer(1);
//             buffer.writeInt8(3);
//             port.write(buffer);
//         }
//         /**
//          * Body Position Measurement
//          * Taking bodyposition as input from frontend in String format
//          *
//          * Send 4 from node.js to arduino for communication
//          */
//         if (status == "bodyposition") {
//             var buffer = new Buffer(1);
//             buffer.writeInt8(4);
//             port.write(buffer);
//         }
//         /**
//          * Blood Presure Measurement
//          * Taking bp as input from frontend in String format
//          *
//          * Send 5 from node.js to arduino for communication
//          */
//         if (status == "bp") {
//             // _base.baudRate = 19200;
//             // console.log("bp" + ' ' + _base.baudRate);
//             var buffer = new Buffer(1);
//             buffer.writeInt8(5);
//             port.write(buffer);
//         }
//         /**
//          * ECG Measurement
//          * Taking ecg as input from frontend in String format
//          *
//          * Send 6 from node.js to arduino for communication
//          */
//         if (status == "ecg") {
//             // _base.baudRate = 115200;
//             // console.log("ecg" + ' ' + _base.baudRate);
//             var buffer = new Buffer(1);
//             buffer.writeInt8(6);
//             port.write(buffer);
//         }
//         /**
//          * EMG Measurement
//          * Taking emg as input from frontend in String format
//          *
//          * Send 7 from node.js to arduino for communication
//          */
//         if (status == "emg") {
//             var buffer = new Buffer(1);
//             buffer.writeInt8(7);
//             port.write(buffer);
//         }
//     });

//     /**
//      * Getting values from arduino
//     */
//     parser.on('data', function (data) {
//         // console.log("baud rate :", _base.baudRate);
//         console.log("arduino data :", data);
//         client.emit('value',
//             { "value": data, "status": status });
//     });
// });

/**
 * Routings
 */

/**
 * User registration and login
 *
 * id:String
 * name:String
 * email:String
 * loginTime:String
 * 
 */
app.post('/registration', function (request, response) {
    console.log("User data :");
    console.log(request.body);

    let userDetails = {};

    let data = new vitalStats();
    data.name = request.body.name;
    data.email = request.body.email;
    data.individualId = request.body.individualId;

    data.save(function (error, result) {
        if (error) {
            userDetails.error = true;
            userDetails.message = `User details not saved.`;
            response.status(404).json(userDetails);
        } else if (result) {
            console.log("User registration result :", result);
            userDetails.error = false;
            userDetails.userRegistration = result;
            userDetails.message = `User Registration Details.`;
            response.status(200).json(userDetails);
        }
    });
});

/**
 *
 * Save sensor values
 * time:String
 * temperature:String
 * "gsr":{
 *  "conductance":"",
 *  "resistance":"",
 *  "conductanceVol":""
 * }
 */
app.put('/sensorValues', function (request, response) {
    console.log("request.body :");
    console.log(request.body);

    let details = {};
    /**For measuring temperature*/
    let temperature = request.body.temperature;

    /**For measuring GSR*/
    let gsr = request.body.gsr;

    /**For measuring glucometer */
    let glucometer = request.body.glucometer;

    /**For measuring body position */
    let bodyposition = request.body.bodyposition;

    /**For measuring ECG */
    let ecg = request.body.ecg;

    /**For measuring EMG */
    let emg = request.body.emg;

    /**For measuring EMG */
    let bp = request.body.bp;


    vitalStats.findOne({ _id: request.body._id }, function (error, res) {
        if (error) {
            details.error = true;
            details.message = `User not found.`;
            response.status(404).json(details);
        } else if (res) {
            if (temperature) {
                res.stats.push({
                    "temperature": temperature
                });
            }
            if (gsr) {
                res.stats.push({
                    "gsr": gsr
                });
            }
            if (glucometer) {
                res.stats.push({
                    "glucometer": glucometer
                });
            }
            if (bodyposition) {
                res.stats.push({
                    "bodyposition": bodyposition
                });
            }
            if (ecg) {
                res.stats.push({
                    "ecg": ecg
                });
            }
            if (emg) {
                res.stats.push({
                    "emg": emg
                });
            }
            if (bp) {
                res.stats.push({
                    "bp": bp
                });
            }
            res.save(function (error, result) {
                if (error) {
                    details.error = true;
                    details.message = `Sensor details not saved.`;
                    response.status(404).json(details);
                } else if (result) {
                    details.error = false;
                    details.sensorDetails = result;
                    details.message = `Sensor Details.`;
                    response.status(200).json(details);
                }
            });
        }
    });
});

app.listen(7000, function () {
    console.log("Server started");
});
