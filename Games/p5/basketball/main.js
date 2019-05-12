//Put this file at end of body in index or it won't work

var world = [player1, player2, player3, player4, ball, rightHoop, leftHoop];
var sortWorld = function() {
	world.sort(function(a, b) {
		return a.z - b.z;
	});
};

draw = function() {
 	cursor("default");

 	mouseX = pmouseX * width / smallest
 	mouseY = pmouseY * height / smallest
 	push();
 	scale(smallest / width);
 	switch (scene) {
 		case "game":
 			game();
 			break;
 		case "home":
 			home();
 			break;
 		case "pause":
 			pause();
 			break;
 		case "halftime":
 			halftime();
 			break;
 		case "overtime":
 			overtime();
 			break;
 		case "results":
 			results();
 			break;
 		case "chooseCpu":
 			chooseCpu();
 			break;
 	}
 	pop();
 	clicked = false;
};


