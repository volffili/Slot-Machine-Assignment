function TouchHandler(pressCallback,releaseCallback){
	this.handleStart = this.handleStart.bind(this);
	this.handleEnd = this.handleEnd.bind(this);
	this.handleCancel = this.handleCancel.bind(this);

	this.ongoingTouches = [];
    this.el = document.getElementById("mainCanvas");
	this.ctx = this.el.getContext("2d");

	this.pressCallback = pressCallback;
	this.releaseCallback = releaseCallback;
}

TouchHandler.prototype.copyTouch = function(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

TouchHandler.prototype.startup = function(){
    this.el.addEventListener("touchstart", this.handleStart, false);
    this.el.addEventListener("touchend", this.handleEnd, false);
    this.el.addEventListener("touchcancel", this.handleCancel, false);
    console.log("Touch initialized.");
}

TouchHandler.prototype.ongoingTouchIndexById = function(idToFind) {
  
  for (var i = 0; i < this.ongoingTouches.length; ++i) {
    if (this.ongoingTouches[i].identifier == idToFind) {
      return i;
    }
  }

  return -1;    // not found
}

TouchHandler.prototype.removeTouchFromArray = function (touches){
	var removed = [];

	for (var i = 0; i < touches.length; ++i) {
		//could be more efficient i guess
		var idx = this.ongoingTouchIndexById(touches[i].identifier);
		this.ongoingTouches.splice(idx, 1);  // remove it; we're done
		removed.push(idx);
	}

	return removed;
}

TouchHandler.prototype.handleStart = function(evt){
	evt.preventDefault();
	console.log("touchstart");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; ++i) {
		this.ongoingTouches.push(this.copyTouch(touches[i]));
		this.pressCallback(touches[i].pageX,touches[i].pageY);
	}
}

TouchHandler.prototype.handleEnd = function(evt){
	evt.preventDefault();
	console.log("touchend");
	var removed = this.removeTouchFromArray(evt.changedTouches);
	for(var i = 0; i < removed.length; ++i){
		this.releaseCallback(removed[i].pageX,removed[i].pageY);
	}
}

TouchHandler.prototype.handleCancel = function(evt){
	evt.preventDefault();
	console.log("touchcancel");
	this.removeTouchFromArray(evt.changedTouches);
}
