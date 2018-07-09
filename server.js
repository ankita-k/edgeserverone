var express = require('express');
const SerialPort = require('serialport-v5');
const Readline = SerialPort.parsers.Readline;
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var axios = require('axios');
var net = require('net');
var config = require('./config.json');

var body_Scale_Port = 9000;
var host = 'hwsensor.local';

let id;
let port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/**
 * Import vitalStats model
*/
let vitalStats = require('./models/vitalStats');

/**
 * connect to mongodb
*/
// mongoose.connect('mongodb://127.0.0.1:27017/edge');
mongoose.connect('mongodb://test:password@ds211558.mlab.com:11558/ionic_chat');

//on successful connection
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb!!!');
});

//on error
mongoose.connection.on('error', (err) => {
    if (err) {
        console.log('Error in db is :' + err);
    }
});

//middleware
app.use(cors());
//body-parser
app.use(bodyParser.json());

io.on('connection', function (client) {
    console.log("Socket connected !");
    let status;
    client.on("start", function (data) {
        status = data.status;
        console.log("status :", status);
  


        /**
         * input : "glucometer", from web
         * send : 2 , to arduino
         */
        if (status == "glucometer") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(2);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("glucometer error :", error);
                } else {
                    console.log("glucometer :", buffer.toString('hex'));
                }
            });
        }
        /**
         * input : "bp", from web
         * send : 3 , to arduino
         */
        if (status == "bp") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(3);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("bp error :", error);
                } else {
                    console.log("bp :", buffer.toString('hex'));
                    if (buffer.toString('hex')) {
                        port.update({
                            baudRate: 19200
                        }, function (data) {
                            console.log("port updated to 19200");
                        });
                    }
                }
            });
        }
        /**
         * input : "spo2", from web
         * send : 4 , to arduino
         */
        if (status == "spo2") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(4);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("spo2 error :", error);
                } else {
                    console.log("spo2 :", buffer.toString('hex'));
                }
            });
        }
        /**
                * input : "gsr", from web
                * send : 5 , to arduino
                */
        if (status == "airflow") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(5);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("airflow error :", error);
                } else {
                    console.log("airflow :", buffer.toString('hex'));
                }
            });
        }
      /**
         * input : "temperature", from web
         * send : 6 , to arduino
         */
        if (status == "temperature") {
            let count = 0;
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let interval = setInterval(function () {
                count++;
                let buffer = new Buffer(1);
                buffer.writeInt8(6);
                port.write(buffer, function (error) {
                    if (error) {
                        console.log("Temperature error :", error);
                    } else {
                        console.log("Temperature :", buffer.toString('hex'));
                    }
                });
                console.log(count);
                if (count == 31) {
                    clearInterval(interval);
                }
            }, 1000);
        }

        /**
         * input : "spirometer", from web
         * send : 7 , to arduino
         */
        if (status == "spirometer") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(7);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("spirometer error :", error);
                } else {
                    console.log("spirometer :", buffer.toString('hex'));
                    if (buffer.toString('hex')) {
                        port.update({
                            baudRate: 9600
                        }, function (data) {
                            console.log("port updated to 9600");
                        });
                    }
                }
            });
        }

        if (status == "ecg") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(8);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("ecg detail :", error);
                } else {
                    console.log("ecg :", buffer.toString('hex'));
                    // if (buffer.toString('hex')) {
                    //     port.update({
                    //         baudRate: 9600
                    //     }, function (data) {
                    //         console.log("port updated to 9600");
                    //     });
                    // }
                }
            });
        }

                /**
         * input : "gsr", from web
         * send : 5 , to arduino
         */
        if (status == "gsr") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(9);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("gsr error :", error);
                } else {
                    console.log("gsr :", buffer.toString('hex'));
                }
            });
        }

                    /**
         * input : "emg", from web
         * send : 2 , to arduino
         */
        if (status == "emg") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(10);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("emg error :", error);
                } else {
                    console.log("emg :", buffer.toString('hex'));
                }
            });
        }


        if (status == "snore") {
            port.update({
                baudRate: 115200
            }, function (data) {
                console.log("port updated to 115200");
            });
            let buffer = new Buffer(1);
            buffer.writeInt8(11);
            port.write(buffer, function (error) {
                if (error) {
                    console.log("snore error :", error);
                } else {
                    console.log("snore :", buffer.toString('hex'));
                }
            });
        }


        /**body-scale */
        if (status == "bodyscale") {
            var cli = new net.Socket();
            cli.connect(body_Scale_Port, host, function () {
                console.log('CONNECTED TO: ' + host + ':' + body_Scale_Port);
                // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
                cli.write('http://host:9000/LED=ON');
            });
            // Add a 'data' event handler for the client socket
            // data is what the server sent to this socket
            cli.on('data', function (data) {
                console.log('data: ' + data);
                if (data) {
                    client.emit('bodyscale_value', {
                        value: data.toString(), "status": status
                    });
                }
                cli.write('http://host:9000/LED=OFF');
                // Close the client socket completely
                cli.destroy();
            });

            // Add a 'close' event handler for the client socket
            cli.on('close', function () {
                console.log('Connection closed');
            });
            cli.on('error', function (error) {
                console.log(error);
            });
        }
    });
    parser.on('data', function (data) {
        console.log("arduino data :", data);
        client.emit('value',
            { "value": data, "status": status });
    });
});

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
    let name = request.body.name;
    let email = request.body.email;
    let individualId = request.body.individualId;

    let data = new vitalStats();
    data.name = name;
    data.email = email;
    data.individualId = individualId;

    data.save(function (error, result) {
        if (error) {
            userDetails.error = true;
            userDetails.message = `User details not saved.`;
            response.status(404).json(userDetails);
        } else if (result) {
            userDetails.error = false;
            userDetails.userRegistration = result;
            console.log("res result :", result);
            id = result.individualId;
            console.log("id :", id);
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

    /**For measuring glucometer */
    let glucometer = request.body.glucometer;

    /**For measuring bp */
    let bp = request.body.bp;

    /**For measuring ECG */
    let spo2 = request.body.spo2;

    /**For measuring GSR*/
    let gsr = request.body.gsr;

    /**For measuring spirometer*/
    let spirometer = request.body.spirometer;
    let ecg = request.body.ecg;
    let bodyposition = request.body.bodyposition;
    let airflow = request.body.airflow;
    let emg = request.body.emg;
    let snore = request.body.snore;
    


    /**calling rest api for meme server
     * post operation
    */

    //header
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    vitalStats.findOne({ _id: request.body._id }, function (error, res) {
        if (error) {
            details.error = true;
            details.message = `User not found.`;
            response.status(404).json(details);
        } else if (res) {
            /**temperature
             * post data to local database
             * post data to meme server
             */




            if (emg) {
                //post emg data to local database
                res.stats.push({
                    "emg": emg
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "emg",
                    "statValue": emg

                }, axiosConfig)
                    .then(function (result) {
                        console.log("result emg :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (snore) {
                //post snore data to local database
                res.stats.push({
                    "snore": snore
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "snore",
                    "statValue": snore

                }, axiosConfig)
                    .then(function (result) {
                        console.log("result snore :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (ecg) {
                //post ecg data to local database
                res.stats.push({
                    "ecg": ecg
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "ecg",
                    "statValue": ecg

                }, axiosConfig)
                    .then(function (result) {
                        console.log("result ecg :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (airflow) {
                //post airflow data to local database
                res.stats.push({
                    "airflow": airflow
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "airflow",
                    "statValue": airflow

                }, axiosConfig)
                    .then(function (result) {
                        console.log("result airflow :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (bodyposition) {
                //post bodyposition data to local database
                res.stats.push({
                    "bodyposition": bodyposition
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "bodyposition",
                    "statValue": bodyposition

                }, axiosConfig)
                    .then(function (result) {
                        console.log("result body :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (temperature) {
                //post temperature data to local database
                res.stats.push({
                    "temperature": temperature
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "temperature",
                    "statValue": temperature
                }, axiosConfig)
                    .then(function (result) {
                        console.log("result :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }
            if (glucometer) {
                console.log("glucometer data to be posted");
                console.log(glucometer);
                res.stats.push({
                    "glucometer": glucometer
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "glucometer",
                    "statValue": glucometer
                }, axiosConfig)
                    .then(function (result) {
                        console.log("result :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (bp) {
                res.stats.push({
                    "bp": bp
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "bp",
                    "statValue": bp
                }, axiosConfig)
                    .then(function (result) {
                        console.log("result :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (spo2) {
                res.stats.push({
                    "spo2": spo2
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "spo2",
                    "statValue": spo2
                }, axiosConfig)
                    .then(function (result) {
                        console.log("result :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }
            // if (spo2) {
            //     res.stats.push({
            //         "spo2": spo2
            //     });

            //     //update data to memeserver
            //     axios.put(config.apiUrl + 'vital/update', {
            //         "_id": id,
            //         "stats": {
            //             "spo2": spo2
            //         }
            //     }, axiosConfig)
            //         .then(function (result) {
            //             console.log("result :", result.data);
            //         }).catch(function (error) {
            //             console.log("error :", error);
            //         });
            // }

            // if (gsr) {
            //     res.stats.push({
            //         "gsr": gsr
            //     });

            //     //update data to memeserver
            //     axios.put(config.apiUrl + 'vital/update', {
            //         "_id": id,
            //         "stats": {
            //             "gsr": gsr
            //         }
            //     }, axiosConfig)
            //         .then(function (result) {
            //             console.log("result :", result.data);
            //         }).catch(function (error) {
            //             console.log("error :", error);
            //         });
            // }

            if (gsr) {
                res.stats.push({
                    "gsr": gsr
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "gsr",
                    "statValue": gsr
                }, axiosConfig)
                    .then(function (result) {
                        console.log("result :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
                    });
            }

            if (spirometer) {
                res.stats.push({
                    "spirometer": spirometer
                });

                //update data to memeserver
                axios.post(config.apiUrl + 'vital/create', {
                    "individualId": id,
                    "statType": "spirometer",
                    "statValue": spirometer
                }, axiosConfig)
                    .then(function (result) {
                        console.log("result :", result.data);
                    }).catch(function (error) {
                        console.log("error :", error);
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
                    console.log(result);
                    details.message = `Sensor Details.`;
                    response.status(200).json(details);
                }
            });
        }
    });
});

const PORT = 8000;
server.listen(PORT, function () {
    console.log("Server started at:  ", PORT);
});
