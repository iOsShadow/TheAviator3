import {Colors} from '../settings';

//region Shooting
let allProjectiles = [];

class Projectile {
  constructor(damage, initialPosition, direction, speed, radius, length) {
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
    sceneManager.add(this);

    game.statistics.shotsFired += 1;
  }

  tick(deltaTime) {
    this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed * deltaTime));
    this.mesh.position.z *= 0.9;
    // out of screen? => remove
    if (this.mesh.position.x > MAX_WORLD_X) {
      this.remove();
    }
  }

  remove() {
    sceneManager.remove(this);
    allProjectiles.splice(allProjectiles.indexOf(this), 1);
  }
}

function spawnProjectile(damage, initialPosition, direction, speed, radius, length) {
  allProjectiles.push(new Projectile(damage, initialPosition, direction, speed, radius, length));
}
