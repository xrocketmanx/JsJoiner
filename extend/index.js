Function.prototype.delay = function(ms) {
    var block = false;
    var func = this;
    return function() {
        if (block) return;
        block = true;
        func.apply(this, arguments);
        setTimeout(function() {
            block = false;
        }, ms);
    }
}

Array.prototype.remove = function(element) {
	var index = this.indexOf(element);
	if (index === -1) return false;
    for (var i = index; i < this.length - 1; i++) {
    	this[i] = this[i + 1];
    }
    this.length = this.length - 1;
    return true;
}