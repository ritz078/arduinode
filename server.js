'use strict';

var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8081));
var five = require('johnny-five');



app.use(express.static(__dirname + '/app'));

app.get('/', function (res) {
  res.sendfile('/index.html');
});

var controller = process.argv[2] || 'GP2Y0A02YK0F';

var board = new five.Board({
  repl:false
});


  board.on('ready', function () {

    var imu = new five.IMU({
      controller: 'MPU6050'
    });

    var i=0;
    imu.on('change', function () {
    i++;
      if(i%30===0){
        var date=new Date();
        var imuData={
          'time':date,
          'temperature':parseFloat(this.temperature.celsius.toFixed(2)),
          'accelerometer':{
            'x':this.accelerometer.x,
            'y':this.accelerometer.y,
            'z':this.accelerometer.z,
            'pitch':this.accelerometer.pitch,
            'roll':this.accelerometer.roll,
            'acceleration':this.accelerometer.acceleration,
            'inclination':this.accelerometer.inclination,
            'orientation':this.accelerometer.orientation
          },
          'gyro':{
            'x':this.gyro.x,
            'y':this.gyro.y,
            'z':this.gyro.z,
            'pitch':this.gyro.pitch,
            'roll':this.gyro.roll,
            'yaw':this.gyro.yaw,
            'rate':this.gyro.rate
          }
        };
        io.emit('temp', imuData);
      }
    });

    io.emit('started','started');


    var speed, commands, motors;
    commands = null;
    motors = {
      a: new five.Motor([3, 12]),
      b: new five.Motor([11, 13])
    };
speed=255;
    motors.a.fwd(speed);
    motors.b.fwd(speed);



    io.on('connection', function (socket) {
      socket.on('stop car',function(a){
        console.log(a);
        speed=255;
        motors.a.fwd(speed);
        motors.b.fwd(speed);
      });

      socket.on('forward car',function (a) {
        console.log(a);
        speed=100;
        motors.a.fwd(speed);
        motors.b.fwd(speed);
      });

      socket.on('reverse', function (a) {
        speed=170;
        motors.a.rev(speed);
        motors.b.rev(speed);
      })
    });



  });



