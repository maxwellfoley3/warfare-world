var victoryScreenListener;

window.contexts.victoryScreen = {
  load: function() {
    window.context = "victory-screen";

    var v = document.createElement("div");
    v.id = "victory-screen";
    Object.assign(v.style,{
      background: "black",
      color: "white",
      position: "relative",
      width: "30%",
      margin: "auto",
      marginTop: "20%",
      fontSize:"24px",
      textAlign:"center",
      textShadow:"none"
    });

    v.innerHTML = "You won!";

    document.body.appendChild(v);
    victoryScreenListener = (this.keyListener).bind(this)
    //add key listener
    document.addEventListener('keydown', victoryScreenListener);
  },

  keyListener: function(event) {
    if(event.keyCode == 13) {
      this.unload();
      window.contexts.titleScreen.load();
    }
  },

  unload: function() {
    //remove key listener 
    document.removeEventListener('keydown', victoryScreenListener);

  //  var element = document.getElementById("pause-screen");
    var element = document.getElementById("victory-screen");
    element.parentNode.removeChild(element);
  }
}