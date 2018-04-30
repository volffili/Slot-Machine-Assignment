function SlotMachine(initial_credit,x,y){
	this.spriteSlotMachine = new Sprite('./assets/slot_machine.png');

	this.spinCallback = function(){
		if(this.bet_size <= this.credit){
			this.credit -= this.bet_size;
			console.log("spin");
			this.roll();	
		}
	};
	
	this.decreaseBetCallback = function(){
		if(this.bet_size > this.bet_size_changer){
			this.bet_size -= this.bet_size_changer;
			console.log("decrease_bet by "+this.bet_size_changer);
		}
	};
	
	this.increaseBetCallback = function(){
		if(this.bet_size < this.bet_size_changer*10){
			this.bet_size += this.bet_size_changer;
			console.log("increase_bet by "+this.bet_size_changer);
		}
	};

	this.spinCallback = this.spinCallback.bind(this);
	this.decreaseBetCallback = this.decreaseBetCallback.bind(this);
	this.increaseBetCallback = this.increaseBetCallback.bind(this);
	this.finishedRoll = this.finishedRoll.bind(this);

	this.buttons = [
		new Button('./assets/spin_button_pressed.png','./assets/spin_button_released.png',this.spinCallback),
		new Button('./assets/decrease_bet_button_pressed.png','./assets/decrease_bet_button_released.png',this.decreaseBetCallback),
		new Button('./assets/increase_bet_button_pressed.png','./assets/increase_bet_button_released.png',this.increaseBetCallback)
	];
	
	this.slots = [new Slot(),new Slot(),new Slot()];

	if(initial_credit){
		this.credit = initial_credit;
	}else{
		this.credit = 100;
	}

	this.display_credit = this.credit;
	this.bet_size_changer = Math.floor(this.credit/100);
	this.bet_size = this.bet_size_changer*4;

	this.checkTouchPressed = this.checkTouchPressed.bind(this);
	this.checkTouchReleased = this.checkTouchReleased.bind(this);

	this.x = x || 0;
	this.y = y || 0;

	this.finishedRolls = 0;
	this.win_multiplier = 16;
}

SlotMachine.prototype.checkTouchPressed = function(x,y){
	for(var i = 0; i < this.buttons.length; ++i){
    	if(this.buttons[i].isPointInside(x,y)){
    		//console.log("pressed "+i );
    		this.buttons[i].press();
    	}
	}
}

SlotMachine.prototype.checkTouchReleased = function(x,y){
	for(var i = 0; i < this.buttons.length; ++i){
		//console.log("released "+i );
		if(this.buttons[i].pressed)
			this.buttons[i].release();    	
	}
}

SlotMachine.prototype.getScale = function(canvas_width,canvas_height){
    var scale = canvas_width/this.spriteSlotMachine.getImageWidth()*0.5;
    var tmp_y_scale = canvas_height/this.spriteSlotMachine.getImageHeight()*0.5;

    //Shrink the image the way, so it always fits the screen
    if(scale > tmp_y_scale){
        scale = tmp_y_scale;
    }

    return scale;
}

SlotMachine.prototype.updatePosition = function(x,y,canvas_width,canvas_height){

	var scale = this.getScale(canvas_width,canvas_height);
    var w = scale*this.spriteSlotMachine.getImageWidth();
    var h = scale*this.spriteSlotMachine.getImageHeight();

	this.x = x;
	this.y = y;

	//update the positions of buttons
	var gap_divisor = 3.42;
	for (var i = 0; i < this.buttons.length; ++i ){
		this.buttons[i].updatePositionAndScale(x-w*(i-(this.buttons.length-1)/2)/gap_divisor,y+h*0.75,scale,scale);
	}

}

SlotMachine.prototype.draw = function(canvas,ctx){
	var scale = this.getScale(canvas.width,canvas.height);
    var w = scale*this.spriteSlotMachine.getImageWidth();
    var h = scale*this.spriteSlotMachine.getImageHeight();

    this.spriteSlotMachine.draw(ctx,this.x,this.y-h/3,scale,scale);

    //Value that looks the best, found by trial and error
    var gap_divisor = 3.42;
    for(var i=0; i < this.slots.length; ++i){
    	this.slots[i].draw(ctx,this.x+w/gap_divisor*(i-1),this.y-h/3,scale,scale);
    }

    //draw score
    ctx.fillStyle="#aaaaaa";
    var fontSize = 0.03*canvas.width;
    ctx.font = (fontSize|0) + 'px Arial';

	ctx.textAlign="left"; 
    ctx.fillText("credit: "+Math.round(this.display_credit),this.x-w/2+w*0.025,this.y+h/2*1.4-h/3);

	ctx.textAlign="right";  
    ctx.fillText("bet size: "+this.bet_size,this.x+w/2-w*0.025,this.y+h/2*1.4-h/3);

    //draw buttons
    for(var i = 0; i < this.buttons.length; ++i ){
    	this.buttons[i].draw(ctx);
    }
}


SlotMachine.prototype.bet = function(bet_size){
	this.roll();
	this.credit -= bet_size;
}

SlotMachine.prototype.checkForWin = function(){
	
	if(this.finishedRolls < this.slots.length)
		return;

	console.log(this.slots[0].position+" ?= "+this.slots[1].position+" ?= "+this.slots[2].position);

	if(this.slots[0].position == this.slots[1].position && this.slots[1].position == this.slots[2].position){
		this.credit += this.bet_size*this.win_multiplier;
		console.log("You won "+this.bet_size*this.win_multiplier+" credits");
	}else{
		console.log("You lost ");
	}
	this.finishedRolls = 0;
}


SlotMachine.prototype.finishedRoll = function(){
	this.finishedRolls += 1;
	this.checkForWin();
}

SlotMachine.prototype.roll = function(){
	//roll all the individual slots
	for(var i=0;i<this.slots.length;++i){
		this.slots[i].roll(7.5+Math.random()*15,i+2,this.finishedRoll);
	}
}

SlotMachine.prototype.update = function(dt,x,y,canvas_width,canvas_height){

	if(this.credit != this.display_credit){
		this.display_credit = (this.credit-this.display_credit)*dt*10+this.display_credit;
	}

    slotMachine.updatePosition(x,y,canvas_width,canvas_height);
	for(var i=0;i<this.slots.length;++i){
		this.slots[i].update(dt);
	}
}