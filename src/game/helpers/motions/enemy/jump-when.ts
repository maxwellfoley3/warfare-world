import { calculateJumpMotion } from '../../jump';
import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";
import { Gravity } from "./gravity";
import { Vector } from '../../vector-math/vector';
import { UpdaterStore } from '../updater-store';

interface GameObjectVelocityUpdaterStore extends GameObject {
  velocity: Vector;
  us: UpdaterStore;
}

export class JumpWhen implements Updater {
  go: GameObjectVelocityUpdaterStore;
  condition: Function;
  jumpTime: number;
  jumpHeight: number;
  jumpCounter: number = 0;
  priority: number = 1;
  name: string = "JumpWhen";

  constructor(go, condition, jumpTime, jumpHeight) {
    this.go = go;
    this.condition = condition;
    this.jumpTime = jumpTime;
    this.jumpHeight = jumpHeight;
  }

  update(events) {
    const onFloor = (<Gravity>this.go.us.get("Gravity")).onFloor;

    const collisionEvents = events.get('collision-'+this.go.id);
    collisionEvents.forEach((event)=>{
      if(event.with == "level") {
        this.jumpCounter = 0;
      }
    })

    if(onFloor && this.condition) {
      this.jumpCounter = 1;

    }
    if(this.jumpCounter > 0 ) {
      this.jumpCounter++; 
      var jumpFactor = calculateJumpMotion(
        this.jumpCounter, 
        this.jumpTime, 
        this.jumpHeight 
      );

      if(jumpFactor < 7) {
        this.go.velocity.y = jumpFactor;
      }
    }
  }
}

