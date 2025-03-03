
import { growBoxByNew  } from '../../helpers/grow-box-by-new';


import { Injury } from '../../helpers/motions/player/injury';
import { Ladder  } from '../../helpers/motions/player/ladder';
import { Platformer } from '../../helpers/motions/player/platformer';

import { Shoot } from '../../helpers/motions/player/shoot';
import { Walk } from '../../helpers/motions/player/walk';

import * as imagesFromFolder from '../../helpers/imports/images-from-folder';
import { Vector } from '../../helpers/vector-math/vector';
import { GameObject } from '../game-object';

import { Gravity } from '../../helpers/motions/enemy/gravity';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class SoldierX implements GameObject {
  id: string = "SoldierX";
  name: string = "SoldierX";
  public p: Vector;
  velocity: Vector;
  width: number;
  height: number;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  renderOrder: number;
  sprites;
  alwaysUpdate:boolean;
  counter:number = 0;
  deleteMe:boolean = false;
  us:UpdaterStore;

  facing:number;

  walkCounter;

  //store any arbitrary data here.... cool!
 // [propName: string] : any;

  //when writing new game objects, the constructer MUST take x and y as its first 
  // two parameters if it has a position at all. This is so fromSymbol can work correctly
  constructor(p : Vector) {    
    this.p = p;
    this.alwaysUpdate = true;
    this.width = 20;
    this.height = 20;

    this.facing = 1;

    this.tags = {player: true};

    //rendering order, higher number means it will render later (i.e. be in the foreground)
    this.renderOrder = 7;

    //if this variable is set there will be collisions
    // this variable is an associative array of "tags" to indexes in this.boxes 
    
    
    this.collidesWith = {level:0, enemy:1, enemyBullet:1, interactive:2}
    this.boxes = [ { solid: 2 }, {}, {}, ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],0, this);
    growBoxByNew(this.boxes[1],-2,this);
    growBoxByNew(this.boxes[2], 2,this);

    //every solid object will need to report its velocity so that the collision detector
    //  can use it to move an object backwards if it goes too far. 
    //the velocity variable is just "how much I moved myself this frame"
    this.velocity = new Vector(0,0)

    this.us = new UpdaterStore([
      new Gravity(this),
      new Ladder(this),
      new Injury(this),
      new Platformer(this),
      new Shoot(this, 15),
      new Walk(this,5.3)
    ]);

    this.sprites = imagesFromFolder.importAllAndFlip(
      "assets/soldier-x", 
      ["standing", "walk1", "walk2", "walk3", "walk4"]);
  }

  
  update(events) {
    this.velocity = new Vector(0, 0);


    this.us.go(events);

    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;

  }

  hp() {
    return (<Injury>this.us.get("Injury")).hp;
  }

  onFloor() {
    return (<Platformer>this.us.get("Platformer")).onFloor;
  }

  onLadder() {
    return (<Ladder>this.us.get("Ladder")).onLadder;
  }

  render(ctx : CanvasRenderingContext2D, map) { 
    try {
      if(this.velocity.x == 0) {
        ctx.drawImage(this.facing == 1 ? 
          this.sprites.standingRight
          :
          this.sprites.standingLeft,map.x(this.p.x - 6), map.y(this.p.y - 4), map.w(32), map.h(24));
      }
      else {
        var walk = <Walk>this.us.get("Walk");
        var walkCounter = walk.walkCounter;
        var frame = (Math.floor(walkCounter/2) % 4) + 1;
        var dir = this.facing == 1 ? "Right" : "Left";
        var spriteName = "walk"+frame+dir;
        ctx.drawImage(this.sprites[spriteName], map.x(this.p.x - 6), map.y(this.p.y - 6), map.w(32), map.h(26));
      }
    }
    catch(e) { }
  }

}