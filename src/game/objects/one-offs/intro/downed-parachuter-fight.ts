import { GameObject } from '../../game-object'
import { Vector } from '../../../helpers/vector-math/vector';

import {  chainEvents } from '../../../helpers/chain-events';
import {  moveTo } from '../../../helpers/animations/move-to';
import {  wait } from '../../../helpers/animations/wait';
import {  letLand } from '../../../helpers/animations/let-land';

import {  PanickedSoldier } from '../../enemies/panicked-soldier';
import {  Display } from '../../display';
import {  Bounds } from '../../portals/bounds';

import { Gravity } from '../../../helpers/motions/enemy/gravity';
import { UpdaterStore } from '../../../helpers/motions/updater-store';
import { SoldierX } from '../../players/soldier-x';
const _ = require('lodash');

var dpPosition = {x: 500, y:430 }

export class DownedParachuterFight implements GameObject  {
  id: string = "DownedParachuterFight";
  name: string = "DownedParachuterFight";
  public p: Vector = new Vector(0,0);
  collidesWith: { [name:string ] : number } = {};
  boxes: Object = {};
  noRespawn: boolean = false;
  alwaysUpdate: boolean = true;
  counter: number = 0;
  deleteMe: boolean = false; 
  tags: { [name:string] : boolean }= {};

  fired: boolean = false;

  constructor() {
  }

  render() {}

  update(events) {
    if(window.saveState.downedParachuterDefeated) {
      this.deleteMe = true;
      return;
    }
    if(window.gameObjects.get("downedParachuter")) {
      dpPosition.x = window.gameObjects.get("downedParachuter").p.x;
      dpPosition.y = window.gameObjects.get("downedParachuter").p.y;
    }
    if(!this.fired) {
      this.fired = true;

      window.gameEvents.push(
        chainEvents([
          { type: "call-function", function: () => {
            window.gameObjects.register(new Display(new Vector(dpPosition.x, dpPosition.y), "assets/enemies/soldier/1.png"),"dpDisplay");
          }},
          
          { type: "wait-for", conditional: ()=> {
            return window.gameObjects.player().p.x > 50 && (<SoldierX>window.gameObjects.player()).onFloor()
          }},
          
          { type: "call-function", function: () => {
            window.context = "animation";
            window.gameObjects.register(new Display(new Vector(dpPosition.x + 5, dpPosition.y - 60), "assets/exclamation.png"),"exclamation");
          }},
          
          {
            type: "wait", time: 15
          },
          
          { type: "call-function", function: () => {
            window.gameObjects.get("dpDisplay").deleteMe = true;
            window.gameObjects.get("exclamation").deleteMe = true;
            window.gameObjects.register(new PanickedSoldier(new Vector(dpPosition.x, dpPosition.y)), "downedParachuter");
          }}


        ])
      );
    }

    if(events.get('enemy-death').length > 0) {
      window.gameEvents.push(

        chainEvents([
          { type: "call-function", function: () => {
            window.gameObjects.register(new Display(new Vector(dpPosition.x, dpPosition.y), "assets/enemies/soldier/1.png"),"dpDisplay");
            window.gameObjects.get("dpDisplay").us = new UpdaterStore([ new Gravity(window.gameObjects.get("dpDisplay")) ] );
          }},
          { type: "animation", animFunction: letLand(window.gameObjects.player, window.gameObjects.get("dpDisplay")) },
          { type: "animation", animFunction: wait(20) },
          { type: "animation", animFunction: moveTo("dpDisplay", 400, 430, 4) },
          { type: "animation", animFunction: wait(20) },
          { type: "animation", animFunction: moveTo("player", 370, 430, 4) },
          { type: "call-function", function: () => (<SoldierX>window.gameObjects.player()).facing = 1 },
          { type: "animation", animFunction: wait(1) },
          { type: "dialogue", dialogue:[
            { speaker:"EVE Soldier", text:"Ow, my leg!"},

            {speaker:"X", text: "Tell me everything you know if you want to live. "},
              
            {speaker:"EVE Soldier", text: "Look I was just doing what they wanted me to do!"},
              
            {speaker:"X", text: "Shut up and tell me what you know. Why were you sent to kill me? "},
              
            {speaker:"EVE Soldier", text: "They wanted you taken out. They..."},
              
            {speaker:"X", text: "What are they planning?"},
              
            {speaker:"EVE Soldier", text: "Look, I don't agree with them, okay? But you know... I don't have a choice but to follow orders! They would kill me too!"},
              
            {speaker:"X", text: "What are they planning? Talk or the next one will hurt worse."},
              
            {speaker:"EVE Soldier", text: "Ok, ok! ... A false flag. They're going to war with China and they're going to do a false flag. Nuclear. Thousands dead probably, on US soil. They thought you would see it. Or tell someone something, or... Look man, they know who you are. They know that you're one of the most capable soldiers in the US Marines. They know that you have a network. They know you're with those patriot guys, the \"don't tread on me\", the whatever. They know you guys follow this stuff. The behind-the-scenes stuff. That you've caught onto things."},
              
            {speaker:"X", text: "Jesus man. Do you have any idea how much of a coward you are?"},
              
            {speaker:"EVE Soldier", text: "Don't judge me! Don't judge me! Kill me if you're going to kill me! Don't just stand there!"},
              
            {speaker:"X", text: "I'm not going to kill you, but you'd better get out of my sight before I change my mind."},
              
            {speaker:"EVE Soldier", text: "Ow! See you in Hell!", },
          ]},
          { type: "animation", animFunction: moveTo("dpDisplay", 700, 430, 4) },
          { type: "dialogue", dialogue:[

            { speaker:"X", text: "Q, did you catch all that?"},
            { speaker:"Q", text: "Yes. It's worse than we thought."}, 
            { speaker:"X", text: "Of all times, why now?"},
            { speaker:"Q", text: "Only God can answer that."},
            
            { speaker:"Q", text: "You know, it's been twenty years that I've been following EYE and the shadow government, and putting things together, and hearing the rumors, and everything, but it never quite sinks in just how evil they are. It always has this veil of unreality to it. But here we are. It's happening. X, you know what you have to do. I'm sorry."},
            
            { speaker:"X", text: "Okay. You're right."}, 
            
            { speaker:"Q", text: "The attack is going to be from MCAS Yuma base in Arizona. That's the only base equipped with a black ops nuclear facility with a major EYE presence. Everything points to there.  We can infiltrate, shut it down. We have the firepower. You alone are worth two hundred men if not more. I'll send a trusted squad of patriots to follow you as backup. You'll get home, don't worry. Simple in-and-out."}, 
            
            { speaker:"X", text: "Okay... I'm not going to be able to get in touch with my wife, I only have the military radio with me. You gotta tell her something. Tell her I had to touch down in Japan because weather, or something like that. But tell her how much I love her. But... well, don't overdo it and make her worry."}, 
            
            { speaker:"Q", text: "Will do."},
            
            { speaker:"X", text: "Okay. I'll get back in the air and I'll radio you."},
          ]},
          { type: "call-function", function:() => {
              window.progressState.level = 9;
              window.progressState.downedParachuterDefeated = true;
              window.saveState = _.cloneDeep(window.progressState);
              window.resumeGame();
            }
          },

          
        ])
      )
    }

  }
}