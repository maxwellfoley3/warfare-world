import { render } from "../game/render";
import { checkCollisions } from "../game/check-collisions";
import { EventQueue } from "../game/helpers/event-queue";
console.log('animation')
//sort of a limited version of the update function that only does certain things we care about 
var animUpdate = () => {
  //copy all of the events out of the queue to be processed 
  var oldEvents = new EventQueue(window.gameEvents);
  //clear the event queue to make room for new events
 window.gameEvents.clear();

  let objs = window.gameObjects.getObjects();
  for(var id in objs) {
    var obj = objs[id];
    if(obj.actions) {
      if (obj.actions.idle) {
        obj.actions.idle();
      }
      if(obj.actions.gravity) {
        obj.actions.gravity(oldEvents);
      }
    }

    if(obj.deleteMe) {
      window.gameObjects.delete(id);
    }
  }
}

window.contexts.animation = {
  load: function(animFunction, next) {
    window.context = "animation";    
    var counter = 0;
    var playAnimation = function() {
      if(animFunction(counter) != "end") {
         animUpdate();
        checkCollisions();
        render (document);
        counter++
        window.requestAnimationFrame(playAnimation)
      }
      else {
        if(next) {
          next()
        }
        else {
          window.resumeGame()
        }    
      }
    }

    playAnimation();

  }
}
