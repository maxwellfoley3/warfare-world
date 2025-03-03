import { PlatformWalker } from '../../objects/enemies/platform-walker';
import { IntelligentFollower } from '../../objects/enemies/intelligent-follower';
import { PanickedSoldier } from '../../objects/enemies/panicked-soldier';
import { Door } from '../../objects/portals/door';
import { fromSymbol } from '../../helpers/from-symbol';
import { flatBackground } from '../../helpers/render/flat-background';

let objectsToLoad = [
  (map) => fromSymbol(map,'d',Door,1,200,200),
  (map) => fromSymbol(map,'e',PlatformWalker),
  (map) => fromSymbol(map,'i',IntelligentFollower),
  (map) => fromSymbol(map,'&',PanickedSoldier)

]


let levelOptions = {
  blockSize: 10,
  defaultPlayerPosition: (map) => fromSymbol(map,'p'),
  background: (ctx) => {
    flatBackground(ctx, "#cc9")
  }
}

let assets = []

export { objectsToLoad, assets, levelOptions } 