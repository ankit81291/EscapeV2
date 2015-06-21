var isNS4 = (document.layers) ? true : false,
	isIE4 = (document.all && !document.getElementById) ? true : false,
	isIE5 = (document.all && document.getElementById) ? true : false,
	isNS6 = (!document.all && document.getElementById) ? true : false;

var curX, curY, curX2, curY2, boxX, boxY, moving=0, touch=0;
var gametime=0, started=0, speed;
var starttime, endtime, finaltime=0; //pass finaltime to popup window to ask for initials
var enemyxdir = new Array(1,1,1,1);
var enemyydir = new Array(1,1,1,1);
var moveInterval, highScore,
    localStorage = window.localStorage;


if (isNS4 || isNS6){
  document.captureEvents(Event.MOUSEUP|Event.MOUSEDOWN|Event.MOUSEMOVE);
}

var Application = function() {
};
Application.prototype.start = function() {
	console.log("Started");
	recoverState();
	setHighScore();
	document.onmousedown = start;
	document.onmousemove = checkLocation;
	document.onkeypress = checkKeyPress;
};

function checkKeyPress(e) {
  if(e.keyCode === 32) {
    pause();
  }
}

function startclock() {var today = new Date(); starttime = today.getTime();}
function endclock() {var today = new Date(); endtime = today.getTime();}
function calctime() {var time = (endtime - starttime - 0)/1000;	return time;}

function giveposX(divname) {
	var posLeft;
	if (isNS4) posLeft = document.layers[divname].left;
	else if (isIE4 || isIE5) posLeft = document.all(divname).style.pixelLeft;
	else if (isNS6) posLeft = parseInt(document.getElementById(divname).style.left + "");
	return posLeft;
}

function giveposY(divname) {
	var posTop;
	if (isNS4) posTop = document.layers[divname].top;
	else if (isIE4 || isIE5) posTop = document.all(divname).style.pixelTop;
	else if (isNS6) posTop = parseInt(document.getElementById(divname).style.top + "");
	return posTop;
}

function setposX(divname, xpos) {
	if (isNS4) document.layers[divname].left = xpos;
	else if (isIE4 || isIE5) document.all(divname).style.pixelLeft = xpos;
	else if (isNS6) document.getElementById(divname).style.left = xpos;
}

function setposY(divname, ypos) {
	if (isNS4) document.layers[divname].top = ypos;
	else if (isIE4 || isIE5) document.all(divname).style.pixelTop = ypos;
	else if (isNS6) document.getElementById(divname).style.top = ypos;
}

function givesize(divname, dimension) {
	var divsize = 0;
		if (dimension == 'y') {
			if (isNS4) divsize = document.layers[divname].clip.height;
			else if (isIE4 || isIE5) divsize = document.all(divname).style.pixelHeight;
			else if (isNS6) divsize = parseInt(document.getElementById(divname).style.height + "");
		}
		else if (dimension == 'x') {
			if (isNS4) divsize = document.layers[divname].clip.width;
			else if (isIE4 || isIE5) divsize = document.all(divname).style.pixelWidth;
			else if (isNS6) divsize = parseInt(document.getElementById(divname).style.width + "");
		}

	return divsize;
}

// check to see if 'box' is touching 'enemy1'
function checktouching(num) {

	var enemy = "enemy" + num + "";
	var difX = giveposX('box') - giveposX(enemy) - 0; // -0 converts to integer
	var difY = giveposY('box') - giveposY(enemy) - 0;

	// set touch = 1 if it is touching an enemy
	if (difX > (-1 * givesize('box', 'x')) && difX < givesize(enemy, 'x') && difY > (-1 * givesize('box', 'y')) && difY < givesize(enemy, 'y')) {
		touch = 1;
	}
	else touch = 0;

}

function movenemy(num,step_x,step_y){

	var enemy = "enemy" + num + "";
	var enemyx = givesize(enemy, 'x');
	var enemyy = givesize(enemy, 'y');

	if (giveposX(enemy) >= (450 - enemyx) || giveposX(enemy) <= 0) {
		enemyxdir[num] = -1 * enemyxdir[num];
		}
	if (giveposY(enemy) >= (450 - enemyy) || giveposY(enemy) <= 0) {
		enemyydir[num] = -1 * enemyydir[num];
		}

	var newposx = giveposX(enemy) + (step_x*enemyxdir[num]) + 0;
	var newposy = giveposY(enemy) + (step_y*enemyydir[num]) + 0;

	setposX(enemy, newposx);
	setposY(enemy, newposy);

	checktouching(num + "");
	if (touch == 1) {
		stop(); reset();
		}
}

