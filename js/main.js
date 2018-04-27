"use strict";

//canvas
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Load image
var img = new Image();      // Vytvoří nový objekt Image
img.src = './assets/slot_machine.png'; // Nastaví cestu zdroje
img.onload = drawSlotMachine;

function drawSlotMachine(){
    ctx.fillStyle = "#3a3a3c";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var aspectRatio = img.height/img.width;
    ctx.drawImage(img,0,(canvas.height-canvas.width*aspectRatio)/2,canvas.width,aspectRatio*canvas.width);
}

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawSlotMachine();    
}

resize();
window.addEventListener('resize', resize);

//start loop
var lastUpdate = Date.now();
var time_elapsed = 0;

//requestAnimationFrame is not available by older browsers supporting ES5.1 
var loop = setInterval(step, 0);

//game loop
function step() {
	//delta time
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;

    time_elapsed += dt;
    console.log(dt);

    update(dt);
    render(dt);
}

function update(dt){
		
}

function render(dt){
    	
}
