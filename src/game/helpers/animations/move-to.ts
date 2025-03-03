import { moveToPoint } from '../vector-math/move-to-point';

export function moveTo(id, toX, toY, velocity) {

  return (counter: number) => {
    var obj = window.gameObjects.get(id);

    if(obj.p.x != toX || obj.p.y != toY) {
      var pos = moveToPoint(obj.p.x, obj.p.y, toX, toY, velocity);
      obj.p.x = pos.x;
      obj.p.y = pos.y;
    }
    else  {
      return "end";
    }

  }
}