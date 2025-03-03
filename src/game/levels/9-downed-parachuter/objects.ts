import { DownedParachuterFight } from "../../objects/one-offs/intro/downed-parachuter-fight";
import { Bounds } from "../../objects/portals/bounds";
import { SoldierX } from "../../objects/players/soldier-x";

let objectsToLoad = [
  () => new DownedParachuterFight(),
  () => new Bounds("left", 8, 0, 600, 0, 600),
]

let assets = {
  backgroundImage: { type: "img", src: "assets/backgrounds/desert-background.png" },
  overlay: { type: "img", src: "assets/scenery/9-overlay.png" },
  underlay: { type: "img", src: "assets/scenery/9-underlay.png" },
}

let levelOptions = {
  blockSize: 10,
  blockRenderOff: true,

  playerType: SoldierX,
  defaultPlayerPosition: () => { return {x:10, y:200} },
  background: function (ctx,map,parallax,draw)  {
    let level = window.gameObjects.level();
    draw.image({x:0, y:0},level.assets.backgroundImage,false,"parallax",.2);
  },
  scenery: [
    {
      renderOrder: 6,
      render: function(ctx,map,parallax,draw) {
        let level = window.gameObjects.level();
        draw.image({x:0, y:0},level.assets.overlay,{x:0, y:0},"map");
      }
    },
    {
      renderOrder: 2,
      render: function(ctx,map,parallax,draw) {
        let level = window.gameObjects.level();
        draw.image({x:0, y:0},level.assets.underlay,{x:0, y:0},"map");
      }
    }
  ]
}

export { objectsToLoad, assets, levelOptions } 