import { IntroLandingScreen } from "../../objects/one-offs/intro/landing-screen";
import { Snake } from "../../objects/enemies/snake";
import { Bee } from "../../objects/enemies/bee";
import { PlatformWalker } from "../../objects/enemies/platform-walker";
import { SoldierX } from "../../objects/players/soldier-x";
import { Bounds } from "../../objects/portals/bounds";
import { Spike } from "../../objects/stuff/spike";
import { fromSymbol } from "../../helpers/from-symbol";

let objectsToLoad = [
  () => new IntroLandingScreen(),
  (map) => fromSymbol(map,'s',Snake),
  (map) => fromSymbol(map,'b',Bee),
  (map) => fromSymbol(map,'$',Spike),
  (map) => fromSymbol(map,'p',PlatformWalker),
  () => new Bounds("right", 7, 0, 600, 0, 600),

]

let assets = {
  backgroundImage: { type: "img", src: "assets/backgrounds/desert-background.png" },
  overlay: { type: "img", src: "assets/scenery/6-overlay.png" },
  foregroundImage: { type: "img", src: "assets/scenery/6-foreground.png" }
}

let levelOptions = {
  blockSize: 10,
  blockColor: "#0000ff",
  blockRenderOff: true,
  playerType: SoldierX,
  defaultPlayerPosition: () => { return {x:350, y:190} },
  background: function (ctx,map,parallax,draw) {
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
    {
      renderOrder: 19,
      render: function(ctx,map,parallax,draw) {
        let level = window.gameObjects.level();
        draw.image({x:0, y:0},level.assets.foregroundImage,{x:0, y:-250},"parallax",1.4);
      }
    }
  ]
}

export { objectsToLoad, assets, levelOptions } 