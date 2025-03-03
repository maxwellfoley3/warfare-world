import { GameObject } from '../../game-object'
import { Vector } from '../../../helpers/vector-math/vector';

import { chainEvents } from '../../../helpers/chain-events';
import { moveTo } from '../../../helpers/animations/move-to';
import { SoldierX } from '../../players/soldier-x';
import { PlaneX } from '../../players/plane-x';

import { Display } from '../../display';

export class IntroLandingScreen implements GameObject {
  id: string = "IntroLandingScreen";
  name: string = "IntroLandingScreen";
  public p: Vector = new Vector(0,0);
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = {};
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean }= {};

  fired: boolean = false;
  constructor() {
  }

  render() {}

  update() {
    var landingPosition = {x:290, y:185}; 
    //onsole.log("intro landing screen update");
    if(!this.fired) {
      this.fired = true;
      
      if(window.gameObjects.player().name == "PlaneX") {
        window.gameEvents.push(
          chainEvents([
            { type: "animation", animFunction: moveTo("player", landingPosition.x, landingPosition.y, 4) },
            //add a display object with the plane on it 
            { type: "call-function", function: () => {
              // delete window.gameObjects.player;
              window.gameObjects.register(new SoldierX(new Vector(landingPosition.x + 60, landingPosition.y) ),"player");
              window.gameObjects.register(new Display(new Vector(landingPosition.x, landingPosition.y), "assets/plane-x.png" ),"landedPlane");
              window.saveState.level = 6;
              window.resumeGame();
            }},
            { type: "wait", time: 10},
            { type: "dialogue",
              dialogue:[
                { text: "Press space to jump" }
              ]
            }

           // window.resumeGame();

          ])
        );
      }
      else {
        window.gameObjects.register(new Display(new Vector(landingPosition.x, landingPosition.y), "assets/plane-x.png" ),"landedPlane");
        window.gameEvents.push( 
          chainEvents([ 
            {type: "wait-for", conditional: ()=> {
              //when player is touching the landedplane, after defeating the downed parachuter
              return window.progressState.downedParachuterDefeated &&
              window.gameObjects.player().p.x > window.gameObjects.get("landedPlane").p.x &&
              window.gameObjects.player().p.x < window.gameObjects.get("landedPlane").p.x + 20
               && window.gameObjects.player().p.y > window.gameObjects.get("landedPlane").p.y - 10
               && window.gameObjects.player().p.y < window.gameObjects.get("landedPlane").p.y + 10
            }},
            { type: "call-function", function: ()=> {
              // delete window.gameObjects.player;
            }},
            { type: "animation", animFunction: moveTo("landedPlane", 400, -20, 4) },
            { type: "call-function", function: ()=> {
              //placeholder, eventually this will play an intro credits animation and begin Stage 1 proper
              window.contexts.titleScreen.load()
            }}

          ])
        )
      }

    }
  }
}