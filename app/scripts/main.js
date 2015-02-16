'use strict';

var app=angular.module('arduinode',['btford.socket-io','highcharts-ng']);

app.factory('mySocket', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('error');
  return mySocket;
});

app.controller('ArduinodeCtrl',['$scope','mySocket',function($scope,mySocket){
  console.log(mySocket);
  mySocket.on('temperature',function(d){
    $scope.temperature=d;
    //console.log(d);

    $scope.chartConfig = {

      //This is not a highcharts object. It just looks a little like one!
      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be ovverriden by values specified below.
        chart: {
          type: 'solidgauge'
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          }
        },
        pane: {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },
        yAxis: {
          stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
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
        data: [d]
      }],
      //Title configuration (optional)
      title: {
        text: 'Temperature'
      },
      //Boolean to control showng loading status on chart (optional)
      //Could be a string if you want to show specific loading text.
      loading: false,
      //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
      //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
      //  xAxis: {
      //  currentMin: 0,
      //    currentMax: 20,
      //    title: {text: 'values'}
      //},
      yAxis: {
        min: 0,
        max: 40,
        title: {
          text: ''
        }
      },
      //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
      useHighStocks: false,
      //size (optional) if left out the chart will default to size of the div or something sensible.
      size: {
        width: 400,
        height: 300
      },
      //function (optional)
      func: function (chart) {
        //setup some logic for the chart
      }
    };
  });

  mySocket.on('current',function(d){
    if(d){
      console.log(d);
      $scope.current=d;

    }
  });


  $scope.chartConfig = {

    //This is not a highcharts object. It just looks a little like one!
    options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be ovverriden by values specified below.
      chart: {
        type: 'solidgauge'
      },
      tooltip: {
        style: {
          padding: 10,
          fontWeight: 'bold'
        }
      },
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      yAxis: {
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
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
    data: [$scope.temperature]
  }],
    //Title configuration (optional)
    title: {
    text: 'Temperature'
  },
  //Boolean to control showng loading status on chart (optional)
  //Could be a string if you want to show specific loading text.
  loading: false,
    //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
    //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
  //  xAxis: {
  //  currentMin: 0,
  //    currentMax: 20,
  //    title: {text: 'values'}
  //},
    yAxis: {
      min: 0,
      max: 40,
      title: {
        text: ''
      }
    },
  //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
  useHighStocks: false,
    //size (optional) if left out the chart will default to size of the div or something sensible.
    size: {
    width: 400,
      height: 300
  },
  //function (optional)
  func: function (chart) {
    //setup some logic for the chart
  }
};

  mySocket.on('a',function(data){
    console.log(data);
  })
}]);
