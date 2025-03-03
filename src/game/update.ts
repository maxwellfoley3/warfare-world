import { EventQueue } from "./helpers/event-queue";
import { Vector } from "./helpers/vector-math/vector";

var sendKeyEvents = () => {
  if(window.keysHeld.space) {
    window.gameEvents.push({
      type: "spacebar-hold"
    });
  }
  if(window.keysHeld.left) {
    window.gameEvents.push({
      type: "left-key"
    });
  }
  if(window.keysHeld.right) {
    window.gameEvents.push({
      type: "right-key"
    });
  }
  if(window.keysHeld.up) {
    window.gameEvents.push({
      type: "up-key"
    });
  }
  if(window.keysHeld.down) {
    window.gameEvents.push({
      type: "down-key"
    });
  }
  if(window.enterThisFrame) {
    window.gameEvents.push({
      type: "enter-key"
    });
    window.enterThisFrame = false;
  }
}

export function update() {  
  //fire events for keys that are currently held down
  sendKeyEvents();
  
  //copy all of the events out of the queue to be processed 
  var oldEvents = new EventQueue(window.gameEvents);
  //clear the event queue to make room for new events
  window.gameEvents.clear();

  //update everything
  let objs = window.gameObjects.getObjects();
  for(var id in objs) {
    if(objs[id].update) {
      //check to make sure the object is within reasonable bounds of the screen
      var obj = objs[id];

      //hack to make old and new method of positioning work
      let p : Vector = obj.p;
      
      if(obj.alwaysUpdate ||
        p.x > window.gameObjects.camera().p.x - 100 &&
        p.x < window.gameObjects.camera().p.x + window.gameObjects.camera().resolution.x + 100 &&
        p.y > window.gameObjects.camera().p.y - 100 &&
        p.y < window.gameObjects.camera().p.y + window.gameObjects.camera().resolution.y + 100) {
          obj.update(oldEvents);
          if(obj.counter) { obj.counter = obj.counter + 1 }
      }
    }
    //if an object wants itself to be deleted, delete it
    if(objs[id].deleteMe) {
      if(objs[id].noRespawn) {
        window.progressState.deathList[objs[id].name + "-" +
        window.gameObjects.level().num + "-" +
        objs[id].startX + "-" + objs[id].startY ] = true;
      }
      delete objs[id];

    }
  };
  
}

