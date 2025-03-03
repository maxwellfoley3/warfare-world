import { GameObject } from '../../../objects/game-object';
import { Updater } from '../updater';
import { Vector } from '../../vector-math/vector';
/*
export function gravity(events) {
    //falling speed
    this.onFloor = false;
    this.velocity.y = 7.2
    const collisionEvents = events.get('collision-'+this.id);
    collisionEvents.forEach((event)=>{
  
      if(event.with == "level" && event.bottom) {
        this.onFloor = true;
      }

    })
}*/

interface GameObjectVelocity extends GameObject {
  velocity: Vector;
}

export class Gravity implements Updater {
  go: GameObjectVelocity;
  onFloor: boolean;
  priority: number = 1;
  name: string = "Gravity";

  constructor(go) {
    this.go = go;
    this.onFloor = false;
  }

  update(events) {
    this.go.velocity.y = 7.2
    const collisionEvents = events.get('collision-'+this.go.id);
    collisionEvents.forEach((event)=>{
  
      if(event.with == "level" && event.bottom) {
        this.onFloor = true;
      }

    })
  }
}

//TODO, apply mixin to this like the way the typescript tutorial thing wants u 