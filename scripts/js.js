function drawIt(){
	var x = 250;
	var y = 260;
	var dx = 2;
	var dy = 6;
	var r = 10;
	var width;
	var height;
	var ctx;
	
	var paddley;
	var paddlex;
	var paddleh;
	var paddlew;	
	
	var rightDown = false;
	var leftDown = false;
	
	var canvasMinX;
	var canvasMaxX;
	
	var bricks;
	var nrows;
	var ncols;
	var brickwidth;
	var brickheight;
	var padding;
	var rng;
	
	var st=0;
	let fail = document.getElementById("failScreen");
	let victory = document.getElementById("victoryScreen");
	let mainCanvas = document.getElementById("main");
	let sideCanvas = document.getElementById("side");
	
	var brick1 = new Image();
	brick1.src = "img/b1.jpg";
	
	var brick2 = new Image();
	brick2.src = "img/b2.jpg";
	
	var brick3 = new Image();
	brick3.src = "img/b3.jpg";
	
	
	var minute = document.getElementById("minute"); 
	var sekunde = document.getElementById("sekunde"); 
	var vs = 0; 
	
	var points = 0;
	var tocke = document.getElementById("tocke");
	
	var minuteEnd = document.getElementById("minutes");
	var sekundeEnd = document.getElementById("seconds"); 
	var tockeEnd = document.getElementById("points");
	
	var minuteBest = document.getElementById("bestMinutes"); 
	var sekundeBest = document.getElementById("bestSeconds");
	
	
	var myTimer= setInterval( function(){
		if(start==true){
			++vs;
			sekunde.innerHTML = pad(vs % 60);
			minute.innerHTML = pad(parseInt(vs / 60));
			tocke.innerHTML = points;
			
			sekundeEnd.innerHTML = pad(vs % 60);
			minuteEnd.innerHTML = pad(parseInt(vs / 60));
			tockeEnd.innerHTML = points;
		}
		else{
			sekunde=0;
		}
	}, 1000);
	
	function pad(val){ 
		var valString = val + "";
		if(valString.length < 2){
			return "0" + valString;
		}
		else{
			return valString;
		}
	} 
	
	function init(){
		ctx = $('#main')[0].getContext("2d");
		width = $("#main").width();
		height = $("#main").height();
		return setInterval(draw, 18);
	}
	
	//zogica
	function circle(x, y, r) {		
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fillStyle = "#713721";
		ctx.fill();
	}
	
	//ploscek
	function rect(x,y,w,h) {
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.closePath();
		ctx.fillStyle = "#713721";
		ctx.fill();
	}
	
	function clear() {
		ctx.clearRect(0, 0, height, width);
	}
	
	//parametri za ploscek
	function initPaddle(){
		paddlex = width/2;
		paddley = 450;
		paddleh = 10;
		paddlew = 100;
	}
	
	function draw(){
		secMin();
		
		clear();
		circle(x, y, 15);
		
		//narise plosck
		rect(paddlex, paddley, paddlew, paddleh);
		
		//narise opeke
		for(var i=0; i<nrows; i++){
			for(var j=0; j<ncols; j++){
				if(bricks[i][j] == 1){
					ctx.drawImage(brick1, (j*(brickwidth + padding)) + padding,
					(i*(brickheight + padding)) + padding,
					brickwidth, brickheight);					
				}
				if(bricks[i][j] == 2){
					ctx.drawImage(brick2, (j*(brickwidth + padding)) + padding,
					(i*(brickheight + padding)) + padding,
					brickwidth, brickheight);					
				}
				if(bricks[i][j] == 3){
					ctx.drawImage(brick3, (j*(brickwidth + padding)) + padding,
					(i*(brickheight + padding)) + padding,
					brickwidth, brickheight);					
				}
			}			
		}
		
		rowheight = brickheight + padding;
		colwidth = brickwidth + padding;
		row = Math.floor(y/rowheight);
		col = Math.floor(x/colwidth);
		
		//razbivanje opek
		if(y < nrows*rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1){
				dy = -dy;
				bricks[row][col] = 0;				
				st--;
				points++;
		}
		if(y < nrows*rowheight && row >= 0 && col >= 0 && bricks[row][col] == 2){
				dy = -dy;
				bricks[row][col] = 1;
				points++;
		}
		if(y < nrows*rowheight && row >= 0 && col >= 0 && bricks[row][col] == 3){
				dy = -dy;
				bricks[row][col] = 2;
				points++;
		}
		if(y < nrows*rowheight && row >= 0 && col >= 0 && bricks[row][col] == 4){
				dy = -dy;
				bricks[row][col] = 3;
				points++;
		}
		if(st==0){
			mainCanvas.setAttribute("hidden", "hidden");
			sideCanvas.setAttribute("hidden", "hidden");
			victory.removeAttribute("hidden");
			audio.muted=true;
			mainUI.setAttribute("hidden", "hidden");
			bestTime();
			secMin();
			clearInterval(myTimer);	
		}
			
		
		//premikanje ploscka
		if(rightDown){
			if((paddlex+paddlew) < width){
				paddlex += 5;
			}
			else{
				paddlex = width-paddlew;
			}
		}
		else if(leftDown){
			if(paddlex>0){
				paddlex -=5;
			}
			else{
				paddlex=0;
			}
		}
		
		//odbivanje zogce		
		if(x+dx > width-r || x+dx < r)
			dx = -dx;
		
		if(y+dy < r)
			dy = -dy;
		else if(y+dy > paddley-r){
			start=false;
			if(x > paddlex && x < paddlex+paddlew){
				dx = 8*((x-(paddlex+paddlew/2))/paddlew);
				dy = -dy;
				start=true;
			}
			else if(st==0){
				fail.setAttribute("hidden");
			}
			else{		
				mainCanvas.setAttribute("hidden", "hidden");
				sideCanvas.setAttribute("hidden", "hidden");
				mainUI.setAttribute("hidden", "hidden");
				fail.removeAttribute("hidden");	
				audio.muted=true;
			}
		}

		//za premikanje zogice
		x += dx;
		y += dy;
	}
	
	function secMin(){
		if(diff == 1){
			sekundeBest.innerHTML=bestSekunde;
			minuteBest.innerHTML=bestMinute;
		}
		if(diff == 2){
			sekundeBest.innerHTML=bestSecMed;
			minuteBest.innerHTML=bestMinMed;
		}
		if(diff == 3){
			sekundeBest.innerHTML=bestSecHard;
			minuteBest.innerHTML=bestMinHard;
		}
	}

	
	var bestSekunde = JSON.parse(localStorage.getItem("seconds"));
	var bestMinute = JSON.parse(localStorage.getItem("minutes"));
	var bestSecMed = JSON.parse(localStorage.getItem("secondsMedium"));
	var bestMinMed = JSON.parse(localStorage.getItem("minutesMedium"));
	var bestSecHard = JSON.parse(localStorage.getItem("secondsHard"));
	var bestMinHard = JSON.parse(localStorage.getItem("minutesHard"));
	
	function bestTime(){	
		if(diff == 1){
			if(localStorage.getItem("second")===null || localStorage.getItem("minutes")===null){
				localStorage.setItem("seconds", JSON.stringify(sekundeEnd.innerHTML));
				localStorage.setItem("minutes", JSON.stringify(minuteEnd.innerHTML));
			}
			if(parseInt(minuteEnd.innerHTML) <= parseInt(JSON.parse(localStorage.getItem("minutes")))){
				if(parseInt(sekundeEnd.innerHTML) < parseInt(JSON.parse(localStorage.getItem("seconds")))){
					localStorage.setItem("seconds", JSON.stringify(sekundeEnd.innerHTML));
					localStorage.setItem("minutes", JSON.stringify(minuteEnd.innerHTML));
				}
			}
			bestSekunde = JSON.parse(localStorage.getItem("seconds"));
			bestMinute = JSON.parse(localStorage.getItem("minutes"));
		}		
		if(diff == 2){
			if(localStorage.getItem("secondsMedium")===null || localStorage.getItem("minutesMedium")===null){
				localStorage.setItem("secondsMedium", JSON.stringify(sekundeEnd.innerHTML));
				localStorage.setItem("minutesMedium", JSON.stringify(minuteEnd.innerHTML));
			}
			if(parseInt(minuteEnd.innerHTML) <= parseInt(JSON.parse(localStorage.getItem("minutesMedium")))){
				if(parseInt(sekundeEnd.innerHTML) < parseInt(JSON.parse(localStorage.getItem("secondsMedium")))){
					localStorage.setItem("secondsMedium", JSON.stringify(sekundeEnd.innerHTML));
					localStorage.setItem("minutesMedium", JSON.stringify(minuteEnd.innerHTML));
				}
			}
			bestSecMed = JSON.parse(localStorage.getItem("secondsMedium"));
			bestMinMed = JSON.parse(localStorage.getItem("minutesMedium"));
		}
		if(diff == 3){
			if(localStorage.getItem("secondsHard")===null || localStorage.getItem("minutesHard")===null){
				localStorage.setItem("secondsHard", JSON.stringify(sekundeEnd.innerHTML));
				localStorage.setItem("minutesHard", JSON.stringify(minuteEnd.innerHTML));
			}
			if(parseInt(minuteEnd.innerHTML) <= parseInt(JSON.parse(localStorage.getItem("minutesHard")))){
				if(parseInt(sekundeEnd.innerHTML) < parseInt(JSON.parse(localStorage.getItem("secondsHard")))){
					localStorage.setItem("secondsHard", JSON.stringify(sekundeEnd.innerHTML));
					localStorage.setItem("minutesHard", JSON.stringify(minuteEnd.innerHTML));
				}
			}
			bestSecHard = JSON.parse(localStorage.getItem("secondsHard"));
			bestMinHard = JSON.parse(localStorage.getItem("minutesHard"));
		}
		
	}
	
	/*nastavljanje leve in desne tipke*/
	function onKeyDown(evt){
		if(evt.keyCode == 39)
			rightDown = true;
		else if(evt.keyCode == 37)
			leftDown = true;
	}
	
	function onKeyUp(evt){
		if(evt.keyCode == 39)
			rightDown = false;
		else if(evt.keyCode == 37)
			leftDown = false;
	}
	
	$(document).keydown(onKeyDown);
	$(document).keyup(onKeyUp);
	
	/*inicializacija opek v tabelo*/
	function initBricksEasy(){
		nrows = 2;
		ncols = 8;
		st=16;
		brickwidth = (width/ncols) - 1;
		brickheight = 50;
		padding = 1;
		bricks = new Array(nrows);
		
		for(var i=0; i<nrows; i++){
			bricks[i] = new Array(ncols);
			for(var j=0; j<ncols; j++){
				rng = Math.floor(Math.random()*3+1);
				bricks[i][j] = rng;
			}
		}
	}
	function initBricksMedium(){
		nrows = 3;
		ncols = 8;
		st=24;
		brickwidth = (width/ncols) - 1;
		brickheight = 50;
		padding = 1;
		bricks = new Array(nrows);
		
		for(var i=0; i<nrows; i++){
			bricks[i] = new Array(ncols);
			for(var j=0; j<ncols; j++){
				rng = Math.floor(Math.random()*3+1);
				bricks[i][j] = rng;
			}
		}
	}
	function initBricksHard(){
		nrows = 5;
		ncols = 8;
		st=40;
		brickwidth = (width/ncols) - 1;
		brickheight = 50;
		padding = 1;
		bricks = new Array(nrows);
		
		for(var i=0; i<nrows; i++){
			bricks[i] = new Array(ncols);
			for(var j=0; j<ncols; j++){
				rng = Math.floor(Math.random()*3+1);
				bricks[i][j] = rng;
			}
		}
	}
	
	init();	
	initPaddle();
	
	if(diff == 1)
		initBricksEasy();
	if(diff == 2)
		initBricksMedium();
	if(diff == 3)
		initBricksHard();

}


