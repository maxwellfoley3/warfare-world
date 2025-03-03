import { GameObject } from '../objects/game-object';
import { Level } from '../objects/level';
import { Camera } from '../objects/camera';
import { Intelligence } from '../objects/enemies/intelligence';
///This extends the object class with a method that allows us to generate a unique ID for objects
//  we add to the list

/*
Basically the way this should work is for objects that there should be only one of like 
  - level
  - player
  - camera

You should add those objects to the list with their name as the ID so they can be accessed
easily

But for bullets and so on, pass them to register() without an id parameter and they will
get a random ID
*/
export class GameObjectList {
  idCounter: number;
  /*
  player: GameObject;
  level: Level;
  camera: Camera;*/
  private objects: { [key: string]:GameObject }
  
  constructor() {
    this.idCounter = 1;
    this.objects = {};
  }

  get(id:string): GameObject {
    return this.objects[id];
  }

  delete(id:string) {
    delete this.objects[id];
  }

  camera(): Camera {
    return <Camera>(<unknown>this.objects["camera"]);
  }
  
  level(): Level {
    return <Level>(<unknown>this.objects["level"]);
  }

  player(): GameObject {
    return this.objects["player"];
  }

  getObjects(): { [key: string]:GameObject } {
    return this.objects;
  }

  intelligence(): Intelligence {
    return <Intelligence>(<unknown>this.objects["intelligence"]);
  }

  register(obj:GameObject,id?) {
    //we can pass this function an array in order to register a bunch of objects
    //  at once. Currently no way to pass an array and specify an id for any
    //  of the objects within it
    if(Array.isArray(obj)){
      obj.forEach((obj2) => this.register(obj2))
      return;
    }
  

    //now to handle the case where it's not an array
    //if an id was specified, use that id. Otherwise use the class name plus an arbitrary 
    // reference number
    if(!id) {
      obj.id = obj.name + this.idCounter;
      this.idCounter++;
    }
    else {
      obj.id = id
    }

    //if(this[obj.id]) { throw "Duplicate id added to GameObjectList" }
    this.objects[obj.id] = obj;
  }
}