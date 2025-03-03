import { GameObject } from "./game-object";
import { Vector } from '../helpers/vector-math/vector';

export class Display implements GameObject {
  id: string = "";
  public p: Vector;
  velocity: Vector = new Vector(0,0);  //need a better solution for this, but this is to let a display object be affected by gravity
  tags: { [name:string] : boolean } = {};
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = [];
  renderOrder: number = 7;
  sprites;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false;
  name: string = "Display";
  
  constructor(p, imageUrl) {    
    this.p = p;

    let image = document.createElement("img");
    image.src = imageUrl;
    this.sprites = [image];
  }

  update() {
    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;
  }

  render(ctx,map,parallax,draw) {    

      draw.image(this.p, this.sprites[0]);
    
  }


  
}