//for objects that implement the vector thing now
export function growBoxByNew(box,grow,obj) {
  box.x = () => obj.p.x - grow;
  box.y = () => obj.p.y - grow; 
  box.width = obj.width + (grow*2);
  box.height = obj.height +(grow*2); 
}