function InputListener(pressCallback,releaseCallback){
	this.handleStart = this.handleStart.bind(this);
	this.handleEnd = this.handleEnd.bind(this);
	this.handleCancel = this.handleCancel.bind(this);
	this.handleMouseDown = this.handleMouseDown.bind(this);
	this.handleMouseUp = this.handleMouseUp.bind(this);

	this.ongoingTouches = [];
    this.el = document.getElementById("mainCanvas");
	this.ctx = this.el.getContext("2d");

	this.pressCallback = pressCallback;
	this.releaseCallback = releaseCallback;
}

InputListener.prototype.copyTouch = function(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

InputListener.prototype.startup = function(){
	//for touch screen devices
    this.el.addEventListener("touchstart", this.handleStart, false);
    this.el.addEventListener("touchend", this.handleEnd, false);
    this.el.addEventListener("touchcancel", this.handleCancel, false);

    //for devices with mouse
    this.el.addEventListener("mousedown", this.handleMouseDown, false);
    this.el.addEventListener("mouseup", this.handleMouseUp, false);

    console.log("Touch initialized.");
}

InputListener.prototype.ongoingTouchIndexById = function(idToFind) {
  
  for (var i = 0; i < this.ongoingTouches.length; ++i) {
    if (this.ongoingTouches[i].identifier == idToFind) {
      return i;
    }
  }

  return -1;    // not found
}

InputListener.prototype.removeTouchFromArray = function (touches){
	var removed = [];

	for (var i = 0; i < touches.length; ++i) {
		//could be more efficient i guess
		var idx = this.ongoingTouchIndexById(touches[i].identifier);
		this.ongoingTouches.splice(idx, 1);  // remove it; we're done
		removed.push(idx);
	}

	return removed;
}

InputListener.prototype.handleStart = function(evt){
	evt.preventDefault();
	console.log("touchstart");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; ++i) {
		this.ongoingTouches.push(this.copyTouch(touches[i]));
		this.pressCallback(touches[i].pageX,touches[i].pageY);
	}
}

InputListener.prototype.handleEnd = function(evt){
	evt.preventDefault();
	console.log("touchend");
	var removed = this.removeTouchFromArray(evt.changedTouches);
	for(var i = 0; i < removed.length; ++i){
		this.releaseCallback(removed[i].pageX,removed[i].pageY);
	}
}

InputListener.prototype.handleMouseDown = function(evt){
	evt.preventDefault();
	console.log("mousedown");
	this.pressCallback(evt.pageX,evt.pageY);
}

InputListener.prototype.handleMouseUp = function(evt){
	evt.preventDefault();
	console.log("mouseup");
	this.releaseCallback(evt.pageX,evt.pageY);
}

InputListener.prototype.handleCancel = function(evt){
	evt.preventDefault();
	console.log("touchcancel");
	this.removeTouchFromArray(evt.changedTouches);
}
