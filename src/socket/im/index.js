var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
server.listen(3001);

//接上面的代码
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var connectionList = {};
io.sockets.on('connection', function (socket) {
    //客户端连接时，保存socketId和用户名
    var socketId = socket.id;
    connectionList[socketId] = {
        socket: socket
    };
    //用户进入聊天室事件，向其他在线用户广播其用户名
    socket.on('join', function (data) {
        socket.broadcast.emit('broadcast_join', data);
        connectionList[socketId].username = data.username;
    });
    //用户离开聊天室事件，向其他在线用户广播其离开
    socket.on('disconnect', function () {
        if (connectionList[socketId].username) {
            socket.broadcast.emit('broadcast_quit', {
                username: connectionList[socketId].username
            });
        }
        delete connectionList[socketId];
    });
    //用户发言事件，向其他在线用户广播其发言内容
    socket.on('say', function (data) {
        console.log(data)
        socket.broadcast.emit('broadcast_say', {//发送给所有socket链接
            username: connectionList[socketId].username,
            text: data.text
        });
        socket.emit('broadcast_say', {//发送给当前socket链接
            username: connectionList[socketId].username,
            text: data.text
        });
    });
})