var Hoop = function(x, y, z, side) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.side = side;
};
Hoop.prototype.draw = function() {
	push();
	translate(this.x, this.z);
	stroke(224, 224, 224);
	strokeWeight(5);
	fill(247, 232, 232);
	if (this.side === "left") {
		scale(-1, 1);
	}
	push();
	translate(20, -134);
	quad(0, -40, 10, -35, 10, 25, 0, 15);
	pop();
	noStroke();
	fill(0, 0, 0, 150);
	ellipse(0, 0, 20, 15);
	strokeWeight(1);
	stroke(255); //credit to paradox programming for making the net
	for (var i = 0; i < 360; i += 20) {
		var x = sin(i);
		var z = cos(i);
		var x2 = sin(i + 34);
		var z2 = cos(i + 34);
		var netHeight = 25;
		var d = 3;
		line(x * 12.5, z * 17 / 2 + this.y, x2 * 25 / d, z2 * 17 / d + netHeight + this.y);
		line(x * 12.5, -z * 17 / 2 + this.y, x2 * 25 / d, -z2 * 17 / d + netHeight + this.y);
	}
	stroke(196, 19, 19);
	strokeWeight(3);
	fill(0, 0, 0, 0);
	ellipse(0, this.y, 25, 17);
	line(12.5, this.y, 23, this.y);
	noStroke();
	pop();
};
Hoop.prototype.run = function() {
	this.draw();
};
var rightHoop = new Hoop(1076, -133, 212, "right");
var leftHoop = new Hoop(49, -133, 212, "left");
var menuHoop = new Hoop(371, -133, 288, "right");
var hoops = [rightHoop, leftHoop];