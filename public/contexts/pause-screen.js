var pauseScreenListener;

window.contexts.pauseScreen = {
  load: function() {
    window.context = "pause-screen"; //This line pauses the game

    var pauseScreen = document.createElement("div");
    pauseScreen.id = "pause-screen";
    Object.assign(pauseScreen.style,{
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

    pauseScreen.innerHTML = "PAUSED: Press enter to resume";

    document.body.appendChild(pauseScreen);
    pauseScreenListener = (this.returnKeyListener).bind(this)
    //add key listener
    document.addEventListener('keydown', pauseScreenListener);
  },

  returnKeyListener: function(event) {
    if(event.keyCode == 13) {
      this.unload();
      window.resumeGame();
    }
  },

  unload: function() {
    //remove key listener 
    document.removeEventListener('keydown', pauseScreenListener);

  //  var element = document.getElementById("pause-screen");
    var element = document.getElementById("pause-screen");
    element.parentNode.removeChild(element);
  }
}