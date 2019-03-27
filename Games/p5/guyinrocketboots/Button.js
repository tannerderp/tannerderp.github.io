function Button(x, y, width, height, radius, color, txt, react, txtY){
	push();
	fill(color);
	rect(x,y,width,height,radius);
	fill(0, 0, 0);
	textFont("sans-serif");
	textAlign(CENTER);
	textSize(40);
	text(txt, x+width/2, txtY);
	pop();
	if(mouseX>x&&mouseX<x+width&&mouseY>y&&mouseY<y+height){
		cursor(HAND);
		if(clicked){
			react();
		}
	}
};