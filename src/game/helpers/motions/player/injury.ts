import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";
import { Vector } from "../../vector-math/vector";

//Injury dynamics
const pushBackTime = 10;
const invincibilityTime = 45;


interface GameObjectVelocityFacing extends GameObject {
  velocity: Vector;
  facing: number;
}

export class Injury implements Updater {
  go: GameObjectVelocityFacing;
  injuredCounter: number = 0;
  readonly priority: number = 6;
  name: string = "Injury";
  hp: number = 7;

  constructor(go: GameObjectVelocityFacing) {
    this.go = go;
  }

  update(events) {
    //initialize
    /*
    if(this.injuredCounter == undefined) {
      //similar to jump counter. Once a player is hit, there is a reaction which
      //  consists of 1. being forcefully pushed back and 2. being invincible
      //This counter will determine........... where in that process the player is
      this.injuredCounter = 0;
    }*/

    if(!this.injuredCounter) {
      const collisionEvents = events.get('collision-'+this.go.id);
      collisionEvents.forEach((event)=>{
        //get injured if we touch an enemy and we are not already processing
        //  an injury (i.e. invincible)
        if(window.gameObjects.get(event.with).tags.enemy || 
          window.gameObjects.get(event.with).tags.enemyBullet) {
          this.hp--;
          this.injuredCounter = pushBackTime + invincibilityTime;
        }
      });
    }
    //push a player back if hes processing an injury
    if(this.injuredCounter) {
      this.injuredCounter--;
      if(this.injuredCounter 
        > invincibilityTime) {
        this.go.velocity.x = -13*this.go.facing;
      }
    }

    //die if HP is zero
    if(this.hp <= 0) {
      window.gameEvents.push({type:"player-death"});
    }

  }
}
