import './controls'
import { update } from './game/update';
import { checkCollisions } from './game/check-collisions';
import { render } from './game/render';
import { contextSwitch } from './game/context-switch';
import { SoldierX } from './game/objects/players/soldier-x';

import { GameObjectList } from './game/helpers/game-object-list';
import { EventQueue } from './game/helpers/event-queue';
import * as _ from 'lodash';

import { loadLevel } from './game/helpers/load-level';
window.loadLevel = loadLevel; //putting this here so we can call it from the console

import { HUD } from './game/hud/index';

import "./contexts/title-screen"
import "./contexts/pause-screen"
import "./contexts/victory-screen"
import "./contexts/game-over-screen"
import "./contexts/dialogue"
import "./contexts/animation"

//CORE GAME LOOP
//this function should be called when the game starts from scratch
window.startGame = function() {


  //this will hold all game objects and give them a unique id
  window.gameObjects = new GameObjectList();

  
  
  //Anytime an action happens that affects objects in the world (e.g. enemy dies,
  // enemy is spawned, player is hurt, whatever, it is added to this queue to be
  // processed on the next frame. Game objects are responsible for reacting to 
  // any events that affect them. So for example if there is a bullet that gives
  // a player an extra life upon hitting an enemy, three objects would need to 
  // react to the event. The player would need to take the extra life, the bullet
  // would need to delete itself, and the enemy would need to decrement its health) 
  window.gameEvents = new EventQueue();

  //Use like this
  //window.gameObjects.register(new PlatformWalker(50,50)); 
  // ^^ will have id "PlatformWalker1"
  //window.gameObjects.register(new SoldierX(40, 40), "player");
  // ^^ will have id "player"
  loadLevel( 6/*window.saveState.level*/);

 // window.resumeGame();
}

//this function should be called every time the game resumes from a menu
//  or from being paused. menus should be done just in HTML outside of the game 
//  loop
var ctr = 0;
window.resumeGame = function() {

  //trying to prevent this from being called twice accidentally
  if(window.context == "game") { return; }
  var exitingContext = window.context; //context we just left
  window.context = "game";
  if(exitingContext != "loading") { window.keysHeld = []; } //hack, see https://github.com/maxwellfoley/violence-world/issues/7
  ctr++;
  console.log("start game");

  interface gameFunction { (): any; num: number; }

  var playGame = <gameFunction>function() {
    if(window.context == "game" && playGame.num == ctr) {
      //Enables cool special frame-by-frame logging feature, expained below
      //ctrl+F "Cool new console.log"
      if(console.logNextFrame) {
        console.logThisFrame = true;
        console.logNextFrame = false;
      }

      console.gameLog("FRAME START");
      console.gameLog("----------------------------");
      var frameStartTime = Date.now();

      //UPDATE
      update();
      console.gameLog("update time", Date.now() - frameStartTime);

      //CHECK COLLISIONS 
      var ccStartTime = Date.now();
      checkCollisions();
      console.gameLog("cc time", Date.now() - ccStartTime);

      //RENDER
      var renderStartTime = Date.now();
      render(document);
      console.gameLog("render time", Date.now() - renderStartTime);

      var frameElapsedTime = Date.now() - frameStartTime;
      console.gameLog("total time",frameElapsedTime);

      //CONTEXT SWITCH
      //If earlier in the loop, an event was fired that causes a context switch
      //e.g. menu entered, level changed, player died, etc. 
      //we will process it here at the end of the loop to prevent weird things 
      //happening from switching context halfway through the loop
      contextSwitch();

      console.logThisFrame = false;
      
      //This line will make the game run at 60 fps
      window.requestAnimationFrame(playGame);

    }
  }
  //this line exists to prevent multiple instances of the game loop from running at once
  playGame.num = ctr;
  playGame();
}

window.addEventListener('load', function () {
  //INIT

  //this object will contain the players saved game and we will use it to rewind the state when he dies
  //  eventually pull this from a file in memory obviously

  // var levelNumArgument  = parseInt( process.argv.slice(-1)[0] );
  window.saveState = { 
    //enter a number as the first command line argument to spawn at that level
    //  otherwise spawn at 5, the first level in the game
    // level:  levelNumArgument || levelNumArgument == 0 ? levelNumArgument : 5,
    //keep track of which enemies have died because enemies don't respawn. also
    //  keep track of what items have already been taken and other non-respawning
    //  objects
    deathList: {}
  };

  //the game progress that gets continually updated, when the player saves, saveState will be set to progressState
  window.progressState = _.cloneDeep(window.saveState);

  //create hud. This will contain healthbar and so on. 
  //  (this is kind of like gameObjects but only renders every frame, not updates)
  window.hud = new HUD(document);

  //debug variables to be written below the screen in real time
  window.debugVariables = {
    //add functions to this object, not primitives.
  }

  //Cool new console.log method just for our game. Press the '1' key and you can see
  //  debug messages printed just for the next frame. This lets us view debug messages
  //  without having a constant flood of junk filling up the console. Use this console.gameLog
  //  method to write in this way. 
  console.gameLog = (...messages: any[]) => {
    if(console.logThisFrame) {
      console.log(...messages);
    }
  }
  window.contexts.titleScreen.load();
})
