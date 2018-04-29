function Slot(){
	this.icon = [new Sprite('./assets/banana.png'),new Sprite('./assets/cherry.png'),new Sprite('./assets/lemon.png'),new Sprite('./assets/melon.png')];
	this.position = Math.floor(Math.random()*this.icon.length);
	
	this.speed = 0;
	this.initial_speed = 0;
	this.end_time = 0;
	this.time_elapsed = 0;
	this.state = 'still';
}

Slot.prototype.roll = function(initial_speed,end_time){
	this.state = 'rolling';	
	this.initial_speed = initial_speed;
	this.speed = initial_speed;
	this.end_time = end_time;
	this.time_elapsed = 0;
}

Slot.prototype.update = function(dt){
	switch(this.state){
		
		case 'still':
			
		break;
		
		case 'rolling':
			this.time_elapsed += dt;	
			var time_left = this.end_time - this.time_elapsed;		
	
			//slow down at the end
			if(time_left < 1.5 && time_left > 0.5){
				this.speed = this.initial_speed*(time_left-0.5);
			}

			if(time_left <= 0.5){
				//align the icon in the slot machine
				this.speed = 0;
				this.initial_speed = 0;
				this.position = (Math.ceil(this.position)-this.position)*0.5+this.position

				//correction so the icon is perfectly aligned				
				if(time_left <= 0){
					console.log(this.time_elapsed);
					this.state = 'still';

					this.position = Math.ceil(this.position);
					this.time_elapsed = 0;
					this.end_time = this.time_elapsed;
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
	this.icon[Math.floor(this.position)].draw(ctx,x,y,x_scale,y_scale);
}