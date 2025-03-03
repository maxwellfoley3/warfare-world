//Camera object. This is an x,y point representing the postion of the top left corner of the
// frame, with associated logic for calculating this point

import { GameObject } from "./game-object";
import { Vector } from '../helpers/vector-math/vector';
export class Camera implements GameObject {
  id: string = "Camera-unloaded";
  name: string = "Camera";
  public p: Vector = new Vector(0,0);
  tags: { [name:string] : boolean } = {};
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = [];
  renderOrder: number = 20;
  sprites;
  actions;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false;

  resolution: Vector;

  constructor() {
    this.resolution = new Vector( 640, 480 );
  }

  update(events) {
    //being lazy by hard coding this here, ideally it should pull from the render.js file
    //  somehow. Actually maybe this should be attached to the Level object
    // or honest probably the camera object

    //calculate ideal position first
    //let's do x and Y one at a time. 
    var idealX;
    
    //So if the level is smaller than the screen, we want to center the 
    //  level on the screen
    var level = window.gameObjects.level();
    if(level.width <= this.resolution.x) {
      idealX = -(this.resolution.x - level.width)/2;
    }
    else {
    //if the level is bigger than the screen, we want to center the camera on the player, 
    //  UNLESS it would mean that the camera would display anything past the boundaries of the
    //  level
      if(window.gameObjects.player().p.x < this.resolution.x / 2) {
        idealX = 0;
      }
      else if(window.gameObjects.player().p.x > level.width - (this.resolution.x/2)) {
        idealX = level.width - this.resolution.x;
      }
      else {
        idealX = window.gameObjects.player().p.x - (this.resolution.x/2);
      }
    }

    //Same logic for y value
    var idealY;
    if(level.height <= this.resolution.y) {
      idealY = -(this.resolution.y - level.height)/2;
    }
    else {
      if(window.gameObjects.player().p.y < this.resolution.y / 2) {
        idealY = 0;
      }
      else if(window.gameObjects.player().p.y > level.height - (this.resolution.y/2)) {
        idealY = level.height - this.resolution.y;
      }
      else {
        idealY = window.gameObjects.player().p.y  - (this.resolution.y/2);
      }
    }

    //if x and y values have not been set, set them to the ideal position
    if(!this.p.x || !this.p.y) {
      this.p.x = idealX;
      this.p.y = idealY;
    }

    //otherwise we want to linearly approach the ideal position to prevent any weird jerking around
    //  of the camera if the player is traveling fast. 
    /*
    var cameraSpeed = 5;
    if(idealX < this.x -cameraSpeed) { this.x -= cameraSpeed; }
    else if(idealX > this.x +cameraSpeed) { this.x += cameraSpeed; }

    if(idealY < this.y -cameraSpeed) { this.y -= cameraSpeed; }
    else if(idealY > this.y +cameraSpeed) { this.y += cameraSpeed; }
    */
   //go halfway to the ideal distance
   if(idealX < this.p.x) { this.p.x -= (this.p.x-idealX)/2; }
   else { this.p.x += (idealX-this.p.x)/2; } 

   if(idealY < this.p.y) { this.p.y -= (this.p.y-idealY)/2; }
   else { this.p.y += (idealY-this.p.y)/2; } 
  }

  //small red dot in the middle of the camera
  render(ctx) {
    /*
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.arc(this.x + 400, this.y + 300, 2, 0, 2 * Math.PI);
    ctx.fill();
    */
  }
}