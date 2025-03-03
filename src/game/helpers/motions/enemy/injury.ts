import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";




export class Injury implements Updater {
  go: GameObject;
  immunityCounter: number;
  priority: number = 2;
  name: string = "Injury";
  hp: number;

  constructor(go, hp) {
    this.go = go;
    this.immunityCounter = 0;
    this.hp = hp;
  }

  update(events) {
    const collisionEvents = events.get('collision-'+this.go.id);
    collisionEvents.forEach((event)=>{
      //die if hit with a bullet 
      if(event.with.startsWith("Bullet") && !this.immunityCounter) {
        if(!this.hp) {
          console.log("enemy death")
          window.gameEvents.push({type:"enemy-death", position:{x:this.go.p.x, y:this.go.p.y}});
          this.go.deleteMe = true;
        }
        else {
          this.immunityCounter = 1;
          this.hp--;
        }
      }
    });
  
    if(this.immunityCounter) {
      this.immunityCounter ++; 
      if(this.immunityCounter > 5) {
        this.immunityCounter = 0;
      }
    }  
  }
}

