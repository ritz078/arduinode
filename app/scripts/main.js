'use strict';

var app = angular.module('arduinode', ['btford.socket-io', 'highcharts-ng']);

app.factory('mySocket', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('error');
  return mySocket;
});

app.controller('ArduinodeCtrl', ['$scope', 'mySocket', function ($scope, mySocket) {

  var raData=[];
  while

  mySocket.on('temp', function (d) {
    console.log(d);
    $scope.imu = d;



    $scope.tempChartConfig = {

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
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'rgba(255,255,255,0.1)',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },
        title:null,
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
            y: -70
          },
          labels: {
            y: 16
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
        'name':'Temperature',
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
          text: 'Celsius'
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
          enabled: false
        },
        "plotOptions": {
          "series": {
            "stacking": ""
          }
        }
      },

      "series": [
        {
          "name": "Some data",
          "data": [
            1,
            2,
            4,
            7,
            3
          ],
          "id": "series-0"
        }]
    }
  });


  mySocket.on('prox', function (d) {

    console.log(d);


  })
}]);
