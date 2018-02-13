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
        /**
         * GSR Measurement
         * Taking gsr as input from frontend in String format
         * 
         * Send 2 from node.js to arduino for communication
         */
        else if (status == "gsr") {
            var buffer = new Buffer(1);
            buffer.writeInt8(2);
            port.write(buffer);
        }
        /**
         * Glucometer Measurement
         * Taking glucometer as input from frontend in String format
         * 
         * Send 3 from node.js to arduino for communication
         */
        else if (status == "glucometer") {
            var buffer = new Buffer(1);
            buffer.writeInt8(3);
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

const PORT = 7000;
server.listen(PORT, function () {
    console.log("Server started");
});