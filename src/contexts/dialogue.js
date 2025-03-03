const $ = require('jquery');
var dialogueListener;

//mapper of speakers to image files
var speakerImages = { "EVE Soldier": "assets/dialogue/eye-soldier.png",
  "X": "assets/dialogue/soldier-x.png",
  "Q": "assets/dialogue/q.png" }


//do a jquery tutorial and figure this out https://www.tutorialspoint.com/jquery/
window.contexts.dialogue = {
  load: function(dialogue, next) {
    window.context = "title";

    this.dialogueBox = $( "<div id='dialogue-box'></div>" ).appendTo( "body" );
    this.dialogueBox.css({
      background: "black",
      color: "white",
      position: "relative",
      width: "60%",
      margin: "auto",

      fontSize:"24px",
      textAlign:"center",
      textShadow:"none"
    });

  //  document.body.appendChild(this.dialogueBox);
    
    this.dialogue = dialogue;
    this.next = next;
    this.dialogueIndex = -1;
    this.nextLineOfDialogue()
    /*
    this.dialogueBox.html( (this.dialogue[0].speaker ? this.dialogue[0].speaker + ": " : "" )
      + this.dialogue[0].text );

    this.dialogueBox.css( 
      "margin-top", function() { 
        return $(window).height()*.75 - ($(this).outerHeight())/2 ; 
      },
    );*/
    
    dialogueListener = this.nextLineOfDialogue.bind(this);
    //add key listener
    document.addEventListener('keydown',dialogueListener);

  },

  nextLineOfDialogue: function() {
    this.dialogueIndex++;
    if(this.dialogueIndex < this.dialogue.length) {
      if(this.dialogue[this.dialogueIndex].speaker) {
        $( "<div id='dialogue-box-inner'><div id='dialogue-box-speaker'></div><div id='dialogue-box-text'></div>" ).appendTo( this.dialogueBox );
        $( "#dialogue-box-speaker").html("<img src='"+speakerImages[ this.dialogue[this.dialogueIndex].speaker]+
        "' style='width:100%'></img>"+this.dialogue[this.dialogueIndex].speaker);
        $( "#dialogue-box-speaker").css({display:"inline-block",width:"20%"});
        $( "#dialogue-box-text").html(this.dialogue[this.dialogueIndex].text);
        $( "#dialogue-box-text").css({display:"inline-block",width:"80%"});
      }
      else { 
        $( "#dialogue-box-inner").remove();
        this.dialogueBox.html(  this.dialogue[this.dialogueIndex].text );
      }
      this.dialogueBox.css( 
        "margin-top", function() { 
          return "20px" ; 
        },
      );
    }
    else {
      this.unload();
      if(this.next) {
        this.next()
      }
      else {
        window.resumeGame();
      }
    }
  },

  unload: function() {
    //remove key listener 
    document.removeEventListener('keydown',dialogueListener);

    this.dialogueBox.remove()

  }
}