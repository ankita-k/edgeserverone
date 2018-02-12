var express = require('express');
const SerialPort = require('serialport');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200
});

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

/**
 * Import User model
*/
let User = require('./models/user');

/**
 * connect to mongodb
*/
// mongoose.connect('mongodb://127.0.0.1:27017/Edge');
mongoose.connect('mongodb://test:password@ds211558.mlab.com:11558/ionic_chat');

//on successful connection
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb!!');
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
        /**
         * Body Temparature Measurement
         * Taking temperature as input from frontend in String format
         * 
         * Send 1 from node.js to arduino for communication
         */
        if (status == "temperature") {
            var buffer = new Buffer(1);
            buffer.writeInt8(1);
            port.write(buffer);
        }
        /**Blood Presure Measurement
         * Taking 201 as input from frontend 
         */
        else if (status == "201") {
            var buffer = new Buffer(1);
            buffer.writeInt8(101);
            port.write(buffer);
        }

        /**EMG Measurement
         * Taking 202 as input from frontend 
         */
        else if (status == "202") {
            var buffer = new Buffer(1);
            buffer.writeInt8(102);
            port.write(buffer);
        }
    });

    /**
     * Getting values from arduino
    */
    parser.on('data', function (data) {
        console.log("Data from arduino :", data);
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
app.post('/registrationAndLogin', function (request, response) {
    console.log("User data :");
    console.log(request.body);

    let userDetails = {};

    User.find({ id: request.body.id }, function (error, res) {
        if (error) {
            userDetails.error = true;
            userDetails.message = `User not found.`;
            response.status(404).json(userDetails);
        } else if (res) {
            if (res.length == 0) {

                let data = new User();
                data.name = request.body.name;
                data.email = request.body.email;
                data.id = request.body.id;
                data.loginTime = request.body.loginTime;

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
            } else {
                console.log("User login result :", result);
                userDetails.error = false;
                userDetails.userLogin = res;
                userDetails.message = `User Login Details.`;
                response.status(200).json(userDetails);
            }
        }
    });
});

/**
 * 
 * Save sensor values
 * id:String
 * temperature:String
 */
app.put('/sensorValues', function (request, response) {
    console.log("request.body :");
    console.log(request.body);

    let details = {};
    let temperature = request.body.temperature;

    User.findOne({ id: request.body.id }, function (error, res) {
        if (error) {
            details.error = true;
            details.message = `User not found.`;
            response.status(404).json(details);
        } else if (res) {
            console.log("Result value :", res);

            switch (request.body) {
                case request.body.temperature: {
                    console.log("Temperature value :", request.body.temperature);
                    res.temperature = temperature;
                    break;
                }
            }
            res.save((error, result) => {
                if (error) {
                    details.error = true;
                    details.message = `Sensor value not updated.`;
                    response.status(404).json(details);
                } else if (result) {
                    console.log("Sensor value result :", result);
                    details.error = false;
                    details.SensorDetails = result;
                    details.message = `Sensor Details.`;
                    response.status(200).json(details);
                }
            });
        }

    });
});

const PORT = 7000;
server.listen(PORT, function () {
    console.log("Server started");
});