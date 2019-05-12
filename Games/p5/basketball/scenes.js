var goToTransX = -110;
var transX = goToTransX;
var goToTransY = 200;
var transY = goToTransY;
var game = function() {
	if (tipoff) {
		tipoff();
	}
	background(87, 87, 87);
	push();
	goToTransX = -ball.x + pixelWidth/2;
	transX += (goToTransX - transX) / 10;
	if (ball.y < -150) {
		goToTransY = -ball.y - 130;
	} else {
		goToTransY = 0;
	}
	transY += (goToTransY - transY) / 10;
	translate(transX, transY);
	drawCourt();
	sortWorld();
	for (var i in world) {
		world[i].run(ball, players, hoops);
	}
	pop();
	push();
	translate(pixelWidth-400, 0);
	displayScoreBoard();
	pop();
	displayShotClock();
	if (turnover) {
		Turnover();
	}
	fill(181, 11, 11);
	textSize(55);
	minutes = constrain(minutes, 0, 100);
	seconds = constrain(seconds, 0, 100);
	if (goaltending) {
		text("GOAL TENDING!", pixelWidth / 2, height / 2);
	}
	if (shotclockViolation) {
		text("SHOTCLOCK\nVIOLATION!", pixelWidth / 2, height / 2);
	}
	if (minutes === 0 && seconds === 0 && ball.y > -1) {
		if (half === 1) {
			scene = "halftime";
		} else if (redScore === blueScore) {
			scene = "overtime";
		} else {
			scene = "results";
		}
	}
	fill(224, 224, 224, 230);
	rect(pixelWidth-100, 5, 10, 33);
	rect(pixelWidth-100+18, 5, 10, 33);
	if (mouseX > pixelWidth-100 && mouseY < 40) {
		cursor(HAND);
		if (clicked) {
			scene = "pause";
		}
	}
	releaseKeys = {};
};
var pause = function() {
	background(207, 207, 207);
	fill(181, 23, 23);
	rect(0, 0, pixelWidth, 59, 5);
	rect(0, height - 59, pixelWidth, 59, 5);
	fill(0, 0, 0);
	textSize(57);
	text("Paused", pixelWidth / 2, 44);
	resume.draw();
	quit.draw();
};
var home = function() {
	background(207, 207, 207);
	fill(181, 23, 23);
	rect(0, 0, pixelWidth, 59, 5);
	rect(0, height - 59, pixelWidth, 59, 5);
	fill(0, 0, 0);
	textSize(57);
	text("Basketball", pixelWidth / 2, 46);
	textSize(20);
	text("Enhanced Edition", pixelWidth/2, 85);
	textSize(34);
	text("Created By Tannerderp", pixelWidth / 2, 380);
	playervsplayer.draw();
	playervscpu.draw();
};
var tip = round(random(0, tips.length - 1));
var halftime = function() {
	background(207, 207, 207);
	fill(181, 23, 23);
	rect(0, 0, pixelWidth, 59, 5);
	fill(0, 0, 0);
	textSize(57);
	text("Halftime", pixelWidth / 2, 46);
	textSize(40);
	text("Tip:", pixelWidth / 2, 91);
	textSize(20);
	text(tips[tip], 2, 183, pixelWidth, 200);
	if (frameCount % 830 === 0 || clicked) {
		minutes = 4;
		seconds = 0;
		half = 2;
		shotclock = 24;
		if(tipoffWinner === "blue"){
			turnoverTeam = "red";
		}else{
			turnoverTeam = "blue";
		}
		for(var i in players){
			players[i].canMove = false;
			ball.dribbling = false;
		}
		ball.carriedBy = "";
		if(turnoverTeam === "blue"){
			 ball.x = 20;
			for(var i in players){
				players[i].x = 150;
			}
			
		}else{
			ball.x = 1110;
			for(var i in players){
				players[i].x = 950;
			}
		}
		ball.z = 210;
		ball.zvel = 0;
		turnover = "true";
		scene = "game";
	}
	cursor(HAND);
};
var overtime = function() {
	background(207, 207, 207);
	fill(181, 23, 23);
	rect(0, 0, pixelWidth, 59, 5);
	fill(0, 0, 0);
	textSize(55);
	text("Overtime", pixelWidth / 2, 44);
	textSize(30);
	text("Wow the game still isn't decided, dang. Well good luck!", 3, 183, pixelWidth, 200);
	if (frameCount % 750 === 0) {
		minutes = 2;
		seconds = 0;
		half++;
		shotclock = 24;
		scene = "game";
	}
};
var results = function() {
	background(207, 207, 207);
	fill(181, 23, 23);
	rect(0, 0, pixelWidth, 59, 5);
	textSize(50);
	fill(0, 0, 0);
	if (blueScore > redScore) {
		text("Player 1 Wins!", pixelWidth / 2, 44);
	} else {
		text("Player 2 Wins!", pixelWidth / 2, 44);
	}
	textSize(67);
	text(blueScore + " - " + redScore, pixelWidth / 2, 234);
	textSize(40);
	text("Thanks for playing!", pixelWidth / 2, 300);
	if (frameCount % 500 === 0) {
		location.reload();
	}
};
function chooseCpu(){
	background(207, 207, 207);
	fill(181, 23, 23);
	rect(0, 0, pixelWidth, 59, 5);
	fill(0, 0, 0);
	textSize(55);
	text("CPU Difficulty", pixelWidth / 2, 44);
	easy.draw();
	hard.draw();
};