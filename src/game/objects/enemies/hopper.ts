import { growBoxByNew } from '../../helpers/grow-box-by-new';

import { Gravity } from '../../helpers/motions/enemy/gravity';
import { Injury } from '../../helpers/motions/enemy/injury';
import { JumpWhen } from'../../helpers/motions/enemy/jump-when';

import { Bullet } from '../bullets/bullet';
import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class Hopper implements GameObject {
  id: string = "";
  name: string = "Hopper";
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
  counter:number = Math.floor(Math.random()*6);
  deleteMe:boolean = false;  
  us: UpdaterStore;

  facing:number = 1;

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

    this.us = new UpdaterStore([
      new Injury(this, 3),
      new Gravity(this),
      new JumpWhen(this, true, 10, 100),
    ]);

    //which way is the character facing. 1 for right -1 for left
    this.facing = 1;

  }

  update(events) {
    this.velocity = new Vector(0, 0);

    var player = window.gameObjects.player();
    if(this.p.x > player.p.x + 150) {
      this.facing = -1;
    }
    if(this.p.x < player.p.x - 150) {
      this.facing = 1;
    }

    this.us.go(events);


    this.velocity.x = 3 * this.facing;

    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
 
  }

  render(ctx) {
    //just draw a square
    ctx.beginPath();
    ctx.fillStyle = "#cc4444";
    ctx.rect(this.p.x, this.p.y, 10, 20);
    ctx.fill();

  }

}