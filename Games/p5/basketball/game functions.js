var tipped = false;
var addedZero = "0";
var displayScoreBoard = function() {
	fill(31, 30, 30);
	rect(315, 330, 80, 64);
	fill(17, 60, 189);
	rect(315, 330, 80, 23);
	fill(194, 10, 10);
	rect(315, 353, 80, 23);
	fill(255, 255, 255);
	textSize(18);
	text("P1:    " + blueScore, 353, 347);
	if (player3.controls === "wasd" || player4.controls === "wasd") {
		text("P2:    " + redScore, 353, 371);
	} else {
		text("CPU:  " + redScore, 353, 371);
	}
	textSize(17);
	if (half === 1) {
		text("1st", 330, 390);
	} else if (half === 2) {
		text("2nd", 330, 390);
	} else {
		text(half - 2 + "OT", 330, 390);
	}
	text(minutes + ":" + addedZero + seconds, 368, 390);
	if (tipped) {
		if (frameCount % 60 === 0 && !turnover) {
			seconds--;
		}
	}
	if (seconds < 0 && minutes !== 0) {
		seconds = 59;
		minutes--;
	}
	if (seconds < 10) {
		addedZero = "0";
	} else {
		addedZero = "";
	}
};
function displayShotClock(){
	if (shotclock < 13) {
		fill(0, 0, 0);
		textSize(20);
		text("Shot", 36, 338);
		rect(14, 342, 46, 46);
		fill(186, 15, 15);
		textSize(40);
		text(shotclock, 37, 378);
	}
};
var tipoff = function() {
	if (frameCount % 160 === 0) {
		ball.yvel = -7.5;
		tipped = true;
	}
	if (ball.carriedBy !== "" || tipped) {
		tipoff = false;
	}
};

function Turnover(){ //completely new turnover system. Looks weird because of teleportation, but this one causes no game stopping bugs
	turnoverWait ++;
	if(turnoverTeam === "red"){
		if(!players[2].carryingBall){
			for(var i in players){
				players[i].canMove = false;
			}
			if(turnoverWait>120){
				for(var i in players){
					players[i].carryingBall = false;
					players[i].y = 0;
					players[i].z = 210;
					players[i].canMove = false;
					ball.carriedBy = "";
					ball.dribbling = false;
				}
				players[2].x = 1115;
				players[3].x = 950;
				players[0].x = 650;
				players[1].x = 650;
				ball.carriedBy = 2;
				players[2].carryingBall = true;
				ball.dribbling = true;
				turnoverWait = 0;
			}
		} else{
			if(turnoverWait>100){
				shotclock = 24;
				shotclockViolation = false;
				turnover = false;
				goaltending = false;
				turnoverTeam = "";
				players[3].x = 950;
				players[0].x = 650;
				players[1].x = 650;
				players[2].pass(ball, players);
				turnoverWait = 0;
				for (var i in players) {
					players[i].canMove = true;
				}
			}
		}
	}
	if(turnoverTeam === "blue"){
		if(!players[0].carryingBall){
			for(var i in players){
				players[i].canMove = false;
			}
			if(turnoverWait>120){
				for(var i in players){
					players[i].carryingBall = false;
					players[i].y = 0;
					players[i].z = 210;
					players[i].canMove = false;
					ball.carriedBy = "";
					ball.dribbling = false;
				}
				players[0].x = 0;
				players[1].x = 165;
				players[2].x = 465;
				players[3].x = 465;
				ball.carriedBy = 0;
				players[0].carryingBall = true;
				ball.dribbling = true;
				turnoverWait = 0;
			}
		} else{
			if(turnoverWait>100){
				shotclock = 24;
				shotclockViolation = false;
				turnover = false;
				goaltending = false;
				turnoverTeam = "";
				players[1].x = 165;
				players[2].x = 465;
				players[3].x = 465;
				players[0].pass(ball, players);
				turnoverWait = 0;
				for (var i in players) {
					players[i].canMove = true;
				}
			}
		}
	}
}