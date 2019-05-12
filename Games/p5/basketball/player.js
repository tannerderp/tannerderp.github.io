var playerX = [
	[],
	[],
	[],
	[]
];
var playerZ = [
	[],
	[],
	[],
	[]
];
var playerGuardedBy = [2,3,0,1];
var Player = function(x, y, z, color, number, cpu, controls, ID, hoop) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = color;
	this.number = number;
	this.cpu = cpu;
	this.controls = controls;
	if (this.x > 550) {
		this.direction = "left";
	} else {
		this.direction = "right";
	}
	this.yvel = 0;
	this.rightArmY = 0;
	this.leftArmY = 0;
	this.carryingBall = false;
	this.ID = ID;
	this.hoop = hoop;
	this.passCooldown = 0;
	this.shooting = false;
	this.shootCooldown = 0;
	if (this.hoop === "right") {
		this.side = 0;
		this.reverse = 1;
	} else {
		this.side = 1;
		this.reverse = -1;
	}
	this.dunkHang = 60;
	this.jumpX = 0;
	this.dunking = false;
	this.stealing = 0;
	this.canMove = false;
	this.wannaBeX = 0;
	this.wannaBeZ = 0;
	this.noBallWait = 0;
	this.setWannaBe = false;
	this.guardedBy = 0;
	this.changeZCooldown = 0;
};
Player.prototype.run = function(ball, players, hoops) {
	this.draw();
	this.update(ball, hoops);
	if (this.canMove) {
		if (!this.cpu) {
			this.control(ball, players, hoops);
		} else {
			if ((this.ID === 1 && ball.carriedBy === 1) || (this.ID === 2 && ball.carriedBy === 0) || (this.ID === 3 && ball.carriedBy === 3) || (this.ID === 4 && ball.carriedBy === 2)) {
				this.cpuNoBallOffense(ball, hoops);
			}else if (ball.carriedBy === this.ID - 1) {
				this.cpuBallOffense(players, hoops, ball);
			}else if (((this.ID === 1 || this.ID === 2) && (ball.carriedBy === 2 || ball.carriedBy === 3 || ball.shotBy === "red")) || ((this.ID === 3 || this.ID === 4) && (ball.carriedBy === 0 || ball.carriedBy === 1 || ball.shotBy === "blue"))) {
				this.cpuDefense(players, ball);
			}else if (ball.carriedBy === "" && ball.shotBy === "") {
				this.cpuGetBall(ball);
			}
		}
	}
	this.passCooldown++;
	this.shootCooldown++;
	if (this.stealing > 0 && !this.carryingBall) {
		this.steal(ball, players);
		if (this.stealing < 20) {
			this.stealing++;
		} else {
			this.stealing = 0;
		}
	}
	if (ball.y < -260) {
		this.canMove = true;
	}
	playerX[this.ID - 1].unshift(this.x);
	playerZ[this.ID - 1].unshift(this.z);
};
Player.prototype.draw = function() {
	fill(0, 0, 0, 150);
	ellipse(this.x + 2, this.z, 35, 18);
	fill(255, 205, 148);
	rect(this.x - 12, this.z + this.y - 27, 10, 23);
	rect(this.x + 5, this.z + this.y - 27, 10, 23);
	if ((this.direction === "right" || this.direction === "up")) {
		rect(this.x + 15, this.z + this.y - 85 + this.rightArmY, 10, 54, 2);
	}
	if ((this.direction === "left" || this.direction === "up") && this.stealing === 0) {
		rect(this.x - 23, this.z + this.y - 85 + this.leftArmY, 10, 54, 2);
	}
	fill(10, 9, 9);
	if (this.direction === "left") {
		ellipse(this.x + 10, this.z + this.y, 14, 10);
		ellipse(this.x - 7, this.z + this.y, 14, 10);
	} else {
		ellipse(this.x + 11, this.z + this.y, 14, 10);
		ellipse(this.x - 5, this.z + this.y, 14, 10);
	}
	fill(this.color);
	rect(this.x + 3, this.z + this.y - 47, 15, 26);
	rect(this.x - 14, this.z + this.y - 47, 15, 26);
	rect(this.x - 14, this.z + this.y - 85, 32, 40);
	fill(255, 255, 255);
	textSize(16);
	if (this.direction === "up") {} else {
		text(this.number, this.x + 1, this.z + this.y - 60);
	}
	fill(255, 205, 148);
	ellipse(this.x + 1, this.z + this.y - 96, 25, 25);
	if ((this.direction === "right" || this.direction === "down") && this.stealing === 0) {
		rect(this.x - 23, this.z + this.y - 85 + this.leftArmY, 10, 54, 2);
	}
	if ((this.direction === "left" || this.direction === "down")) {
		rect(this.x + 15, this.z + this.y - 85 + this.rightArmY, 10, 54, 2);
	}
	if ((this.direction === "left" || this.direction === "down") && this.stealing > 0) {
		rect(this.x - 63, this.z + this.y - 85, 54, 10, 2);
	}
	if ((this.direction === "right" || this.direction === "up") && this.stealing > 0) {
		rect(this.x - 15, this.z + this.y - 85, 54, 10, 2);
	}
	fill(this.color);
	textSize(20);
	if (this.controls === "arrows") {
		text("P1", this.x, this.z + this.y - 115);
	}
	if (this.controls === "wasd") {
		text("P2", this.x, this.z + this.y - 115);
	}
};
Player.prototype.control = function(ball, players, hoops) {
	if (((this.controls === "arrows" && releaseKeys[ENTER]) || (this.controls === "wasd" && releaseKeys.g)) && this.stealing === 0 && !this.carryingBall && this.passCooldown > 100) {
		this.stealing++;
	}
	if (this.controls === "arrows" && this.canDunk && this.dunkHang > 59) {
		if (keys[UP_ARROW]) {
			this.z -= 3;
			this.direction = "up";
		}
		if (keys[DOWN_ARROW]) {
			this.z += 3;
			this.direction = "down";
		}
		if (keys[LEFT_ARROW]) {
			this.x -= 3;
			this.direction = "left";
		}
		if (keys[RIGHT_ARROW]) {
			this.x += 3;
			this.direction = "right";
		}
		if (keys[SHIFT] && this.y === 0) {
			this.jump(hoops);
		}
		if (this.carryingBall && releaseKeys[ENTER] && this.passCooldown > 30) {
			this.pass(ball, players);
		}
	}
	if (((this.controls === "arrows" && releaseKeys[SHIFT]) || (this.controls === "wasd" && releaseKeys.f)) && this.shooting && this.x === this.jumpX) {
		this.release(ball, hoops);
	}
	if (this.controls === "wasd" && this.canDunk && this.dunkHang > 59) {
		if (keys.w) {
			this.z -= 3;
			this.direction = "up";
		}
		if (keys.s) {
			this.z += 3;
			this.direction = "down";
		}
		if (keys.a) {
			this.x -= 3;
			this.direction = "left";
		}
		if (keys.d) {
			this.x += 3;
			this.direction = "right";
		}
		if (keys.f && this.y === 0) {
			this.jump(hoops);
		}
		if (this.carryingBall && releaseKeys.g && this.passCooldown > 30) {
			this.pass(ball, players);
		}
	}
};
Player.prototype.steal = function(ball, players) {
	try {
		if (this.x + 25 > ball.x - 9 && this.x - 25 < ball.x + 9 && this.z + 25 > ball.z - 5 && this.z - 25 < ball.z + 5 && this.y === 0 && ball.stealCooldown > 30) {
			stealSound.play();
			if (round(random(0, 1)) === 0) {
				for (var i in players) {
					players[i].carryingBall = false;
					players[i].passCooldown = 0;
					ball.dribbling = false;
					ball.carriedBy = "";
					ball.x -= 20;
					ball.xvel = -2;
				}
				shotclock = 24;
			} else {
				ball.dribbling = true;
				for (var i in players) {
					players[i].carryingBall = false;
					players[i].passCooldown = 0;
				}
				ball.stealCooldown = 0;
				this.stealing = 21;
				this.passCooldown = 0;
				ball.carriedBy = this.ID - 1;
				ball.x = this.x - 15;
				this.carryingBall = true;
				if(this.ID === 1 && this.cpu){
					this.cpu = false;
					players[1].controls = "";
					players[1].cpu = true;
					this.controls = "arrows"
				} else if(this.ID === 2 && this.cpu){
					this.cpu = false;
					players[0].controls = "";
					players[0].cpu = true;
					this.controls = "arrows"
				} else if(this.ID === 3 && this.cpu && players[3].controls === "wasd"){
					this.cpu = false;
					players[3].controls = "";
					players[3].cpu = true;
					this.controls = "wasd"
				} else if(this.ID === 4 && this.cpu && players[2].controls === "wasd"){
					this.cpu = false;
					players[2].controls = "";
					players[2].cpu = true;
					this.controls = "wasd"
				}
				shotclock = 24;
			}
		} else {
			ball.stealCooldown = 0;
		}
	} catch (e) {
		print(e);
	}
};
Player.prototype.jump = function(hoops) {
	this.yvel = -9.5;
	this.jumpX = this.x;
	if (this.carryingBall) {
		this.yvel = -8;
		this.shootCooldown = 0;
		this.shooting = true;
		if (this.hoop === "right") {
			this.side = 0;
			this.reverse = 1;
		} else {
			this.side = 1;
			this.reverse = -1;
		}
		try {
			if (dist(this.x, this.z, hoops[this.side].x, hoops[this.side].z) < 175 && dist(this.x, this.z, hoops[this.side].x, hoops[this.side].z) > 30 && this.carryingBall) {
				this.canDunk = true;
				this.dunkHang = 60;
				if (dist(this.x, this.z, hoops[this.side].x, hoops[this.side].z) > 135) {
					this.yvel = -10.7;
				}
			} else {
				this.canDunk = false;
			}
		} catch (e) {
			print(e);
		}
		this.leftArmY = -50;
		this.rightArmY = -40;
		if (this.hoop === "right" && this.direction === "left") {
			this.direction = "right";
		}
		if (this.hoop === "left" && this.direction === "right") {
			this.direction = "left";
		}
	} else if (this.direction === "right") {
		this.leftArmY = -50;
		this.yvel = -10.7;
	} else if (this.direction === "left") {
		this.rightArmY = -50;
		this.yvel = -10.7;
	} else {
		this.rightArmY = -50;
		this.leftArmY = -50;
		this.yvel = -10.7;
	}
};
Player.prototype.pass = function(ball, players) {
	if (this.ID === 1) {
		this.passTarget = 2;
	} else if (this.ID === 2) {
		this.passTarget = 1;
	} else if (this.ID === 3) {
		this.passTarget = 4;
	} else {
		this.passTarget = 3;
	}
	this.passTarget--;
	this.carryingBall = false;
	this.passCooldown = 0;
	ball.dribbling = false;
	ball.heightLimit = true;
	ball.carriedBy = "";
	try {
		ball.xvel = (players[this.passTarget].x + 20 - this.x) / 20;
		ball.zvel = (players[this.passTarget].z - this.z) / 20;
		ball.yvel = 4;
	} catch (e) {
		print(e.message);
	}
};
Player.prototype.release = function(ball, hoops) {
	this.releaseY = this.y;
	if (this.hoop === "right") {
		this.side = 0;
		this.reverse = 1;
	} else {
		this.side = 1;
		this.reverse = -1;
	}
	this.carryingBall = false;
	this.passCooldown = 0;
	this.shotDistance = (dist(this.x, this.z * 2.3, hoops[this.side].x, hoops[this.side].z * 2.3));
	this.shotDistance = map(this.shotDistance, 0, 1000, 1, 0.05);
	ball.y = -260;
	ball.dribbling = false;
	ball.carriedBy = "";
	try {
		ball.xvel = ((hoops[this.side].x - this.x) / 105);
		ball.zvel = ((hoops[this.side].z - this.z) / 105);
		ball.yvel = -4;
		this.cpuReleaseY = 0;
		var releaseChance = map(this.releaseY, -95, 0, 1, 0);
		ball.shotChance = releaseChance * this.shotDistance * 100 - 10;
		ball.shotChance = constrain(ball.shotChance, 5, 95);
		this.shootCooldown = 0;
		if (this.ID === 1 || this.ID === 2) {
			ball.shotBy = "blue";
		} else {
			ball.shotBy = "red";
		}
		if (dist(this.x, this.z * 1.4, hoops[this.side].x, hoops[this.side].z * 1.4) > 220) {
			ball.pointsWorth = 3;
		} else {
			ball.pointsWorth = 2;
		}
	} catch (e) {
		print(e);
	}
	ball.shot = true;
};
Player.prototype.update = function(ball, hoops) {
	this.y += this.yvel;
	this.y = constrain(this.y, -250, 0);
	this.yvel += 0.35;
	this.z = constrain(this.z, 50, 400);
	this.x = constrain(this.x, 10, 1120);
	if (this.y === 0) {
		this.shooting = false;
		this.canDunk = true;
	}
	if (this.jumpX !== this.x && this.canDunk && this.shooting) {
		ball.dunking = true;
		this.dunking = true;
	}
	if (this.carryingBall && !this.shooting) {
		if (ball.yvel < 0) {
			this.leftArmY = -4;
			this.rightArmY = 0;
		} else {
			this.leftArmY = 4;
			this.rightArmY = 0;
		}
	} else if (this.y === 0) {
		this.rightArmY = 0;
		this.leftArmY = 0;
	}
	if (ball.x === this.x - 15) {
		this.carryingBall = true;
	} else {
		this.carryingBall = false;
	}
	try {
		if (this.canDunk && this.shooting && this.x > hoops[this.side].x - 20 && this.x < hoops[this.side].x + 20 && this.z > hoops[this.side].z - 20 && this.z < hoops[this.side].z + 20 && this.y < -20 && this.y > hoops[this.side].y - 10) {
			this.carryingBall = false;
			this.shooting = false;
			this.dunkHang = 0;
			this.x = hoops[this.side].x;
			this.z = hoops[this.side].z;
			this.y = hoops[this.side].y + 120;
			this.rightArmY = -50;
			this.leftArmY = -50;
			this.dunking = false;
			ball.dunking = false;
			ball.carriedBy = "";
			ball.xvel = 0;
			ball.zvel = 0;
			ball.x = hoops[this.side].x;
			ball.z = hoops[this.side].z;
			ball.y = hoops[this.side].y - 20;
			if (this.ID === 1 || this.ID === 2) {
				blueScore += 2;
				turnoverTeam = "red";
			} else {
				redScore += 2;
				turnoverTeam = "blue";
			}
			turnover = true;
		}
		this.dunkHang++;
		if (this.dunkHang < 60) {
			this.yvel = 0;
		}
	} catch (e) {
		print(e.message);
	}
};
var player1 = new Player(534, 0, 210, color(8, 58, 115), 1, false, "arrows", 1, "right");
var player2 = new Player(348, 0, 210, color(8, 58, 115), 2, true, "", 2, "right");
var player3 = new Player(584, 0, 210, color(184, 2, 2), 1, false, "wasd", 3, "left");
var player4 = new Player(770, 0, 210, color(184, 2, 2), 2, true, "", 4, "left");
var players = [player1, player2, player3, player4];
//}
//cpu stuff{
Player.prototype.cpuMove = function() {
	if (this.z > this.wannaBeZ) {
		this.z -= 3;
		this.direction = "up";
	}
	if (this.z < this.wannaBeZ) {
		this.z += 3;
		this.direction = "down";
	}
	if (this.x > this.wannaBeX) {
		this.x -= 3;
		this.direction = "left";
	}
	if (this.x < this.wannaBeX) {
		this.x += 3;
		this.direction = "right";
	}
};
Player.prototype.cpuBallOffense = function(players, hoops, ball) {
	if(this.ID === 1){
		this.teammate = 1;
	}else if(this.ID === 2){
		this.teammate = 0;
	} else if(this.ID === 3){
		this.teammate = 3
	}else{
		this.teammate = 2;
	}
	if (!this.setWannaBe) {
		try {
			if (hoops[this.side].side === "right") {
				this.wannaBeX = hoops[this.side].x - random(260, 40);
			} else {
				this.wannaBeX = hoops[this.side].x + random(260, 40);
			}
		} catch (e) {
			print(e.message);
		}
		this.wannaBeZ = random(50, 400);
		this.setWannaBe = true;
	}
	this.changeZCooldown ++;
	if((this.ID === 3 || this.ID === 4)&&this.x>610&&cpuDifficulty === "hard"&&this.changeZCooldown > 15){
				if(dist(this.x, this.z, players[0].x, players[0].z)<100||dist(this.x, this.z, players[1].x, players[1].z)<100){ //trying to make it a lot harder to easily steal from cpus when they're dribbling it down
					var change = random(-200, 200);
					while(change<50&&change>-50){
						change = random(-200, 200);
					}
					this.wannaBeZ = change;
					this.changeZCooldown = 0;
					this.wannaBeZ = constrain(this.wannaBeZ, 50, 390);
				}
			}
	if (this.x > this.wannaBeX - 5 && this.x < this.wannaBeX + 5 && this.z > this.wannaBeZ - 5 && this.z < this.wannaBeZ + 5 && this.y === 0) {
		if(cpuDifficulty === "hard"){
			var p = players[playerGuardedBy[this.teammate]]; //hard cpu determines how open it and it's teammate is and decides what to do from there
			if(shotclock > 2 && (minutes > 0 && seconds > 2)){
				if(dist(this.x, this.z, players[this.guardedBy].x, players[this.guardedBy].z)>125){
					this.y = -1;
					this.jump(hoops);
					this.cpuReleaseY = random(-85, -95.4);
				} else if(dist(players[this.teammate].x, players[this.teammate].z, p.x, p.z)>200){
					this.pass(ball, players);
				} else{
					this.setWannaBe = false;
				}
			} else{
				this.y = -1;
				this.jump(hoops);
				this.cpuReleaseY = random(-90, -95);
			}
		} else{
			var chance = round(random(0,2)); //easy cpu just does random crap
			if(chance === 0 || chance === 1){
				this.y = -1;
				this.jump(hoops);
				this.cpuReleaseY = random(-70, -90);
			} else{
				this.pass(ball, players);
			}
		}
	}
	if (this.y > this.cpuReleaseY - 8 && this.y < this.cpuReleaseY + 8 && !ball.shot && this.shooting) {
		this.cpuReleaseY = 0;
		this.release(ball, hoops);
	}
	if (!this.shooting) {
		this.cpuMove();
	}
};
Player.prototype.cpuNoBallOffense = function(ball, hoops) {
	try {
		if (this.noBallWait < 100) {
			this.wannaBeX = hoops[this.side].x;
			this.wannaBeZ = hoops[this.side].z + 50;
		} else if (this.noBallWait < 200) {
			this.wannaBeX = hoops[this.side].x;
			this.wannaBeZ = hoops[this.side].z + 300;
		} else if (this.noBallWait < 300) {
			this.wannaBeX = hoops[this.side].x;
			this.wannaBeZ = hoops[this.side].z - 300;
		} else if (this.noBallWait < 400) {
			if (hoops[this.side].side === "right") {
				this.wannaBeX = hoops[this.side].x - 280;
			} else {
				this.wannaBeX = hoops[this.side].x + 280;
			}
			this.wannaBeZ = 210;
		} else {
			this.noBallWait = 0;
		}
	} catch (e) {
		print(e.message);
	}
	this.noBallWait++;
	this.cpuMove();
};
Player.prototype.cpuGetBall = function(ball) {
	if (dist(this.x, this.z, ball.x, ball.z) < 100 && ball.y < -100 && this.y === 0 && round(random(0, 3)) === 0 && !this.shot) {
		if((cpuDifficulty === "hard" && ball.yvel>0.5)||(cpuDifficulty === "easy" && ball.yvel>2)){
			this.jump();
		}
	}
	this.wannaBeX = ball.x;
	this.wannaBeZ = ball.z;
	if((this.ID === 2 || this.ID === 4) && doneTipoff){
		this.cpuMove();  //other cpus don't try to participate in the tipoff
	} else if(this.ID === 1 || this.ID === 3){
		this.cpuMove();
	}
};
Player.prototype.cpuDefense = function(player, ball) {
	if (this.ID === 1) {
		this.guarding = 2;
	} else if (this.ID === 2) {
		this.guarding = 3;
	} else if (this.ID === 3) {
		this.guarding = 0;
	} else {
		this.guarding = 1;
	}
	player[this.guarding].guardedBy = this.ID-1;
	try {
		this.wannaBeZ = playerZ[this.guarding][15];
		if (this.guarding === 0 || this.guarding === 1) {
			if (player[this.guarding].x > 800) {
				this.wannaBeX = playerX[this.guarding][30] + 70;
			} else {
				this.wannaBeX = 870;
				if(cpuDifficulty === "hard"){
					this.wannaBeX = 810;
				}
			}
		} else {
			if (player[this.guarding].x < 300) {
				this.wannaBeX = player[this.guarding].x - 70;
			} else {
				this.wannaBeX = 225;
				if(cpuDifficulty === "hard"){
					this.wannaBeX = 285;
				}
			}
		}
		if (player[this.guarding].dunking) {
			this.wannaBeX = player[this.guarding].x;
		}
		if (player[this.guarding].shooting && this.y === 0 && player[this.guarding].y < -40 && ball.yvel < -3) {
			this.jump();
		}
		if(player[this.guarding].shooting && cpuDifficulty === "hard"){
			this.wannaBeX = player[this.guarding].x;
		}
		if(cpuDifficulty === "hard" && dist(this.x, this.z, player[this.guarding].x, player[this.guarding].z)<30&&this.stealing === 0 && !this.carryingBall && this.passCooldown > 100&&this.y === 0 && ball.carriedBy === this.guarding && player[this.guarding].y === 0 && this.ID !== 2 && this.ID !== 1){
			this.wannaBeX = player[this.guarding].x;
			this.stealing ++;
		} else if(this.cpuDifficulty === "hard"){
			this.stealing = 0;
		}
	} catch (e) {
		print(e.message);
	}
	if ((this.y === 0&&cpuDifficulty==="easy")||cpuDifficulty==="hard") {
		this.cpuMove();
	}
};