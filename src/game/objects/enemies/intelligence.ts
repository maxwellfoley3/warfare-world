import { Bullet } from '../bullets/bullet';
import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';
import { SoldierX } from '../players/soldier-x';

interface IMapPoint {
  x: number;
  y: number;
  dist?: number;
  direction?: string; //TODO make enum
  action?: string; //TODO also make enum
  fallTo?: IMapPoint;
  jumpTo?: IMapPoint;
}

export class Intelligence implements GameObject{
  id: string = "";
  name: string = "Intelligence";
  public p: Vector = new Vector(0, 0);
  velocity: Vector = new Vector(0, 0);
  width: number = 20;
  height: number = 20;
  tags: { [name:string] : boolean } = {};
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = {};
  renderOrder: number = 10;
  sprites;
  noRespawn:boolean = true;
  alwaysUpdate:boolean = true;
  actions;
  counter:number = Math.floor(Math.random()*6);
  deleteMe:boolean = false;

  map:IMapPoint[][];
  q:IMapPoint[] = [];
  ladderMap:boolean[][];
  prevP:IMapPoint;
  lastTestedPoint?:IMapPoint;
  lastAlgorithmStartPoint?:IMapPoint;

  constructor() {    

    //Basically we want to make a 2D array the same size as the level map
    // Each square should show how many squares is it to get to the player and which direction
    //  to go
    //Going up should not be considered to be possible unless there is a ladder
      // TODO it should be possible if its high enough above ground
    //Going sideways should not be possible if there is no ground underneath... TODO let the
    //  character jump
    if(!window.gameObjects.level) {
      throw "Intelligence must be added after the level object";
    }

    //initialize map so it doesnt break when we check it
    this.map = [];
    this.ladderMap = [];
    for(var i = 0; i < window.gameObjects.level().widthInBlocks; i++) {
      this.map[i] = [];
      this.ladderMap[i] = [];
    }

    this.prevP = {x:-1, y:-1, };
    this.lastTestedPoint = {x:0,y:0};
    this.counter = 0;
  }

  //find all ladders on the stage and add them to the level map.... hopefully we never
  //  have to add ladders dynamically lol

  makeLadderMap() {
    var level = window.gameObjects.level;

    var ladderMap : boolean[][] = [];
    for(var i = 0; i < level().widthInBlocks; i++) {
      ladderMap[i] = [];
    }

    for(var id in window.gameObjects) {
      if(id.startsWith("Ladder")) {

        var obj = window.gameObjects[id];
        var ladderStart = level().pointToBlockCoord(obj.x, obj.y);
        
        var ladderEndY = Math.floor(obj.y+obj.height / level().blockSize)
        for(var y = ladderStart.y; y < ladderEndY ; y++) {
          ladderMap[ladderStart.x][y] = true;
        }
      }
    }

    return ladderMap;
  }

