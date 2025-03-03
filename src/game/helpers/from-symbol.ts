import { GameObject } from '../objects/game-object';
import { Vector } from './vector-math/vector';


export function fromSymbol(mapBuf, symbol, constructor?:  { new(v:Vector, ...args:any[]) }, ...args) {

  //this should be called after the new level is already added to window.gameObjects
  var level = window.gameObjects.level();
  var objs : GameObject[] = [];
  var i = 0;
  var width = level.blocks.length + 1; //plus one for the newline
  var prev;
  for(const block of mapBuf) {
    //test for blank line 
    if(block == "\n" && prev == "\n") {
      return objs;
    }

    prev = block;
    i++;
    var x = (i % width)-1;
    var y = i / width;
    if(block == symbol) {
        //one way to operate this is to construct a new object at position x y and return it. 
        // Another one is to just return the coordinates.
        //Kind of sloppy way of combining two different behaviors and perhaps should be worked
        //  out better.
      if(!constructor) {
        return {x: x * level.blockSize, y: y*level.blockSize};
      }
      let newGO = new constructor(new Vector(x * level.blockSize, y*level.blockSize),...args);
      objs.push(newGO); 

    } 
  }

  return objs;
}
