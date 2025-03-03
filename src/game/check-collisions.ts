import { Vector } from "./helpers/vector-math/vector";


import * as _ from 'lodash';
var table;

//pass two boxes into this
var testCollision = function(a,b) {
  //this shoudnt happen because every collider should have a box
  if(!a || !b) return false;

  // formula from here https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 return (a.x() < b.x() + b.width &&
  a.x() + a.width > b.x() &&
  a.y() < b.y() + b.height &&
  a.y() + a.height > b.y())
   // collision detected!
}

var testCollisionWithLevel = function(level,b,x?,y?) {
  //we can pass this function different points to test hypothetical collisions without moving the object
  if(x == undefined || y == undefined) {
    x = b.x();
    y = b.y();
  }


  //Return information telling us which sides are touching the level
  var left, right, top, bottom;

  //this will tell us if an ENTIRE side is overlapping w the level
  var wholeLeft = true, wholeRight = true, wholeTop = true, wholeBottom = true;

  //ok now we will have to test if the object is overlapping with any block
  //we will do this edge by edge 


  //TOP & BOTTOM
  for(var i = Math.floor(x / level.blockSize)*level.blockSize; i < x+b.width-1; i+=level.blockSize){
 // for(var i = b.box.x(); i <= b.box.x()+b.box.width; i+=b.box.width){
    if(level.blockAtPoint(i,b.y())) { top = true; } else { wholeTop = false }
    if(level.blockAtPoint(i,b.y()+b.height-1)) { bottom = true; } else { wholeBottom = false }
  }

  //LEFT & RIGHT
  for(var j = Math.floor(y / level.blockSize)*level.blockSize; j < y+b.height-1; j+=level.blockSize){
  //for(var j = b.box.y(); j <= b.box.y()+b.box.height; j+=b.box.height){

    if(level.blockAtPoint(x,j)) { left = true; } else { wholeLeft = false }
    if(level.blockAtPoint(x+b.width-1,j)) { right = true; } else { wholeRight = false }
  }

  //TODO: this ignores the case where a block is entirely enveloped by an object
  //  idk if this will ever be relevant, we can cross this bridge when we come to
  //  it

  wholeLeft = left && wholeLeft;
  wholeRight = right && wholeRight;
  wholeTop = top && wholeTop;
  wholeBottom = bottom && wholeBottom;

  if(left || right || top || bottom) {
    return { left, right, top, bottom, wholeLeft, wholeRight, wholeTop, wholeBottom };
  }
  //just return null if no collision
  else {
    return null;
  }
}

//calling this function instead of just testCollisionWithLevel directly ensures that objects cant
//  "jump over" blocks by traveling too fast 
var testCollisionWithLevelAccountForVelocity = function(level,b,velocity?) {
  if(velocity && (velocity.y > level.blockSize || velocity.x > level.blockSize)) {

    var distRemainingY = velocity.y;
    var distRemainingX = velocity.x;

    //test starting at origin
    var testX = b.x() - velocity.x;
    var testY = b.y() - velocity.y;

    //travel in blockSize increments until we reach destination
    while(distRemainingY || distRemainingX) {
      if(velocity.x > 0) {
        testX += level.blockSize;
      }
      else {
        testX -= level.blockSize;
      }
      if(velocity.y > 0) {
        testY += level.blockSize;
      }
      else {
        testY -= level.blockSize;
      }      
      
      var collisionData = testCollisionWithLevel(level,b,testX,testY);
      if(collisionData) {
        return collisionData;
      }
      
      if(distRemainingX > level.blockSize) {
        distRemainingX -= level.blockSize;
      }
      else {
        distRemainingX = 0;
      }
      
      if(distRemainingY > level.blockSize) {
        distRemainingY -= level.blockSize;
      }
      else {
        distRemainingY = 0;
      }    
    }

    //once we reach destination just test normally
    return testCollisionWithLevel(level,b);
  }
  else {
    //otherwise just test normally
    return testCollisionWithLevel(level,b);
  }
}

var adjust = function(a, b)  {
  //TODO: implement this. This will push an object back so it no longer intersects with
  //  an object it collides with. B is the less solid object getting pushed

} 


