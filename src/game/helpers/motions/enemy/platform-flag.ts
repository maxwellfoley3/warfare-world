import { GameObject } from "../../../objects/game-object";
import { Updater } from "../updater";

//same as platform walk but just flags when the enemy is approaching the edge
//  of a platform instead of defining how the enemy moves


export class PlatformFlag implements Updater {
  go: GameObject;
  onEdge: string = ""; //todo make enum
  priority: number = 1;
  name: string = "PlatformFlag";

  constructor(go) {
    this.go = go;
  }

  update(events) {
    const collisionEvents = events.get('collision-'+this.go.id);
    collisionEvents.forEach((event)=>{
      //this is what makes it stay on the platform
      if(event.with == "level") {
        if(!event.wholeBottom || event.left || event.right) {
          if(event.left || !window.gameObjects.level().blockAtPoint(this.go.p.x, this.go.p.y + ( this.go.height || 0) + 1)) {
            this.onEdge = "left";
          }
          else { 
            this.onEdge = "right";
          }
        }
        else {
          this.onEdge = "";
        }
      }
  
    })
  }
}
