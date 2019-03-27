new p5();
var playerImage, samImage, fuelImage, asteroidImage, font, clicked;
function preload(){
	playerImage = loadImage("costume1.png");
	fuelImage = loadImage("fuel.png");
	asteroidImage = loadImage("asteroid.png");
	font = loadFont("HoW_tO_dO_SoMeThInG1.ttf");
};
var keys = {};
keyPressed = function(){
	keys[key] = true;
	keys[keyCode] = true;
};
keyReleased = function(){
	keys[key] = false;
	keys[keyCode] = false;
};
mouseReleased = function(){
	clicked = true;
};
var scene = "home";
var skyColor, cameraY, altitude, score;
function setup() {
	//createCanvas(min(windowWidth, 1000), windowHeight);
	let canvas = createCanvas(min(windowWidth, 1000),windowHeight-30);
	canvas.parent('game');
	noStroke();
	textAlign(CENTER);
}