var adjustWithLevel = function(level,obj,box,data) {
  //hack to make objs work both the new vector way and the old way
  var p : Vector = obj.p ? obj.p : new Vector(obj.x, obj.y);
  var initBx = p.x;
  var initBy = p.y;
  p.x -= obj.velocity.x;
  p.y -= obj.velocity.y;

  //unit directions will be -1, 0, or 1
  var unitX = obj.velocity.x == 0 ? 0 : obj.velocity.x / Math.abs(obj.velocity.x);
  var unitY = obj.velocity.y == 0 ? 0 : obj.velocity.y / Math.abs(obj.velocity.y);

  var yDistanceMoved = 0;
  if(obj.velocity.y) {// do nothing if y velocity is zero 
    while(!testCollisionWithLevel(level,box) && yDistanceMoved <= Math.abs(obj.velocity.y)) {

      p.y = Math.floor(p.y);
    // b.x += unitX;
      p.y += unitY;
      yDistanceMoved += Math.abs(unitY);
      
    }

    p.y -= unitY;
  }

  var xDistanceMoved = 0;
  var counter = 0;
  if(obj.velocity.x) {
    while(!testCollisionWithLevel(level,box) && xDistanceMoved <= Math.abs(obj.velocity.x)) {
      p.x += unitX;
      xDistanceMoved += Math.abs(unitX);
      counter++;
    } 
    p.x -= unitX;
 //   obj.x = Math.floor(obj.x);
  }

    /*
  let xDistanceMoved = 0;
  let end = false;
  while(
    !testCollisionWithLevel(level,box) || end) {
      if(obj.velocity.x  && xDistanceMoved <= Math.abs(obj.velocity.x)) {
        p.x += unitX;
        xDistanceMoved += Math.abs(unitX);  
      }
      if(obj.velocity.y  && yDistanceMoved <= Math.abs(obj.velocity.y)) {
        p.y = Math.floor(p.y);
        p.y += unitY;
        yDistanceMoved += Math.abs(unitY);
      }
  }

  if(obj.velocity.x) {
    p.x -= unitX;
  }
  if(obj.velocity.y) {
    p.y -= unitY;
  }
*/
  if(obj.p) obj.p = p;
  else { obj.x = p.x; obj.y = p.y; }
 // throw "kill";

  //get new collision data based on where it is now i.e. if ther are no pixels between it and the
  //  floor report it as colliding with the floor
  // to do this we will test collisions based on a dummy object thats 1px bigger on every side
  // unfortunately we have to separate this into two objects one bigger on the left and right 
  // other bigger on top and bottom

  var widerDummy = {x: p.x - 1, y: p.y, box:{
    x: () => p.x - 1,
    y: () => p.y,
    width: obj.width + 2,
    height: obj.height
  }};

  var wideCollisionData = testCollisionWithLevel(level, widerDummy.box);
  if(obj.id =="player"){ console.gameLog("wide",JSON.stringify(wideCollisionData)) }

  var tallerDummy = {
    x: p.x, 
    y: p.y - 1,
    box: {
      x: () => p.x,
      y: () => p.y - 1,
      width: obj.width,
      height: obj.height + 2
    }
  };

  var tallCollisionData = testCollisionWithLevel(level, tallerDummy.box);

  if(tallCollisionData) {
    data.top = tallCollisionData.top;
    data.bottom = tallCollisionData.bottom;
    data.wholeTop = tallCollisionData.wholeTop;
    data.wholeBottom = tallCollisionData.wholeBottom;
  } else {
    data.top = false;
    data.bottom = false;
    data.wholeTop = false;
    data.wholeBottom = false; 
  }
  
  if(wideCollisionData) {
    data.left = wideCollisionData.left;
    data.right = wideCollisionData.right;
    data.wholeLeft = wideCollisionData.wholeLeft;
    data.wholeRight = wideCollisionData.wholeRight; 
  } else {
    data.left = false;
    data.right = false;
    data.wholeLeft = false;
    data.wholeRight = false; 
  }
}

