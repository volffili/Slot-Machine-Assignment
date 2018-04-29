function Sprite(src){
	this.x_origin = 0.5;
	this.y_origin = 0.5;
	
	this.img = new Image();
	this.img.src = src;
	this.loaded = false;

	this.img.onload = function(){
		this.aspect_ratio = this.img.height/this.img.width;
		this.loaded = true;
	}
	this.img.onload = this.img.onload.bind(this);
}

Sprite.prototype.getImageWidth = function(){
	if (this.loaded){
		return this.img.width;
	}else{
		return 0;
	}
}

Sprite.prototype.getImageHeight = function(){
	if (this.loaded){
		return this.img.height;
	}else{
		return 0;
	}
}

Sprite.prototype.draw = function(ctx,x,y,x_scale,y_scale){

  if(!ctx || !this.loaded)
  	return;

  //default values
  x = x || 0;
  y = y || 0;
  x_scale = x_scale || 1;
  y_scale = y_scale || 1;

  var w = x_scale*this.img.width;
  var h = y_scale*this.img.height;
  
  ctx.drawImage(this.img,x-w*this.x_origin,y-h*this.x_origin,w,h);
}