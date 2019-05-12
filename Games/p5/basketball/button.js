var Button = function(x, y, width, height, radius, color, text, textSize, textColor, react) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.radius = radius;
	this.color = color;
	this.text = text;
	this.textSize = textSize;
	this.textColor = textColor;
	this.react = react || function() {
		print("MAKE A FUNCTION FOR ME!!!!!");
	};
};
Button.prototype.update = function() {
	if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
		cursor(HAND);
		if (clicked) {
			clicked = false;
			this.react();
		}
	}
};
Button.prototype.draw = function() {
	this.update();
	fill(this.color);
	rect(this.x, this.y, this.width, this.height, this.radius);
	fill(this.textColor);
	textSize(this.textSize);
	text(this.text, this.x + this.width / 2, this.y + this.height / 1.7);
};
var playervsplayer = new Button(0, 99, pixelWidth, 71, 5, color(36, 36, 36), "Player vs Player", 22, color(255, 255, 255), function() {
	scene = "game";
});
var playervscpu = new Button(0, 231, pixelWidth, 71, 5, color(36, 36, 36), "Player vs CPU", 22, color(255, 255, 255), function() {
	player3.cpu = true;
	player3.controls = "";
	scene = "chooseCpu";
});
var resume = new Button(0, 99, pixelWidth, 71, 5, color(36, 36, 36), "Resume", 30, color(255, 255, 255), function() {
	scene = "game";
});
var quit = new Button(0, 230, pixelWidth, 71, 5, color(36, 36, 36), "Quit", 30, color(255, 255, 255), function() {
	location.reload();
});
var easy = new Button(0, 99, pixelWidth, 71, 5, color(36,36,36), "Easy CPU", 30, color(255, 255, 255), function(){
	cpuDifficulty = "easy";
	scene = "game";
});
var hard = new Button(0, 230, pixelWidth, 71, 5, color(36,36,36), "Hard CPU", 30, color(255, 255, 255), function(){
	cpuDifficulty = "hard";
	scene = "game";
});