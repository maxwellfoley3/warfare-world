export function hp(document) {
  var hp = document.createElement("div");
  hp.id = "hp";
  Object.assign(hp.style,{
    background: "black",
    color: "red",
    position: "absolute",
    top: "5%",
    left: "0px",
    fontSize:"18px",
    textAlign:"center",
  });
  return hp;
}