
const Perlin = require('pf-perlin')

import { Injury } from '../../helpers/motions/enemy/injury';
import { growBoxByNew } from '../../helpers/grow-box-by-new';
import * as imagesFromFolder from '../../helpers/imports/images-from-folder';

import { GameObject } from '../game-object';
import { Vector } from '../../helpers/vector-math/vector';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class Bee implements GameObject {
  id: string = "";
  name: string = "Bee";
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
  start: Vector;
  noise;
  prevX:number = -1;

  constructor(p) {    
    this.p = p;
    this.width = 20;
    this.height = 20;
    this.tags = {enemy: true};

    
    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {player:0, playerBullet: 1}
    this.boxes = [ {}, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],-1,this);
    growBoxByNew(this.boxes[1],1,this);


    this.start = new Vector(p.x,p.y);

    this.noise = new Perlin({ dimensions: 1 })

    this.us = new UpdaterStore([
      new Injury(this, 2)
    ]);

    this.sprites = imagesFromFolder.importAllAndFlip("assets/enemies/bee", ["1", "2"]);
  }

  update(events) {
    this.counter++;

    this.us.go(events);

    this.prevX = this.p.x;
    this.p.x = this.start.x - 75 + (this.noise.get([this.counter*.011234])*150);
    //figure out what way its moving for the sake of the renderer
    if(this.p.x < this.prevX) { this.facing = -1 } 
    else { this.facing = 1 }
    
    this.p.y = this.start.y - 75 + (this.noise.get([(this.counter*.011244) + 100])*150);
 
  }

  render(ctx, map, parallax, draw) {
    try {
      var frame = (Math.floor(this.counter/2) % 2) + 1;
      var dir = this.facing == 1 ? "Right" : "Left";
      var spriteName = ""+frame+dir;
      draw.image(this.p, this.sprites[spriteName]);
    }
    catch(e) {}
  }

}