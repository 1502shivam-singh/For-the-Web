for(var i=1;i<=7;i++){      //Loop to put event listeners on all buttons
document.querySelector(".drum"+i).addEventListener("click",function(){
  detectkey(this.innerHTML);    //Detects key press definition below (1)
  addstyle(this.innerHTML);   //Brings pressed animation definition below (2)
});
}

function detectkey(value){    //Function-1
  switch (value) {
    case "w":
      var audio=(new Audio('sounds/crash.mp3'));
      audio.play();
      break;
    case "a":
      var audio=(new Audio('sounds/kick-bass.mp3'));
      audio.play();
      break;
    case "s":
      var audio=(new Audio('sounds/snare.mp3'));
      audio.play();
      break;
    case "d":
      var audio=(new Audio('sounds/tom-1.mp3'));
      audio.play();
      break;
    case "j":
      var audio=(new Audio('sounds/tom-2.mp3'));
      audio.play();
      break;
    case "k":
      var audio=(new Audio('sounds/tom-3.mp3'));
      audio.play();
      break;
    case "l":
      var audio=(new Audio('sounds/tom-4.mp3'));
      audio.play();
      break;
  }
}

function addstyle(keypress){      //Function-2
  document.querySelector("."+keypress).classList.add("pressed");
  setTimeout(function(){document.querySelector("."+keypress).classList.remove("pressed");},50);

}

document.addEventListener("keydown",function(pressed){
  detectkey(pressed.key);
  addstyle(pressed.key);
});
