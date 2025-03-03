import { GameObject } from "../../../objects/game-object";
import { Updater } from "../updater";
import { Vector } from "../../vector-math/vector";
import { UpdaterStore } from "../updater-store";
import { Platformer } from "./platformer";

interface GameObjectVelocityUs extends GameObject {
  velocity: Vector;
  us: UpdaterStore;
}

export class Ladder implements Updater {
  go: GameObjectVelocityUs;
  onLadder: boolean = false;
  readonly priority: number = 1;
  name: string = "Ladder";

  constructor(go) {
    this.go = go;
  }

  update(events) {
    var onLadderCurrently = false;
    const collisionEvents = events.get('collision-'+this.go.id);
    collisionEvents.forEach((event)=>{
      if(event.with.startsWith("Ladder")) {
        onLadderCurrently = true;
        if(events.get('up-key').length > 0) {
          this.onLadder = true;
          (<Platformer>this.go.us.get("Platformer")).jumpCounter = 0; 
        }
      }
    })
  
    if(!onLadderCurrently)  {
      this.onLadder = false;
    }
  
    if(this.onLadder) {
      if(events.get('up-key').length) {
        this.go.velocity.y = -4;
      }
      else if (events.get('down-key').length) {
        this.go.velocity.y = 4;
      }
      else {
        this.go.velocity.y = 0;
      }
  
      //lock the player's X to the grid
      this.go.velocity.x = -1*(this.go.p.x % window.gameObjects.level().blockSize);
    }
  }
}
