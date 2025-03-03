//All this is for now is provide access to a  map of arrays
// that we can query and push new events to quickly.
export class EventQueue {
  q: any;
  constructor(otherEventQueue? : EventQueue) {
    if(otherEventQueue) {
      //this allows to create a deep copy of another event queue
      this.q = Object.assign(otherEventQueue.q, {});
    }
    else {
      this.q = {};

    }
  }

  push(event) {
    //if there already exists an array of events of this type, add it
    if(this.q[event.type]) {
      this.q[event.type].push(event)
    }
    else {
      //otherwise create a new array with a single object
      this.q[event.type] = [event];
    }
  }

  get(eventType) {
    if(this.q[eventType]) {
      return this.q[eventType];
    }
    else {
      return [];
    }
  }
  
  clear() {
    this.q = {};
  }
}