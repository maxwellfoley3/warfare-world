import { growBoxByNew } from '../../helpers/grow-box-by-new'

import { Gravity } from '../../helpers/motions/enemy/gravity';
import { Injury } from '../../helpers/motions/enemy/injury';
import { calculateJumpMotion } from '../../helpers/jump';

import { EnemyBullet } from '../bullets/enemy-bullet';

import { StateMachine } from "../../helpers/state-machine";
import {  StateTransition } from "../../helpers/state-transition";
import * as imagesFromFolder from '../../helpers/imports/images-from-folder';

import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class PanickedSoldier implements GameObject {
  id: string = "";
  name: string = "PanickedSoldier";
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
  us: UpdaterStore;

  facing:number = 1;  
  hp:number = 8;
  sm:StateMachine;

  constructor(p) {    
    this.p = p;

    this.tags = {enemy: true};

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {level:0, player:1, playerBullet: 2}
    this.boxes = [ { solid: 2 }, {}, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],0, this);
    growBoxByNew(this.boxes[1],-1,this);
    growBoxByNew(this.boxes[2],1,this);




    //which way is the character facing. 1 for right -1 for left
    this.facing = 1;

    this.renderOrder = 10;
    this.counter = 0;

    this.us = new UpdaterStore([
      new Gravity(this),
      new Injury(this,8)
    ]);


    this.sprites = imagesFromFolder.importAllAndFlip("assets/enemies/soldier", ["1", "2", "3", "4"]);

    let smActions : any = {}
    smActions.left = (() => {
      this.facing = -1;
      this.velocity.x = 3 * this.facing;
    }).bind(this);

    smActions.right = (() => {
      this.facing = 1;
      this.velocity.x = 3 * this.facing;
    }).bind(this);

    smActions.notJumping = (() => {
    }).bind(this);

    smActions.jumpCycle = (() => {
    }).bind(this);

    smActions.jump = ((events, counter) => {
      var jumpFactor = calculateJumpMotion(counter, 10, 300 );
      if(jumpFactor < 7) {
        this.velocity.y = jumpFactor;
      }  
    }).bind(this);

    smActions.shootCycle = ((events, counter) => {
      if(counter % 10 == 0) {
        window.gameObjects.register(new EnemyBullet(new Vector(this.p.x, this.p.y + this.width/2), new Vector(this.facing*5, 0), 100)); 
      }
    }).bind(this);

    const smTransitions = [ 
      new StateTransition(
        "left", "right", false, "condition", 
        (() => {
          var player = window.gameObjects.player();
          return this.p.x < player.p.x - 150;
        }).bind(this)),

      new StateTransition(
        "right", "left", false, "condition", 
        (() => {
          var player = window.gameObjects.player();
          return this.p.x > player.p.x + 150;
        }).bind(this)),

      new StateTransition(
        "notJumping", "jumpCycle", false, "compound",
        { time: 30, odds: 90 }),

      new StateTransition( 
        "jumpCycle", "jump", true, "condition",
        (() => {
          return (<Gravity>this.us.get("Gravity")).onFloor;
        }).bind(this)
      ),
      new StateTransition(
        "jump", null, false, "condition", ((events, counter)=>{ 
          if(counter > 10) {
            const collisionEvents = events.get('collision-'+this.id);
            var any = false;
            collisionEvents.forEach((event)=>{
              if(event.with == "level") {
                any = true;
                return;
              }
            })
            return any;
          }
        }).bind(this)),

      new StateTransition(
        "jumpCycle", "notJumping", false, "counter", 150),

      new StateTransition(
        "notJumping", "shootCycle", true, "random", {time: 30, odds: 30 }),
      
      new StateTransition(
        "jump", "shootCycle", true, "condition", (events, counter) => counter == 5),
      
      new StateTransition( 
        "shootCycle", null, false, "counter", 20)
    ]
    this.sm = new StateMachine(smActions, smTransitions, ["left", "notJumping"]);



  }

  update(events) {
    window.debugVariables.dpAtions = () => this.sm.currentActions;

    this.counter++;
    this.velocity = new Vector(0,0);

    this.us.go(events);
    this.sm.go(events);


    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
 
  }

  render(ctx, map) {
    
    var i = (Math.floor(this.counter/2) % 4) + 1;
    var name = this.facing == -1 ? i+"Left" : i+"Right";

    if(this.sprites[name]) {
      ctx.drawImage(this.sprites[name], map.x(this.p.x - 6), map.y(this.p.y - 6), map.w(32), map.h(26));
    }
  }
}