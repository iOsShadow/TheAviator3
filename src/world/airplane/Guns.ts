import * as THREE from "three";
import TweenMax from 'gsap';
import {Colors} from '../../settings';
import { spawnProjectile } from '../../mechanic/Shooting';
import { Game } from '../../game';
import { spawnParticles } from '../../utils/utils';

//region Guns
export class SimpleGun {
  mesh: THREE.Group;
  constructor(private game: Game) {
    this.mesh = SimpleGun.createMesh();
    this.mesh.position.z = 28;
    this.mesh.position.x = 25;
    this.mesh.position.y = -8;
  }

  static createMesh() {
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      flatShading: true,
      roughness: 0.5,
      metalness: 1.0,
    });
    const BODY_RADIUS = 3;
    const BODY_LENGTH = 20;
    const full = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(BODY_RADIUS, BODY_RADIUS, BODY_LENGTH),
      metalMaterial,
    );
    body.rotation.z = Math.PI / 2;
    full.add(body);

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(BODY_RADIUS / 2, BODY_RADIUS / 2, BODY_LENGTH),
      metalMaterial,
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.x = BODY_LENGTH;
    full.add(barrel);
    return full;
  }

  downtime() {
    return 0.1;
  }

  damage() {
    return 1;
  }

  shoot(direction: THREE.Vector3) {
    const BULLET_SPEED = 0.5;
    const RECOIL_DISTANCE = 4;
    const RECOIL_DURATION = this.downtime() / 1.5;

    const position = new THREE.Vector3();
    this.mesh.getWorldPosition(position);
    position.add(new THREE.Vector3(5, 0, 0));
    spawnProjectile(this.damage(), position, direction, BULLET_SPEED, 0.3, 3, this.game);

    // Little explosion at exhaust
    spawnParticles(position.clone().add(new THREE.Vector3(2, 0, 0)), 1, Colors.orange, 0.2, this.game.world.scene);

    // audio
    this.game.audioManager.play('shot-soft');

    // Recoil of gun
    const initialX = this.mesh.position.x;
    TweenMax.to(this.mesh.position, {
      duration: RECOIL_DURATION / 2,
      x: initialX - RECOIL_DISTANCE,
      onComplete: () => {
        TweenMax.to(this.mesh.position, {
          duration: RECOIL_DURATION / 2,
          x: initialX,
        });
      },
    });
  }
}

export class DoubleGun {
  gun1: SimpleGun;
  gun2: SimpleGun;
  mesh: THREE.Group;
  constructor(private game: Game) {
    this.gun1 = new SimpleGun(this.game);
    this.gun2 = new SimpleGun(this.game);
    this.gun2.mesh.position.add(new THREE.Vector3(0, 14, 0));
    this.mesh = new THREE.Group();
    this.mesh.add(this.gun1.mesh);
    this.mesh.add(this.gun2.mesh);
  }

  downtime() {
    return 0.15;
  }

  damage() {
    return this.gun1.damage() + this.gun2.damage();
  }

  shoot(direction: THREE.Vector3) {
    this.gun1.shoot(direction);
    this.gun2.shoot(direction);
  }
}

export class BetterGun {
  mesh: THREE.Group;
  constructor(private game: Game) {
    this.mesh = BetterGun.createMesh();
    this.mesh.position.z = 28;
    this.mesh.position.x = -3;
    this.mesh.position.y = -5;
  }

  static createMesh() {
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      flatShading: true,
      roughness: 0.5,
      metalness: 1.0,
    });
    const BODY_RADIUS = 5;
    const BODY_LENGTH = 30;
    const full = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(BODY_RADIUS, BODY_RADIUS, BODY_LENGTH),
      metalMaterial,
    );
    body.rotation.z = Math.PI / 2;
    body.position.x = BODY_LENGTH / 2;
    full.add(body);

    const BARREL_RADIUS = BODY_RADIUS / 2;
    const BARREL_LENGTH = BODY_LENGTH * 0.66;
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(BARREL_RADIUS, BARREL_RADIUS, BARREL_LENGTH),
      metalMaterial,
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.x = BODY_LENGTH + BARREL_LENGTH / 2;
    full.add(barrel);

    const TIP_RADIUS = BARREL_RADIUS * 1.3;
    const TIP_LENGTH = BODY_LENGTH / 4;
    const tip = new THREE.Mesh(
      new THREE.CylinderGeometry(TIP_RADIUS, TIP_RADIUS, TIP_LENGTH),
      metalMaterial,
    );
    tip.rotation.z = Math.PI / 2;
    tip.position.x = BODY_LENGTH + BARREL_LENGTH + TIP_LENGTH / 2;
    full.add(tip);
    return full;
  }

  downtime() {
    return 0.1;
  }

  damage() {
    return 5;
  }

  shoot(direction: THREE.Vector3) {
    const BULLET_SPEED = 0.5;
    const RECOIL_DISTANCE = 4;
    const RECOIL_DURATION = this.downtime() / 3;
    const position = new THREE.Vector3();
    // position = position.clone().add(new THREE.Vector3(11.5, -1.3, 7.5))
    this.mesh.getWorldPosition(position);
    position.add(new THREE.Vector3(12, 0, 0));
    spawnProjectile(this.damage(), position, direction, BULLET_SPEED, 0.8, 6, this.game);

    // Little explosion at exhaust
    spawnParticles(position.clone().add(new THREE.Vector3(2, 0, 0)), 3, Colors.orange, 0.5, this.game.world.scene);

    // audio
    this.game.audioManager.play('shot-hard');

    // Recoil of gun
    const initialX = this.mesh.position.x;
    TweenMax.to(this.mesh.position, {
      duration: RECOIL_DURATION,
      x: initialX - RECOIL_DISTANCE,
      onComplete: () => {
        TweenMax.to(this.mesh.position, {
          duration: RECOIL_DURATION,
          x: initialX,
        });
      },
    });
  }
}
