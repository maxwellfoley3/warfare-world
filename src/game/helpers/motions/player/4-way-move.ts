import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";
import { Vector } from "../../vector-math/vector";

interface GameObjectVelocity extends GameObject {
  velocity: Vector;
}

export class FourWayMove implements Updater {
  go: GameObjectVelocity;
  readonly priority:number = 3;
  name: string = "FourWayMove";

  constructor(go, velocity) {
    this.go = go;
  }

  update(events) {
    //Move the player around
    //The velocity variable is for the collision detector

    if(events.get('left-key').length > 0) {
      window.debugVariables.leftKey = () => true;
      this.go.velocity.x = -5;
    }
    if(events.get('right-key').length > 0) {
      window.debugVariables.rightKey = () => true;
      this.go.velocity.x = 5;
    }
    if(events.get('up-key').length > 0) {
      window.debugVariables.upKey = () => true;
      this.go.velocity.y = -5;
    }
    if(events.get('down-key').length > 0) {
      window.debugVariables.downKey = () => true;
      this.go.velocity.y = 5;
    }
  }
}
