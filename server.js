var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8080));
var five = require('johnny-five');



app.use(express.static(__dirname + '/app'));

app.get("/", function (req, res) {
  res.sendfile("/index.html");
});

var controller = process.argv[2] || "GP2Y0A02YK0F";

var board = new five.Board();


  board.on("ready", function () {

    //
    //
    //var speed, commands, motors;
    //
    //speed = 100;
    //commands = null;
    //motors = {
    //  a: new five.Motor([3, 12]),
    //  b: new five.Motor([11, 13])
    //};
    //
    //motors.a.fwd(2*speed);
    //motors.b.fwd(2*speed);

    //
    //this.repl.inject({
    //  motors: motors
    //});
    //
    //function controller(ch, key) {
    //  if (key) {
    //    if (key.name === "space") {
    //      motors.a.stop();
    //      motors.b.stop();
    //    }
    //    if (key.name === "up") {
    //      motors.a.rev(speed);
    //      motors.b.fwd(speed);
    //    }
    //    if (key.name === "down") {
    //      motors.a.fwd(speed);
    //      motors.b.rev(speed);
    //    }
    //    if (key.name === "right") {
    //      motors.a.fwd(speed * 0.75);
    //      motors.b.fwd(speed * 0.75);
    //    }
    //    if (key.name === "left") {
    //      motors.a.rev(speed * 0.75);
    //      motors.b.rev(speed * 0.75);
    //    }
    //
    //    commands = [].slice.call(arguments);
    //  } else {
    //    if (ch >= 1 && ch <= 9) {
    //      speed = five.Fn.scale(ch, 1, 9, 0, 255);
    //      controller.apply(null, commands);
    //    }
    //  }
    //}
    //
    //
    //keypress(process.stdin);
    //
    //process.stdin.on("keypress", controller);
    //process.stdin.setRawMode(true);
    //process.stdin.resume();


    var proximity = new five.IR.Proximity({
      controller: controller,
      pin: "A1"
    });


    proximity.on("change", function () {
      io.emit('prox',{'data': this.value});
      console.log("inches: ", this.value);
    });

    var imu = new five.IMU({
      controller: "MPU6050"
    });

    var i=0;
    var imuData={};
    imu.on("change", function (d) {
    i++;

      if(i%15==0){
        var date=new Date();
        var imuData={
          id:i,
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
        }
        console.log(i);
        io.emit('temp', imuData);
      }

      //console.log("  celsius      : ", this.temperature.celsius);
      //console.log("  fahrenheit   : ", this.temperature.fahrenheit);
      //console.log("  kelvin       : ", this.temperature.kelvin);
      //console.log("--------------------------------------");

      //console.log("accelerometer");
      //console.log("  x            : ", this.accelerometer.x);
      //console.log("  y            : ", this.accelerometer.y);
      //console.log("  z            : ", this.accelerometer.z);
      //console.log("  pitch        : ", this.accelerometer.pitch);
      //console.log("  roll         : ", this.accelerometer.roll);
      //console.log("  acceleration : ", this.accelerometer.acceleration);
      //console.log("  inclination  : ", this.accelerometer.inclination);
      //console.log("  orientation  : ", this.accelerometer.orientation);
      //console.log("--------------------------------------");

      //console.log("gyro");
      //console.log("  x            : ", this.gyro.x);
      //console.log("  y            : ", this.gyro.y);
      //console.log("  z            : ", this.gyro.z);
      //console.log("  pitch        : ", this.gyro.pitch);
      //console.log("  roll         : ", this.gyro.roll);
      //console.log("  yaw          : ", this.gyro.yaw);
      //console.log("  rate         : ", this.gyro.rate);
      //console.log("  isCalibrated : ", this.gyro.isCalibrated);
      //console.log("--------------------------------------");
    });

  });



