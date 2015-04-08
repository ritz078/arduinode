'use strict';

var app = angular.module('arduinode', ['btford.socket-io', 'highcharts-ng']);

app.factory('mySocket', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('error');
  return mySocket;
});

app.controller('ArduinodeCtrl', ['$scope', 'mySocket', function ($scope, mySocket) {

  $scope.assimpModelUrl = "/model/model.json";
  var lineData = {
    'x': [],
    'y': [],
    'z': []
  };

  var accData = {
    'x': [],
    'y': [],
    'z': []
  }

  Array.prototype.initializeArray = function (d) {
    while (d--) {
      this.push(0);
    }
    return this;
  };

  Array.prototype.updateChartData = function (d) {
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
    $scope.imu = d;
    var gyro = d.gyro;
    var acc = d.accelerometer;

    $scope.threeDgyro = {
      'pitch': gyro.pitch.angle * 2,
      'yaw'  : gyro.yaw.angle * 2,
      'roll' : gyro.roll.angle * 2
    };

    lineData.x.updateChartData(gyro.pitch.angle);
    lineData.y.updateChartData(gyro.yaw.angle);
    lineData.z.updateChartData(gyro.roll.angle);

    accData.x.updateChartData(acc.x * 9.80665);
    accData.y.updateChartData((acc.y + 0.05) * 9.80665);
    accData.z.updateChartData((acc.z + 0.205) * 9.8065);

    $scope.tempConfig = {

      //This is not a highcharts object. It just looks a little like one!
      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be ovverriden by values specified below.
        chart      : {
          type           : 'solidgauge',
          backgroundColor: null
        },
        credits    : {
          enabled: false
        },
        exporting  : {
          enabled: false
        },
        tooltip    : {
          enabled: false
        },
        pane       : {
          center    : ['50%', '85%'],
          size      : '100%',
          startAngle: -90,
          endAngle  : 90,
          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'rgba(255,255,255,0.1)',
            innerRadius    : '60%',
            outerRadius    : '100%',
            shape          : 'arc'
          }
        },
        title      : 'Temperature',
        yAxis      : {
          stops            : [
            [18.1, '#55BF3B'], // green
            [18.3, '#DDDF0D'], // yellow
            [21, '#DF5353'] // red
          ],
          lineWidth        : 0,
          minorTickInterval: null,
          tickPixelInterval: 400,
          tickWidth        : 0,
          title            : {
            y: -570
          },
          labels           : {
            y: 160
          }
        },
        loading    : true,
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y          : 5,
              borderWidth: 0,
              useHTML    : true
            }
          }
        }
      },

      //The below properties are watched separately for changes.
      //Series object (optional) - a list of series using normal highcharts series options.
      series : [{
        'name'    : '',
        data      : [d.temperature],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">&deg; C</span></div>'
        }
      }],
      yAxis  : {
        min  : 10,
        max  : 50,
        title: {
          text: 'Celcius'
        }
      }

    };

    $scope.chartc = {
      "options": {
        "chart"      : {
          "type"           : "spline",
          "backgroundColor": null
        },
        "credits"    : {
          enabled: false
        },
        "exporting"  : {
          enabled: false
        },
        "tooltip"    : {
          enabled: true
        },
        "title"      : {
          'text': 'Gyrometer'
        },
        "plotOptions": {
          "line": {
            'marker': {
              'enabled': false
            }
          }
        },
        yAxis        : {
          title    : {
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
          "name"  : "Pitch",
          "data"  : lineData.x,
          "id"    : "series-0",
          "marker": {
            "enabled": false
          }
        },
        {
          "name"  : "Yaw",
          "data"  : lineData.y,
          "id"    : "series-1",
          "marker": {
            "enabled": false
          }
        },
        {
          "name"  : "Roll",
          "data"  : lineData.z,
          "id"    : "series-2",
          "marker": {
            "enabled": false
          }
        }]
    }
    $scope.accelerometerConfig = {
      "options": {
        "chart"      : {
          "type"           : "spline",
          "backgroundColor": null
        },
        "credits"    : {
          enabled: false
        },
        "exporting"  : {
          enabled: false
        },
        "tooltip"    : {
          enabled: true
        },
        "title"      : {
          'text': 'Accelerometer'
        },
        "plotOptions": {
          "line": {
            'marker': {
              'enabled': false
            }
          }
        },
        yAxis        : {
          title    : {
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
          "name"  : "x",
          "data"  : accData.x,
          "id"    : "series-0",
          "marker": {
            "enabled": false
          }
        },
        {
          "name"  : "y",
          "data"  : accData.y,
          "id"    : "series-1",
          "marker": {
            "enabled": false
          }
        },
        {
          "name"  : "z",
          "data"  : accData.z,
          "id"    : "series-2",
          "marker": {
            "enabled": false
          }
        }]
    }
  });

  function speedC(s) {
    $scope.speedConfig = {
      "options": {
        chart      : {
          type               : 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth    : 0,
          plotShadow         : false,
          backgroundColor    : null
        },
        "exporting": {
          enabled: false
        },
        title      : {
          text: 'Angular Velocity (RPM)'
        },

        pane : {
          startAngle: -150,
          endAngle  : 150,
          background: [{
            backgroundColor: {
              linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
              stops         : [
                [0, '#FFF'],
                [1, '#333']
              ]
            },
            borderWidth    : 0,
            outerRadius    : '109%'
          }, {
            backgroundColor: {
              linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
              stops         : [
                [0, '#333'],
                [1, '#FFF']
              ]
            },
            borderWidth    : 1,
            outerRadius    : '107%'
          }, {
            // default background
          }, {
            backgroundColor: '#DDD',
            borderWidth    : 0,
            outerRadius    : '105%',
            innerRadius    : '103%'
          }]
        },
        yAxis: {
          min: 0,
          max: 500,

          minorTickInterval: 'auto',
          minorTickWidth   : 1,
          minorTickLength  : 10,
          minorTickPosition: 'inside',
          minorTickColor   : '#666',

          tickPixelInterval: 30,
          tickWidth        : 2,
          tickPosition     : 'inside',
          tickLength       : 10,
          tickColor        : '#666',
          labels           : {
            step    : 2,
            rotation: 'auto',
            style   : {
              color: '#000'
            }
          },
          title            : {
            text : 'Angular Velocity (rpm)',
            style: {
              color: '#000'
            }
          },
          subtitle         : {
            style: {
              color: '#000'
            }
          },
          plotOptions      : {
            series: {
              dataLabels: {
                color: '#000'
              }
            }
          },
          plotBands        : [{
            from : 0,
            to   : 260,
            color: '#55BF3B' // green
          }, {
            from : 260,
            to   : 380,
            color: '#DDDF0D' // yellow
          }, {
            from : 380,
            to   : 500,
            color: '#DF5353' // red
          }]
        }

      },
      "series" : [{
        "name"   : 'Speed',
        "data"   : [s],
        "tooltip": {
          valueSuffix: ' rpm'

        }
      }]
    }
  }

  speedC(0);

  var oldSpeed = 0;
  mySocket.on('prox', function (d) {
    if (d.speed != oldSpeed) {
      //speedC(d.speed);
      $scope.speedConfig.series[0].data = [d.speed];
      oldSpeed = d.speed;
    }
    $scope.speed = d.speed;

  })
}]);

