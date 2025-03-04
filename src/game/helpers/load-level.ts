import { getLevelDirName } from './get-level-dir-name';
import {  Level } from '../objects/level';
import {  Camera } from '../objects/camera';

import {  GameObjectList } from './game-object-list';
import {  EventQueue } from './event-queue';

import { Vector } from './vector-math/vector';

import { SoldierX } from '../objects/players/soldier-x';
import path from 'path';
let maps: string[] = []
maps[0] = require('../levels/0-test/map.js').default
maps[1] = require('../levels/1-test/map.js').default
maps[2] = require('../levels/2-small-test/map.js').default
maps[3] = require('../levels/3-big-test/map.js').default
maps[4] = require('../levels/4-png-test/map.js').default
maps[5] = require('../levels/5-plane-intro/map.js').default
maps[6] = require('../levels/6-ground-1/map.js').default
maps[7] = require('../levels/7-ground-2/map.js').default
maps[8] = require('../levels/8-ground-3/map.js').default
maps[9] = require('../levels/9-downed-parachuter/map.js').default

let objects: any[] = []
objects[0] = require('../levels/0-test/objects')
objects[1] = require('../levels/1-test/objects')
objects[2] = require('../levels/2-small-test/objects')
objects[3] = require('../levels/3-big-test/objects')
objects[4] = require('../levels/4-png-test/objects')
objects[5] = require('../levels/5-plane-intro/objects')
objects[6] = require('../levels/6-ground-1/objects')
objects[7] = require('../levels/7-ground-2/objects')
objects[8] = require('../levels/8-ground-3/objects')
objects[9] = require('../levels/9-downed-parachuter/objects')

function createLevelObject(mapBuf: string, levelOptions, index) {
  //basically here we want to create a 2D array of whether or not there is a
  //  block in the given location. So we're just converting this information
  //  from a string (actually a Buffer)

  var blocksRaw : boolean[][] = [[]];
  var lineNum = 0;
  var lineLength = -1;
  let mapBufMinusFirstLine = mapBuf.slice(1)
  for(const block of mapBufMinusFirstLine) {
      if(block == '\n'){
        if(blocksRaw[lineNum].length == 0 && lineNum > 0) {
          delete blocksRaw[lineNum];
        }
        else {
          if(lineLength == -1) {
            lineLength = blocksRaw[lineNum].length;
          }
          else {
            if(blocksRaw[lineNum].length != lineLength) {
              throw `This level map has lines of inconsistant length: ${blocksRaw[lineNum].length} != ${lineLength}, please fix! 
              Offense occured on line ${lineNum + 1}`;
            }
          }
          lineNum++;
          blocksRaw[lineNum] = [];
        }
      }
      else {
        blocksRaw[lineNum].push(block == 'X')
      }
    }
  
  //now the problem here is that we have an array of rows, which means that we
  //  will need to query it like blocks[y][x] to get a block at (x,y)

  var blocks : boolean[][] = [[]];
  //lets rotate the array so that this is arranged more logically
  for(var j = 0; j < blocksRaw.length && blocksRaw[j]; j++) {
    for(var i = 0; i < blocksRaw[j].length; i++) {
      if(!blocks[i]){
        blocks[i] = [];
      }
      blocks[i][j] = blocksRaw[j][i];
    }
  }

  var level = new Level(blocks, levelOptions ? levelOptions.blockSize : 10, index);
  //copy all leveloptions over to level
  Object.assign(level, levelOptions);
  return level;
}


