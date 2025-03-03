import { growBoxByNew } from '../../helpers/grow-box-by-new';
import { GameObject } from '../game-object';
import { Vector } from '../../helpers/vector-math/vector';

export class Spike implements GameObject {
  id: string = "Spike-unloaded";
  name: string = "Spike";
  public p: Vector = new Vector(0,0);
  width:number = 20;
  height:number = 20;
  collidesWith: { [name:string ] : number } = {};
  boxes: Object;
  renderOrder: number = 6;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean };
  sprites;

  constructor(p) {    
    this.p = p;

    this.tags = {enemy: true};

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {player:0}
    this.boxes = [ {}, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],-1,this);

    this.renderOrder = 6;

    this.sprites = [document.createElement("img")];
    this.sprites[0].src = "assets/spike.png";

 
  }

  update() {}


  render(ctx,map, parallax, draw) {
    draw.image(this.p, this.sprites[0], {x: 0, y: -60});

  }

}