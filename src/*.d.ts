import { GameObjectList } from './game/helpers/game-object-list';
import { EventQueue } from './game/helpers/event-queue';
declare global {
  interface Window { 
    startGame: Function;
    resumeGame: Function;
    loadLevel: Function; 
    gameObjects: GameObjectList; 
    gameEvents: EventQueue; 
    keysHeld: any;
    enterThisFrame:boolean; //this def should be gone

    context:string;
    contexts:any;
    saveState:any;
    progressState:any;
    debugVariables:any;
    hud:any;

    eventsInWaiting:any;
  }

  interface Console { 
    gameLog: Function ; 
    logThisFrame: Boolean;
    logNextFrame: Boolean;
  }
}