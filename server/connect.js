var RoomsClass = require('../api/rooms.js');
var fork = require('child_process').fork;
var path = require('path');
var serviceDir = path.join(__dirname, '../services/');
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
		console.log(data);
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

function	GamepadService(threads, room) {
	this.room = room
	this.thread = threads.getThreadByName('gamepad-service');
	if (!this.thread)
		this.thread = threads.run('gamepad-service', path.join(serviceDir, '/gamepad/gamepad.js'), {}, 1);
	this.run = function(on) {
		self = this;
		this.thread.listenMessage(function(data) {
			if (self.room) {
				self.room.sendData('gamepadInput', data); // send input From gamepads //
			}
		});
	}
	this.updateRoom = function(room) {
		this.room = room;
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
			console.log('room updated');
			console.log(rooms);
		});
		socket.on('disconnect', function() {
			rooms.closeClient(this);
			console.log('client disconnected || rooms updated ');
			console.log(rooms);
		});
	});
}
