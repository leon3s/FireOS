require('./removeItem.js');
// Rooms class for sockets.io //

function	Room(name, debug) {
//	Manage sockets with room
	this.sockets = [];
	this.name = name;
	this.debug = debug;

	if (this.debug)
		console.log("Room \"" + this.name + "\" has been created");
}

Room.prototype.sendData = function(e, data) {
//	send data to all user of the room, he can be alone //
	for (var x in this.sockets) {
		this.sockets[x].emit(e, data);
	}
}

Room.prototype.asSocket = function(socket) {
	for (var i in this.sockets) {
		if (this.sockets[i] == socket)
			return (true);
	}
	return (false);
}

Room.prototype.addSocket = function(socket) {
	this.sockets.push(socket);
	if (this.debug)
		console.log('socket added [' + this.sockets.length + ']');
};

Room.prototype.removeSocket = function(socket) {
	this.sockets = this.sockets.removeItem(socket);
	if (this.debug)
		console.log('socket deleted [' + this.sockets.length + ']');
}

Room.prototype.getName = function() {
	return (this.name);
}

Room.prototype.getSockets = function() {
	return (this.sockets);
}

function	Rooms(debug) {
//	Manage room with name
	this.rooms = [];
	this.debug = debug;
}

Rooms.prototype.addRoom = function(name) {
	var tmp = new Room(name, this.debug);
	this.rooms.push(tmp);
	return (tmp);
}

Rooms.prototype.deleteRoomByName = function(name) {
	for (var i in this.rooms) {
		if (this.rooms[i].getName() == name)
			this.deleteRoomByIndex(i);
	}
}

Rooms.prototype.getIndexByRoomName = function(name) {
	for (var i in this.rooms)
		if (this.rooms[i].getName() == name)
			return (i);
	return (-1);
}

Rooms.prototype.getRoomNameBySocket = function(socket) {
	for (var i in this.rooms) {
		if (this.rooms[i].asSocket(socket))
			return (this.rooms[i].name);
	}
	return (null);
}

Rooms.prototype.deleteRoomByIndex = function(i) {
	delete this.rooms[i];
	this.rooms = this.rooms.removeItem(this.rooms[i]);
}

Rooms.prototype.closeClient = function(socket) {
	if (this.debug) 
		console.log('deleting socket from rooms');
	for (var i in this.rooms) {
		this.rooms[i].removeSocket(socket);
	}
}

exports.Rooms = Rooms;
