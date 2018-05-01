function Slot(){

	//the slot is 2.14 x height of the icon
	this.slotToIconHeightRatio = 2.14;

	//Each icon has to be the same height!
	this.icon = [new Sprite('./assets/banana.png'),new Sprite('./assets/cherry.png'),new Sprite('./assets/melon.png')];
	this.position = Math.floor(Math.random()*this.icon.length);

	this.speed = 0;
	this.initial_speed = 0;
	this.end_time = 0;
	this.time_elapsed = 0;
	this.state = 'still';
	this.generateTreshold();

	this.finishedRollCallback = function(){};
}

Slot.prototype.roll = function(initial_speed,end_time,finishedRollCallback){
	this.state = 'rolling';	
	this.initial_speed = initial_speed;
	this.speed = initial_speed;
	this.end_time = end_time;
	this.time_elapsed = 0;
	this.finishedRollCallback = finishedRollCallback;
}

Slot.prototype.generateTreshold = function(){
	this.stopTreshold = Math.random()/2+0.75;
}

Slot.prototype.update = function(dt){
	switch(this.state){
		
		case 'still':
			this.generateTreshold();
		break;
		
		case 'rolling':
			this.time_elapsed += dt;	
			var time_left = this.end_time - this.time_elapsed;		
	
			//slow down at the end
			if(time_left < 2.5 && time_left > 1){
				this.speed = this.initial_speed*(time_left-this.stopTreshold)/this.end_time;
			}

			if(time_left <= 1){
				//align the icon in the slot machine
				this.speed = 0;
				this.initial_speed = 0;
				this.position = (Math.round(this.position)-this.position)*dt*7.5+this.position

				//correction so the icon is perfectly aligned				
				if(time_left <= 0){
					console.log(this.time_elapsed);
					this.state = 'still';

					this.position = Math.round(this.position)%this.icon.length;
					this.time_elapsed = 0;
					this.end_time = this.time_elapsed;

					this.finishedRollCallback();
				}
			}else{
				this.position += this.speed*dt;
			}	
		break;
	}

	if (this.position >= this.icon.length){
		this.position = this.position % this.icon.length;
	}
}

Slot.prototype.draw = function(ctx,x,y,x_scale,y_scale){

	//Each icon has to be the same height!
	var h = this.icon[0].getImageHeight();
	var w = this.icon[0].getImageWidth();
	//var shift = Math.floor(this.icon.length/2)*h*y_scale*1.5;

	var dec_part = this.position % 1;
	var gap = h*y_scale*this.slotToIconHeightRatio/3*2;

	var shift_y1 = dec_part*y_scale*h*this.slotToIconHeightRatio/3*2;

	//this.icon[Math.floor(this.position)].draw(ctx,x,y,x_scale,y_scale);
	for(var i = -3; i <= 3; ++i ){
		var arbitrary = 10;
		var tr_i = (i+arbitrary+Math.floor(this.position))%this.icon.length;
		this.icon[tr_i].draw(ctx,x,y-shift_y1+gap*i,x_scale,y_scale,0,0,1,1);
	}

	//this.icon[im1_pos].draw(ctx,x,y,x_scale,sh1,0,sy1,x_scale,sh1);
	//this.icon[im2_pos].draw(ctx,0,sy2,w,sh2,x,y+gap,x_scale*w,sh2);
}