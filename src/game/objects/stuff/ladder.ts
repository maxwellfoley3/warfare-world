import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';

export class Ladder {
  id: String = "Ladder-unloaded";
  name: string = "Ladder";
  public p: Vector = new Vector(0,0);
  width:number;
  height:number;
  collidesWith: { [name:string ] : number };
  solid: number = 0;
  boxes: Object;
  renderOrder: Number = 6;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean };
  sprites;

  constructor(p, height) {    
    this.p = p;
    this.width = 10;
    this.height = height;
    
    this.tags = {interactive: true};

    this.collidesWith = {player:0, enemy:0}
    
    let box : any = {};
    box.x = () => this.p.x;
    box.y = () => this.p.y;
    box.width = 10;
    box.height = this.height;
    this.boxes = [ box ];
  }

  render(ctx, map) {
    ctx.beginPath();
    ctx.fillStyle = "#3305AEaa";
    ctx.rect(map.x(this.p.x), map.y(this.p.y), map.w(this.width), map.h(this.height));
    ctx.stroke();
  }
}