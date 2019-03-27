var Fuel = function(x, y){
	this.x = x;
	this.y = y;
	this.collected = false;
};
Fuel.prototype.run = function(){
	this.display();
	this.collide();
};
Fuel.prototype.collide = function(){
	if(dist(this.x, this.y, player.x, player.y)<108){
		player.fuel = 100;
		this.collected = true;
	}
};
Fuel.prototype.display = function(){
	push();
	translate(this.x, this.y);
	scale(0.15, 0.15);
	imageMode(CENTER);
	image(fuelImage, 0, 0);
	pop();
};
var fuels = [];
function spawnFuels(){
	fuels = [];
	fuels.push(new Fuel(500, -1000));
	var distanceToFuel = 800;
	for(var i = -1800; i>-80000; i -= distanceToFuel){
		var x = random(25, width-25);
		while(x>width/2-100&&x<width/2+100){
			x = random(25, width-25);
		}
		fuels.push(new Fuel(x, i));
		if(player.y>-18000){
			distanceToFuel += 125;
		} else{
			distanceToFuel = 1000;
		}
	}
};
