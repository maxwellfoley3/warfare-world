import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";
import { Vector } from '../../vector-math/vector';


interface GameObjectFacingVelocity extends GameObject {
  facing: number;
  velocity: Vector;
}

export class Walk implements Updater {
  go: GameObjectFacingVelocity;
  readonly priority: number = 2;
  name: string = "Walk";

  walkCounter: number = 0;
  constructor(go, velocity) {
    this.go = go;
  }

  update(events) {
    //initialization 
    if(this.go.facing == undefined || this.walkCounter == undefined) {
      //which way is the character facing. 1 for right -1 for left
      this.go.facing = 1;
      //tells us how long we've been walking for. used to play walking animation
      this.walkCounter = 0;
    }

    //Move the player around
    //The velocity variable is for the collision detector
    if(events.get('left-key').length > 0) {
      this.go.facing = -1;
      this.go.velocity.x = -5.3;
      this.walkCounter++;
    }
    if(events.get('right-key').length > 0) {
      this.go.facing = 1;
      this.go.velocity.x = 5.3;
      this.walkCounter++;
    }
  }
}
