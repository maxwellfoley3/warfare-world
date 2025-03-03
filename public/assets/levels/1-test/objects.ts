import { Bounds } from '../../objects/portals/bounds';
import { PlatformWalker } from '../../objects/enemies/platform-walker';
import { Snake } from '../../objects/enemies/snake';
import { fromSymbol } from '../../helpers/from-symbol';
import { flatBackground } from '../../helpers/render/flat-background';

let objectsToLoad = [
 () => new Bounds("right", 0, 0, 600, 0, 600),
 (map) => fromSymbol(map,'e',PlatformWalker),
 (map) => fromSymbol(map,'s',Snake)
]

let levelOptions = {
  blockSize: 10,
  blockColor: "#000000",
  background: (ctx) => {
    flatBackground(ctx, "#8899cc")
  }
}

let assets = {}

export { objectsToLoad, assets, levelOptions } 