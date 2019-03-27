var Asteroid = function(x, y){
	this.x = x;
	this.y = y;
};
Asteroid.prototype.run = function(){
	this.display();
	this.collide();
}
Asteroid.prototype.collide = function(){
	if(dist(this.x, this.y, player.x, player.y)<180){
		 scene = "dead";
	}
};
Asteroid.prototype.display = function(){
	push();
	translate(this.x, this.y);
	scale(0.35, 0.35);
	image(asteroidImage, 0, 0);
	pop();
};
var asteroids = [];
function spawnAsteroids(){
	asteroids = [];
	asteroids.push(new Asteroid(500, -24000));
	for(var i = -24500; i>-35000; i-=random(600, 850)){
			asteroids.push(new Asteroid(random(25, width-25), i));
	}
};