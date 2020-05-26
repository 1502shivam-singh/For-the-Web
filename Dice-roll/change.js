
var dice1 = Math.floor((Math.random()*6)+1);
var dice2 = Math.floor((Math.random()*6)+1);

var addr1 = "images/dice"+dice1+".png";
var addr2 = "images/dice"+dice2+".png";

document.querySelector(".img1").setAttribute("src",addr1);
document.querySelector(".img2").setAttribute("src",addr2);

if(dice1>dice2){
  document.querySelector(".container h1").textContent=("🚩 Player-1 Wins!!");
}
else if(dice1===dice2){
  document.querySelector(".container h1").textContent=("🎲 Its a tie!!");
}
else{
  document.querySelector(".container h1").textContent=("🚩 Player-2 Wins!!");
}
