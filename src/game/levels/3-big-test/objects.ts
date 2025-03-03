import { fromSymbol } from "../../helpers/from-symbol";
import { PlatformWalker } from "../../objects/enemies/platform-walker";
import { IntelligentFollower } from "../../objects/enemies/intelligent-follower";
import { flatBackground } from "../../helpers/render/flat-background";

let objectsToLoad = [
  (map) => fromSymbol(map,'e',PlatformWalker),
  (map) => fromSymbol(map,'i',IntelligentFollower),
]

let levelOptions = {
  blockSize: 10,
  background: (ctx) => {
    flatBackground(ctx, "#bfb")
  }
}

let assets = []

export { objectsToLoad, assets, levelOptions } 