function game(){
	push();
	if(player.y<height/2){
		translate(0, -cameraY+height/2);
	}
	skyColor = lerpColor(color(200,225,255), color(58, 72, 89), -player.y*0.00005);
	background(skyColor);
	runScenery();
	for(var i in fuels){
		fuels[i].run();
		if(fuels[i].collected){
			fuels.splice(i, 1);
		}
	}
	for(var i in asteroids){
		asteroids[i].run();
	}
	player.run();
	pop();
	player.displayFuel();
	fill(0,0,0);
	textSize(50);
	text(altitude, 75, 100);
};
function home(){
	background(200,225,255);
	fill(0,0,0);
	textSize(50);
	text("Guy In Rocket Boots", width/2, 50);
	Button(width/2-100, height/2, 200, 75, 3, color(220, 247, 225), "Play", function(){scene="init"}, height/2+50);
	Button(width/2-100, height/2+100, 200, 75, 3, color(220, 247, 225), "How", function(){scene="how"}, height/2+150);
};
function how(){
	background(200,225,255);
	fill(0,0,0);
	textSize(50);
	text("How to Play", width/2, 50);
	textSize(20);
	textFont("sans-serif")
	text("Press space to accelerate, use the arrow keys or a and d to steer. Collect fuel to keep your engines running. Get as high as you can(not on drugs, tannerderp frowns upon drugs)", 0, height/2, width, height);
	Button(100, height-100, 100, 100, 3, color(220, 247, 225), "Back", function(){scene="home"}, height-50);
};
function dead(){
	score = max(altitude, 0);
	background(200,225,255);
	fill(0, 0, 0);
	textSize(50);
	text("You died", width/2, 50);
	textSize(35);
	text("You got a score of "+score, width/2, height/2-50);
	Button(width/2-75, height/2, 150, 50, 3, color(220, 247, 225), "Retry", function(){scene="init"}, height/2+35);
};
function init(){
	player.init();
	spawnFuels();
	spawnAsteroids();
	scene = "game";
}
