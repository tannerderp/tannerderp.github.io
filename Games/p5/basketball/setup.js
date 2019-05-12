new p5();
var swishSound, dribbleSound, crowdImage, stealSound;
var pixelWidth;
function preload(){
	crowdImage = loadImage("crowd.png");
	soundFormats("wav", "mp3");
	swishSound = loadSound("Swish.wav");
	dribbleSound = loadSound("dribble.wav");
	stealSound = loadSound("steal.mp3");
}
var smallest;
function setup() {
	smallest = min(windowWidth, windowHeight-30);
	createCanvas(windowWidth, smallest);
	width = 400;
	height = 400;
	smooth();
	angleMode(DEGREES);
	pixelWidth = (windowWidth/smallest)*width;
}
setup();

noStroke();
textAlign(CENTER);
var scene = "home";
var cpuDifficulty  = "easy";
var tipoff = true;
var blueScore = 0;
var redScore = 0;
var tipoffWinner = "";
var doneTipoff = false;
var half = 1;
var minutes = 4;
var seconds = 0;
var turnover = false;
var turnoverTeam = "";
var turnoverWait = 0;
var goaltending = false;
var shotclock = 24;
var shotclockViolation = false;
var tips = ["Press shift/f to rebound after a ball misses. Grabbing a rebound can give you another chance to score or take away another players chance to score", "Don't try and block the ball when it's moving downwards. It will be goaltending, and the other team will automatically score", "Press enter/g to attempt to steal. You have to be very close to the ball to steal it, so get close", "Watch out for the shot clock! If you don't shoot for 24 seconds, you'll get a shotclock violation and you'll lose the ball", "Press shoot while moving towards the hoop to attempt a dunk. Keep moving towards the basket so you hit it. Dunks are harder to block than regular shots, so use em"];
//}
//key and mouse functions{
var keys = {};
var releaseKeys = {};
keyPressed = function() {
	keys[keyCode] = true;
	keys[key] = true;
};
keyReleased = function() {
	keys[keyCode] = false;
	keys[key] = false;
	releaseKeys[keyCode] = true;
	releaseKeys[key] = true;
};
var clicked = false;
mouseReleased = function() {
	clicked = true;
};
//}
