/*
import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';

//TODO
//Represents the edge of the screen
//A level will have four slots for a Bounds object, for top left right and bottom
//A bounds object will be responsible for providing a mapping for the players 
//position exiting a level to a position on the new level


export class Goal implements GameObject {
  id: String = "Spike-unloaded";
  public p: Vector = new Vector(0,0);
  width:number = 20;
  height:number = 20;
  collidesWith: { [name:string ] : number } = {};
  boxes: Object;
  solid: number = 0;
  renderOrder: Number = 6;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean };
  sprites;

  constructor(p){
    this.p = p;
    this.tags = {interactive: true};

    this.box = {x:()=>this.x+200, y:()=>this.y+300,width:100,height:100}
    this.collider = true;
    this.solid = 0;

    this.image = document.createElement("img");
    this.image.src = "assets/porno.jpg";
  
  }

  update(events) {
    events.get('collision-'+this.id).forEach((event)=>{
      if(event.with == "player") {
        window.gameEvents.push({
          type: "victory"
        })          
      }
    })
  }

  render(ctx) {
    ctx.drawImage(this.image,this.x,this.y,300,500);
  }
  





}*/