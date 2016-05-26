// PeerFlix torrent stream API
// v 1.0
// by leone

var parseTorrent = require('parse-torrent');
var async = require('async');
var fs = require('fs');
var os = require('os');
var ip = require('ip');
var path = require('path');

var done = 0; // url is alrealy send //

//var	torrentsDir = __dirname + '/../torrents/';

//var torrentPath = torrentsDir + 'deadpool-french-dvdrip-2016.torrent';

//var file = "/tmp/torrent-stream/7bf56352ef95d4dab3158ec97e692694e210c703/[ www.CpasBien.cm ] Deadpool.2016.FRENCH.BDRip.XViD.AC3-FUNKKY.avi";


var torrentFile = process.argv[2];
var dir = '/home/leone/boxDownload';

if (!torrentFile) {
	console.log("No arg");
	process.exit(1);
}


var spawn = require('child_process').spawn;

String.prototype.nthIndexOf = function(searchElement, n, fromElement) {
//	rechercher le n em mot clef
	n = n || 0;
	fromElement = fromElement || 0;
	while (n > 0) {
		fromElement = this.indexOf(searchElement, fromElement);
		if (fromElement < 0) {
			return -1;
		}
		--n;
		++fromElement;
	}
	return fromElement - 1;

};

function	torrentToMagnet(filePath) {
//	convert torrent to magnet link
	var torrent = parseTorrent(fs.readFileSync(filePath));
	var magnet = parseTorrent.toMagnetURI( { infoHash: torrent.infoHash } );
	return (magnet);
}


function	getFileSizeOnDisk(filePath) {
//	get file size on disk 
	var stat = fs.statSync(filePath);
	return (stat.blocks * 0.00048828125);
}

function	getFileSize(filePath) {
//	get full file size 
	var stat = fs.statSync(filePath);
	return (stat.size / 1000000.0);
}

function	getUrl(data) {
//	get Url started by peerflix
//	this will work if port len is always equal to 4
	var localIpAddr = ip.address();
	var format = "http://:0000";
	var output = data.toString('utf8');
	var urlIndex = output.indexOf('http');
	if (urlIndex != -1 && done == 0) {
		var start = urlIndex;
		var end = urlIndex + localIpAddr.length + format.length;
		var url = data.toString('utf8', urlIndex, end);
		done = 1;
		return (url);
	}
}

function	getSpeed(data) {
//	get torrent transfert Speed
	var start;
	var end;
	var speed;
	var output = data.toString('utf8');

	if (output.indexOf('vlc'))
		start = output.nthIndexOf('[1m', 2);
	else
		start = output.nthIndexOf('[1m', 4);
	var end = output.indexOf('from');
	if (start != -1 && end != -1) {
		end -= 5;
		start += 3;
		speed = data.toString('utf8', start, end);
		return (speed);
	}
}

function	getPourcentage(file) {
//	get % of current dowloading torrent
	var sizeOnDisk = getFileSizeOnDisk(file);
	var sizeTotal = getFileSize(file);
	var pourcentage = sizeOnDisk * 100 / sizeTotal;
	return (pourcentage);
}

// get torrent info

var magnet = torrentToMagnet(torrentFile);
var torrent = parseTorrent(fs.readFileSync(torrentFile));
console.log(torrent);

// execute peerflix command

var	peerflix = spawn('peerflix', [magnet, '-f', dir]);


peerflix.stdout.on('data', function(data) {
	var url;
	var speed;
	var pourcentage;
//	emplacement du fichier
	var file = path.join(dir, torrent.files[0].path);

	var output = data.toString('utf8');
	var obj = {};
	obj.url = getUrl(data);
	obj.speed = getSpeed(data);
	obj.pourcentage = getPourcentage(file);
	process.send(obj);
});

// TODO peerflix errors //
// TODO size of a dir //
// TODO find the film file //

peerflix.stderr.on('data', function(data){
	console.log(data);
});
