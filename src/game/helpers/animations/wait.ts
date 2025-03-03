export function wait(time) {
  return (counter: number) => {
    if(counter > time) {
      return "end";
    }
  }
}