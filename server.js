var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/public', express.static(__dirname + '/public'));

// routing
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// start the server
server.listen(5000, () => {
    console.log('Starting server on port 5000');
});

// add the websocket handler
var players = {};
io.on('connection', socket => {
    socket.on('new player', () => {
        players[socket.id] = {
            x: 300,
            y: 300,
        };
    });
    socket.on('movement', (data) => {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });
    socket.on('disconnect', () => {
        delete players[socket.id];
    });
});

setInterval(() => {
    io.sockets.emit('state', players);
}, 1000 / 60);