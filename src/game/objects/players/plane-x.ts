
import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';
import { platform } from 'os';

import {  ShootForward } from '../../helpers/motions/player/shoot-forward';
import {  FourWayMove } from '../../helpers/motions/player/4-way-move';
import {  Injury } from '../../helpers/motions/player/injury';

import {  growBoxByNew } from '../../helpers/grow-box-by-new';
import { UpdaterStore } from '../../helpers/motions/updater-store';

export class PlaneX implements GameObject {

  id: string = "PlaneX";
  name: string = "PlaneX";
  public p: Vector;
  velocity: Vector = new Vector(0,0);
  width: number = 10;
  height: number = 10;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  renderOrder: number = 20;
  sprites;
  alwaysUpdate:boolean = true;
  actions;
  counter:number = 0;
  deleteMe:boolean = false;
  us:UpdaterStore;

  readonly facing = 1;

  //when writing new game objects, the constructer MUST take x and y as its first 
  // two parameters if it has a position at all. This is so fromSymbol can work correctly
  constructor(p) {    
    this.p = p;
    
    this.tags = {player: true};

    //in order to have satisfying gameplay, all hitboxes should be "generous", i.e. the player's
    //  hitbox should be smaller than his sprite whereas for example the player's bullets should
    //  be bigger 

    this.collidesWith = {level:0, enemy:1, enemyBullet:1, interactive:2}
    this.boxes = [ { solid: 2 }, {}, {}, ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],0, this);
    growBoxByNew(this.boxes[1],-2,this);
    growBoxByNew(this.boxes[2], 2,this);

    this.us = new UpdaterStore([
      new FourWayMove(this,5),
      new ShootForward(this, 1000),
      new Injury(this)
    ]);

    this.sprites = [ document.createElement("img") ];
    this.sprites[0].src = "assets/plane-x.png";

  }

  
  update(events) {
    this.velocity = new Vector(0, 0);

    this.us.go(events);

    
    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;



  }

  hp() {
    return (<Injury>this.us.get("Injury")).hp;
  }

  render(ctx, map, parallax, draw) {
    //just draw a square
    draw.image(this.p, this.sprites[0], {x: -40, y: 0});

  }

}