var diff;
var audio = new Audio('sound/soundEgypt.mp3');
audio.loop=true;

easyb.addEventListener('click', function(){
	diff = 1;
	audio.play();
	let menu = document.getElementById("menu");
	let mainCanvas = document.getElementById("main");
	let sideCanvas = document.getElementById("side");
	let mainUI = document.getElementById("mainUI");
	let hidden = mainCanvas.getAttribute("hidden");

	if(!hidden) {
		mainCanvas.removeAttribute("hidden");
		sideCanvas.removeAttribute("hidden");
		mainUI.removeAttribute("hidden");
		menu.setAttribute("hidden", "hidden");
		drawIt();
	} 
	else {
		mainCanvas.setAttribute("hidden", "hidden");
		sideCanvas.setAttribute("hidden", "hidden");
		mainUI.setAttribute("hidden", "hidden");
	}
})

mediumb.addEventListener('click', function(){
	diff = 2;
	audio.play();
	let menu = document.getElementById("menu");
	let mainCanvas = document.getElementById("main");
	let sideCanvas = document.getElementById("side");
	let mainUI = document.getElementById("mainUI");
	let hidden = mainCanvas.getAttribute("hidden");

	if(!hidden) {
		mainCanvas.removeAttribute("hidden");
		sideCanvas.removeAttribute("hidden");
		mainUI.removeAttribute("hidden");
		menu.setAttribute("hidden", "hidden");
		drawIt();
	} 
	else {
		mainCanvas.setAttribute("hidden", "hidden");
		sideCanvas.setAttribute("hidden", "hidden");
		mainUI.setAttribute("hidden", "hidden");
	}
})

