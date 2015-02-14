'use strict';

var app=angular.module('arduinode',['btford.socket-io','highcharts-ng']);

app.factory('mySocket', function (socketFactory) {
  var mySocket = socketFactory();
  mySocket.forward('error');
  return mySocket;
});

app.controller('ArduinodeCtrl',['$scope','mySocket',function($scope,mySocket){
  console.log(mySocket);
  mySocket.on('temp',function(d){
    console.log(d);
  });
}]);
