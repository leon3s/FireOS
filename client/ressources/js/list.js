function	list(itemLength) {
	this.size = itemLength;
	this.index = 0;
	this.getIndex = function() {
		return (this.index);
	};
	this.newSize = function(size) {
		this.size = size;
	}
	this.next = function() {
		if (this.index == this.size) {
			this.index = 0;
			return (this.index);
		}
		this.index += 1;
		return (this.index);
	};
	this.prev = function() {
		if (!this.index) {
			this.index = this.size;
			return (this.index);
		}
		this.index -= 1;
		return (this.index);
	};
}
