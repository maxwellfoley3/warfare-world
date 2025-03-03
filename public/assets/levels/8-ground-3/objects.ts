import { Snake } from "../../objects/enemies/snake";
import { Bee } from "../../objects/enemies/bee";
import { Spike } from "../../objects/stuff/spike";
import { PlatformWalker } from "../../objects/enemies/platform-walker";
import { Bounds } from "../../objects/portals/bounds";
import { SoldierX } from "../../objects/players/soldier-x";
import { fromSymbol } from "../../helpers/from-symbol";

let objectsToLoad = [
  (map) => fromSymbol(map,'s',Snake),
  (map) => fromSymbol(map,'b',Bee),
  (map) => fromSymbol(map,'$',Spike),
  (map) => fromSymbol(map,'p',PlatformWalker),
  () => new Bounds("left", 7, 0, 600, 0, 600),
  () => new Bounds("right", 9, 0, 600, 0, 600),
]

let assets = {
  backgroundImage: { type: "img", src: "assets/backgrounds/desert-background.png" },
  overlay: { type: "img", src: "assets/scenery/8-overlay.png" },
  //underlay: { type: "img", src: "assets/scenery/9-underlay.png" },
}

let levelOptions = {
  blockSize: 10,
  blockRenderOff: true,

  playerType: SoldierX,
  defaultPlayerPosition: () => { return {x:120, y:190} },
  background: function (ctx,map,parallax,draw)  {
    let level = window.gameObjects.level();
    draw.image({x:0, y:0},level.assets.backgroundImage,false,"parallax",.2);
  },
  scenery: [
    {
      renderOrder: 8,
      render: function(ctx,map,parallax,draw) {
        let level = window.gameObjects.level();
        draw.image({x:0, y:0},level.assets.overlay,{x:0, y:0},"map");
      }
    },
  ]
}

export { objectsToLoad, assets, levelOptions } 