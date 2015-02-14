var express=require('express');
var app=express();
var io=require('socket.io')(app.listen(3000));
var five=require('johnny-five');


app.use(express.static(__dirname + '/app'));

app.get("/", function(req, res) {
  res.sendfile("/index.html");
});

io.on('connection',function(socket){

});
