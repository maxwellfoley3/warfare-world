import { GameObject } from "./game-object";
import { Vector } from '../helpers/vector-math/vector';

export class DisplayAnimation implements GameObject {
  id: string = "DisplayAnimation-unloaded";
  name: string = "DisplayAnimation";
  public p: Vector;
  velocity: Vector = new Vector(0,0);  //need a better solution for this, but this is to let a display object be affected by gravity
  tags: { [name:string] : boolean } = {};
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = [];
  renderOrder: number = 20;
  sprites;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false;

  constructor(p, imageUrls) {    
    this.p = p;

    this.sprites = [];
    for(var i = 0; i < imageUrls.length; i++) {
      this.sprites[i] = document.createElement("img");
      this.sprites[i].src = imageUrls[i];
    }
  }

  update() {
    if(this.counter >= this.sprites.length*2) { this.deleteMe = true; } 
    else {
      this.counter++;
      this.p.x += this.velocity.x;
      this.p.y += this.velocity.y;
    }
  }

  render(ctx,map) {
    var half = Math.floor(this.counter/2)    
    if(half < this.sprites.length) {
      ctx.drawImage(this.sprites[half], 
        map.x(this.p.x), 
        map.y(this.p.y),
        map.w(this.sprites[half].width/5),
        map.h(this.sprites[half].height/5));
    }
  }


  
}