var processObjectAndLevel = function(level,b) {
  var box = b.boxes[b.collidesWith.level];

  var collisionData = testCollisionWithLevelAccountForVelocity(level,box);

  if(collisionData){
    if(box.solid) { //TODO, make this line just box.solid after changing everything
      if(b.id=="player") { console.gameLog("player collision data pre", JSON.stringify(collisionData));  }
      adjustWithLevel(level,b,box,collisionData);
      if(b.id=="player") { console.gameLog("player collision data post", JSON.stringify(collisionData));  }

    }
    window.gameEvents.push({
      type: "collision-"+b.id,
      with: 'level',
      top: collisionData.top,
      left: collisionData.left,
      right: collisionData.right,
      bottom: collisionData.bottom,
      wholeTop: collisionData.wholeTop,
      wholeLeft: collisionData.wholeLeft,
      wholeRight: collisionData.wholeRight,
      wholeBottom: collisionData.wholeBottom
    })
  }
}

var processTwoObjects = function(a,b) {
  //if collision has not already been checked 
  if(!table[b.id+"+"+a.id]) {

    var aBox;
    
      for(var tag in b.tags) {
        if(a.collidesWith[tag] != undefined) {
          aBox = a.boxes[a.collidesWith[tag]];
        }
      }
      if(a.collidesWith.all != undefined) {
        aBox = a.boxes[a.collidesWith.all];
      }
      if(!aBox) { throw "box not found, this shouldnt have happened"}
    

    var bBox;

      for(tag in a.tags) {
        if(b.collidesWith[tag] != undefined) {
          bBox = b.boxes[b.collidesWith[tag]];
        }
      }
      if(b.collidesWith.all != undefined) {
        bBox = b.boxes[b.collidesWith.all];
      }
      if(!bBox) { throw "box not found, this shouldnt have happened"}
    

    if(testCollision(aBox,bBox)){

      //Fire two events, one for each object to handle their own collision
      window.gameEvents.push({
        type: "collision-"+a.id,
        with: b.id
      })

      window.gameEvents.push({
        type: "collision-"+b.id,
        with: a.id
      })

      //Two types of collision. In one case, we have objects that aren't solid and are
      // ok to pass through each other as long as we are notified (e.g. bullets hitting 
      // enemies, enemies walking past each other. In another case, we need to make sure
      // that objects dont intersect, so if an object enters inside another, we need to 
      // push it backwards

      //This is determined with the "solid" variable. If solid == 0 it is not solid
      // After that there are varying degrees of solidness and the "more solid" object 
      // is the one that gets pushed. So for example we might have a moving platform that
      // bounces back and forth between two walls. This platform should get pushed back
      // when it collides with a wall, but the player should get pushed back when he 
      // collides with the platform. So the platform could have solid == 1 and the player
      // can have solid == 2. Idk if we will ever need more numbers than 0 1 and 2 but if
      // we do we can do it. 

      if(a.solid && b.solid) {
        var moreSolid;
        var lessSolid;
        if(a.solid > b.solid) {
          moreSolid = a.solid;
          lessSolid = b.solid;
        }
        else {
          moreSolid = b.solid;
          lessSolid = a.solid;
        }
        adjust(moreSolid, lessSolid);
      }
    }
    //record that this collision has been checked
    table[a.id+"+"+b.id] = true;
  }


}

export function checkCollisions() {

  //Do collisions between two game objects
  //O n^2 runtime. Eventually probably want to implement something efficient like this
  //https://stackoverflow.com/questions/7107231/best-algorithm-for-efficient-collision-detection-between-objects
  
  //Make a list of collisions we've already done so that in the double-loop we only process each
  //  pair of objects once
  table = {};
  let objs = window.gameObjects.getObjects();
  for(var id in objs) {
    var a = objs[id];

    if(a.collidesWith && a.collidesWith.length != 0) {
      //for each type of thing that it collides with 
      for(var key in a.collidesWith) {
        //level is a special case
        if(key == "level") {
          processObjectAndLevel(window.gameObjects.level(),a);
        }

        //get objects w proper tag for it to collide w
        var relevant = _.filter(objs, (obj)=>{
          return obj.tags && obj.tags[key];
        })
        .filter((obj)=>{
          //part two of the test, make sure object 2 has a box to collide w the first one
          if(!obj.collidesWith) {
            return false;
          }
          if(obj.collidesWith.all) {
            return true;
          }
          for(var tag in a.tags) {
            if(obj.collidesWith[tag]) {
              return true; 
            }
          }
        })

        for(var idx in relevant) {
          //process 
          processTwoObjects(a, relevant[idx]);
        }
      }

    }
  }
}