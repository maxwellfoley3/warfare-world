import { Vector } from '../helpers/vector-math/vector';
import { UpdaterStore } from '../helpers/motions/updater-store';

export interface GameObject {
  id: string;
  name: string;
  //location in game coordinates
  p: Vector;
  //velocity must be sent to collision detection engine
  //  each frame. it can also be used internally
  //TODO: consider automatically updating based on velocity 
  //  in the update method 
  //also this should probably be a different interface "collider"
  velocity?: Vector;
  //not really sure what to do with width and height
  //  yet, at this point it's mainly for rendering
  width?: number;
  height?: number;
  //tag the game object with 'enemy' or 'bullet'
  //  or whatever  
  tags: { [name:string] : boolean };
  //collidesWith is a mapping from tag to index in the boxes array
  collidesWith: { [name:string ] : number };
  //all the hitboxes for the object
  boxes: Object;

  update:Function;

  //render order... default should be 6
  //  how do we do default in typescript?
  renderOrder?: number;

  //all sprites this object uses, maybe should just be called images
  sprites?;

  //if FALSE, the object will not update if it is
  //  a certain distance away off-screen. 
  //  name should prob be changed 
  alwaysUpdate?:boolean;

  //no-respawn, used for items and enemies that once removed from
  //  the game level won't respawn
  noRespawn?:boolean;

  //counter, will be auto-incred in the update method
  counter: number;

  //set to true and it will be deleted in the update method
  deleteMe: boolean;
  
  //contains updaters, basically stateful functions that are called every
  //  time the update loop is run 
  us?: UpdaterStore;

  render: Function;
  startX?: number;
  startY?: number;
}