import { GameObject } from '../game-object'
import { Vector } from '../../helpers/vector-math/vector';

//TODO
//Represents the edge of the screen
//A level will have four slots for a Bounds object, for top left right and bottom
//A bounds object will be responsible for providing a mapping for the players 
//position exiting a level to a position on the new level

export class Bounds implements GameObject {
  id: string = "Bounds-unloaded";
  name: string = "Bounds";
  public p: Vector = new Vector(0,0);
  collidesWith: { [name:string ] : number };
  solid: number = 0;
  boxes: Object;
  renderOrder: number = 6;
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean };
  sprites;

  side: string; //TODO make enum
  destinationIndex: number;
  start: number;
  end: number;
  startOtherSide: number;
  endOtherSide: number;

  render() {}

  constructor(side, destinationIndex, start, end, startOtherSide, endOtherSide){
    this.side = side;
    this.start = start;
    this.destinationIndex = destinationIndex;
    this.end = end;
    this.startOtherSide = startOtherSide;
    this.endOtherSide = endOtherSide;
    this.alwaysUpdate = true; 
    this.boxes = [{}]
    this.collidesWith = {player: 0 };
    this.solid = 0;
    
    this.tags = {interactive: true};

    if(this.side == "left" || this.side == "right") {
      //just make this arbitrarily big so the player cant somehow fly past it
      this.boxes[0].width = 1000;
      this.boxes[0].height = window.gameObjects.level().heightInBlocks * window.gameObjects.level().blockSize;

      this.boxes[0].y = () => 0;

      if(this.side == "left") {
        this.boxes[0].x = () => -999;
      }
      else if(this.side == "right") {
        this.boxes[0].x = () =>  window.gameObjects.level().widthInBlocks * window.gameObjects.level().blockSize - 1;
      }
    }

    else if(this.side == "top" || this.side == "bottom") {
      //just make this arbitrarily big so the player cant somehow fly past it
      this.boxes[0].height = 1000;
      this.boxes[0].width = window.gameObjects.level().widthInBlocks * window.gameObjects.level().blockSize;

      this.boxes[0].x = () => 0;

      if(this.side == "top") {
        this.boxes[0].y = () => -999;
      }
      else if(this.side == "bottom") {
        this.boxes[0].y = () => window.gameObjects.level().heightInBlocks * window.gameObjects.level().blockSize - 1;
      }
    }
  }

  update(events) {
    events.get('collision-'+this.id).forEach((event)=>{
      if(event.with == "player") {
        window.gameEvents.push({
          type: "bounds-crossed",
          bounds: this
        })          
      }
    })

  }

  //from https://stackoverflow.com/questions/5731863/mapping-a-numeric-range-onto-another
  mapRange(x, inMin, inMax, outMin, outMax) {
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  destinationCoordinates(player, newLevel) {
    if(this.side == "top") {
      return {
        x: this.mapRange(player.p.x, this.start, this.end, this.startOtherSide, this.endOtherSide),
        y: newLevel.height - player.height - 5
      }
    }
    if(this.side == "bottom") {
      return {
        x: this.mapRange(player.p.x, this.start, this.end, this.startOtherSide, this.endOtherSide),
        y: 5
      }
    }  
    if(this.side == "left") {
      return {
        x: newLevel.width - player.width - 5,
        y: this.mapRange(player.p.y, this.start, this.end, this.startOtherSide, this.endOtherSide),
      }
    }
    if(this.side == "right") {
      return {
        x: 5,
        y: this.mapRange(player.p.y, this.start, this.end, this.startOtherSide, this.endOtherSide),
      }
    }      
  }
  





}