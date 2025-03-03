var magnitude = function(vec) {
  if(vec.x == undefined || vec.y == undefined) {
    throw "You need to pass an object with an x and a y to the magnitude function"
  }
  return distance(vec, {x:0, y:0});
}

var distance = function(vec1, vec2) {
  if(vec1.x == undefined || vec1.y == undefined 
  ||   vec2.x == undefined || vec2.y == undefined ) {
    throw "You need to pass two objects with xs and ys to the distance function"
  }
  return Math.sqrt(Math.pow(vec2.x - vec1.x,2) + Math.pow(vec2.y - vec1.y,2));


}

var unit = function(vec) {
  if(vec.x == undefined || vec.y == undefined) {
    throw "You need to pass an object with an x and a y to the unit vector function"
  }
  return {x: vec.x / magnitude(vec), y: vec.y / magnitude(vec)}
}
module.exports = {
  magnitude: magnitude,
  distance: distance,
  unit: unit
}