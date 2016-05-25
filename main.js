// TheBox server
// by leone
// v 1.0
var express = require('express')
var http = require('http');
var fs = require('fs');
var app = express();
var server = app.listen(1337);
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/client');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/client/ressources'));
process.setMaxListeners(0);

// film apps //

app.get('/', function(req, res, next){
	var tmp = fs.readFileSync(__dirname + '/apps/film/cache/cpbTop.data');
	var topCpbFilm = JSON.parse(tmp.toString());
	res.render('index', {topCpbFilm: topCpbFilm});
});

/*

   // main menu tester //

app.get('/', function(req, res, next) {
	res.render('index');
});

*/

require('./server/connect.js')(io);
console.log("TheBox server is running on port 1337");
