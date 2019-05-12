//beware of inefficient code, this is an old project of mine updated, 
function setup() {
    createCanvas(400, 500);
	noStroke();
    rectMode(CENTER);
    textAlign(CENTER);
	textFont("cursive");
	angleMode(DEGREES);
	let canvas = createCanvas(400, 500);
	canvas.parent("game");
	canvas.position(windowWidth/2+200, windowHeight/2+250);
}
//setup{
var currentScene = 1;
var divingPhase = 1;
var divingheights = [17, 125, 237];
var currentDive = 0;
var wait = 0;
var score = 0;
var highscore = 0;
if(Number(localStorage["highscore"]) > 0){
    highscore = localStorage["highscore"];
}
var failed = false;
//}
//mouse stuff {
var clicked = false;
var releaseClick = false;
mouseReleased = function(){
	releaseClick = true;
	clicked = false;
}
mousePressed = function() {
    clicked = true;
};
//}
//key stuff {
var keys = {};
var tuckingkey = {};
keyPressed = function(){
    tuckingkey[keyCode] = true;
    tuckingkey[key] = true;
};
keyReleased = function() {
    keys[keyCode] = true;
    keys[key] = true;
    tuckingkey[keyCode] = false;
    tuckingkey[key] = false;
};
//}
//objects {
//Player object {
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.rotation = 10;
    this.rotationvel = 0;
    this.displayRotate = 0;
    this.xvel = 0;
    this.yvel = 0;
    this.tucking = false;
    this.evertucked = false;
};
Player.prototype.draw = function() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(240, 229, 156);
    ellipse(0, -20, 20, 20);
    rect(0, 9, 20, 40);
    fill(240, 229, 156);
    if(!this.tucking){
    rect(-5, 53, 9, 38);
    rect(5, 53, 9, 38);
    }else{
    rect(-5, 21, 9, 38);
    rect(5, 21, 9, 38);
    }
    fill(219, 0, 0);
    rect(0, 29, 20, 10);
    pop();
};
Player.prototype.phases = function(phase) {
    if(phase === 2){
        this.displayRotate = sin(frameCount*4)*10+8;
        this.rotation = this.displayRotate;

    } if(phase===3){
        this.rotationvel = (this.rotation-2)/2; //Thanks to paradox programming for help with physics.
        this.xvel = sin(this.rotation)*12;
        this.yvel = -cos(this.rotation)*5;
        divingPhase++;
    } if(phase===4){
        this.rotation+=this.rotationvel;
        if(this.tucking){
            this.rotationvel  *= 1.01;
        }else{
        this.rotationvel*=0.99;
        }
        this.xvel*=0.99;
        this.yvel*=0.99;
        this.yvel+=0.2;
        this.x+=this.xvel;
        this.y+=this.yvel;
        if(tuckingkey[32]||clicked){
            this.tucking = true;
            this.evertucked = true;
            score += 1;
        }else{
            this.tucking = false;
        }

    }
};
//237, 125, 17
var playerY = divingheights[currentDive];
var player = new Player(68, playerY, 0,10);
//}
//button object {
var Button = function(x, y, width, height, text, scenechange) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.scenechange = scenechange;
};
Button.prototype.draw = function() {
    fill(0, 0, 0);
    strokeWeight(5);
    rect(this.x, this.y, this.width, this.height);
    fill(224, 220, 224);
    text(this.text, this.x, this.y+5);
};
Button.prototype.react = function() {
    if(mouseX > this.x - this.width/2 && mouseX<this.x+this.width/2 && mouseY>this.y-this.height/2 && mouseY< this.y+this.height/2){
        cursor(HAND);
        if(clicked) {
            currentScene = this.scenechange;
            divingPhase = 1;
            score = 0;
        }

    }
};
var playbutton = new Button(200, 300, 159, 76, "play", 2);
var controlsButton = new Button(200, 400, 159, 76, "how", 4);
var backButton = new Button(25, 450, 50, 100, "Back", 1)
//}
//}
//scenes {
var scene1 = function() {
    background(0, 225, 255);
    fill(0, 0, 255);
    rect(200, 459, 446, 157);
    fill(0, 0, 0);
    textSize(40);
    text("Flip Diving", width/2, 92);
    textSize(20);
    text("Enhanced Edition", width/2, 120);
    playbutton.draw();
    playbutton.react();
    controlsButton.draw();
    controlsButton.react();

};
var waterHeight = 406;
var scene2 = function() {
    background(0, 225, 255);
    fill(0, 0, 255);
    rect(200, 459, 446, 157);
    fill(237, 237, 237);
    rect(18, height/2.5, 44, 400);
    for(var i = 308; i>0; i -=110){
        rect(52, i, 69, 12);
    }
    if(player.y<370){
    player.draw();
    } else{
        currentScene = 3;
    }
    player.phases(divingPhase);
    //diving phases
    if((keys[32]||releaseClick) && divingPhase === 1){
        divingPhase = 2;
    }else if((keys[32]||releaseClick) && divingPhase === 2){
        divingPhase = 3;
    }
    player.rotation = player.rotation%360;
};
var failText = function(why, size) {
    fill(255, 0, 0);
    textSize(81);
    text("Fail!", width/2, 150);
    textSize(size);
    text("You "+why, width/2, 234);
    failed = true;
    if(wait<100){wait+=1;}else{
            currentScene = 1;
            currentDive += 1;
            player.rotation = 10;
            player.rotationvel = 0;
            player.displayRotate = 0;
            player.xvel = 0;
            player.yvel = 0;
            player.tucking = false;
            player.evertucked = false;
            player.x = 68;
            currentDive = 0;
            player.y = divingheights[currentDive];
            divingPhase = 1;
            wait = 0;
            failed = false;
    }

};
var scene3 = function(){
    this.tucking = false;
    background(0, 225, 255);
    fill(0, 0, 255);
    rect(200, 459, 446, 157);
    fill(237, 237, 237);
    rect(18, height/2.5, 44, 400);
    for(var i = 308; i>0; i -=110){
        rect(52, i, 69, 12);
    }
    if(player.x<150){
      failText("hit the boards", 45);
    }else if(player.rotation>83&&player.rotation<106){
        failText("bellyflopped", 50);
        player.draw();
    }else if(player.rotation<288&&player.rotation>255){
        failText("backflopped", 50);
        player.draw();
    } else if(player.tucking){
        failText("were still tucking", 35);
    } else if(!player.evertucked){
        failText("never tucked", 50);
    } else{
        if(wait<100){
        fill(0, 207, 31);
        textSize(81);
        text("Success!!!", width/2, 150);
        wait += 1;


        } else{
            currentScene = 2;
            currentDive += 1;
            player.rotation = 10;
            player.rotationvel = 0;
            player.displayRotate = 0;
            player.xvel = 0;
            player.yvel = 0;
            player.tucking = false;
            player.evertucked = false;
            player.x = 68;
            if(currentDive===3){
                currentDive = 0;
            }
            player.y = divingheights[currentDive];
            divingPhase = 1;
            wait = 0;
            failed = false;
            }




    }
    /* debugging stuff
    player.draw();
    player.rotation= 298;
    */

};
function how(){
    background(0, 225, 255);
    fill(0, 0, 255);
    rect(200, 459, 446, 157);
    fill(0, 0, 0);
    textSize(40);
    text("How to Play", width/2, 92);
    textSize(15);
    text("At the beginning of your dive, click or press space to start rotating back and forth. Click or press space again to launch off the board from the angle you were at. Hold space or hold click while in the air to tuck. Tucking spins you faster so you can avoid potential bellyflops or backflops. You need to tuck at least once in your dive, but you can't hit the water while tucking. Your score goes up as you tuck, so trying to go for the highscore means taking risks.", width/2, height/1.25, width, height);
    backButton.draw();
    backButton.react();
}
//}
function draw() {
 cursor("default");
    if(currentScene === 1){
        scene1();
    } else if(currentScene === 2) {
    scene2();
    textSize(28);
    fill(0, 0, 0);
    text("score: "+score, 331, 25);
    } else if(currentScene ===3){
        scene3();
        textSize(28);
        fill(0, 0, 0);
        text("score: "+score, 331, 25);
    } else if(currentScene === 4){
        how();
    }
    if(highscore>0){
    textSize(28);
    fill(0, 0, 0);
    text("highscore: "+highscore, 305, 54);
    }
    keys = {};
	releaseClick = false;
    if(score>highscore){
        console.log(true)
        highscore = score;
        localStorage["highscore"] = highscore;
    }

}
