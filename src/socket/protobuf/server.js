var ProtoBuf = require("protobufjs");

// 同步创建proto，异步用ProtoBuf.load("./proto/a.proto",function(err,root){...})
var root = ProtoBuf.loadSync("./src/socket/protobuf/proto/a.proto");

// 获得一个包类型
var textMessage = root.lookupType("ceshipackage.textMessage");


var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
server.listen(3001);

//接上面的代码
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var resPayload = {
    people: {
        age: 65,
        name: 'ttt'
    }
};

// 检测是否符合类型
var errMsg = textMessage.verify(resPayload);
if (errMsg) throw Error(errMsg);

// 生成一条message
var message = textMessage.create(resPayload); // or use .fromObject if conversion is necessary

// 将message转成buffer,node下转成Buffer,browser下转成Uint8Array
var respBuffer = textMessage.encode(message).finish();

var connectionList = {};
io.sockets.on('connection', function (socket) {
    var data = {
        t:'2323'
    }
    socket.on('message', function (buffer) {
        console.log(buffer);
        var message = textMessage.decode(buffer);
        console.log(message);
        socket.emit('resmsg', respBuffer);
    });
    
})