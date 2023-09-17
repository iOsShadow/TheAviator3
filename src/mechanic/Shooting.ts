import * as THREE from "three";
import { Game } from '../game';
import {Colors} from '../settings';

//region Shooting

export class Projectile {
  damage: number;
  direction: THREE.Vector3;
  speed: number;
  mesh: THREE.Mesh;

  constructor(damage, initialPosition, direction, speed, radius, length, private game: Game) {
    const PROJECTILE_COLOR = Colors.brownDark; // 0x333333

    this.damage = damage;
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, length),
      new THREE.LineBasicMaterial({color: PROJECTILE_COLOR}),
    );
    this.mesh.position.copy(initialPosition);
    this.mesh.rotation.z = Math.PI / 2;
    this.direction = direction.clone();
    this.direction.setLength(1);
    this.speed = speed;
    this.game.sceneManager.add(this);

    this.game.state.statistics.shotsFired += 1;
  }

  tick(deltaTime) {
    this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed * deltaTime));
    this.mesh.position.z *= 0.9;
    // out of screen? => remove
    if (this.mesh.position.x > this.game.world.scene.scale.x) {
      this.remove();
    }
  }

  remove() {
    this.game.sceneManager.remove(this);
    this.game.allProjectiles.splice(this.game.allProjectiles.indexOf(this), 1);
  }
}

export function spawnProjectile(damage, initialPosition, direction, speed, radius, length, game) {
  game.allProjectiles.push(new Projectile(damage, initialPosition, direction, speed, radius, length, game));
}
