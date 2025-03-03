import { hp } from './hp';
import { SoldierX } from '../objects/players/soldier-x';

export class HUD {
  elements : any;
  constructor(document) {
    this.elements = {};
    this.elements.hp = hp(document);
    for(let name in this.elements){
      document.body.appendChild(this.elements[name]);
    }
  }
  update() {
    if(window.gameObjects.player()) {
      this.elements.hp.innerHTML = "HP: " 
      + (<SoldierX>window.gameObjects.player()).hp();
    }
  }
}