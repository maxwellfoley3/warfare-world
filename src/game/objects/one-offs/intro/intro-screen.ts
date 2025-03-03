import { GameObject } from '../../game-object'
import { Vector } from '../../../helpers/vector-math/vector';

import { chainEvents } from '../../../helpers/chain-events';
import { moveTo} from '../../../helpers/animations/move-to';
import { wait } from '../../../helpers/animations/wait';

import { Plane } from '../../enemies/plane';
import { Display } from '../../display';
import { Bounds } from '../../portals/bounds';

export class IntroScreen implements GameObject {
  id: string = "IntroScreen";
  name: string = "IntroScreen";
  public p: Vector = new Vector(0,0);
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = {};
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean }= {};

  deaths: number = 0;
  enemy: Plane;
  newPlane: Function;
  lastDeathPosition: Vector;

  fired: boolean = false;

  constructor() {  
    this.enemy = new Plane(new Vector(600, 250));
    this.newPlane = () => window.gameObjects.register(new Plane(new Vector(600, 250)));
    this.lastDeathPosition = new Vector(-1,-1);
  }

  render() {}

  update(events) {

    if(this.counter == 0) {
      window.gameEvents.push(
        chainEvents([
          { type: "dialogue",
            dialogue:[
              { text: "Press arrow keys to move" }
            ]
          },
          { type: "wait", time: 300},
          { type: "animation", animFunction: moveTo("player", 200, 250, 4) },
          { type: "animation", animFunction: wait(90) },
          { type: "call-function", function: 
            () => {
              window.gameObjects.register(this.enemy, "first-enemy");
            }
          },
          { type: "animation", animFunction: moveTo("first-enemy", 500, 250, 3) },
          { type: "dialogue", dialogue: [ { text: "Press Z to fire" } ] },
          { type: "wait-for", conditional: () => {
              return this.deaths == 1 
            }
          },
          { type: "dialogue", dialogue:[
            { speaker: "X", text: "Q, come in Q. Are you there?" },
            { speaker: "Q", text: "X. Hello. What is it?" },
            { speaker: "X", text: "Can you get my location on radar? You're not going to believe this. I was just attacked. Plane looked like it was EYE, which means it's US. I shot him down. I shot down a US pilot over US soil." },
            { speaker: "Q", text: "Hold on. I'm bringing up your location right now." },
            { speaker: "Q", text: "..." },
            { speaker: "Q", text: "Okay. Stay calm. You have five more fighter planes approaching from the east. They appear to be homing in on your location. " },
            { speaker: "X", text: "Jesus. This is bad." },
            { speaker: "Q", text: "I'm going to figure out what's going on. You focus on surviving. " },
            { speaker: "X", text: "Okay." },
          ]},
          { type: "call-function", function: this.newPlane },
          { type: "wait", time: 30},
          { type: "call-function", function: this.newPlane },
          { type: "wait", time: 90},
          { type: "call-function", function: this.newPlane },
          { type: "wait", time: 180},
          { type: "call-function", function: this.newPlane },
          { type: "wait", time: 180},
          { type: "call-function", function: this.newPlane },
          { type: "wait-for", conditional: () => this.deaths == 6 },
          {
            type: "call-function",
            function: () => {
              window.gameObjects.register(new Display(new Vector(this.lastDeathPosition.x,this.lastDeathPosition.y),"assets/parachuting-soldier.png"),"parachutingSoldier");
            }
          },
          { type: "animation", animFunction: moveTo("parachutingSoldier", 300, 600, 4) },
          {
            type:"dialogue",
            dialogue:[
              { speaker: "Q", text: "Did you see that? It looks like one of the attackers escaped by parachute." },
              { speaker: "X", text: "Yeah, I saw him. I should track?" },
              { speaker: "Q", text: "I think so. There's a landing area just below you. Fly down and see if you can locate the downed attacker." }
            ]
          },
          {
            type: "call-function",
            function: () => {
              window.gameObjects.register(new Display(new Vector(250,400),"assets/landing-zone.png"));
              window.gameObjects.register(new Bounds("bottom",6,250,350,250,350));
              window.resumeGame();
            }
          }
        ])
      );
    this.counter++;
    }

    if(events.get('enemy-death').length > 0) {
      this.lastDeathPosition = events.get('enemy-death')[0].position;
      this.deaths++;
    }
  }

}