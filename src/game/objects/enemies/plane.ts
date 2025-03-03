import { EnemyBullet } from '../bullets/enemy-bullet';

import { StateMachine } from "../../helpers/state-machine";
import {  StateTransition } from "../../helpers/state-transition";

import { Injury } from '../../helpers/motions/enemy/injury';

import { growBoxByNew } from '../../helpers/grow-box-by-new'


var totalPlanes = 0;
import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class Plane implements GameObject {
  id: string = "";
  name: string = "Plane";
  public p: Vector;
  velocity: Vector = new Vector(0, 0);
  width: number = 20;
  height: number = 20;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  renderOrder: number = 10;
  sprites;
  noRespawn:boolean = true;
  counter:number = Math.floor(Math.random()*6);
  deleteMe:boolean = false;
  us:UpdaterStore;

  sm:StateMachine;
  mode:string; //TODO make enum
  number:number;

  constructor(p) {    
    this.p = p;
    this.width = 20;
    this.height = 20;
    this.tags = {enemy: true};

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {all:0};
    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {level:0, playerBullet: 1}
    this.boxes = [ { solid: 2 }, {}, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],0, this);
    growBoxByNew(this.boxes[1],5,this);

    this.mode = "left";
    this.renderOrder = 10;

    this.us = new UpdaterStore([
      new Injury(this, 4)
    ]);

    totalPlanes ++;
    //what number plane entering the screen is this
    this.number = totalPlanes;
    this.counter = Math.floor(Math.random()*500);

    this.sprites = [ document.createElement("img") ];
    this.sprites[0].src = "assets/enemy-plane.png";
    
    let smActions = {};
    smActions["left"] =  (()=> {
      this.velocity.x = -3
    }).bind(this); 

    smActions["up"] = (() => {
      this.velocity.y = -2;
      this.velocity.x = Math.sin(this.counter/30);
    }).bind(this);

    smActions["down"] = (() => {
      this.velocity.y = 2;
      this.velocity.x = Math.sin(this.counter/30);
    }).bind(this);

    smActions["shootCycle"] = ((events, counter) => {   
      if(counter % 10 == 0) {
        var vec = (new Vector(
          window.gameObjects.player().p.x - this.p.x, 
          window.gameObjects.player().p.y - this.p.y ) ).unit(); 
        window.gameObjects.register(new EnemyBullet(new Vector(this.p.x, this.p.y + this.width/2), new Vector(vec.x*5, vec.y*5), 1000)); 
      }
    }).bind(this);

    let smTransitions = [
      //go left until a certain x value determined by how many other planes are on the screen, then go up 
      new StateTransition(
        "left", "up", false, "condition", (() => {
          return this.p.x < 500 - 30*this.number
        }).bind(this)
      ),
      new StateTransition(
        "up", "down", false, "condition", (() => this.p.y < 10).bind(this)
      ),
      new StateTransition(
        "down", "up", false, "condition", (() => this.p.y > 440).bind(this)
      ),
      //start shooting randomly
      new StateTransition(
        "up", "shootCycle", true, "random", 120
      ), 
      new StateTransition(
        "down", "shootCycle", true, "random", 90
      ),
      //end shooting after 30
      new StateTransition(
        "shootCycle", null, false, "counter", 30
      )
    ]
    this.sm = new StateMachine(smActions, smTransitions, ["left"]);

  }

  update(events) {
    this.counter++;
    this.velocity = new Vector(0,0);

    //run state machine 

    this.us.go(events);
    this.sm.go(events);
    
    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
 
  }

  render(ctx, map, parallax, draw) {
    //just draw a square
    //just draw a square
    draw.image(this.p, this.sprites[0], {x: 0, y: 0});


  }

}