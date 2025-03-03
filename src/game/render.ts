import { flatBackground } from './helpers/render/flat-background';
import { Vector } from './helpers/vector-math';

import { Camera } from './objects/camera';

import * as _ from 'lodash';

import { hp } from './hud/hp';
//we will render everything at 800x600 and scale it up later
//  can change this resolution later idk what will be best
/*const resolution = {
  width: 800,
  height: 600
};*/  

//class to help with drawing

const imageRenderScale = .2;
class Draw {
  ctx: CanvasRenderingContext2D;
  
  constructor(ctx) {
    this.ctx = ctx;
  }

  image(p:Vector, img, offsets, drawMode, parallaxNumber:number) {
    
    if(!offsets) { offsets = {x: 0, y:0 } }

    if(drawMode == undefined) {
      drawMode = "map";
    }
    if(drawMode == "map") {
      drawMode = "parallax";
      parallaxNumber = 1;
    }
    if(drawMode == "parallax") {
      try {
        this.ctx.drawImage(img, 
          this.parallax(parallaxNumber).x(p.x + (offsets.x * imageRenderScale )),
          this.parallax(parallaxNumber).y(p.y + (offsets.y * imageRenderScale )), 
          this.parallax(parallaxNumber).w(imageRenderScale * img.width), 
          this.parallax(parallaxNumber).h(imageRenderScale * img.height)
        );
      }
      catch(e) { console.log("drawing error" + e); }
    }
    else if(drawMode == "static") {
      try {
        this.ctx.drawImage(img, 
          p.x + (offsets.x * imageRenderScale),
          p.y + (offsets.y * imageRenderScale ),
          imageRenderScale * img.width,
          imageRenderScale * img.height    
        );     
      }
      catch(e) { console.log("drawing error" + e); }
     
    }
  }

  parallax(p) {
    var c =  <HTMLCanvasElement>document.getElementById("gameCanvas");
    var camera = window.gameObjects.camera();
    return {
      x: (x) => { return Math.floor((x - (p*camera.p.x)) * ( c.width / camera.resolution.x )) },
      y: (y) => { return Math.floor((y - (p*camera.p.y)) * ( c.height / camera.resolution.y )) },
      w: (w) => { return Math.floor(w * (c.width / camera.resolution.x ))},
      h: (h) => { return Math.floor(h * (c.height / camera.resolution.y ))},
    }
  }
}

function defaultBackground(ctx) {
  //pink
  flatBackground(ctx, "#ffaaaa");
}

function renderBackground(ctx, map, parallax) {
  //draw a background
  var draw = new Draw(ctx);
  let bg = window.gameObjects.level().background;
  if(bg != null) {
    bg(ctx, map, parallax, draw)
  }
  else {
    defaultBackground(ctx);
  }
}

function renderObjects(ctx, map, parallax) {
  //copying is necessary bc lodash groupBy modifies array in place
  var draw = new Draw(ctx);
  var gameObjectsCopy = Object.assign({}, window.gameObjects.getObjects());
  var gameObjectsRenderOrder = _.groupBy(gameObjectsCopy, (obj) => obj.renderOrder ? obj.renderOrder : 0);
  var keys = Object.keys(gameObjectsRenderOrder).map(obj=>parseInt(obj)).sort((a,b)=>a-b);
  console.gameLog("gameObjectsRenderOrder",gameObjectsRenderOrder, "keys" , keys );
  keys.forEach((order)=> {
    for(var id in gameObjectsRenderOrder[order]) {
      if(gameObjectsRenderOrder[order][id].render) {
        gameObjectsRenderOrder[order][id].render(ctx, map, parallax, draw);
      }
    }
  });
}

export function render (document) {
  //get render targets
  var c = document.getElementById("gameCanvas");
  var dummy = document.getElementById("dummy");

  var resolution = window.gameObjects.camera().resolution;
  //first draw on a dummy canvas thats 800x600 resolution

  //TODO: figure out if we want 2d or webgl as the variable passed in here
  /*
  const dctx = dummy.getContext("2d");
  dctx.imageSmoothingEnabled = false;
  dctx.canvas.height = window.gameObjects.level.height() > resolution.y ? window.gameObjects.level.height() : resolution.y; //canvasHeight;
  dctx.canvas.width = window.gameObjects.level.width() > resolution.x ? window.gameObjects.level.width() : resolution.x;//canvasWidth;
  dctx.translate(-window.gameObjects.camera.x, -window.gameObjects.camera.y); //this line is causing bugs
*/
  //renderObjects(dctx);
  

  //scale what we drew to fit the screen size

  const ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  //resize canvas to match window size while keeping 3:4 resolution  
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  if(windowWidth < windowHeight * 1.33333333) {
    ctx.canvas.width  = windowWidth;
    ctx.canvas.height = Math.ceil(ctx.canvas.width * .75);  
  }
  else {
    ctx.canvas.height  = windowHeight;
    ctx.canvas.width = Math.ceil(ctx.canvas.height * 1.333333333);  
  }

  //copy over the image from dummy
  //ctx.scale(dctx.canvas.width / resolution.x,  dctx.canvas.height / resolution.y);
  ctx.imageSmoothingEnabled = false;

  //mapping of game coordinates to screen
  var camera : Camera = window.gameObjects.camera();



  var parallax = function(p) {
    return {
      x: (x) => { return Math.floor((x - (p*camera.p.x)) * ( c.width / camera.resolution.x )) },
      y: (y) => { return Math.floor((y - (p*camera.p.y)) * ( c.height / camera.resolution.y )) },
      w: (w) => { return Math.floor(w * (c.width / camera.resolution.x ))},
      h: (h) => { return Math.floor(h * (c.height / camera.resolution.y ))},
    }
  }

  var map = parallax(1);

  renderBackground(ctx, map, parallax);
  renderObjects(ctx, map, parallax);

  /*ctx.drawImage(dummy, 0, 0,
    ctx.canvas.width, ctx.canvas.height);
  */
  //center the canvas visually on the screen
  if(ctx.canvas.width < windowWidth) {
    c.style.left = ""+ ((windowWidth - ctx.canvas.width) / 2) + "px";
  }

  window.hud.update();
  //write debug variables
  //window.debugVariables should be an associative array of functions. Call each function to get the 
  //  variable for that frame. We need to do this because we can't get references to primitives
  
  //process each function to get the variables themselves
  var processedDebugVariables = {}
  for(var key in window.debugVariables) {
    processedDebugVariables[key] = window.debugVariables[key]();
  } 
  //render to html
  document.getElementById('debug-text').innerHTML = JSON.stringify(processedDebugVariables);
  

}
