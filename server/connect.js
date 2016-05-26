var RoomsClass = require('../api/rooms.js');
var fork = require('child_process').fork;
var path = require('path');
var serviceDir = path.join(__dirname, '../services/');
var torrentDir = path.join(__dirname, '../torrents/');
console.log('exe path: ' + serviceDir);
// Manage Threads //

function	Thread(name, path, args, type, debug) {
	this.name = name;
	this.path = path;
	this.type = type;
	this.process = fork(path, args);
	this.debug = debug;
	this.state = 1;
	if (this.debug)
		console.log('starting process : ' + this.name);
}

Thread.prototype.listenMessage = function(callback) {
	this.process.on('message', function(data) {
		callback(data);
	});
}

function	Threads(debug) {
	this.debug = debug;
	this.threads = [];
}

Threads.prototype.run = function(name, path, args, type) {
	var thread = new Thread(name, path, args, type, this.debug);
	this.threads.push(thread);
	if (this.debug)
		console.log('thread added in list');
	return (thread);
}

Threads.prototype.getThreadByName = function(name) {
	for (var i in this.threads) {
		if (this.threads[i].name == name)
			return (this.threads[i]);
	}
	return (0);
}

// TODO CREATE THREAD CLASS //
// TODO IMPLEMENT LOCALCLIENT CLASS TO ROOMS//
// START SERVICES FOR CLIENTS
// START APPS FOR CLIENT //

// gamepad.on('move') axis keys 
// 6 -> KEY left and right
// 7 -> KEY top and bot
// 3 -> L2
// 4 -> R2
// 0 -> stick[L] left right
// 1 -> stick[L] top bot
// 5 -> stick[R] top bot
// 2 -> stick[3] left right
// 8 -> touche pad 
// gamepad.on('down | up ') value keys
// 1 -> X

var http = require('http');
var fs = require('fs');


function	GamepadService(threads, room) {
	this.room = room;
	this.e = "nothing";
	this.thread = threads.getThreadByName('gamepad-service');
	if (!this.thread)
		this.thread = threads.run('gamepad-service', path.join(serviceDir, '/gamepad/gamepad.js'), {}, 1);
	this.run = function(on) {
		self = this;
		this.thread.listenMessage(function(data) {
			if (self.room) {
				self.room.sendData(self.e, data); // send input From gamepads //
			}
		});
	}
	this.updateRoom = function(room) {
		this.room = room;
	}
	this.updateE = function(e) {
		this.e = e;
	}
}

var download = function(url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function(response) {
		response.pipe(file);
		console.log('downloading file : ' + dest);
		file.on('finish', function() {
			file.close(cb(null, dest));  // close() is async, call cb after close completes.
		}).on('error', function(e){
			cb(e);
		});
	});
}

function	torrentStreaming(threads, room, torrent) {
	var torrentName = torrent.split('/')[4];
	var torrentPath = path.join(__dirname, '../torrents/' + torrentName);
	console.log('torrent name : ' + torrentName);
	console.log('torrent path : ' + torrentPath)
	if (!fs.existsSync(torrentPath)) {
		download(torrent, torrentPath, function(err, dest) {
			if (err) {
				console.log('error while downloading .torrent..');
				// emit erro to clients //
			} else {
				var args = [dest];
				var thread = threads.run('peerflix-' + torrentName, path.join(__dirname, '../services/peer/torrent.js'), args, 0);
				var self = room;
				thread.listenMessage(function(data){
					if (data.url) {
						console.log('sendingDataUrl');
						self.sendData('url', {url:data.url, title:torrentName.split('.torrent')[0]});
					}
					if (data.speed) {
						self.sendData('speed', {speed:data.speed.split('KB\/s')[0]});
					}
				});
			}
		});
	} else {
		//resume download there 
	}
}


module.exports = function(io) {
//	core input service
	var rooms = new RoomsClass.Rooms(1); // room for clients //
	var threads = new Threads(1); // Threads List for apps //
	var gamepadRoom = rooms.addRoom('gamepad');
	var gamepadService = new GamepadService(threads, gamepadRoom);
	gamepadService.run();
//
	io.on('connection', function(socket) {
		socket.on('service-gamepad', function(i) {
//			User request gamePad event //
			gamepadRoom.addSocket(socket);
			gamepadService.updateRoom(gamepadRoom);
			gamepadService.updateE('navFilmInput');
			console.log('room updated');
			console.log(rooms);
		});
		socket.on('swap-gamepad-event', function(data){
			gamepadService.updateE(data.e);
		});
		socket.on('start-torrent-streaming', function(torrentUrl) {
			var torrentRoom = rooms.addRoom('torrent-streaming');
			torrentRoom.addSocket(socket);
			console.log('stream torrent requested for');
			console.log(torrentUrl);
			gamepadService.updateE('gamepad-vlc');
			torrentStreaming(threads, torrentRoom, torrentUrl);
		});
		socket.on('disconnect', function() {
			rooms.closeClient(this);
			console.log('client disconnected || rooms updated ');
			console.log(rooms);
		});
	});
}