  update(events) {
    this.counter++;
    //make ladder map if it doesnt exist. do this in update not constructor
    //  so we dont do it before ladder objects are loaded
    if(!this.ladderMap) {
      this.ladderMap = this.makeLadderMap();
    }

    //TODO check to see if there are still intelligent enemies on the screen,
    //  if they are all dead then delete this 
    if(window.gameObjects.player().name != "SoldierX") {
      throw "Intelligence should not be deployed without a SoldierX on the map";
    }

    let player : SoldierX = <SoldierX>window.gameObjects.player(); 

    var p = <IMapPoint>window.gameObjects.level().pointToBlockCoord(
      window.gameObjects.player().p.x, 
      window.gameObjects.player().p.y+1*window.gameObjects.level().blockSize 
    );
    var playerP = p;
    var newQueue = false;
    //refresh map

    //TAKEN OUT FOR NOW SO MAP ONLY GETS RENDERED ONCE
    
    if((p.x!=this.prevP.x||p.y!=this.prevP.y) 
      && (player.onFloor() || player.onLadder()) ) {
      this.map = [];
      for(var i = 0; i < window.gameObjects.level().widthInBlocks; i++) {
        this.map[i] = [];
      }
      newQueue = true;
      this.prevP = p;
    }

    this.lastAlgorithmStartPoint = p;
    p.dist = 0;

    //make sure the player is the bounds of the level (if it jumped into the left wall and hasnt been adjusted in
    //  the collision detection event yet 
    if(p.x < 0 || p.x > window.gameObjects.level().widthInBlocks) return;
    if(p.y < 0 || p.y > window.gameObjects.level().heightInBlocks) return;

    //ok we need to do a sort of breadth first search
    if(newQueue) {
      var q = [p]
    }
    else {
      var q = this.q ? this.q : [p]; //queue of new points to process
    }
    this.q = q;
    var counter = 0;
    while(q.length > 0) {
      //process new point
      p = <IMapPoint>q.shift()

      this.map[p.x][p.y] = p;

      
      counter++;
      if(counter > 100) {
        this.lastTestedPoint = p;
        return;
      } 

       // test points to the left right and above
      
      var ptLeft: IMapPoint = {x: p.x-1, y: p.y, direction: "right", dist: (p.dist || 0)+1}
      var ptRight: IMapPoint = {x: p.x+1, y: p.y, direction: "left", dist: (p.dist || 0)+1}
      //var ptUp = {x: p.x, y: p.y-1, direction: "down", dist: p.dist+1}
      var ptDown: IMapPoint = {x: p.x, y: p.y+1, direction: "up", dist: (p.dist || 0)+1}

      
      
      var newPts = [ptLeft, ptRight, //ptUp,
        ptDown
      ]

      newPts.forEach((np)=>{
//       console.log("np", JSON.stringify(np));
        //if block is outside of level range, dont test
        if(np.x < 0 || np.x > window.gameObjects.level().widthInBlocks) return;
        if(np.y < 0 || np.y > window.gameObjects.level().heightInBlocks) return;

        //if the block is already filled in, dont test
        if(!this.map[np.x]) return;
        if(this.map[np.x][np.y]) return;
 
        //if the block is solid, dont test
        if(window.gameObjects.level().blocks[np.x][np.y]) return;

        //We only add points to the map that are "safe ground" that an enemy can stand on, aka ladder and ground

        if(np.direction == "up") {
          //if the direction is up and there is no ladder on the spot, dont test
          if(!this.ladderMap[np.x][np.y]) return;
          else { 
            np.action = "climb";
          }
        }
        else if(np.direction == "right" || np.direction == "left"){
          
          if(window.gameObjects.level().blocks[np.x][np.y+1]){ 
            np.action = "walk";
          }
          else if(this.ladderMap[np.x][np.y]) {
            np.action = "climb";
          }
          else {
            //search for blocks to jump from 
            var blocksToJumpFrom = this.findBlocksToJumpFrom(np)
            // add THEM and not np
            if(blocksToJumpFrom) {
              blocksToJumpFrom.map((obj)=>{
                obj.dist = (p.dist || 0) + 1;
                return obj;
              })
              q = q.concat(blocksToJumpFrom);
            }
            //if we're going left or right and theres no block below to stand on, dont test
            return;
          }

        }

        //we must test, if a point is on the edge of the block, if its possible to "jump" to it
        //  lets define a jump distance of 10 and height of 6 
        //  test every square in that 12 by 10 block to see if its a platform

        
        //we must also test if its possible to "fall" to a square
        //  doing this backwards is way too inefficient because any valid square can be fallen 
        //  towards from a huge amount of squares above it 

        //  therefore after we check jump and ladders to check squares below, we will go and scan for squares above
        //  that can be falling points

        q.push(np);
      })

      //if we have tested everything in the current queue, then look for ledges above from which we 
      //  can fall down to the player
      
      if(q.length == 0) {
        var ledge = this.getNextLedge();
        while(ledge) {
          this.lastAlgorithmStartPoint = ledge;
          var pointToFallTo = this.getPointToFallToFromLedge(ledge);
          if( pointToFallTo != undefined) {
            ledge.action = "fall";
            ledge.fallTo = pointToFallTo;
            ledge.dist = ( pointToFallTo.dist || 0) + 1; //TODO if something breaks this is it lol
            q.push(ledge);
            break;
          }
          else {
            ledge = this.getNextLedge()
          }
        }
      }
    }
  }

