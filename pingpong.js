var play_arena = document.getElementById('arena');
var rod_1 = document.getElementById('rod1');
var rod_2 = document.getElementById('rod2');
var rods = document.getElementsByClassName('rod');
var move_size = 20;
var play_area_rect = play_arena.getBoundingClientRect();
var ball = document.getElementById('ball');
var ball_move_size = 1;
var startGameInterval ;
var startFlag = false;

class Player{

    constructor(name){
        this.name = name;
        this.score = 0;
    }

    getScore(){
        return this.score;
    }
}

var player1 = new Player('player1');
var player2 = new Player('player2');

var impactDir = {

    fromRight:false,
    fromLeft:false,
    fromTop:false,
    fromBottom:false
};

function initImpactDir(){
    impactDir.fromRight = false;
    impactDir.fromLeft = false;
    impactDir.fromTop = false;
    impactDir.fromBottom = false;
}
ball.style.left = rod_2.offsetLeft+(0.5*rod_2.getBoundingClientRect().width)+'px';

(function initHighScore(){
    localStorage.setItem("high_score",0);
})();
document.addEventListener('keypress',function(){move(event)});
function move(event){
var key_code = event.keyCode;
console.log(key_code);
var left_offset = rods[0].offsetLeft;
var rod_rect = rods[0].getBoundingClientRect();
if(key_code == 97){
for(let i=0 ; i < rods.length ;i++){
if(left_offset >= 0)
rods[i].style.left = left_offset - move_size +"px";
}
}
else if(key_code == 100){
for(let j=0 ; j < rods.length ; j++){
if(left_offset + rod_rect.width+9.593 <= play_area_rect.width)
rods[j].style.left = left_offset + move_size +"px";
}
}
else if(key_code == 13){
startGame();
}
else{
console.log("invalid move");
}
}


function startGame(){
startGameInterval = setInterval(function(){
let impactRes = checkImpact();
let ballLeftOffset = ball.offsetLeft;
let ballTopOffset = ball.offsetTop;
if(!impactRes.impact){
ball.style.left = ballLeftOffset +ball_move_size +"px";
ball.style.top = (ballTopOffset- ball_move_size) +"px";
}
else{
console.log("impact"+impactRes.impactPoint);
clearInterval(startGameInterval);
//ball_move_size =12;
getBallMove(impactRes.impactPoint,impactRes.impactPosition);
}
},5);
}


function checkImpact(){
let ballRect = ball.getBoundingClientRect();
let ballTopPos = ballRect.y;
let ballXPos = ballRect.x;
//console.log(Math.trunc(ballTopPos));
let rod1rect = rod_1.getBoundingClientRect();
let rod1topPos = rod1rect.y+rod1rect.height;
let rod1XPos = rod1rect.x;
let rod1Width = rod1rect.width;
let rod2rect = rod_2.getBoundingClientRect();
let rod2topPos = rod2rect.y;
let rod2XPos = rod2rect.x;
let rod2Width = rod2rect.width;
let verticalWallsCenter = play_area_rect.y + (0.5 * play_area_rect.height);
//console.log(rod1topGap);
if((ballTopPos <= rod1topPos) && (ballXPos >= rod1XPos) && (ballXPos <= (rod1XPos + rod1Width))) {
    player1.score++;
setTimeout(function(){
    initImpactDir();
    impactDir.fromTop = true;}
    ,6);
return {impact:true,
        impactPoint:"rodOne",
    };
}
else if(Math.trunc(ballTopPos)==Math.trunc(play_area_rect.top)){
return {
impact:true,
impactPoint:"topWall"};
}
else if(Math.trunc(ballXPos+ballRect.width) == Math.trunc(play_area_rect.x+play_area_rect.width)){
setTimeout(function(){
    initImpactDir();
    impactDir.fromRight = true;}
    ,6);
return {
    impact:true,
    impactPoint:"rightWall",
    };
}
else if(Math.trunc(ballXPos) == Math.trunc(play_area_rect.x)){
setTimeout(function(){
    initImpactDir();
    impactDir.fromLeft = true;}
    ,6);
return {
    impact:true,
    impactPoint:"leftWall",
    };
}
else if(Math.trunc(ballTopPos+ballRect.height) == Math.trunc(play_area_rect.top+play_area_rect.height)){
return {
impact:true,
impactPoint:"bottomtWall"};
}
else if((Math.trunc(ballTopPos+ballRect.height) == Math.trunc(rod2topPos)) && (ballXPos >= rod2XPos) && (ballXPos <= (rod2XPos + rod2Width))){
player2.score++;
let tempImpact;
if(!startFlag){
startFlag=true;
tempImpact=false;
}
else{
tempImpact=true;
}
setTimeout(function(){
    initImpactDir();
    impactDir.fromBottom = true;}
    ,6);
return {
    impact:tempImpact,
    impactPoint:"rodTwo",
    };
}
else{
    return {impact:false,
    impactPoint:null};
}
}

