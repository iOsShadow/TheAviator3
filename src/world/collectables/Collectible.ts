import * as THREE from "three";
import { Game } from "../../game";
import { COLOR_COLLECTIBLE_BUBBLE } from "../../settings";
import { rotateAroundSea, spawnParticles } from "../../utils/utils";
import { SimpleGun, BetterGun, DoubleGun } from "../airplane/Guns";
import { collide } from "../../utils/utils";
import { gsap } from "gsap";

//region Collectibles
class Collectible {
  angle: number;
  distance: number;
  mesh: THREE.Object3D;
  onApply: () => void;

  constructor(
    mesh,
    onApply,
    private game: Game,
  ) {
    this.angle = 0;
    this.distance = 0;
    this.onApply = onApply;

    this.mesh = new THREE.Object3D();
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(10, 100, 100),
      new THREE.MeshPhongMaterial({
        color: COLOR_COLLECTIBLE_BUBBLE,
        transparent: true,
        opacity: 0.4,
        flatShading: true,
      }),
    );
    this.mesh.add(bubble);
    this.mesh.add(mesh);
    this.mesh.castShadow = true;

    // for the angle:
    //   Math.PI*2 * 0.0  => on the right side of the sea cylinder
    //   Math.PI*2 * 0.1  => on the top right
    //   Math.PI*2 * 0.2  => directly in front of the plane
    //   Math.PI*2 * 0.3  => directly behind the plane
    //   Math.PI*2 * 0.4  => on the top left
    //   Math.PI*2 * 0.5  => on the left side
    this.angle = Math.PI * 2 * 0.1;
    this.distance =
      this.game.world.worldSettings.seaRadius +
      this.game.world.worldSettings.planeDefaultHeight +
      (-1 + 2 * Math.random()) *
        (this.game.world.worldSettings.planeAmpHeight - 20);
    this.mesh.position.y =
      -this.game.world.worldSettings.seaRadius +
      Math.sin(this.angle) * this.distance;
    this.mesh.position.x = Math.cos(this.angle) * this.distance;

    this.game.sceneManager.add(this);
  }

  tick(deltaTime) {
    rotateAroundSea(
      this,
      deltaTime,
      this.game.world.worldSettings.collectiblesSpeed,
    );

    // rotate collectible for visual effect
    this.mesh.rotation.y += deltaTime * 0.002 * Math.random();
    this.mesh.rotation.z += deltaTime * 0.002 * Math.random();

    // collision?
    if (
      collide(
        this.game.world.airplane.mesh,
        this.mesh,
        this.game.world.worldSettings.collectibleDistanceTolerance,
      )
    ) {
      this.onApply();
      this.explode();
    }
    // passed-by?
    else if (this.angle > Math.PI) {
      this.game.sceneManager.remove(this);
    }
  }

  explode() {
    spawnParticles(
      this.mesh.position.clone(),
      15,
      COLOR_COLLECTIBLE_BUBBLE,
      3,
      this.game.world.scene,
    );
    this.game.sceneManager.remove(this);
    this.game.audioManager.play("bubble");

    const DURATION = 1;

    setTimeout(() => {
      const itemMesh = new THREE.Group();
      for (let i = 1; i < this.mesh.children.length; i += 1) {
        itemMesh.add(this.mesh.children[i]);
      }
      this.game.world.scene.add(itemMesh);
      itemMesh.position.y = 120;
      itemMesh.position.z = 50;

      const initialScale = itemMesh.scale.clone();
      gsap.to(itemMesh.scale, {
        duration: DURATION / 2,
        x: initialScale.x * 4,
        y: initialScale.y * 4,
        z: initialScale.z * 4,
        ease: "Power2.easeInOut",
        onComplete: () => {
          gsap.to(itemMesh.scale, {
            duration: DURATION / 2,
            x: 0,
            y: 0,
            z: 0,
            ease: "Power2.easeInOut",
            onComplete: () => {
              this.game.world.scene.remove(itemMesh);
            },
          });
        },
      });
    }, 200);
  }
}

export function spawnSimpleGunCollectible(game: Game) {
  const gun = SimpleGun.createMesh();
  gun.scale.set(0.25, 0.25, 0.25);
  gun.position.x = -2;

  new Collectible(
    gun,
    () => {
      game.world.airplane.equipWeapon(new SimpleGun(game));
    },
    game,
  );
}

export function spawnBetterGunCollectible(game: Game) {
  const gun = BetterGun.createMesh();
  gun.scale.set(0.25, 0.25, 0.25);
  gun.position.x = -7;

  new Collectible(
    gun,
    () => {
      game.world.airplane.equipWeapon(new BetterGun(game));
    },
    game,
  );
}

export function spawnDoubleGunCollectible(game: Game) {
  const guns = new THREE.Group();

  const gun1 = SimpleGun.createMesh();
  gun1.scale.set(0.25, 0.25, 0.25);
  gun1.position.x = -2;
  gun1.position.y = -2;
  guns.add(gun1);

  const gun2 = SimpleGun.createMesh();
  gun2.scale.set(0.25, 0.25, 0.25);
  gun2.position.x = -2;
  gun2.position.y = 2;
  guns.add(gun2);

  new Collectible(
    guns,
    () => {
      game.world.airplane.equipWeapon(new DoubleGun(game));
    },
    game,
  );
}

export function spawnLifeCollectible(game: Game) {
  const heart = game.modelManager.get("heart").clone();
  heart.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material.color.setHex(0xff0000);
    }
  });
  heart.position.set(0, -1, -3);
  heart.scale.set(5, 5, 5);

  new Collectible(
    heart,
    () => {
      game.gameManager.addLife();
    },
    game,
  );
}
