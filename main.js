
//canvas
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

//start loop
var lastUpdate = Date.now();
window.requestAnimationFrame(step);

//game loop
function step() {
	//delta time
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;

    update(dt);
    render(dt);

	window.requestAnimationFrame(step);
}

function update(dt){
		
}

function render(dt){
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0,0,150,75);
}
