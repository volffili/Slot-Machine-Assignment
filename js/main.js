"use strict";

//canvas
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

var slotMachine = new SlotMachine(200);
var touchHandler = new TouchHandler(slotMachine.checkTouchPressed,slotMachine.checkTouchReleased);

//start loop
var lastUpdate = Date.now();
var time_elapsed = 0;

//requestAnimationFrame is not available by older browsers supporting ES5.1 
var loop = setInterval(step, 0);

function startup(){
    touchHandler.startup();
}

//game loop
function step() {

    var now = Date.now();
    //delta time is in seconds
    var dt = (now - lastUpdate)/1000;
    lastUpdate = now;

    update(dt);
    render(dt);
}

function update(dt){
	slotMachine.update(dt);
}

function render(dt){
    slotMachine.draw(canvas,ctx,canvas.width/2,canvas.height/2)
}
