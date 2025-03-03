import { IntroScreen } from "../../objects/one-offs/intro/intro-screen";
import { PlaneX } from "../../objects/players/plane-x";

let objectsToLoad = [
  () => new IntroScreen()
]

let assets = {
  backgroundImage: { type: "img", src: "assets/backgrounds/blue-sky.png" },
}

let levelOptions = {
  blockSize: 10,
  playerType: PlaneX,
  defaultPlayerPosition: () => { return {x:200, y:250} },
  background: function (ctx,map,parallax,draw) {
    let level = window.gameObjects.level();
    //looping animated background to give the illusion of motion
    var counter = window.gameObjects.level().counter; 
    var width = level.assets.backgroundImage.width/5;
    //lets just have the image move at 1 px for frame for now... see how that goes
    var offset = counter % width; 
    draw.image({x:-1*offset, y:0},level.assets.backgroundImage);
    if(width - offset < 800) {
      draw.image({x:(-1*offset) + width, y:0},level.assets.backgroundImage);
    }
  },  
}

export { objectsToLoad, assets, levelOptions } 