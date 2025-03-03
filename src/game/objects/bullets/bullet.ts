import { growBoxByNew } from '../../helpers/grow-box-by-new';
import * as _ from 'lodash';

import { PostBullet } from './post-bullet';

import { Vector } from '../../helpers/vector-math/vector';
import { GameObject } from '../game-object';

export class Bullet implements GameObject {
  id: string = "";
  name: string = "Bullet";
  public p: Vector;
  velocity: Vector = new Vector(0, 0);;
  width: number = 10;
  height: number = 10;
  tags: { [name:string] : boolean };
  collidesWith: { [name:string ] : number };
  boxes: Object;
  renderOrder: number = 8;
  sprites;
  actions;
  noRespawn: boolean = false;
  counter: number = 0;
  deleteMe: boolean = false;

  lifetime: number;

  constructor(p, velocity, lifetime) {    
    this.p = p;
    this.velocity = velocity;

    this.tags = { playerBullet : true };

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {level:0, enemy:1}
    this.boxes = [ { }, {} ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],-3, this);
    growBoxByNew(this.boxes[1],2,this);

    //Bullets will only stay alive for a quarter second then disappear
    this.lifetime = lifetime;

    this.actions = {};
    this.actions.idle = () => {
      this.deleteMe = true;
    }

    this.sprites = {};
    for(var i = 1; i <= 6; i++) {
      this.sprites[i+"Left"] = document.createElement("img");
      this.sprites[i+"Left"].src = "assets/soldier-x/bullet/"+i+"-left.png";
      this.sprites[i+"Right"] = document.createElement("img");
      this.sprites[i+"Right"].src = "assets/soldier-x/bullet/"+i+"-right.png";

    }

  }

  update(events) {
    //remove a bullet whenever it hits the level
    var collisions = events.get('collision-'+this.id);
    var collisionsWithLevel = _.filter(collisions, (obj) => {
      return obj.with == "level";
    });


    if(collisionsWithLevel.length > 0) {
      this.deleteMe = true;
      return;
    }

    var collisionsWithEnemy = _.filter(collisions, (obj) => {
      return (window.gameObjects.get(obj.with)
      && window.gameObjects.get(obj.with).tags 
      && window.gameObjects.get(obj.with).tags.enemy);
    });


    if(collisionsWithEnemy.length > 0) {
      //little animation that appears when you successfully hit an enemy
      this.deleteMe = true;
      window.gameObjects.register( new PostBullet(this.p));
      return;
    }



    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;

    this.counter++;
    if(this.counter > this.lifetime) {
      this.deleteMe = true;
    }
  }

  render(ctx, map) {
    if(this.counter > 0) {
      var half = Math.ceil(this.counter/2);
      ctx.drawImage(
        this.sprites[(half < 6 ? half : 6) + (this.velocity.x < 0 ? "Left" : "Right")], 
        map.x(this.velocity.x < 0 ? this.p.x : this.p.x-90), 
        map.y(this.p.y), 
        map.w(100), 
        map.h(10));
    }
    

  }

}