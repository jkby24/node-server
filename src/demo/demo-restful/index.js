var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.post('/addUser',urlencodedParser, function (req, res) {
	console.log(req);
	var user = {
		  "name" : req.body.name,
		  "password" : req.body.password,
		  "profession" : req.body.profession
	   }
	
   // 读取已存在的数据
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
	   console.log( data );
	   var newId = data[data.length-1]['id']+1;
	   user['id'] = newId;
       data.push(user);
       console.log( data );
       res.end( JSON.stringify(data));
   });
});
app.get('/user/:id', function (req, res) {
   // 首先我们读取已存在的用户
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
	   var user;
	   for(var i=0;i<data.length;i++){
		   if(data[i].id == req.params.id){
			  user = data[i];
			  break;
		   }
	   }
      
       console.log( user );
       res.end( JSON.stringify(user));
   });
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})