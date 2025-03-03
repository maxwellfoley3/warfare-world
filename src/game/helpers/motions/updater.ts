import { GameObject } from '../../objects/game-object';
export interface Updater {
  go: GameObject;
  update: Function;
  priority: number;
  name: string;
}