window.keysHeld = {};

//This page is poorly organized and inconsistent, needs to be rethought

document.addEventListener('keydown', function(event) {
  //do not track input if game is paused
  if(window.context == "game") {
    switch (event.keyCode) {
      case 13: //return slash enter
        //some weird timing issues with this not entering the loop
        window.enterThisFrame = true;  

        break; 
      case 32: //space 
        //send an event both when its initially pressed, and on every frame when its held
        window.gameEvents.push({
          type: "spacebar-down"
        });
        window.keysHeld.space = true;
        break;
      //for the arrow keys, we want to fire an event on every frame where they are held down
      // we can't do this within javascript itself
      // therefore we will change a state variable and create new events inside the gameloop
      case 37: //left key
        window.keysHeld.left = true;
        break;
      case 38: //up key
        window.keysHeld.up = true;
        break;
      case 39: //right key
        window.keysHeld.right = true;
        break;
      case 40: //down key
        window.keysHeld.down = true;
        break;
      case 49: //1 key 
        //when the 1 key is pressed, we will get to see console.gameLog() messages on the next
        //  frame
        console.logNextFrame = true;
        break;
      case 90: //z key 
        window.gameEvents.push({
          type: "z-key-down"
        });
        window.keysHeld.z = true;
        break;
      default: 
        //do nothing for now
        break;
    }
  }
});

document.addEventListener('keyup', function(event) {
  if(window.context == "game") {
    switch (event.keyCode) {
      case 32: //space key
        window.keysHeld.space = false;
        break;
      case 37: //left key
        window.keysHeld.left = false;
        break;
      case 38: //up key
        window.keysHeld.up = false;
        break;
      case 39: //right key
        window.keysHeld.right = false;
        break;
      case 40: //down key
        window.keysHeld.down = false;
        break;
      case 90: //z key 
        window.keysHeld.z = false;
        break;
      default: 
        //do nothing for now
        break;
    }
  }
});
