export class Vector {
  constructor(public x: number, public y: number) {
    this.x = x;
    this.y = y;
  }

  static distance(vec1: Vector, vec2: Vector) {
    return Math.sqrt(Math.pow(vec2.x - vec1.x,2) + Math.pow(vec2.y - vec1.y,2));
  }

  magnitude() {
    return Vector.distance(this, new Vector(0, 0));
  }

  unit() {
    return new Vector(this.x / this.magnitude(), this.y / this.magnitude())
  }

}