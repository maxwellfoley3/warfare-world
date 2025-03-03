import { stringify } from "querystring";

export class StateTransition {
  from: string;
  to: string;
  cumulative: boolean;
  //type: string; //TODO make enum
  data: any;
  condition: Function;

  constructor(from, to, cumulative, type, data) {
    this.from = from; //state we are transitioning to
    this.to = to; // state we are transitioning to. can be null
    this.cumulative = cumulative; //whether or not we add the next state on top of this one or switch (ending the current state)
    
    if(type == "condition") {
      this.condition = data;
    }
    else if(type == "counter") {
      this.condition = ((time) => {
        return (events, counter) => counter > time
      })(data);
    }
    else if(type == "random") {
      this.condition = ((odds) => {
        return (events, counter) => {
          return Math.floor(Math.random() * odds) == 0;
        }
      })(data);
    }
    //combo of counter and random 
    else if(type == "compound") {
      this.condition = ((time, odds) => {
        return (events, counter) => counter > time && Math.floor(Math.random() * odds) == 0;
      })(data.time, data.odds);
    }
    else {
      throw "Unexpected type (argument #4). Must be 'condition', 'counter', 'random', or 'compound'"
    }
  }
}