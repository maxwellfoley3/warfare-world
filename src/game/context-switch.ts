import { loadLevel } from './helpers/load-level';
import * as _ from 'lodash';

export function contextSwitch() {
  if(window.gameEvents.get('pause').length > 0) {
    window.contexts.pauseScreen.load();
    return;
  }

  //generic event where you can pass in whatever you want and it will happen
  for(var i = 0; i < window.gameEvents.get('call-function').length; i++) {
    window.gameEvents.get('call-function')[i].function(); 
  }


  //same but this will call the function after a delay
  for(var i = 0; i < window.gameEvents.get('wait-for').length; i++) {
    var unit = { type: "conditional", conditional: window.gameEvents.get('wait-for')[i].conditional, function: window.gameEvents.get('wait-for')[i].function };
    window.eventsInWaiting.push(unit);
  }

  if(window.eventsInWaiting) {
    window.eventsInWaiting.forEach((obj, i) => {
      if(obj.type == "counter") {
        obj.counter--;
      }
      var fire;
      if(obj.type == "counter") {
        fire = obj.counter <= 0;
      }
      else if(obj.type == "conditional") {
        fire = obj.conditional()
      }
      if(fire) {
        delete window.eventsInWaiting[i];
        obj.function();
      }
    })
  }

  //same but this will call the function only afer a certain condition is met


  

  if(window.gameEvents.get('player-death').length > 0) {
    window.progressState = _.cloneDeep(window.saveState);
    window.contexts.gameOverScreen.load();
    return;
  }
  if(window.gameEvents.get('victory').length > 0) {
    window.contexts.victoryScreen.load();
    return;
  }
  if(window.gameEvents.get('dialogue').length > 0) {
    window.contexts.dialogue.load(window.gameEvents.get('dialogue')[0].dialogue,
    window.gameEvents.get('dialogue')[0].next);
    return;
  }

  if(window.gameEvents.get('animation').length > 0) {
    window.contexts.animation.load(window.gameEvents.get('animation')[0].animFunction, window.gameEvents.get('animation')[0].next);
    return;
  }

  if(window.gameEvents.get('door-entered').length > 0) {
    const event = window.gameEvents.get('door-entered')[0];
    loadLevel(event.door.destinationIndex, event, window.gameObjects.player());
    return;
  }

  if(window.gameEvents.get('bounds-crossed').length > 0) {
    const event = window.gameEvents.get('bounds-crossed')[0];
    loadLevel(event.bounds.destinationIndex, event, window.gameObjects.player());
    return;
  }


}