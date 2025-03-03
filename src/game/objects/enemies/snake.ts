const Perlin = require('pf-perlin')
 
import { StateMachine } from "../../helpers/state-machine";
import {  StateTransition } from "../../helpers/state-transition";

import { growBoxByNew } from '../../helpers/grow-box-by-new';

import { Gravity } from '../../helpers/motions/enemy/gravity';
import { Injury } from '../../helpers/motions/enemy/injury';
import { PlatformFlag } from '../../helpers/motions/enemy/platform-flag';
import { PlatformWalk } from '../../helpers/motions/enemy/platform-walk';

import {  Bullet } from '../bullets/bullet';

import * as  imagesFromFolder from '../../helpers/imports/images-from-folder';

import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';
import { UpdaterStore } from '../../helpers/motions/updater-store';

//head of the snake moves independently from its body
//  all we need from this is collision detection
class SnakeHead implements GameObject{
  id: string = "";
  name: string = "SnakeHead";
  public p: Vector;
  width: number;
  height: number;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  sprites;
  counter: number;
  deleteMe: boolean = false;
  us: UpdaterStore;

  body; //should be type Snake but idk how to do that

  constructor(p:Vector, body) {  
    this.p = p;

    this.body = body;

    this.width = 10;
    this.height = 20;
    this.tags = {enemy: true};

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {player:0, playerBullet: 1}
    this.boxes = [ {}, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],-1,this);
    growBoxByNew(this.boxes[1],1,this);
    this.us = new UpdaterStore([
      new Injury(this, 2)
    ]);

    this.counter = 0;

  }

  update(events) {
    let injury = <Injury>this.us.get("Injury");
    //hack to make body HP share w head hp
    injury.hp = 2;
    this.us.go(events);

    if(injury.hp == 1) {
      let bodyInjury =  <Injury>this.body.us.get("Injury");
      bodyInjury.hp--;
      bodyInjury.immunityCounter = 1;
    }
  }

  render() {}
}

export class Snake implements GameObject {
  id: string = "";
  name: string = "Snake";
  public p: Vector;
  velocity: Vector = new Vector(0, 0);;
  width: number = 10;
  height: number = 20;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  renderOrder: number = 10;
  sprites;
  noRespawn: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false;
  us: UpdaterStore;
  
  //should be moved to like an injury mixin 
  hp: number = 4;
  sm: StateMachine;
  facing: number = -1;

  head: SnakeHead;


  attackVector: Vector = new Vector(0,0);
  attackPosition: Vector = new Vector(0,0);
  lastAttackTime: number;
  onEdge: boolean = false;
  noise;

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

    this.sprites = imagesFromFolder.importAllAndFlip(
      "assets/enemies/snake",
      ["bite1", "bite2", "bite3", "bite4", "bite5", "static"]
    );

    this.us = new UpdaterStore([
      new Injury(this, 4),
      new Gravity(this),
      new PlatformFlag(this),
    ]);
  

    let smActions = {};
    smActions["idle"] = ((events, counter) => {


      var sin = Math.sin(counter/8)
      var speed = 2*sin*Number(sin>0);
      if(this.onEdge) {
        this.facing = -1 * this.facing;
      }

      this.velocity.x = this.facing * speed;
      this.adjustHead();

    }).bind(this);


    smActions["preparing"] = ((events, counter) => {
      var player = window.gameObjects.player();

      if(counter == 1) { 
        this.attackVector = (new Vector(player.p.x - this.head.p.x, player.p.y - this.head.p.y)).unit();
        this.attackPosition = player.p;
      }

      if(player.p.x < this.p.x) { this.facing = -1 } 
      else { this.facing = 1 }

      this.head.p.x -= 8*this.attackVector.x;
      this.head.p.y -= 8*this.attackVector.y;
    }).bind(this);

    smActions["attack"] = (() => {
      this.head.p.x += 20* this.attackVector.x;
      this.head.p.y += 20*this.attackVector.y
    }).bind(this);

    smActions["postAttack"] = (() => {
      this.adjustHead();
    }).bind(this);

    const smTransitions = [
      new StateTransition("idle", "preparing", false, 
      "condition",
        (() => 
        Vector.distance(window.gameObjects.player().p,
          this.p) < 200).bind(this)
      ),

      new StateTransition("preparing", "attack", false, "counter", 10),

      new StateTransition("attack", "postAttack", false, "counter", 10),

      new StateTransition("postAttack", "idle", false, "compound", {time: 10, odds: 15}),


    ]
    this.sm = new StateMachine(smActions, smTransitions, ["idle"])


    this.head = new SnakeHead(new Vector(this.p.x, this.p.y-10), this);
    window.gameObjects.register(this.head);  
    

    this.counter = Math.floor(Math.random()*100);
    this.lastAttackTime = this.counter;

    //noise generator  
    this.noise = new Perlin({ dimensions: 1 })
    

  }

  //used to move the head around when not attacking
  adjustHead( ) {
    this.head.p.x = this.p.x - 20 + 14*(Math.sin(this.counter*.005443));
    this.head.p.y = this.p.y - 37 + 34*(this.noise.get([this.counter*.005234]));
  }

  update(events) {

    this.velocity = new Vector(0,0);

    if(this.hp == 0) {
      this.head.deleteMe = true;
    }

    this.us.go(events);
    this.sm.go(events);
    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
 
  }

  render(ctx, map, parallax, draw) {
    //draw body
    ctx.beginPath();
    ctx.fillStyle = "#fff";
 //   ctx.rect(map.x(this.p.x), map.y(this.p.y), map.w(10), map.h(20));
    ctx.fill();

    //draw head
    if(this.head) {
      var spriteName;
      var dir = this.facing == 1 ? "Right" : "Left";
      if(this.sm.inState("attack")) {
        var num = Math.floor(this.sm.counters["attack"] / 2) + 1;
        if(num > 5) num = 5;
        spriteName = "bite"+num+dir;
      }
      else {
        spriteName = "static"+dir;
      }
      draw.image({x:this.head.p.x, y:this.head.p.y}, this.sprites[spriteName], {x: this.facing == 1  ? 50 : 0, y: 0})
      //draw path btw body & head
      //should be a series of segments arranged in an s curve shape when retracted 
      // and line when extended
      //lets say 15 segments
      var start = new Vector( this.p.x, this.p.y + 20)
      var end = new Vector( this.head.p.x, this.head.p.y + 10);

      var dist = Vector.distance(start, end);
      var offset = dist/10;
      var toHead = new Vector( end.x - start.x, end.y - start.y );
      toHead = toHead.unit();
      for(var i = 0; i < 10; i++) {
        var pos = new Vector( start.x + (toHead.x * offset * i), start.y+(toHead.y * offset * i) );
        ctx.beginPath();
        ctx.fillStyle = "#00aa00";
        var multiplier = 15 - (dist/5);//straighten neck out as it gets longer
        var horizontalOffset = multiplier*Math.sin((offset*i*5)/dist) + 5; //should follow a sine curve
        ctx.rect(map.x(pos.x-horizontalOffset), map.y(pos.y), map.w(10), map.h(4));
        ctx.fill();
      }
      /*
      ctx.beginPath();
      ctx.strokeStyle = "#ff0000";
      ctx.moveTo(map.x(this.x), map.y(this.y));
      ctx.lineTo(map.x(this.head.x), map.y(this.head.y + 10));
      ctx.stroke();*/
    }


  }

}