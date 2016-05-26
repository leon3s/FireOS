function	appFilm(  ) {	
//	CLIENT SIDE APPS FILM 
	var nodes = $('.gallery-item');
	var itemsList = new list(nodes.length);
	this.init = 0;
	this.gallery = 0;
	this.galleryState = 0;
	this.index = 0;
	this.init = function() {
//		init apps
		$('#cursor-' + this.index).addClass('menu_selected');
	}
	this.cursor = function(value) {
//		Cursor moves
//		TODO scroll with items;
		var oldIndex;
		if (value) {
			oldIndex = itemsList.getIndex();
			this.index = itemsList.next();
			$("#cursor-" + oldIndex).removeClass('menu_selected');
			$("#cursor-" + this.index).addClass('menu_selected');
		} else {
			oldIndex = itemsList.getIndex();
			this.index = itemsList.prev();
			$("#cursor-" + oldIndex).removeClass('menu_selected');
			$("#cursor-" + this.index).addClass('menu_selected');
		}
		if (this.index % 4) {
			var page = $("#film-" + this.index);
			var speed = 300; // Durée de l'animation (en ms)
			$('html, body').animate( { scrollTop: $(page).offset().top - 50 }, speed ); // Go
		}
		return (this.index);
	}
	this.startGallery = function() {
//		Init blueImp gallery 
		var links = $("#gallery-films").find('a');
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
					if (this.gallery) {
						// move gallery nodes;
						this.gallery.next();
					} else {
						// mode items nodes;
						this.index = this.cursor(1);
					}
				} else if (data.value == -1) {
					if (this.gallery) {
						this.gallery.prev();
					} else {
						this.index = this.cursor(0);
					}
				}
			}
		} else {
			if (data.key == 'BUTTON_BOT') {
				if (data.value == 1) {
					this.startGallery();
				}
			}
			if (data.key == 'BUTTON_RIGHT') {
				if (data.value == 1) {
					this.gallery.close();
				}
			}
		}
	}
}


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
			};
			blueimp.Gallery(link, options);
		};
	}
});
