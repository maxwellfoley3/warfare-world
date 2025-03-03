
import * as path from 'path';
import * as fs from 'fs';

var importAll = function(folder, filenames) {
  //joining path of directory 
  // const directoryPath = path.resolve(__dirname, "../../../"+folder);
  //passsing directoryPath and callback function
  // var files = fs.readdirSync(directoryPath);

  var sprites = {}
  filenames.forEach((filename)=>{
    if(filename == ".DS_Store") { return; }
    //cut off end of filename
    //var name = filename.substring(0,filename.indexOf("."));

    sprites[filename] = document.createElement("img");
    sprites[filename].src = folder+"/"+filename+".png";
  
  })
  return sprites;
}

var flip = function(right) {
  //you can draw a canvas on a canvas using the same API as an image, hopefully there are no other weird differences
  //  that will sneek up on me
  var left  = document.createElement('canvas');
  left.width = right.width;
  left.height = right.height;
  var ctx = left.getContext('2d');

  ctx!.translate(left.width, 0);
  ctx!.scale(-1, 1);
  ctx!.drawImage(right, 0, 0);
  return left;
}

//will turn a directory of Walk1.png, Walk2.png etc into Walk1Left, Walk1Right, Walk2Left, Walk2Right
// assumes pictures are stored facing right

var importAllAndFlip = (folder, filenames) => {
  var sprites = importAll(folder, filenames);
  //this.sprites = sprites;
  for(var key in sprites) {
    sprites[key].onload = ((key) => {
      return () =>{
        sprites[key+"Right"] = sprites[key];
        delete sprites[key];
    
        sprites[key+"Left"] = flip(sprites[key+"Right"])
      }
    })(key)    
  }
  
  return sprites;

}

export { importAll, importAllAndFlip }