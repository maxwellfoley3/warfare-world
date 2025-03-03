import { calculateJumpMotion } from "../../jump";
import { Updater } from '../updater';
import { GameObject } from "../../../objects/game-object";
import { Ladder } from "./ladder";
import { UpdaterStore } from "../updater-store";
import { Vector } from "../../vector-math/vector";


interface GameObjectVelocityUs extends GameObject {
  velocity: Vector;
  us: UpdaterStore;
}

export class Platformer implements Updater {
  go: GameObjectVelocityUs;
  readonly priority: number = 3;

  jumpCounter: number = 0;
  onFloor: boolean = false;
  onCeiling: boolean = false;
  name: string = "Platformer";


  constructor(go) {
    this.go = go;
  }

  update(events) {
    if(this.jumpCounter == undefined || this.onFloor == undefined ) {
      //if jumpCounter == 0, we are not in a jump
      // otherwise, this is number of ms until the jump is over
      this.jumpCounter = 0;
  
      //variable that tells us if the player is standing on the floor
      //  this will be set with collision detection events
      this.onFloor = false;
    }
  
    const collisionEvents = events.get('collision-'+this.go.id);
  
    collisionEvents.forEach((event)=>{
      if(event.with == "level") window.debugVariables.playerLevelCollide = () => event;
      if(event.with == "level" && event.bottom) { 
        this.onFloor = true;
      }
      if(event.with == "level" && event.top) {
        this.onCeiling = true;
      }
      else {
        this.onCeiling = false;
      }
    })
  
      //Jumping logic
      const jumpTime = 30;
      const jumpHeight = 400;
      const fallingSpeed = 7;
      let onLadder = (<Ladder>this.go.us.get("Ladder")).onLadder;
  
      //restart jumpcounter if we're on the floor and the spacebar was just pressed
      if((this.onFloor || onLadder) && events.get('spacebar-down').length > 0) {
        onLadder = false;
        this.onFloor = false;
        this.jumpCounter = 1;
      }
  
      //cancel the jump if we jump into a ceiling
      if(this.onCeiling || this.jumpCounter >= jumpTime) {
        this.jumpCounter = 0; 
      }
      
      //update jumpcounter if the spacebar is still being held, otherwise cancel the 
      // jump
      if(this.jumpCounter > 0 && events.get('spacebar-hold').length > 0) {
        this.jumpCounter++; 
        var jumpFactor = calculateJumpMotion(this.jumpCounter, jumpTime, jumpHeight );
  
        if(jumpFactor < fallingSpeed) {
          this.go.velocity.y = jumpFactor;
        }
        else {
          this.go.velocity.y = fallingSpeed;
        }
      }
  
      else {
        this.jumpCounter = 0;
        this.go.velocity.y = fallingSpeed;
      }
    }
}