app.directive(
  "tjsModelViewer",
  ['$timeout', function ($timeout) {
    return {
      restrict: "E",
      scope   : {
        assimpUrl : "=assimpUrl",
        assimpData: "=assimpData"
      },
      link    : function (scope, elem, attr) {
        var camera;
        var scene;
        var renderer;

        // init scene
        init();

        // Load jeep model using the AssimpJSONLoader
        var loader1 = new THREE.AssimpJSONLoader();

        function loadModel(modelUrl) {
          loader1.load(modelUrl, function (assimpjson) {
            assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 0.3;
            assimpjson.updateMatrix();
            scene.add(assimpjson);
            assimpjson.name = "model";
            console.log(scene.getObjectByName('model'))
          });
        }

        loadModel(scope.assimpUrl);
        animate();

        function init() {
          camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
          camera.position.set(0, 0, 0);
          scene = new THREE.Scene();
          scene.position.set(0, 0, 0);
          scene.rotation.set(1, 0, 0);
          // Lights
          var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee);
          directionalLight.position.x = Math.random() - 0.5;
          directionalLight.position.y = Math.random() - 0.5;
          directionalLight.position.z = Math.random() - 0.5;
          directionalLight.position.normalize();
          scene.add(directionalLight);

          // Renderer
          renderer = new THREE.WebGLRenderer();
          renderer.setSize(window.innerWidth, window.innerHeight);
          elem[0].appendChild(renderer.domElement);

          //Events
          window.addEventListener('resize', onWindowResize, false);
        }

        //
        function onWindowResize(event) {
          renderer.setSize(window.innerWidth, window.innerHeight);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        }

        function r(a, b) {
          a.rotation.x = (b.yaw) * Math.PI / 180;
          a.rotation.y = (b.roll) * Math.PI / 180;
          a.rotation.z = (b.pitch) * Math.PI / 180;
        }

        function animate() {
          requestAnimationFrame(animate);
          render();
        }

        scope.$watch('assimpData', function (n) {
          var obj = scene.getObjectByName('model');
          if (obj != undefined) {
            r(obj, n);
          }

        });

        function render() {
          camera.position.x = 4;//0;
          camera.position.y = 4;//(Math.sin( t/1000) * 300 );
          camera.position.z = 4;//(Math.sin( t/1000) * 300 );
          camera.lookAt(scene.position);
          renderer.render(scene, camera);
        }
      }
    }
  }
  ]);
