function	appFilm(  ) {	
//	CLIENT SIDE APPS FILM 
	var nodes = $('.gallery-item');
	var itemsList = new list(nodes.length);
	this.init = 0;
	this.gallery;
	this.galleryState = 0;
	this.index = 1;
	this.init = function() {
//		init apps
		this.initGallery();
		$('#filmId-1').addClass('menu_selected');
	}
	this.cursor = function(value) {
//		Cursor moves
//		TODO scroll with items;
		var oldIndex;
		var newIndex;
		if (value) {
			oldIndex = itemsList.getIndex();
			newIndex = itemsList.next();
			$("#filmId-" + c).removeClass('menu_selected');
			$("#filmId-" + this.index).addClass('menu_selected');
		} else {
			oldIndex = itemsList.getIndex();
			newIndex = itemsList.prev();
			$("#filmId-" + c).removeClass('menu_selected');
			$("#filmId-" + this.index).addClass('menu_selected');
		}
		return (newIndex);
	}
	this.initGallery = function() {
//		Init blueImp gallery 
		var links = $("#gallery-film").find('a');
		options = {
			onslide: function (index, slide) {
				self = this;
				var initializeAdditional = function (index, data, klass, self) {
					var text = self.list[index].getAttribute(data),
					node = self.container.find(klass);
					node.empty();
					if (text) {
						node[0].appendChild(document.createTextNode(text));
					}
					initializeAdditional(index, 'data-description', '.description', self);
					//	initializeAdditional(index, 'data-example', '.example', self);
				}
			}
		}
		this.gallery = blueimp.Gallery(links, options);
	}
	this.main = function(data) {
//		app Main
//		data are gamepads inputs
		if (data.type == 0) {
			if (data.key == 'KEY_AXIS_X') {
				if (data.value == 1) {
					if (this.galleryState) {
						// move gallery nodes;
					} else {
						// mode items nodes;
						this.index = this.cursor(1);
					}
				} else if (data.value == -1) {
					if (this.galleryState) {
						
					} else {
						this.index = this.cursor(0);
					}
				}
			}
		}
	}
}

/*

$(document).ready(function(){
	if ($("#app-film").length) {
		$("#gallery-films").onclick = function (event) {
			var ret;
			event = event || window.event;
			var target = event.target || event.srcElement,
			link = target.src ? target.parentNode : target,
			options = {
				index: link, event: event,
				onslide: function (index, slide) {
					self = this;
					var initializeAdditional = function (index, data, klass, self) {
						var text = self.list[index].getAttribute(data),
						node = self.container.find(klass);
						node.empty();
						if (text) {
							node[0].appendChild(document.createTextNode(text));
						}
					};
					initializeAdditional(index, 'data-description', '.description', self);
					//	initializeAdditional(index, 'data-example', '.example', self);
				}
			},
			links = this.getElementsByTagName('a');
			ret = blueimp.Gallery(links, options);
			console.log(ret);
			return (ret);
		};
	}
});
*/