  getNextLedge(): IMapPoint | undefined {
    var level = window.gameObjects.level();
    var pt = { x: this.lastAlgorithmStartPoint!.x + 1 , 
      y: this.lastAlgorithmStartPoint!.y } ; 
    while(pt.y >= 0) {
      if(pt.x >= level.widthInBlocks-1) {
        pt.x = 0;
        pt.y = pt.y - 1;
      }
      else {
        pt.x = pt.x + 1;
      }

      //only return this as next ledge if it is not already added to the map
      if(!this.map[pt.x] || !this[pt.y]) {
        //if the block below it is solid, and it is not solid, and either
        //  the block below and to the left or below and to the right is not solid,
        // then this is a ledge

        //console.gameLog(x,y,level.blockAtPoint(pt.x,pt.y+1),  !level.blockAtPoint(pt.x,pt.y))
        if( level.block(pt.x,pt.y+1) &&  !level.block(pt.x,pt.y) 
        && (!level.block(pt.x-1,pt.y+1) ||  !level.block(pt.x+1,pt.y+1))) {

          return pt;
        }
      }
    }
  }

  getPointToFallToFromLedge(ledge): IMapPoint | undefined {
    var level = window.gameObjects.level();

    //for now only allow them to fall straight down
    
    //if we can fall off the ledge to the  left
    if(!level.block(ledge.x-1,ledge.y+1)) {
      var pt : IMapPoint = {x:ledge.x-1,y:ledge.y+1};
    }
    //if we can fall off the ledge to the right
    else {
      var pt : IMapPoint = {x:ledge.x+1,y:ledge.y+1};
    }

    while(!level.block(pt.x,pt.y)){
      pt.y = pt.y+1;
    }
    //if the point has been added to the map (and therefore has a route to the
    //  player) add it, otherwise undefined
    if(this.map[pt.x][pt.y-1]) {
      return this.map[pt.x][pt.y-1];
    }

  }


  findBlocksToJumpFrom(point): IMapPoint[] | undefined {
    //for now only look directly to left or right and down
    var column = point.x;
    var keepGoing = true;
    var jumpDist = 6;
    while(keepGoing) {
      var start = point.y-10;
      var end =  start+25;
      for(var i = start; i < end && i < window.gameObjects.level().heightInBlocks; i++) {
        //if the current block is open and block below it is closed, its a platform
        if(!this.map[column][i]
          && !window.gameObjects.level().block(column,i) && window.gameObjects.level().block(column,i+1)) {
          return [{x: column, y: i, action: "jump", jumpTo: {x: 
            point.direction == "left" ? point.x - 1 : point.x + 1, 
            y:point.y}} ]; 
        }
        //otherwise if its closed, theres no blocks in this column
        else if(window.gameObjects.level().block(column,i)) {
          break;
        }
      }

      if(point.direction == "right") {
        column --;
        if (column < point.x - jumpDist || column <= 0 ) { 
          keepGoing = false; }
      }
      else {
        column ++;
        if(column > point.x + jumpDist || column >= window.gameObjects.level().widthInBlocks ) { 
          keepGoing = false; }
      }
    }
  }

  render(ctx, map) {
    //TODO: enable this to work only in a debug mode
    //return; 
    var camera = window.gameObjects.camera();
    var level = window.gameObjects.level();

    var startBlockX = Math.max(0,Math.floor(camera.p.x / level.blockSize));
    var lastBlockX = Math.floor((camera.p.x + 800)/level.blockSize); 
    var startBlockY = Math.max(0,Math.floor(camera.p.y / level.blockSize));
    var lastBlockY = Math.floor((camera.p.y + 600)/level.blockSize); 


    for(var i = startBlockX; i <= lastBlockX && i < level.blocks.length; i++) {
      if(level.blocks[i]) {
        for(var j = startBlockY; j <= lastBlockY && j < level.blocks[i].length; j++) {

          if(this.map[i][j]) {
            //ctx.fillStyle =actual i == this.lastTestedPoint.x && j == this.lastTestedPoint.y ? "#0000ff" : "rgb(255,"+(100+(4*this.map[i][j].dist))+",255)";
            ctx.beginPath();
            ctx.fillStyle = this.map[i][j].action == "jump" ? "#0000ff" : "rgb(255,"+(100+(4*(this.map[i][j].dist || 0)))+",255)";
            ctx.rect(map.x(i*level.blockSize), map.y(j*level.blockSize), map.w(level.blockSize), map.h(level.blockSize));
            ctx.fill();          
          }
        }
      }
    }

  }

}