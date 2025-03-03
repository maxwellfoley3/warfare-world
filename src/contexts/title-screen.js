var titleScreenListener;

window.contexts.titleScreen = {
  load: function() {
    window.context = "title";
    var div = document.createElement("div");
    div.id = "title-screen";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.background = "red";
    div.style.color = "white";
    div.style.position = "absolute";
    div.style.top = "0px";
    div.style.left = "0px";
    div.style.fontSize = "120px";
    div.style.textShadow = "5px 5px #000";
    div.innerHTML = "Warfare World";
    
    var pressAnyKey = document.createElement("div");
    pressAnyKey.id = "press-any-key";
    Object.assign(pressAnyKey.style,{
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

    pressAnyKey.innerHTML = "Press any key to begin";

    div.appendChild(pressAnyKey);

    document.body.appendChild(div);
    
    titleScreenListener = this.start.bind(this);
    //add key listener
    document.addEventListener('keydown',titleScreenListener);
  },

  start: function() {
    this.unload();
    window.startGame();
  },

  unload: function() {
    //remove key listener 
    document.removeEventListener('keydown',titleScreenListener);

    var element = document.getElementById("title-screen");
    element.parentNode.removeChild(element);
  }
}