var Basketball = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.xvel = 0;
	this.yvel = 0;
	this.zvel = 0;
	this.dribbling = false;
	this.carriedBy = "";
	this.facing = 0;
	this.heightLimit = false;
	this.maxSpeed = 15;
	this.speedMag = 0;
	this.shotChance = 0;
	this.shot = false;
	this.shotChance = 0;
	this.dunking = false;
	this.stealCooldown = 0;
	this.pointsWorth = 2;
	this.shotBy = "";
};
Basketball.prototype.run = function(ball, players, hoops) {
	for (var i = 0; i < players.length; i++) {
		if (this.shotBy === "blue" && (i === 0 || i === 1)) {
			i = 2;
		}
		if (this.shotBy === "red" && (i === 2 || i === 3)) {
			break;
		}
		if (!this.dribbling) {
			this.collide(players, i);
		}
	}
	if (this.shot) {
		this.hoopCollide(hoops);
	}
	this.update(hoops, players);
	this.draw();
	this.stealCooldown++;
	if (!turnover && shotclock !== 0 && frameCount % 60 === 0 && this.carriedBy !== "") {
		shotclock--;
	}
	if (shotclock === 0 && this.y > -1 && !turnover) {
		shotclockViolation = true;
		this.shot = false;
		this.dunking = false;
		if (this.carriedBy === 0 || this.carriedBy === 1 || this.shotBy === "blue") {
			turnoverTeam = "red";
		} else {
			turnoverTeam = "blue";
		}
		if (this.carriedBy !== "") {
			players[this.carriedBy].dunking = false;
			this.dribbling = false;
			players[this.carriedBy].carryingBall = false;
			players[this.carriedBy].passCooldown = 0;
		}
		this.z = 210;
		turnoverWait = 0;
		turnover = true;
	}
};
Basketball.prototype.draw = function() {
	fill(0, 0, 0, 150);
	ellipse(this.x, this.z, 22, 18);
	fill(207, 83, 0);
	ellipse(this.x, this.z + this.y, 18, 18);
	stroke(0, 0, 0);
	strokeWeight(1.5);
	line(this.x - 9, this.z + this.y, this.x + 8, this.z + this.y);
	fill(0, 0, 0, 0);
	ellipse(this.x, this.z + this.y - 0, 18, 13);
	noStroke();
};
Basketball.prototype.update = function(hoops, player) {
	this.yvel += 0.1;
	this.y += this.yvel;
	this.z = constrain(this.z, 50, 400);
	this.x = constrain(this.x, 10, 1110);
	if (this.heightLimit) {
		this.y = constrain(this.y, -10, 0);
	} else {
		this.y = constrain(this.y, -500, 0);
	}
	if (this.y > -0.1) {
		this.dunking = false;
		this.shot = false;
		this.shotChance = 0;
		if (this.dribbling) {
			this.yvel = -3;
			dribbleSound.play();
		} else if (turnover) {
			this.yvel = 0;
			if (turnoverTeam === "red" && player[2].passCooldown > 30) {
				this.x = 1110;
			} else if (turnoverTeam === "blue" && player[0].passCooldown > 30) {
				this.x = 20;
			}

		} else if(!tipoff){
			this.yvel *= -0.9;
			dribbleSound.play();
			this.shotBy = "";
		}
	}
	if (this.carriedBy !== "") {
		if (players[this.carriedBy].shooting) {
			this.dribbling = false;
			this.yvel = 0;
			this.y = player[this.carriedBy].y - 130;
			this.x = player[this.carriedBy].x + 5;
			this.z = player[this.carriedBy].z + 5;
		}
		if (this.dribbling) {
			player[this.carriedBy].carryingBall = true;
			this.x = players[this.carriedBy].x - 15;
			this.z = players[this.carriedBy].z + this.facing;
			if (player[this.carriedBy].direction === "up") {
				this.facing = -1;
			} else {
				this.facing = 1;
			}
		}
		this.speedMag = mag(this.xvel, this.zvel);
		if (this.speedMag > this.maxSpeed) {
			var m = this.maxSpeed / this.speedMag;
			this.xvel *= m;
			this.zvel *= m;
		}
	}
	this.x += this.xvel;
	this.z += this.zvel;
};
Basketball.prototype.collide = function(player, i) {
	try {
		if (this.x - 9 > player[i].x - 28 && this.x + 9 < player[i].x + 28 && this.z > player[i].z - 35 && this.z < player[i].z + 35 && abs(this.y) + player[i].y < 30 && player[i].passCooldown > 30 && !player[i].shooting && !this.shot && this.dunking === false) {
			this.dribbling = true;
			this.heightLimit = false;
			this.carriedBy = i;
			this.zvel = 0;
			this.xvel = 0;
			this.yvel = 0;
			this.x = player[i].x - 15;
			if(tipoffWinner === ""){
				doneTipoff = true;
				if(i === 0 || i === 1){
					tipoffWinner = "blue";
				}else{
					tipoffWinner = "red";
				}
			}
			player[i].carryingBall = true;
			if (i === 1 && player[0].controls === "arrows") {
				player[0].controls = "";
				player[0].cpu = true;
				player[1].cpu = false;
				player[1].controls = "arrows";
			}
			if (i === 0 && player[1].controls === "arrows") {
				player[1].controls = "";
				player[1].cpu = true;
				player[0].cpu = false;
				player[0].controls = "arrows";
			}
			if (i === 2 && player[3].controls === "wasd") {
				player[3].controls = "";
				player[3].cpu = true;
				player[2].cpu = false;
				player[2].controls = "wasd";
			}
			if (i === 3 && player[2].controls === "wasd") {
				player[2].controls = "";
				player[2].cpu = true;
				player[3].cpu = false;
				player[3].controls = "wasd";
			}
			player[i].setWannaBe = false;
		}
		if (((this.shot) || (this.dunking && player[i].y < -40 && !player[i].dunking && player[this.carriedBy].shooting)) && player[i].shootCooldown > 30 && this.x - 9 > player[i].x - 28 && this.x + 9 < player[i].x + 28 && this.z > player[i].z - 38 && this.z < player[i].z + 38 && abs(this.y) + player[i].y - 130 < 80) {
			var blockChance = round(random(0, 2));
			if (this.dunking && blockChance === 0) {
				player[i].shootCooldown = 0;
				player[i].yvel = 5;
			}
			if (this.dunking && blockChance === 1) {
				this.dunking = false;
				player[this.carriedBy].dunking = false;
				player[this.carriedBy].shooting = false;
				player[this.carriedBy].carryingBall = false;
				this.carriedBy = "";
				this.shot = false;
				this.x -= 10;
				this.xvel *= random(-0.8, -1.2);
				this.zvel *= random(-0.8, -1.2);
				this.yvel *= random(-0.2, -0.6);
			} else if (!this.dunking && this.shot) {
				if (this.yvel < 1) {
					player[i].shooting = false;
					this.shot = false;
					this.xvel *= random(-0.3, -0.6);
					this.zvel *= random(-0.3, -0.6);
					this.yvel *= random(-2, -2.5);
				} else if(player[i].y < 0){
					player[i].shooting = false;
					this.shot = false;
					turnoverWait = 0;
					turnover = true;
					this.z = 210;
					this.y = 0;
					this.yvel = 0;
					this.xvel = 0;
					this.zvel = 0;
					if (this.shotBy === "red") {
						turnoverTeam = "blue";
						redScore += this.pointsWorth;
						this.x = 20;
					}
					if (this.shotBy === "blue") {
						turnoverTeam = "red";
						blueScore += this.pointsWorth;
						this.x = 1110;
					}
					goaltending = true;
					this.carriedBy = "";
					this.shotBy = "";
					this.shot = false;
				}
			}
		}
	} catch (e) {
		print(e);
	}
};
Basketball.prototype.hoopCollide = function(hoops) {
	if (this.y > -133 && this.z > 205 && this.z < 225 && ((this.x > 1066) || (this.x < 56))) {
		this.shot = false;
		if (random(0, 100) <= this.shotChance) {
			this.xvel = 0;
			this.zvel = 0;
			swishSound.play();
			if (this.shotBy === "blue") {
				blueScore += this.pointsWorth;
				turnoverTeam = "red";
			} else if (this.shotBy === "red") {
				redScore += this.pointsWorth;
				turnoverTeam = "blue";
			}
			this.shotBy = "";
			turnoverWait = 0;
			turnover = true;
			shotclock = 24;
		} else {
			this.yvel = -3;
			this.xvel *= random(-0.2, -0.5);
			this.zvel *= random(-0.2, -0.5);
			shotclock = 24;
			this.shotBy = "";
		}
	}

};
var ball = new Basketball(560, 0, 208);