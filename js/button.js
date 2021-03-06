function Button(spr_src_press,spr_src_rel,spr_src_fail,release_callback,press_callback,x,y){
	this.spritePressed = new Sprite(spr_src_press);
	this.spriteReleased = new Sprite(spr_src_rel);
	this.spriteFail = new Sprite(spr_src_fail);
	this.currentSprite = this.spriteReleased;
	this.updatePositionAndScale();

	this.pressed = false;

	this.release_callback = release_callback || function(){}
	this.press_callback = press_callback || function(){}

	this.x = x || 0;
	this.y = y || 0;

	this.fail = false;
	this.reverseFail = this.reverseFail.bind(this);
	this.sn_buzz = new Audio("./assets/wrong.wav");
	this.sn_press = new Audio("./assets/but_press.wav");
	this.sn_release = new Audio("./assets/but_rel.wav");
}

Button.prototype.reverseFail = function(){
	this.pressed = false;
	this.fail = false; 
	this.sn_release.play();
	this.currentSprite = this.spriteReleased;
}

Button.prototype.failPress = function(){
	this.sn_buzz.play();
	this.pressed = false;
	this.fail = true;
	this.currentSprite = this.spriteFail;
	setTimeout(this.reverseFail,250);
}

Button.prototype.updatePositionAndScale = function(x,y,x_scale,y_scale){
	this.x = x || 0;
	this.y = y || 0;
	this.x_scale = x_scale || 1;
	this.y_scale = y_scale || 1;	
}

Button.prototype.draw = function(ctx){
	this.currentSprite.draw(ctx,this.x,this.y,this.x_scale,this.y_scale)
}

Button.prototype.release = function(){
	if (this.fail)
		return;

	this.sn_release.play();

	this.pressed = false;
	this.currentSprite = this.spriteReleased;

	this.release_callback();
}


Button.prototype.press = function(){
	if (this.fail)
		return;
	
	this.sn_press.play();

	this.pressed = true;
	this.currentSprite = this.spritePressed;
	
	this.press_callback();
}

Button.prototype.isPointInside = function(x,y){
	var w = this.currentSprite.getImageWidth()*this.x_scale;
	var h = this.currentSprite.getImageHeight()*this.y_scale;
	if( x >= this.x-w/2 && x <= this.x+w/2){
		if(y >= this.y-h/2 && y <= this.y+h/2){
			return true;
		}
	}
	return false;
}