/*-------------------------------------------------------------------------------------------------------------*/
function getBallMove(impact_point,impact_pos){
if(impact_point == 'topWall'){
    let highScore = compHighScore();
    window.alert('game Over : Player Blue WINS !!!\n High Score :'+highScore);
}

else if(impact_point == 'bottomtWall'){
    let highScore = compHighScore();
    window.alert('game Over : Player Red WINS !!!\n High Score :'+highScore);
}

else if(impact_point == 'rightWall'){
    ball.style.left = ball.offsetLeft - ball_move_size +'px';
   // console.log(impactDir);
    if(impactDir.fromTop){
        // console.log(' not in else');
        moveBall(moveDownLeft);}
    else{
       // console.log('in else');
        moveBall(moveUpLeft);
    }
}

else if(impact_point == 'leftWall'){
    ball.style.left = ball.offsetLeft + ball_move_size +'px';
   // console.log(impactDir);
   // console.log('left ball rebound',ball.style.left);
    if(impactDir.fromTop){
        // console.log(' not in else');
        moveBall(moveDownRight);}
    else{  
      //  console.log('in else');
        moveBall(moveUpRight);
    }
}

else if(impact_point == 'rodOne'){
    ball.style.top = ball.offsetTop + ball_move_size + 'px';
    console.log('right wall check = ',impactDir.fromRight);
    if(impactDir.fromRight){
        moveBall(moveDownLeft);
    }
    else{
        moveBall(moveDownRight);
    }
}
else if(impact_point == 'rodTwo'){

    ball.style.top = ball.offsetTop - ball_move_size + 'px';
    console.log(impactDir);
    if(impactDir.fromRight){
         console.log(' not in else');
        moveBall(moveUpLeft);
    }
    else{
        moveBall(moveUpRight);
    }
}
}

function moveBall(functionName){
let tempInterval = setInterval(function(){
let impactRes = checkImpact();
let ballLeftOffset = ball.offsetLeft;
let ballTopOffset = ball.offsetTop;
if(!impactRes.impact){
    functionName(ballLeftOffset,ballTopOffset);
}

else{
console.log("impact"+impactRes.impactPoint);
clearInterval(tempInterval);
getBallMove(impactRes.impactPoint,impactRes.impactPosition);
}
},5);
}

var moveUpRight = function moveUpRight(ball_left,ball_top){
    ball.style.left = ball_left + ball_move_size + 'px';
    ball.style.top = ball_top - ball_move_size + 'px';
}
var moveUpLeft = function moveUpLeft(ball_left,ball_top){
    ball.style.left = ball_left - ball_move_size + 'px';
    ball.style.top = ball_top - ball_move_size + 'px';
}
var moveDownRight = function moveDownRight(ball_left,ball_top){
    ball.style.left = ball_left + ball_move_size + 'px';
    ball.style.top = ball_top + ball_move_size + 'px';
}
var moveDownLeft = function moveDownLeft(ball_left,ball_top){
    ball.style.left = ball_left - ball_move_size + 'px';
    ball.style.top = ball_top + ball_move_size + 'px';
}
var moveUp = function moveUp(ball_left,ball_top){
    ball.style.top = ball_top - ball_move_size + 'px';
}
var moveDown = function moveDown(ball_left,ball_top){
    ball.style.top = ball_top + ball_move_size + 'px';
}


function compHighScore(){

    let currHigh = parseInt(localStorage.getItem("high_score"));
    let localHigh = 0;

    if(player1.score > player2.score){
        localHigh = player1.score;
    }
    else{
        localHigh = player2.score;
    }
    if(currHigh < localHigh){
        localStorage.setItem('high_score',localHigh);
    }
    return localStorage.getItem('high_score');
}