export function loadLevel(index: number, entranceEvent?, player?) {
  
  window.context = "loading";

  const mapBuf = maps[index] 
      /*import(path.resolve(__dirname,'../levels/'+dirName+'/objects'))*/
     // lazy()
    //  fetch('/assets/levels/'+dirName+'/map.txt')
      const objectsFile = objects[index]
      //.then((objectsFile)=>{
        let { levelOptions, objectsToLoad, assets } = objectsFile;
        window.gameObjects = new GameObjectList();
        window.gameObjects.register(new Camera(), "camera");
        window.gameEvents = new EventQueue();
        window.gameEvents.push({type:'level-entered'}); 
        window.eventsInWaiting = [];

      
        var level = createLevelObject(mapBuf, levelOptions, index);
      
        //dont do this stuff until weve loaded all assets
        var deferred = function() {
          window.gameObjects.register(level,"level");

          if(!levelOptions) { levelOptions = {} }
      
          if(levelOptions.backgroundImage) {
            level.backgroundImage = document.createElement("img");
            level.backgroundImage.src = levelOptions.backgroundImage;
          }
      
          if(levelOptions.scenery) { 
            level.scenery = levelOptions.scenery
            //i guess we can just add scenery as gameobjects?
            level.scenery.forEach((scenery, index)=>{
              scenery.render = scenery.render.bind(level);
              window.gameObjects.register(scenery, scenery.name + "-" + index);
            })
          
          };
      
          level.blockColor = levelOptions.blockColor;
          level.blockRenderOff = levelOptions.blockRenderOff;
          level.loadTilemap();
      
          if(player) {
            if(entranceEvent) {
              if(entranceEvent.type == "door-entered") {
                player.p.x = entranceEvent.door.destinationX;
                player.p.y = entranceEvent.door.destinationY;
              }
              else if(entranceEvent.type == "bounds-crossed") {
                player.p.x = entranceEvent.bounds.destinationCoordinates(player,level).x;
                player.p.y = entranceEvent.bounds.destinationCoordinates(player,level).y;
              }
            }
            window.gameObjects.register(player,"player")
          }
          //This is a way of making a "default" entrance for different levels so at some point
          //  we can just fuck around with the command line and do like window.loadLevel(100) 
          //  or whatever to test stuff. Needs to be worked out in more detail later
          else {
            var dpp;
            if(levelOptions.defaultPlayerPosition) {
              dpp = levelOptions.defaultPlayerPosition(mapBuf);
            }
            else {
              dpp = {x: 100, y:100 };
            }
            if(levelOptions.playerType) {
              let dpp2 = new Vector(dpp.x, dpp.y);
              window.gameObjects.register(new levelOptions.playerType(dpp2),"player")
            }
            else { 
              window.gameObjects.register(new SoldierX(new Vector(dpp.x,dpp.y)),"player")
            }
          }
      
          if(objectsToLoad) {
            objectsToLoad.forEach((objGen)=> {
              var data = objGen(mapBuf);
              var objs;
              if(Array.isArray(data)) {
                objs = data;
              }
              else {
                objs = [data];
              }

              objs.forEach((obj) => {
                if(obj.noRespawn) {
                  var key = obj.name + "-" + index + "-" + obj.p.x + "-" + obj.p.y;
                  if( window.progressState.deathList[key] ) {
                    //dont add it
                    return;
                  }
                  else {
                    obj.startX = obj.p.x; 
                    obj.startY = obj.p.y;
                  }
                }
                
                window.gameObjects.register(obj);
              })
            })
          }
          
          window.resumeGame();
      
        }
      
        var loaded = {};
        if(Object.keys(assets).length > 0) {
          level.assets = {};
          for(var key in assets) {
            loaded[key] = false;
            var asset = assets[key];
            if(asset.type == "img") {
              level.assets[key] = document.createElement("img");
              level.assets[key].src = asset.src; 
              level.assets[key].onload = ((key) => {
                return () =>{
                  loaded[key] = true;
                  //once there is no false value in the loaded array, render
                  var hasFalse = false;
                  for(var b in loaded) { if(!loaded[b]) hasFalse = true }
                  if(!hasFalse) {
                    deferred();
                  }
                }
              })(key)    }
          }
        }
        else {
          deferred();
        }
      
  //map = map.toString();
  //var objectsFile = fs.readFileSync(path.resolve(__dirname,'../levels/'+dirName+'/objects.js'),"utf8"); 
  //if the objects file is written properly, this will set the objects for the
  // new level in objectsToLoad
  //and options relating to it in levelOptions

  //eval(objectsFile);
  



}