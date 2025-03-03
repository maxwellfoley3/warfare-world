import { Updater } from "../updater";
import { GameObject } from "../../../objects/game-object";
import { Bullet } from "../../../objects/bullets/bullet";
import { Vector } from "../../vector-math/vector";


export class ShootForward implements Updater {
  go: GameObject;
  readonly priority: number = 4;

  lifetime : number;
  shootBreakTime: number = 0;
  name: string = "ShootForward";

  constructor(go, lifetime) {
    this.go = go;
    this.lifetime = lifetime;
  }

  update(events) {
    if(window.keysHeld.z && !this.shootBreakTime) {
      this.shootBreakTime = 1;
      window.gameObjects.register(
        new Bullet(
          new Vector(
            this.go.p.x, 
            this.go.p.y + ( this.go.width || 0 )/2
          ), 
          new Vector(10, 0), 
          this.lifetime));
    }
    if(this.shootBreakTime) {
      this.shootBreakTime++;
      if(this.shootBreakTime > 10) {
        this.shootBreakTime = 0;
      }
    }
  }
}