function movenemies() {

	gametime = gametime + 1;

	if (gametime >= 0 && gametime < 100) speed = 80;
	else if (gametime >= 100 &&  gametime < 200) speed = 60;
	else if (gametime >= 200 &&  gametime < 300) speed = 40;
	else if (gametime >= 300 &&  gametime < 400) speed = 30;
	else if (gametime >= 400 &&  gametime < 500) speed = 20;
	else speed = 10;
	// window.status = "speed:  " + speed + "   gametime: " + gametime
	move();
	moveInterval = setTimeout(movenemies,speed);
}

function move() {
	showSpeedProgress();

	movenemy(0,-10,12);
	movenemy(1,-12,-20);
	movenemy(2,15,-13);
	movenemy(3,17,11);
}

function showSpeedProgress() {
	var actualSpeed = (100 - speed),		//speed denotes the time interval that is lower the speed, faster the enemies
		id = 'progressBar', progressBar;
	if (isNS4) progressBar = document.layers[id];
      else if (isIE4 || isIE5) progressBar = document.all(id);
      else if (isNS6) progressBar = document.getElementById(id);

    progressBar.setAttribute("style","width:" + actualSpeed + "%");
}

function start(e) {

	curX = (isNS4 || isNS6) ? e.pageX : window.event.x ;
    curY = (isNS4 || isNS6) ? e.pageY : window.event.y ;

	curX2 = eval(curX - 40);
	curY2 = eval(curY - 40);

	boxX = eval(curX - 20);
	boxY = eval(curY - 20);

	var boxleft = giveposX('box');
	var boxtop = giveposY('box');

	if (curX > boxleft && curX2 < boxleft && curY > boxtop && curY2 < boxtop) {
		localStorage.setItem("GameStatus", "Started");
		if (started === 0) {
			movenemies();
			startclock();
			started = 1;
		}

		moving = 1;
		setposX('box', boxX);
		setposY('box', boxY);

		if (isNS4 || isNS6){
			document.captureEvents(Event.MOUSEMOVE);
		}
	}
}

function pause() {
	stop();
	localStorage.setItem("GameStatus", "Paused");
	localStorage.setItem("enemyxdir", enemyxdir);
	localStorage.setItem("enemyydir", enemyydir);
	localStorage.setItem("boxX", boxX);
	localStorage.setItem("boxY", boxY);
	localStorage.setItem("speed", speed);
}

function recoverState() {
	if(localStorage.getItem("GameStatus") === "Paused") {
		enemyxdir = localStorage.getItem("enemyxdir");
		enemyydir = localStorage.getItem("enemyydir");
		boxX = localStorage.getItem("boxX");
		boxY = localStorage.getItem("boxY");
		speed = localStorage.getItem("speed");
		move();
		setposX('box', boxX);
		setposY('box', boxY);
	}

}

function stop(e){
    moving=0;
    started=0;
	if (isNS4 || isNS6){
		document.releaseEvents(Event.MOUSEMOVE);
	}
  clearInterval(moveInterval);
}

function reset(e){
	endclock();
	localStorage.setItem("GameStatus", "Stopped");
	moving=0;
	if (isNS4 || isNS6){
			document.releaseEvents(Event.MOUSEMOVE);
		}
	if (finaltime === 0) {
		finaltime = calctime();
		setHighScore(finaltime);
		window.alert('You survived ' + finaltime + ' seconds !');
			document.location.reload();
		}
}

function checkLocation(e){

		curX = (isNS4 || isNS6) ? e.pageX : window.event.x ;
        curY = (isNS4 || isNS6) ? e.pageY : window.event.y ;

		boxX = eval(curX - 20);
		boxY = eval(curY - 20);

	checktouching('1');

	if (moving === 1 && touch === 0){

			setposX('box',boxX);
			setposY('box',boxY);

			if (curY > 69 && curX > 69 && curY < 381 && curX < 381) return false;
			else stop(); reset();
	}

	else if (touch == 1){
	stop(); reset();
	}

}

function setHighScore(score) {
  highScore = localStorage.getItem("highScore");
  if(highScore) {
    if(score && highScore < score) {
      highScore = score;
    }
      
  } else if(score) {
    highScore = score;
  }

  if(highScore) {
    localStorage.setItem("highScore", highScore);
    var scoreDiv, id = "scoreId";
    if (isNS4) scoreDiv = document.layers[id];
      else if (isIE4 || isIE5) scoreDiv = document.all(id);
      else if (isNS6) scoreDiv = document.getElementById(id);

    scoreDiv.innerHTML = highScore + " seconds";
  }
}