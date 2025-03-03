import { PlatformWalker } from "../../objects/enemies/platform-walker";
import { IntelligentFollower } from "../../objects/enemies/intelligent-follower";
import { Door } from "../../objects/portals/door";
import { Bounds } from "../../objects/portals/bounds";
import { Ladder } from "../../objects/stuff/ladder";
import { fromSymbol } from "../../helpers/from-symbol";
import { flatBackground } from "../../helpers/render/flat-background";
import { Vector } from "../../helpers/vector-math/vector";

let objectsToLoad = [
  (map) => fromSymbol(map,'e',PlatformWalker),
  (map) => fromSymbol(map,'i',IntelligentFollower),
  (map) => fromSymbol(map,'d',Door,1,30,200),
  () => new Bounds("left", 4, 0, 1, 0, 1),
  () => new Bounds("right", 4, 0, 1, 0, 1),
  () => new Ladder(new Vector(150,1500),280) 
]

let levelOptions = {
  blockSize: 10,
  defaultPlayerPosition: (map) => fromSymbol(map,'p'),
  background: (ctx) => {
    flatBackground(ctx, "#ddd")
  }
}

let assets = []

export { objectsToLoad, assets, levelOptions } 