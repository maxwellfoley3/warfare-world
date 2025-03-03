import { Updater } from "./updater";
import * as _ from 'lodash';

export class UpdaterStore {
  private updaters: { [name:string ] : Updater } = {};

  constructor(us: Updater[]) {
    for(var i = 0; i < us.length; i++){
      this.updaters[us[i].name] = us[i];
    }
  }

  go(events) {
    let ordered = _.orderBy(this.updaters, ['priority'], ['asc']);
    for(let key in ordered) {
      ordered[key].update(events);
    }
  }

  get(key) {
    return this.updaters[key];
  }
}