hardb.addEventListener('click', function(){
	diff = 3;
	audio.play();
	let menu = document.getElementById("menu");
	let mainCanvas = document.getElementById("main");
	let sideCanvas = document.getElementById("side");
	let mainUI = document.getElementById("mainUI");
	let hidden = mainCanvas.getAttribute("hidden");

	if(!hidden) {
		mainCanvas.removeAttribute("hidden");
		sideCanvas.removeAttribute("hidden");
		mainUI.removeAttribute("hidden");
		menu.setAttribute("hidden", "hidden");
		drawIt();
	} 
	else {
		mainCanvas.setAttribute("hidden", "hidden");
		sideCanvas.setAttribute("hidden", "hidden");
		mainUI.setAttribute("hidden", "hidden");
	}
})

question.addEventListener('click', function() {
	let menu = document.getElementById("menu");
	let tutorial = document.getElementById("tutorialScreen");
	let hidden = tutorial.getAttribute("hidden");
	
	if(!hidden){
		tutorial.removeAttribute("hidden");
		menu.setAttribute("hidden","hidden");
	}
	else{
		tutorial.setAttribute("hidden", "hidden");
	}
	
});

menu1.addEventListener('click', function() {
	location.reload();
});

menu2.addEventListener('click', function() {
	location.reload();
});

menu3.addEventListener('click', function() {
	location.reload();
});

returnUI.addEventListener('click', function() {
	location.reload();
});

let soundOn = document.getElementById("on");
let soundOff = document.getElementById("off");
soundOff.setAttribute("hidden", "hidden");

soundOn.addEventListener('click', function(){
	audio.muted=true;
	soundOff.removeAttribute("hidden", "hidden");
	soundOn.setAttribute("hidden", "hidden");
});

soundOff.addEventListener('click', function(){
	audio.muted=false;
	soundOn.removeAttribute("hidden", "hidden");
	soundOff.setAttribute("hidden", "hidden");
});





