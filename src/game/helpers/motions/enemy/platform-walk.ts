import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";
import { Vector } from "../../vector-math/vector";

/*
export function platformWalk(events, velocity) {
}*/

interface GameObjectFacingVelocity extends GameObject {
  facing: number;
  velocity: Vector;
}
export class PlatformWalk implements Updater {
  go: GameObjectFacingVelocity;
  velocity: number; //todo make enum
  priority: number = 1;
  name: string = "PlatformWalk";

  constructor(go, velocity) {
    this.go = go;
    this.velocity = velocity;
  }

  update(events) {
    const collisionEvents = events.get('collision-'+this.go.id);
    collisionEvents.forEach((event)=>{
      //this is what makes it stay on the platform
      if(event.with == "level") {
        if(!event.wholeBottom || event.left || event.right) {
          this.go.facing = -1 * this.go.facing;
        }
      }
      if(this.go.facing == -1) {
        this.go.velocity.x = -1 * this.velocity;
      }
      if(this.go.facing == 1) {
        this.go.velocity.x = this.velocity;
      }
    });
  }
}
