var gamepad = require('../api/gamepad.js');


// gamepad button //
// -- move --
// [6][1] fleche de droite ->
// [6][-1] fleche de gauche <-

Object.defineProperty(Array.prototype, "removeItem", {
    enumerable: false,
    value: function (itemToRemove) {
        var filteredArray = this.filter(function(item){
            return item !== itemToRemove;
        });
        return filteredArray;
    }
});

function	Room(name, type) {
	this.sockets = [];
	this.name = name;
	this.type = type;
	this.sendData = function(e, data) {
		for (var x in this.sockets) {
			this.sockets[x].emit(e, data);
		}
	}
	console.log("Room \"" + this.name + "\" has been created");
}
  
Room.prototype.addSocket = function(socket) {
	this.sockets.push(socket)
	console.log('socket added [' + this.sockets.length + ']');
};

Room.prototype.removeSocket = function(socket) {
	this.sockets = this.sockets.removeItem(socket);
	console.log('socket deleted [' + this.sockets.length + ']');
}

Room.prototype.getName = function() {
	return (this.name);
}

Room.prototype.getSockets = function() {
	return (this.sockets);
}
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


// I should create a thread for that, and kill it if user is disconnected
// that should prevent multiple call of gamepadEnvent.

Room.prototype.gamepad = function() {
	 self = this;
	 var gamepadAPI = new gamepad();
	 var keys = gamepadAPI.getKeys();
	 
	 self.sendData("gamepadEvent-KEYSMAP", {keys:keys});
	 gamepadAPI.Input(function(type, key, value) {
		self.sendData("gamepadEvent", {type:type, key:key, value:value});
	 });
}

function	freeClient(rooms, socket) {
	console.log('deleting socket from rooms');
	for (var i in rooms) {
		rooms[i].removeSocket(socket);
		if (!rooms[i].getSockets().length) {
			console.log('room empty deleting room : ' + rooms[i].getName());
			if (rooms[i].getName() == 'gamepad') {
				// free ? gamepad.shutdown()
			}
			delete rooms[i];
			rooms = rooms.removeItem(rooms[i]);
		}
	}
	return (rooms);
}

module.exports = function(io) {
	var	rooms = [];
	io.on('connection', function(socket) {
	// everytime a user is connected this function is call //
	// first we detect what controller he want use //
		console.log('a user connected');
		socket.on('service', function(i) {
			if (i == 1) {
				var tmp = new Room('gamepad', 1);
				tmp.addSocket(socket);
				tmp.gamepad();
				console.log("gamepad actived");
				rooms.push(tmp);
			}
		});
		socket.on('disconnect', function() {
			rooms = freeClient(rooms, this);
			console.log("Room activated :");
			console.log(rooms);
		});
	});
}
