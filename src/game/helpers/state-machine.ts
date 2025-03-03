

const _ = require('lodash');
import { StateTransition } from './state-transition';

export class StateMachine {

  actions: Array<Function>;
  currentActions: Array<string>;
  transitions: Array<StateTransition>;
  counters: Array<number>;

  constructor (actions, transitions, initialState) {
    this.actions = actions ? actions : [];
    this.currentActions = initialState;
    this.transitions = transitions ? transitions : [];
    this.counters = [];
    this.currentActions.forEach((state) => {
      this.counters[state] = 0;
    });
  }


  inState(state) {
    return _.find(this.currentActions,(action) => action == state)
  }

  go(events) {
    this.currentActions.forEach((action) => {
      this.counters[action]++;
      if(this.actions[action]) this.actions[action](events, this.counters[action]);
    });

    //TOOD: idle

    this.transitions.forEach((transition) => {

      if(this.inState(transition.from)) {
        var counter = this.counters[transition.from];
        if(transition.condition(events, counter)) {
          if(!transition.cumulative) {
            delete this.counters[transition.from]; 
            this.currentActions = this.currentActions.filter((obj) => obj != transition.from ); 
          }
          else {
            //if a transition is not cumulative, it happens once then gets used up... how to make this happen? 
            // or should it even?
          }
          if(transition.to) {
            if(!this.inState(transition.to)) {
              this.currentActions.push(transition.to);
              this.counters[transition.to] = 0;
            }
          }
        }
      }
    }); 
  }
}