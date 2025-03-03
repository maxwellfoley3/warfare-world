//NOTE, this is not a high-quality secure RNG, should be fine for gaming though 

export class seedableRNG {
  seed: number;
  
  constructor(seed) {
    this.seed = seed;
  }

  random() {
    var x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

}