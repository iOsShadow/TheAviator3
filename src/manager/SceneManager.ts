import {Mesh, Object3D} from 'three';
import {Game} from '../game';

//region Game managers
export class SceneManager {
  list: Set;
  constructor(private game: Game) {
    this.list = new Set();
  }

  add(obj) {
    this.game.world.scene.add(obj.mesh);
    this.list.add(obj);
  }

  remove(obj) {
    this.game.world.scene.remove(obj.mesh);
    this.list.delete(obj);
  }

  clear() {
    for (const entry of this.list) {
      this.remove(entry);
    }
  }

  tick(deltaTime: any) {
    this.list.forEach(entry => {
      if (entry.tick) {
        entry.tick(deltaTime);
      }
    });

    for (const key in this.list) {
      const entry = this.list[key];
      if (entry.tick) {
        entry.tick(deltaTime);
      }
    }
  }
}
