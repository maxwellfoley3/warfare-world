import { Vector } from '../../helpers/vector-math/vector';


import { fromSymbol } from '../../helpers/from-symbol';
import { flatBackground } from '../../helpers/render/flat-background';


import { PlatformWalker } from '../../objects/enemies/platform-walker';
import { Door } from '../../objects/portals/door';
import { Bounds } from '../../objects/portals/bounds';

//right now the only game object we've made is the bullet, so just add one in 
//  the center of the screen
let objectsToLoad = [
  //this makes it so leaving from the left side of the screen will take you to level 1
  () => new Bounds("left", 1, 0, 600, 0, 600),
  () => new Door(new Vector(30,560),2,50,100),
  () => new PlatformWalker(new Vector(30,540)),

  //adding a feature whre you can define location of an object via a symbol in the
  //  map file

  (map) => fromSymbol(map,'d',Door,3,60,60,),
  (map) => fromSymbol(map,'e',PlatformWalker)
]

let assets = {
  backgroundImage: {type:"img", src:"assets/backgrounds/pink-sky.png"},
  foregroundImage: {type:"img", src:"assets/scenery/shitty-foreground.png"},
  overlay: {type:"img", src:"assets/scenery/0-overlay.png"},
}

let levelOptions = {
  blockSize: 10,
  blockColor: "#0000ff",
  background: function (ctx,map,parallax,draw) {
    let level = window.gameObjects.level();
    draw.image({x:0, y:0},level.assets.backgroundImage,false,"parallax",.6);
  },
  //background:  (ctx) => flatBackground(ctx, "#ff0000"),
  scenery: [
    {
      renderOrder: 6,
      render: function(ctx,map,parallax,draw) {
        let level = window.gameObjects.level();
        draw.image({x:0, y:0},level.assets.overlay,{x:0, y:0},"map");
      }
    },
    {
      renderOrder: 19,
      render: function(ctx,map,parallax,draw) {
        let level = window.gameObjects.level();
        draw.image({x:0, y:0},level.assets.foregroundImage,{x:0, y:200},"parallax",1.4);
      }
    }
  ]
}

export { objectsToLoad, assets, levelOptions } 