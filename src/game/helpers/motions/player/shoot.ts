import { Bullet } from '../../../objects/bullets/bullet';
import { DisplayAnimation } from '../../../objects/display-animation';
import { Vector } from '../../vector-math/vector';
import { GameObject } from '../../../objects/game-object';
import { Updater } from '../updater';

/*
export function shoot(events, lifetime) {
}*/

interface GameObjectFacing extends GameObject {
  facing: number;
}
export class Shoot implements Updater {
  go: GameObjectFacing;
  readonly priority: number = 4;

  lifetime: number;
  shootBreakTime: number = 0;
  muzzle: DisplayAnimation | null = null;
  name: string = "Shoot";
  constructor(go, lifetime) {
    this.go = go;
    this.lifetime = lifetime;
  }

  update(events) {
   //shoot a bullet if z key is pressed
   if(window.keysHeld.z && !this.shootBreakTime) {
    this.shootBreakTime = 1;
    window.gameObjects.register(
      new Bullet(
        new Vector(
          this.go.p.x + (this.go.facing == 1 ? (this.go.width || 0) +5 : -10), 
          this.go.p.y + (this.go.width || 0)/4
        ), 
        new Vector(
          10*this.go.facing, 
          0//this.go.us.get("Platformer").onFloor ? 0 : 2
      ), this.lifetime));

    var dir = this.go.facing == 1 ? "right" : "left";
    this.muzzle = new DisplayAnimation(
      new Vector(this.go.p.x,this.go.p.y),[
      "assets/soldier-x/muzzle/1-"+dir+".png",
      "assets/soldier-x/muzzle/2-"+dir+".png",
     // "assets/soldier-x/muzzle/3-"+dir+".png"
    ]);
    window.gameObjects.register(this.muzzle);
  }

    if(this.muzzle) {
      if(this.muzzle.deleteMe) { this.muzzle = null } 
      else { 
        this.muzzle.p.x = this.go.p.x + (this.go.facing == 1 ? (this.go.width || 0) + 5: -20); 
        this.muzzle.p.y = this.go.p.y; 
      }
    }
    if(this.shootBreakTime) {
      this.shootBreakTime++;
      if(this.shootBreakTime > 10) {
        this.shootBreakTime = 0;
      }
    }
  }
}
