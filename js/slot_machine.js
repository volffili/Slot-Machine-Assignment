function SlotMachine(initial_credit){
	this.spriteSlotMachine = new Sprite('./assets/slot_machine.png');

	this.buttons = [new Button(),new Button(),new Button(),];
	this.slot = [new Slot(),new Slot(),new Slot()];

	if(initial_credit){
		this.credit = initial_credit;
	}else{
		this.credit = 100;
	}

	this.display_credit = this.credit;
	this.bet_size = Math.floor(this.credit/50);

	this.checkTouchPressed = this.checkTouchPressed.bind(this);
	this.checkTouchReleased = this.checkTouchReleased.bind(this);
}


SlotMachine.prototype.checkTouchPressed = function(x,y){
	for(var i = 0; i < this.buttons.length; ++i){
		console.log("checking button "+i+" press ");
	}
}

SlotMachine.prototype.checkTouchReleased = function(x,y){
	for(var i = 0; i < this.buttons.length; ++i){
		console.log("checking button "+i+" release");
	}
}

SlotMachine.prototype.draw = function(canvas,ctx,x,y){

    var scale = canvas.width/this.spriteSlotMachine.getImageWidth()*0.5;
    var tmp_y_scale = canvas.height/this.spriteSlotMachine.getImageHeight()*0.5;

    //Shrink the image the way, so it always fits the screen
    if(scale > tmp_y_scale){
        scale = tmp_y_scale;
    }

    var w = scale*this.spriteSlotMachine.getImageWidth();
    var h = scale*this.spriteSlotMachine.getImageHeight();


    this.spriteSlotMachine.draw(ctx,x,y-h/3,scale,scale);

    //Value that looks the best, found by trial and error
    var gap_divisor = 3.42;
    for(var i=0; i<this.slot.length; ++i){
    	this.slot[i].draw(ctx,x+w/gap_divisor*(i-1),y-h/3,scale,scale);
    }

    //draw score
    ctx.fillStyle="#000000";
    fontSize = 0.03*canvas.width;
    ctx.font = (fontSize|0) + 'px Arial';

	ctx.textAlign="left"; 
    ctx.fillText("credit: "+this.display_credit,x-w/2+w*0.025,y+h/2*1.3-h/3);
	
	ctx.textAlign="right";  
    ctx.fillText("bet size: "+this.bet_size,x+w/2-w*0.025,y+h/2*1.3-h/3);
}


SlotMachine.prototype.bet = function(bet_size){
	this.roll();
	this.changeCredit(-bet_size);
}

SlotMachine.prototype.roll = function(){
	//roll all the individual slots
	for(var i=0;i<this.slot.length;++i){
		this.slot[i].roll(5+Math.random()*10,i+2);
	}
}

SlotMachine.prototype.update = function(dt){
	for(var i=0;i<this.slot.length;++i){
		this.slot[i].update(dt);
	}
}