import * as fs from 'fs';
import * as path from 'path';

const levels = [
  '0-test',
  '1-test',
  '2-small-test',
  '3-big-test',
  '4-png-test',
  '5-plane-intro',
  '6-ground-1',
  '7-ground-2',
  '8-ground-3',
  '9-downed-parachuter'
]
export function getLevelDirName(index: number) {
  return levels[index]
  //this should be a list of all files within the levels folder
  /*
  var levelsList = fs.readdirSync(path.resolve(__dirname,'../levels/'));
  for(var i = 0; i < levelsList.length; i++) {
    if(levelsList[i].startsWith(""+index+"-")) {
      return levelsList[i];
    }
  }
  throw "There is no level with index " + index + " in the current app directory";
  */
}