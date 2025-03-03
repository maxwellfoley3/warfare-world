import {  growBoxByNew } from '../../helpers/grow-box-by-new';

import { Bullet } from '../bullets/bullet';
import { Intelligence } from './intelligence';
import { calculateJumpMotion } from '../../helpers/jump';

import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';

export class IntelligentFollower implements GameObject{
  id: string = "";
  name: string = "IntelligentFollower";
  public p: Vector;
  velocity: Vector = new Vector(0, 0);
  width: number = 10;
  height: number = 20;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  renderOrder: number = 10;
  sprites;
  noRespawn:boolean = true;
  actions;
  counter:number = Math.floor(Math.random()*6);
  deleteMe:boolean = false;

  facing:number = 1;
  jumpCounter:number = 0;
  jumpTo: Vector = new Vector(0,0);
  jumpStartX: number = -1;
  ladderClimb: string = "off"; //TODO make enum

  constructor(p) {    
    this.p = p;

    this.width = 10;
    this.height = 20;
    this.tags = {enemy: true};

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {level:0, player:1, playerBullet: 2}
    this.boxes = [ { solid: 2 }, {}, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],0, this);
    growBoxByNew(this.boxes[1],-1,this);
    growBoxByNew(this.boxes[2],1,this);


    //every solid object will need to report its velocity so that the collision detector
    //  can use it to move an object backwards if it goes too far. 
    //the velocity variable is just "how much I moved myself this frame"

    //which way is the character facing. 1 for right -1 for left

    this.jumpCounter = 0;
    //The logic to track where the player is and build paths to him is shared among all intelligent
    //  enemies
    if(!window.gameObjects.intelligence()) {
      window.gameObjects.register(new Intelligence(), "intelligence");
    }
  }

  update(events) {

    var levelEvent;
    var touchingLadder;
    const collisionEvents = events.get('collision-'+this.id);
    collisionEvents.forEach((event)=>{
      //die if hit with a bullet 
      if(event.with.startsWith("Bullet")) {
        window.gameEvents.push({type:"enemy-death"});
        this.deleteMe = true;
      }
      
      if(event.with.id == "level") {
        levelEvent = event;
      }
      if(event.with.startsWith("Ladder")) {
        touchingLadder = true;
      }
    })

    var intel;
    if(window.gameObjects.intelligence && window.gameObjects.intelligence().map) {
      var mapLoc = window.gameObjects.level().pointToBlockCoord(
        this.p.x,
        this.p.y + this.height - 1 //add height to test the enemy's "feet" not its head
      );
      intel = window.gameObjects.intelligence().map[mapLoc.x][mapLoc.y];
    }

    if(intel) {
      //TODO, reorganize to be by action
      if(intel.action == "jump" && this.jumpCounter == 0) {
        this.jumpCounter = 1;
        this.jumpTo = new Vector(
          intel.jumpTo.x * window.gameObjects.level().blockSize,
          intel.jumpTo.y * window.gameObjects.level().blockSize - 10
        );
        this.jumpStartX = this.p.x;
        //for now lets just warp the character to the correct spot, we need later to actually implement
        //  a jump

      }
      else { 
        if(intel.direction == "left") {
          if(this.ladderClimb == "on") { this.ladderClimb = "leaving" }
          else { this.ladderClimb = "off"; }
          this.facing = -1;
        }
        else if(intel.direction == "right") {
          if(this.ladderClimb == "on") { this.ladderClimb = "leaving" }
          else { this.ladderClimb = "off"; }
          
          this.facing = 1;
        }
        else if(intel.direction == "up" && touchingLadder) {
          //climb a ladder
          this.ladderClimb = "on";
        }
      }
    }
    else {

      this.ladderClimb = "off";

      //if map isnt set, just default to platform walking 
      if(levelEvent) {
        if(!levelEvent.wholeBottom || levelEvent.left || levelEvent.right) {
          this.facing = -1 * this.facing;
        }
      }
    }
    this.velocity = new Vector(0, 0);

    if(this.facing == -1) {
      this.velocity.x = -2;
    }
    if(this.facing == 1) {
      this.velocity.x = 2;
    }

    if(this.ladderClimb!="off") {
      this.velocity.y = -3; 
      this.velocity.x = 0;

      //lock the enemy's X to the grid
      this.velocity.x = -1*(this.p.x % window.gameObjects.level().blockSize);
      if(this.ladderClimb == "leaving") {
        //if leaving also lock it to grid so it can properly exit
        this.velocity.y = -2*(this.p.y % window.gameObjects.level().blockSize);

      }


    }
    else {
      if(this.jumpCounter > 0) {
        this.jumpCounter++;
        var jumpHeight = 200;
        var jumpTime = 20;
        if(this.jumpCounter >= jumpTime) { this.jumpCounter = 0 }
        this.velocity.y = calculateJumpMotion(this.jumpCounter,jumpTime,jumpHeight);
        this.velocity.x = (this.jumpTo.x - this.jumpStartX)/jumpTime;
      }
      else {
      //falling speed

        this.velocity.y = 7;
      }
    }
    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
  }

  render(ctx,map) {
    //just draw a square
    ctx.beginPath();
    ctx.fillStyle = "#00aacc";
    ctx.rect(map.x(this.p.x), map.y(this.p.y), map.w(10), map.h(20));
    ctx.fill();

  }

}