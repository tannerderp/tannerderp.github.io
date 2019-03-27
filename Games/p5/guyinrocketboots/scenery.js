var WIDTH = min(windowWidth, 1000); // because the regular width variable likes to have a piss fit if it's not in the setup variable or draw function
//space at around -23000
//run scenery
function runScenery(){
	for(var i in clouds){
		var c = clouds[i];
		fill(247, 247, 247, 150);
		ellipse(c.x, c.y, c.width, c.height);
	}
	for(var i in stars){
		var s = stars[i];
		fill(255, 255, 255);
		ellipse(s.x, s.y, s.size, s.size);
	}
	fill(36, 204, 70);
	rect(0, height-50, width, 10);
	fill(124, 70, 19);
	rect(0, height-40, width, 40);
};
//stars
var stars = [];
function createStars(){
	stars = [];
	for(var i = -24000; i>-80000; i-= random(25, 40)){
		stars.push({
			x: random(5, WIDTH-5),
			y: i,
			size: random(10, 15),
		});
	}
};
createStars();
//clouds
var clouds = [];
function createClouds(){
	clouds = [];
	for(var i = 0; i>-23000; i -= random(350, 900)){
		clouds.push({
			x: random(25, WIDTH-25),
			y: i,
			width: random(300, 620),
			height: random(80,150),
		});
	}
};
createClouds();