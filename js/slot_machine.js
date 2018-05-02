function SlotMachine(initial_credit,x,y){
	this.spriteSlotMachineBack = new Sprite('./assets/slot_machine_back.png');
	this.spriteSlotMachineMid = new Sprite('./assets/slot_machine_mid.png');
	this.spriteSlotMachineFront = new Sprite('./assets/slot_machine_glow.png');
	this.spinning = false;
	this.sn_coin = new Audio("./assets/coin_drop.wav");

	this.pressSpinCallback = function(){
		if(this.bet_size > this.credit || this.spinning || this.bet_size <= 0){
			this.buttons[0].failPress();
		}
	};
	
	this.pressMaxBetCallback = function(){
		if (this.credit < this.bet_size_changer*this.bet_max_amount || this.spinning){
			this.buttons[2].failPress();
		}		
	};
	
	this.pressBetOneCallback = function(){
		if (this.credit <= this.bet_size || this.bet_size >= this.bet_max_amount || this.spinning){
			this.buttons[1].failPress();
		}	
	};

	this.spinCallback = function(){
		if(this.bet_size <= this.credit && !this.spinning){
			this.credit -= this.bet_size;
			console.log("spin");
			if(this.bet_size > 0 ){
				this.roll();
			}else{
				this.buttons[0].failPress();
			}
		}
	};
	
	this.maxBetCallback = function(){
		this.bet_size = Math.min(this.bet_size_changer*this.bet_max_amount,this.credit);
		console.log("bet max");
		this.spinCallback();
	};
	
	this.betOneCallback = function(){
		if(this.bet_size < this.bet_size_changer*this.bet_max_amount && this.credit >= this.bet_size_changer){
			this.bet_size += this.bet_size_changer;
			console.log("bet one ");
		}
	};

	this.pressSpinCallback = this.pressSpinCallback.bind(this);
	this.pressMaxBetCallback = this.pressMaxBetCallback.bind(this);
	this.pressBetOneCallback = this.pressBetOneCallback.bind(this);
	this.spinCallback = this.spinCallback.bind(this);
	this.maxBetCallback = this.maxBetCallback.bind(this);
	this.betOneCallback = this.betOneCallback.bind(this);
	this.finishedRoll = this.finishedRoll.bind(this);

	this.buttons = [
		new Button('./assets/spin_reels_pressed.png','./assets/spin_reels.png','./assets/spin_reels_fail.png',this.spinCallback,this.pressSpinCallback),
		new Button('./assets/bet_one_pressed.png','./assets/bet_one.png','./assets/bet_one_fail.png',this.betOneCallback,this.pressBetOneCallback),
		new Button('./assets/bet_max_pressed.png','./assets/bet_max.png','./assets/bet_max_fail.png',this.maxBetCallback,this.pressMaxBetCallback)
	];
	
	this.slots = [new Slot(),new Slot(),new Slot()];

	if(initial_credit){
		this.credit = initial_credit;
	}else{
		this.credit = 50;
	}

	this.initial_credit = this.credit;

	this.bet_max_amount = 3;
	this.display_credit = this.credit;
	this.bet_size_changer = 1;
	this.bet_size = 0;

	this.checkTouchPressed = this.checkTouchPressed.bind(this);
	this.checkTouchReleased = this.checkTouchReleased.bind(this);

	this.x = x || 0;
	this.y = y || 0;

	this.finishedRolls = 0;
	this.win_multiplier = 9;
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
    var scale = canvas_width/this.spriteSlotMachineBack.getImageWidth()*0.35;
    var tmp_y_scale = canvas_height/this.spriteSlotMachineBack.getImageHeight()*0.35;

    //Shrink the image the way, so it always fits the screen
    if(scale > tmp_y_scale){
        scale = tmp_y_scale;
    }

    return scale;
}


SlotMachine.prototype.updatePosition = function(x,y,canvas_width,canvas_height){

	var scale = this.getScale(canvas_width,canvas_height);
    var w = scale*this.spriteSlotMachineBack.getImageWidth();
    var h = scale*this.spriteSlotMachineBack.getImageHeight();

	this.x = x;
	this.y = y;

	//update the positions of buttons
	var gap_divisor = 3.42;
	for (var i = 0; i < this.buttons.length; ++i ){
		this.buttons[i].updatePositionAndScale(x-w*(i-(this.buttons.length-1)/2)/gap_divisor,y+h*0.75,scale*3,scale*3);
	}

}

SlotMachine.prototype.draw = function(canvas,ctx){
	var scale = this.getScale(canvas.width,canvas.height);
    var w = scale*this.spriteSlotMachineBack.getImageWidth();
    var h = scale*this.spriteSlotMachineBack.getImageHeight();

    this.spriteSlotMachineBack.draw(ctx,this.x,this.y-h/3,scale,scale);

	var tmp_canvas = document.createElement('canvas');
	tmp_canvas.width = w*2;
	tmp_canvas.height = h;
	var tmp_canvas_context = tmp_canvas.getContext('2d');

    //Value that looks the best, found by trial and error
    var gap_divisor = 3.42;
    for(var i=0; i < this.slots.length; ++i){
    	this.slots[i].draw(tmp_canvas_context,w/2+w/gap_divisor*(i-1),0,scale,scale);
    }

    if(tmp_canvas.width != 0 && tmp_canvas.height != 0)
    	ctx.drawImage(tmp_canvas,this.x-w/2,this.y-h/3-h/2);

    //draw score
    ctx.fillStyle = "#aaaaaa";
    var fontSize = 0.03*canvas.width;
    ctx.font = (fontSize|0) + 'px Arial';


	ctx.textAlign="left"; 
    ctx.fillText("credit: "+Math.round(this.display_credit),this.x-w/2+w*0.025,this.y+h/2*1.4-h/3);

	ctx.textAlign="right";  
    ctx.fillText("bet size: "+this.bet_size,this.x+w/2-w*0.025,this.y+h/2*1.4-h/3);

    this.spriteSlotMachineMid.draw(ctx,this.x,this.y-h/3,scale,scale);
    this.spriteSlotMachineFront.draw(ctx,this.x,this.y-h/3,scale,scale);

    //draw buttons
    for(var i = 0; i < this.buttons.length; ++i ){
    	this.buttons[i].draw(ctx);
    }
}

SlotMachine.prototype.checkForWin = function(){
	
	if(this.finishedRolls < this.slots.length)
		return;

	console.log(this.slots[0].position+" ?= "+this.slots[1].position+" ?= "+this.slots[2].position);

	if(this.slots[0].position == this.slots[1].position && this.slots[1].position == this.slots[2].position){
		this.credit += this.bet_size*this.win_multiplier;
		console.log("You won "+this.bet_size*this.win_multiplier+" credits");
		this.sn_coin.play();
	}else{
		console.log("You lost ");
	}
	this.finishedRolls = 0;
	this.spinning = false;
	this.bet_size = 0;
}


SlotMachine.prototype.finishedRoll = function(){
	this.finishedRolls += 1;
	this.checkForWin();
}

SlotMachine.prototype.roll = function(){
	this.spinning = true;
	//roll all the individual slots
	for(var i=0;i<this.slots.length;++i){
		this.slots[i].roll(7.5+Math.random()*15,i+3,this.finishedRoll);
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

SlotMachine.prototype.getEmotionColor = function(){
	var g = 55;
	var b = 55;
	var r = 55+100-Math.min(this.display_credit/this.initial_credit,1)*100;
	
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);

	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}