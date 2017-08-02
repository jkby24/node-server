var ProtoBuf = require("protobufjs");

// 同步创建proto，异步用ProtoBuf.load("./proto/a.proto",function(err,root){...})
var root = ProtoBuf.loadSync("./src/socket/protobuf/proto/a.proto");
// 获得一个包类型
var textMessage = root.lookupType("ceshipackage.textMessage");

// 定义一个符合包类型的变量
var payload = {
    people: {
        age: 13,
        name: 'aaab'
    }
};

// 检测是否符合类型
var errMsg = textMessage.verify(payload);
if (errMsg) throw Error(errMsg);

// 生成一条message
var message = textMessage.create(payload); // or use .fromObject if conversion is necessary

// 将message转成buffer,node下转成Buffer,browser下转成Uint8Array
var buffer = textMessage.encode(message).finish();



var io = require('socket.io-client');
var socket = io.connect('http://localhost:3001');
socket.emit('message', buffer);
socket.on('resmsg', function (resp) {
        console.log(resp);
        var message = textMessage.decode(resp);
        console.log(message);
    });