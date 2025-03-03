//pass in an array of events and this function will
//  return a single event that will fire one after another using the
// next function of the events
// animation and dialogue events are the only ones supported
//  for now

export function chainEvents(arr) {
  var funcs: Function[]  = [] ;
  for(var i = arr.length-1; i >= 0; i--) {
    var event = arr[i];
    var data;
    if(event.type == "call-function") {
      funcs[i] = (
        (i, event) => { 
          return () => {             
            event.function(); 
            if(i < arr.length-1) { funcs[i+1](); }

          }
        })(i, event)
    }
    else if(event.type == "wait") {
      funcs[i] = ((i, event)=>{
        return () => {
          window.eventsInWaiting.push({ type:"counter", counter: event.time, function: funcs[i+1] });
          if(window.context != "game") {
            window.resumeGame();
          }
        }
      })(i, event);
    }
    else if(event.type == "wait-for") {
      funcs[i] = ((i, event)=>{
        return () => {
          window.eventsInWaiting.push({ type:"conditional", conditional: event.conditional, function: funcs[i+1] });
          if(window.context != "game") {
            window.resumeGame();
          }
        }
      })(i, event);
    }
    else {
      if(event.type == "dialogue") {
        data = event.dialogue;
      }
      if(event.type == "animation") {
        data = event.animFunction;
      }
      if(i == arr.length -1) {
        funcs[i] = 
          ((data, event) => { 
            return () => window.contexts[event.type].load(data);
          })(data, event);
      }
      else {
        funcs[i] = ((i, data, event) => { 
          return () => { 
            window.contexts[event.type].load(data,funcs[i+1])
          }
        })(i, data, event);
      }
    }
  }
  return {type: "call-function", function: funcs[0] } ;

}