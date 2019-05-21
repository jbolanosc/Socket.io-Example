var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data = require('./data');
 

// Global variable to store the latest NHL results
var latestData;

data.getData().then((result) => { 
    latestData = result;
});




app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
 
http.listen(3000, function(){
    console.log('HTTP server started on port 3000');
});

io.on('connection', function(socket){
    console.log('Client connection received');

    socket.emit('sendToClient', { latestData });
     
    socket.on('receivedFromClient', function (data) {
        console.log(data);
    });
});

setInterval(function (){
    data.getData().then( (result) => {
        latestData = result;

         // send it to all connected clients
         io.emit('data', result);
         
         console.log('Last updated: ' + new Date());
    });

}, 300000);

