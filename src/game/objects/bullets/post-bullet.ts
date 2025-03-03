import { Vector } from '../../helpers/vector-math/vector';
import { GameObject } from '../game-object';

export class PostBullet implements GameObject {
  id: string = "";
  name: string = "PostBullet";
  public p: Vector;
  tags: { [name:string] : boolean } = {};
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = {};
  renderOrder: number = 8;
  sprites;
  actions;
  noRespawn: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false;

  constructor(p: Vector) {
    this.p = p;
    this.counter = 0;
    this.actions = {};
    this.actions.idle = () => {
      this.deleteMe = true;
    }
    this.renderOrder = 8;

    this.sprites = {};
    for(var i = 1; i <= 3; i++) {
      this.sprites[i] = document.createElement("img");
      this.sprites[i].src = "assets/soldier-x/bullet/impact/"+i+".png";

    }
  }
  update() {
    this.counter++; 
    if(this.counter >= 5) { this.deleteMe = true; }
  }
  render(ctx, map) {

    var half = Math.floor(this.counter/2) + 1;
    if(half > 0 && half < 4) {
      ctx.drawImage(this.sprites[half],map.x(this.p.x-20), map.y(this.p.y-20), map.w(40), map.h(40));
    }
  }

}