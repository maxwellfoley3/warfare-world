export function moveToPoint(inX, inY, goalX, goalY, velocity) {
  var dirX = goalX-inX;
  var dirY = goalY-inY;
  var mag = Math.sqrt(dirX*dirX + dirY*dirY);
  if(mag < velocity) { return {x: goalX, y: goalY} }
  return {x: inX + Math.floor((dirX/mag) * velocity), y: inY + Math.floor((dirY/mag) * velocity)};
}