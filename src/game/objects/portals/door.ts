import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';

//Door that transfers player to a predetermined location in another level
//  when the player is standing in front of it and pressing down

export class Door implements GameObject {
  id: string = "Door-unloaded";
  name: string = "Door";
  public p: Vector = new Vector(0,0);
  width:number = 20;
  height:number = 30;
  collidesWith: { [name:string ] : number };
  solid: number = 0;
  boxes: Object;
  renderOrder: number = 6;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean };
  sprites;

  destinationIndex:number;
  destinationX:number;
  destinationY:number;
  
  constructor(p, destinationIndex, destinationX, destinationY) {    
    this.p = p;
    this.destinationIndex = destinationIndex;
    this.destinationX = destinationX;
    this.destinationY = destinationY;

    this.width = 20;
    this.height = 30;
    
    this.tags = {interactive: true};

    //if an object is a collider, it means that we will receive collision detection
    //  events whenever it hits another collider
    this.collidesWith = {player:0 }
    this.boxes = [ {x: () => this.p.x, y: () => this.p.y, width: this.width, height: this.height } ];

    //not solid
    this.solid = 0;

    this.sprites = [ document.createElement("img") ];
    this.sprites[0].src = "assets/door.png";

  }

  update(events) {
    //if the down key is pressed and the door is touching the player, fire a
    //  event
    events.get('collision-'+this.id).forEach((event)=>{
      if(event.with == "player") {
        if(events.get('down-key').length > 0) {
          window.gameEvents.push({
            type: "door-entered",
            door: this
          })          
        }
      }
    })
  }
  render(ctx, map) {

    ctx.drawImage(this.sprites[0],map.x(this.p.x), map.y(this.p.y)-map.h(10), map.w(24), map.h(40));

  }
}