'use strict';

var app = angular.module('arduinode', ['btford.socket-io', 'highcharts-ng']);

app.factory('mySocket', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('error');
  return mySocket;
});

app.controller('ArduinodeCtrl', ['$scope', 'mySocket', function ($scope, mySocket) {

  var lineData={
    'x':[],
    'y':[],
    'z':[]
  };

  var accData={
    'x':[],
    'y':[],
    'z':[]
  }


  Array.prototype.initializeArray=function(d){
    while(d--){
      this.push(0);
    }
    return this;
  };



  Array.prototype.updateChartData=function(d){
    this.shift();
    this.push(d);
    return this;
  };

  lineData.x.initializeArray(50);
  lineData.y.initializeArray(50);
  lineData.z.initializeArray(50);

  accData.x.initializeArray(50);
  accData.y.initializeArray(50);
  accData.z.initializeArray(50);


  mySocket.on('temp', function (d) {
    console.log(d);
    $scope.imu = d;
    var gyro= d.gyro;
    var acc= d.accelerometer;

    lineData.x.updateChartData(gyro.pitch.angle);
    lineData.y.updateChartData(gyro.yaw.angle);
    lineData.z.updateChartData(gyro.roll.angle);

    accData.x.updateChartData(acc.x*9.80665);
    accData.y.updateChartData((acc.y+0.05)*9.80665);
    accData.z.updateChartData((acc.z+0.205)*9.8065);



    $scope.tempConfig = {

      //This is not a highcharts object. It just looks a little like one!
      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be ovverriden by values specified below.
        chart: {
          type: 'solidgauge',
          backgroundColor: null
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        pane: {
          center: ['50%', '85%'],
          size: '100%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'rgba(255,255,255,0.1)',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },
        title:'Temperature',
        yAxis: {
          stops: [
            [18.1, '#55BF3B'], // green
            [18.3, '#DDDF0D'], // yellow
            [21, '#DF5353'] // red
          ],
          lineWidth: 0,
          minorTickInterval: null,
          tickPixelInterval: 400,
          tickWidth: 0,
          title: {
            y: -570
          },
          labels: {
            y: 160
          }
        },
        loading:true,
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        }
      },

      //The below properties are watched separately for changes.
      //Series object (optional) - a list of series using normal highcharts series options.
      series: [{
        'name':'',
        data: [d.temperature],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">&deg; C</span></div>'
        }
      }],
      yAxis: {
        min: 10,
        max: 50,
        title: {
          text: 'Celcius'
        }
      }

    };

    $scope.chartc={
      "options": {
        "chart": {
          "type": "spline",
          "backgroundColor":null
        },
        "credits": {
          enabled: false
        },
        "exporting": {
          enabled: false
        },
        "tooltip": {
          enabled: true
        },
        "title":{
          'text':'Gyrometer'
        },
        "plotOptions": {
          "line":{
            'marker':{
              'enabled':false
            }
          }
        },
        yAxis: {
          title: {
            text: 'Angle (in degrees)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        }
      },

      "series": [
        {
          "name": "Pitch",
          "data": lineData.x,
          "id": "series-0",
          "marker":{
            "enabled":false
          }
        },
        {
          "name": "Yaw",
          "data": lineData.y,
          "id": "series-1",
          "marker":{
            "enabled":false
          }
        },
        {
          "name": "Roll",
          "data": lineData.z,
          "id": "series-2",
          "marker":{
            "enabled":false
          }
        }]
    }
    $scope.accelerometerConfig={
      "options": {
        "chart": {
          "type": "spline",
          "backgroundColor":null
        },
        "credits": {
          enabled: false
        },
        "exporting": {
          enabled: false
        },
        "tooltip": {
          enabled: true
        },
        "title":{
          'text':'Accelerometer'
        },
        "plotOptions": {
          "line":{
            'marker':{
              'enabled':false
            }
          }
        },
        yAxis: {
          title: {
            text: 'Acceleration (in m/s^2)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        }
      },

      "series": [
        {
          "name": "x",
          "data": accData.x,
          "id": "series-0",
          "marker":{
            "enabled":false
          }
        },
        {
          "name": "y",
          "data": accData.y,
          "id": "series-1",
          "marker":{
            "enabled":false
          }
        },
        {
          "name": "z",
          "data": accData.z,
          "id": "series-2",
          "marker":{
            "enabled":false
          }
        }]
    }
    console.log($scope.chartc.options.plotOptions.line.marker.enabled);
  });



  function speedC(s){
    alert('a');
  $scope.speedConfig={
    "options": {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor:null
      },
      "exporting": {
        enabled: false
      },
      title: {
        text: 'Angular Velocity (RPM)'
      },

      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '109%'
        }, {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#333'],
              [1, '#FFF']
            ]
          },
          borderWidth: 1,
          outerRadius: '107%'
        }, {
          // default background
        }, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '105%',
          innerRadius: '103%'
        }]
      },
      yAxis: {
        min: 0,
        max: 500,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto',
          style:{
            color:'#000'
          }
        },
        title: {
          text: 'Angular Velocity (rpm)',
          style:{
            color:'#000'
          }
        },
        subtitle:{
          style:{
            color:'#000'
          }
        },
        plotOptions:{
          series:{
            dataLabels:{
              color:'#000'
            }
          }
        },
        plotBands: [{
          from: 0,
          to: 260,
          color: '#55BF3B' // green
        }, {
          from:260,
          to: 380,
          color: '#DDDF0D' // yellow
        }, {
          from: 380,
          to: 500,
          color: '#DF5353' // red
        }]
      }

    },
    "series": [{
      "name": 'Speed',
      "data": [s],
      "tooltip": {
        valueSuffix: ' rpm'

      }
    }]
  }}

  speedC(0);

var oldSpeed=0;
  mySocket.on('prox', function (d) {
    if(d.speed!=oldSpeed){
      //speedC(d.speed);
      $scope.speedConfig.series[0].data=[d.speed];
      oldSpeed= d.speed;
    }
    $scope.speed= d.speed;

  })
}]);
