//most of the logic for constructing the level object is in helpers/load-level.js
const _ = require('lodash');
import { hexToRgb } from '../helpers/hex-to-rgb';

import { GameObject } from "./game-object";
import { Vector } from '../helpers/vector-math/vector';


export class Level implements GameObject {
  id: string = "Level-unloaded";
  name: string = "Level";
  public p: Vector = new Vector(0,0);
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = [];
  renderOrder: number = 5;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean };
  sprites;

  readonly blocks: boolean[][];
  readonly width: number;
  readonly height: number;
  readonly widthInBlocks: number;
  readonly heightInBlocks: number;

  blockSize: number;
  num: number; //level number
  blockRenderOff: boolean = false; //if true then the level object wont automatically render itself and it must be done through jpgs and stuff
  tileCanvas?: HTMLCanvasElement;
  tilenames:string[][] = [];
  blockColor?:string;
  background:Function|null = null;

  //i forget why i made these but theyre used in load-level
  assets?;
  backgroundImage?;
  scenery?;

  constructor(blocks, blockSize, num) {
    this.blocks = blocks;
    this.blockSize = blockSize;
    this.widthInBlocks = this.blocks.length;
    this.heightInBlocks = this.blocks[0].length;
    this.width = this.widthInBlocks * this.blockSize;
    this.height = this.heightInBlocks * this.blockSize;


    //this.collider = true;
    this.renderOrder= 5;
    this.num = num;
    
    this.tags = {level: true};
  }

  //get world x y to block x y
  pointToBlockCoord (x,y) {
    var blockX = Math.floor(x/this.blockSize);
    var blockY = Math.floor(y/this.blockSize);
    return { x: blockX, y: blockY };
  }


  //function that queries the blocks array and returns true if undefined,
  //  or the value if defined. this is because out-of-bounds is considered solid
  block(x,y) {
    if(!this.blocks[x]) return true;
    return this.blocks[x][y]
      || this.blocks[x][y]==undefined;
  }

  // define a function to test if a given point is within a block
  blockAtPoint (x,y) {
    var p = this.pointToBlockCoord (x,y);

    //by checking for undefined as well we catch out-of-bounds
    return this.blocks[p.x]&&this.blocks[p.x][p.y]
      || !this.blocks[p.x]
      || this.blocks[p.x][p.y]==undefined;
  }

  loadTilemap() {
    if(this.blockRenderOff) { return; }
   // this.tilemap = tilemap;
    this.tileCanvas  = document.createElement('canvas');
    this.tileCanvas.width = this.width*2;
    this.tileCanvas.height = this.height*2;
    this.sprites = { };
    var names = ["3side-down","3side-left","3side-right","3side-up","bottom-left-corner",
    "bottom-right-corner", "bottom-side", "left-side", "parallel-horizontal", "parallel-vert",
  "right-side", "single-block", "top-left-corner", "top-right-corner", "top-side", "inner",
  "top-left-corner-inner","top-right-corner-inner","bottom-left-corner-inner","bottom-right-corner-inner"];

    var loaded = {};
    for(var i = 0; i < names.length; i++) {
      loaded[names[i]] = false;
      this.sprites[names[i]] = document.createElement("img");
      this.sprites[names[i]].src = "assets/tilemaps/basic/"+names[i]+".png";

      this.sprites[names[i]].onload = ((i) => {
        return () =>{
          loaded[names[i]] = true;
          //once there is no false value in the loaded array, render
          var hasFalse = false;
          for(var key in loaded) { if(!loaded[key]) hasFalse = true }
          if(!hasFalse) {
            this.renderTilemap();
          }
        }
      })(i)
    }
    
  }
  renderTilemap() {
    if(typeof this.tileCanvas == "undefined") {
      throw "ERROR: in the level object, renderTilemap() has been called before loadTilemap()"
    }
    var ctx = this.tileCanvas.getContext("2d");
    if(ctx == null) {
      throw "Tile canvas is unexpectedly null";
    }

    this.tilenames = [];
    for(var i = 0; i < this.widthInBlocks; i++) {
      this.tilenames[i] = [];
      for(var j = 0; j < this.heightInBlocks; j++) {
        if(this.block(i,j)) {
          var top = !this.block(i, j-1);
          var left = !this.block(i-1,j);
          var right = !this.block(i+1,j);
          var bottom = !this.block(i,j+1);

          var name;
          if(top && left && right && bottom) {
            name = "single-block";
          }
          else if(!top && !left && !right && !bottom) {
            name = "inner";
            /*
            if(!this.block(i-1,j-1)) { name = "top-left-corner-inner" }
            else if(!this.block(i+1,j-1)) { name = "top-right-corner-inner" }
            else if(!this.block(i-1,j+1)) { name = "bottom-left-corner-inner" }
            else if(!this.block(i+1,j+1)) { name = "bottom-right-corner-inner" }
*/
          }
          else if(top && !left && !right && bottom) {
            name = "parallel-horizontal";
          }
          else if(!top && left && right && !bottom) {
            name = "parallel-vert";
          }
          else if(top && !left && !right && !bottom) {
            name = "top-side";
          }
          else if(!top && left && !right && !bottom) {
            name = "left-side";
          }
          else if(!top && !left && right && !bottom) {
            name = "right-side";
          }
          else if(!top && !left && !right && bottom) {
            name = "bottom-side";
          }
          else if(top && left && !right && !bottom) {
            name = "top-left-corner";
          }
          else if(top && !left && right && !bottom) {
            name = "top-right-corner";
          }
          else if(!top && left && !right && bottom) {
            name = "bottom-left-corner";
          }
          else if(!top && !left && right && bottom) {
            name = "bottom-right-corner";
          }
          else if(top && left && right && !bottom) {
            name = "3side-up";
          }
          else if(top && left && !right && bottom) {
            name = "3side-left";
          }
          else if(top && !left && right && bottom) {
            name = "3side-right";
          }
          else if(!top && left && right && bottom) {
            name = "3side-down";
          }
          if(name) {
            ctx!.drawImage(this.sprites[name],i*this.blockSize*2, j*this.blockSize*2, this.blockSize*2, this.blockSize*2);
            this.tilenames[i][j]= name;
          }
        }
      }
    }

    if(this.blockColor) {
      //change color
      var color = hexToRgb(this.blockColor);
      
      var imageData = ctx.getImageData(0, 0, this.width*2, this.height*2);
      var pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
          // Is this pixel non-transparent ?
          if (pixels[i+3] > 100) {
              pixels[i] = color.r;
              pixels[i + 1] = color.g;
              pixels[i + 2] = color.b;
          }
      }
      ctx.putImageData(imageData,0,0);
    }

  }


  //at some point this should be moved to like a "game manager" object,
  //  putting it here for now. Pause the game when enter is pressed
  //Can't just directly react to the enter-key event because context switching
  // events are processed at the end of the loop not the beginning
  update(events) {
    this.counter++;
    if(events.get('enter-key').length > 0) {
      window.gameEvents.push({type: 'pause'});
    }
  }

  render(ctx, map) {
    //only render if its on camera
    var camera = window.gameObjects.camera();
    var startBlockX = Math.max(0,Math.floor(camera.p.x / this.blockSize));
    var lastBlockX = Math.floor((camera.p.x + 800)/this.blockSize); 
    var startBlockY = Math.max(0,Math.floor(camera.p.y / this.blockSize));
    var lastBlockY = Math.floor((camera.p.y + 600)/this.blockSize); 

    if(!this.blockRenderOff) {
      ctx.drawImage(this.tileCanvas,map.x(0), map.y(0), map.w(this.width), map.h(this.height));
    }/*
    else {
      for(var i = startBlockX; i <= lastBlockX && i < this.blocks.length; i++) {
        if(this.blocks[i]) {
          for(var j = startBlockY; j <= lastBlockY && j < this.blocks[i].length; j++) {
            //draw a square
            ctx.beginPath();
            ctx.fillStyle = "#aa00aa";
            if(this.blocks[i][j]) {

              ctx.rect(map.x(i*this.blockSize), map.y(j*this.blockSize), map.w(this.blockSize+1), map.h(this.blockSize+1));
              
            }
            ctx.fill();
          }
        }
      }
    }*/
  }
}