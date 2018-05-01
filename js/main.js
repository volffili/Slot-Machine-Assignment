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

var slotMachine = new SlotMachine();
var inputListener = new InputListener(slotMachine.checkTouchPressed,slotMachine.checkTouchReleased);

//start loop
var lastUpdate = Date.now();
var time_elapsed = 0;

//maintaining compatibility for old browser 
if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback, element ) {
            window.setTimeout( callback, 1000 / 60 );
        };

    } )();
}

function startup(){
    inputListener.startup();
}

window.requestAnimationFrame(step);

//game loop
function step() {

    var now = Date.now();
    //delta time is in seconds
    var dt = (now - lastUpdate)/1000;
    lastUpdate = now;

    //console.log(dt);

    update(dt);
    render(dt);

    window.requestAnimationFrame(step);
}

function update(dt){
	slotMachine.update(dt,canvas.width/2,canvas.height/2,canvas.width,canvas.height);

}



function render(dt){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    slotMachine.draw(canvas,ctx,canvas.width/2,canvas.height/2)
}
