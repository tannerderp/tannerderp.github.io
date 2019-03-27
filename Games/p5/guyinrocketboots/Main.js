function draw() {
	textFont(font);
	cursor("default");
	switch(scene){
			case"game":game();break;
			case"dead":dead();break;
			case"init":init();break;
			case"home":home();break;
			case"how":how();break;
	}
	clicked = false;
}
