var player = {
	x: width/2,
	y: height-100,
	speed: 0,
	r: 0,
	rvel: 0,
	yvel: 0,
	xvel: 0,
	grounded: true,
	fuel: 100,
	run: function(){
		this.draw();
		this.update();
		this.control();
	},
	control: function(){
		if(!this.grounded){
			if(keys.d||keys[RIGHT_ARROW]){
				this.rvel += 0.005;
			}
			if(keys.a||keys[LEFT_ARROW]){
				this.rvel -= 0.005;
			}
		}
		if(keys[32]&&this.fuel>0){
			if(this.fuel === 100&&this.yvel>0){
				this.yvel = 0; //if you fall onto fuel, you don't waste the fuel just trying to stop falling
			}
			this.speed += 0.1;
			this.fuel -= 0.3;
		}
	},
	update: function(){
		this.grounded = false;
		this.yvel = constrain(this.yvel, -19, 37);
		if(this.y>height-99){
			this.grounded = true;
			this.yvel = constrain(this.yvel, -100, 0);
			if(this.fuel<0.1){
				scene = "dead";
			}
		}
		this.r += this.rvel;
		this.rvel *= 0.9;
		this.speed *= 0.95;
		this.speed = constrain(this.speed, 0, 1.2);
		this.yvel -= this.speed*cos(this.r);
		this.xvel += this.speed*sin(this.r);
		this.x += this.xvel;
		this.y += this.yvel;
		this.yvel += 1;
		this.xvel *= 0.95;
		this.x = constrain(this.x, -10, width+10);
		if(this.fuel>0){
			cameraY = this.y;
		}
		if(this.y>cameraY+height/2){
			scene = "dead";
		}
		altitude = round(-this.y/15+35);
	},
	displayFuel: function(){
		textFont("sans-serif");
		push();
		fill(lerpColor(color(0, 255, 0), color(255, 0, 0), map(this.fuel, 0, 100, 100, 0)/100));
		rect(75, 20, this.fuel, 25);
		strokeWeight(7);
		stroke(0, 0, 0);
		fill(0, 0, 0, 0);
		rect(75, 20, 100, 25);
		fill(0, 0, 0);
		textSize(30);
		noStroke();
		textAlign(LEFT);
		text("Fuel: ", 0, 40);
		pop();
	},
	draw: function(){
		push();
		rectMode(CENTER);
		translate(this.x, this.y);
		rotate(this.r);
		imageMode(CENTER);
		scale(0.225, 0.225);
		image(playerImage, 0, 0);
		if(keys[32]&&this.fuel>0){
			fill(234, 61, 35);
			rect(40, 350, 40, 160);
			rect(-40, 350, 40, 160);
		}
		pop();
	},
	init: function(){
		this.x = width/2;
		this.y = height-100;
		this.fuel = 100;
		this.r = 0;
		this.xvel = 0;
		this.yvel = 0;
		this.rvel = 0;
		this.speed = 0;
		//this.y = -23000
	},
}
