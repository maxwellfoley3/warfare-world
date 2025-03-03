import { growBoxByNew } from '../../helpers/grow-box-by-new';
import * as _ from 'lodash';
import { PostBullet } from './post-bullet';

import { Vector } from '../../helpers/vector-math/vector';
import { GameObject } from '../game-object';
export class EnemyBullet implements GameObject {
  id: string = "";
  name: string = "EnemyBullet";
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

    
    this.tags = { enemyBullet : true };

    //every game object will need to have a box variable that does collision detection
    this.collidesWith = {level:0, player:0}
    this.boxes = [ { } ];

    //helper method to make the enemy box 2 pixels smaller on each side
    growBoxByNew(this.boxes[0],0, this);

    //Bullets will only stay alive for a quarter second then disappear
    this.lifetime = lifetime;

    this.actions = {};
    this.actions.idle = () => {
      this.deleteMe = true;
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

    var collisionsWithPlayer = _.filter(collisions, (obj) => {
      return obj.with == "player";
    })

    if(collisionsWithPlayer.length > 0) {
      this.deleteMe = true;
      window.gameObjects.register( new PostBullet(this.p));
      return;
    }

    this.p.x += this.velocity.x;
    this.p.y += this.velocity.y;

    if(this.counter > this.lifetime) {
      this.deleteMe = true;
    }
  }

  render(ctx,map,parallax,draw) {
    //just draw a square
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.rect(map.x(this.p.x), map.y(this.p.y), map.w(this.width), map.h(this.height));
    ctx.fill();

  }

}