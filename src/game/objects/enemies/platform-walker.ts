import { growBoxByNew } from '../../helpers/grow-box-by-new';

import { Gravity } from '../../helpers/motions/enemy/gravity';

import { Injury } from '../../helpers/motions/enemy/injury';
import { PlatformWalk } from '../../helpers/motions/enemy/platform-walk';

import {  Bullet } from '../bullets/bullet';
import { Vector } from '../../helpers/vector-math/vector';
import { GameObject } from '../game-object';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class PlatformWalker implements GameObject {
  id: string = "PlatformWalker-unloaded";
  name: string = "PlatformWalker";
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

  facing:number = 1;
  
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

    this.us = new UpdaterStore([
      new Injury(this, 3),
      new Gravity(this),
      new PlatformWalk(this,2),
    ]);



    this.sprites = {};
    for(var i = 1; i <= 6; i++) {
      this.sprites["walk"+i+"Left"] = document.createElement("img");
      this.sprites["walk"+i+"Left"].src = "assets/enemies/coyote/walk"+i+"-left.png";
      
      this.sprites["walk"+i+"Right"] = document.createElement("img");
      this.sprites["walk"+i+"Right"].src = "assets/enemies/coyote/walk"+i+"-right.png";
    }
  }

  update(events) {
    this.velocity = new Vector(0, 0);

    this.us.go(events);

    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
 
  }

  render(ctx, map) {
    //just draw a square
    var i = (Math.floor(this.counter/2) % 6) + 1;
    ctx.drawImage(this.facing == -1 ? this.sprites["walk"+i+"Left"] : this.sprites["walk"+i+"Right"], map.x(this.p.x - 8), map.y(this.p.y ), map.w(32), map.h(20));


  }

}