export function letLand(...args) {

  return (counter: number) => {
    var allOnFloor = true;
    args.forEach(obj =>{ 
      if(obj && obj.actions && obj.actions.gravity && !obj.onFloor) { 
        obj.y += obj.velocity.y;
        allOnFloor = false 
      }

    })

    if(allOnFloor)  {
      return "end";
    }

  }
}