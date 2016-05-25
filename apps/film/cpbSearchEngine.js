// Cpasbien search engine
// by leone
// v 1.0

var	request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var os = require('os');
var path = require('path');

var url = 'http://www.cpasbien.cm/';

function	getFilmInfo(filmList, url, x, callback) {
	//	get Description and torrent url from film
	request(url, function(err, response, body){
		if (!err && response.statusCode == 200) {
			var $ = cheerio.load(body);
			var link = $('#infosficher').find('a');
			var torrentLink = link[1].attribs.href;
			var descr = $('#textefiche p:nth-of-type(2)').text();
			filmList.torrentLink = torrentLink;
			filmList.descr = descr;
	//		console.log(filmList);
			callback(filmList, x);
		}
	});
}

function	searchTopFilm(url, callback) {
	//	get cpb top films
	var topFilms = [];
	request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var $ = cheerio.load(body);
			var filmList = $('#droite');
			var links = filmList.find('a');
			links.each(function(i, element){
				var film = {};
				var img = element.children[0].attribs.src;
				var url = element.attribs.href;
				var tmp = element.attribs.title;
				var buffer = new Buffer(tmp, 'utf8');
				var start = tmp.indexOf(' ') + 3;
				var end = tmp.length;
				var name = buffer.toString('utf8', start, end);
				film.url = url;
				film.img = img;
				film.name = name;
				topFilms.push(film);
				if (i == links.length - 1)
					callback(topFilms);
			});
		}
	});
}


function	searchFilm(filmName) {
	// 
}

function	getTopFilm(url, callback) {
	// list of top film
	var Films = [];
	searchTopFilm(url, function(data){
		for (var x = 0; x < data.length; x++) {
			getFilmInfo(data[x], data[x].url, x, function(film, x){
				Films.push(film);
				if (x == data.length - 1) {
					callback(Films);
				}
			});
		}
	});
}

/*
** data structure 
** data.name name of film
** data.descr description of film
** data.torrentLink
*/



// TODO write into cache fiche and diff the data for update //

getTopFilm(url, function(topFilms) {
	// cache topFilms from cpasbien.cm
	var data = JSON.stringify(topFilms);
	var fd = fs.openSync(path.join(__dirname, '../cache/cpbTop.data'), 'a+');
	fs.writeSync(fd, data);
	fs.closeSync(fd);
});
