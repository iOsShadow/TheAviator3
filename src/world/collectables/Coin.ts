import { COLOR_COINS } from "../../settings";
import {
  spawnParticles,
  rotateAroundSea,
  collide,
  randomFromRange,
} from "../../utils/utils";
import { Game } from "../../game";
import * as THREE from "three";

//region Coins
class Coin {
  mesh: THREE.Mesh;
  angle: number;
  distance: number;

  constructor(private game: Game) {
    var geom = new THREE.CylinderGeometry(4, 4, 1, 10);
    var mat = new THREE.MeshPhongMaterial({
      color: COLOR_COINS,
      shininess: 1,
      specular: 0xffffff,
      flatShading: true,
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.distance = 0;
    this.game.sceneManager.add(this);
  }

  tick(deltaTime) {
    rotateAroundSea(
      this,
      deltaTime,
      this.game.world.worldSettings.enemiesSpeed,
    );
    this.mesh.rotation.z += Math.random() * 0.1;
    this.mesh.rotation.y += Math.random() * 0.1;

    // collision?
    if (
      collide(
        this.game.world.airplane.mesh,
        this.mesh,
        this.game.world.worldSettings.coinDistanceTolerance,
      )
    ) {
      spawnParticles(
        this.mesh.position.clone(),
        5,
        COLOR_COINS,
        0.8,
        this.game.world.scene,
      );
      this.game.gameManager.addCoin();
      this.game.audioManager.play("coin", { volume: 0.5 });
      this.game.sceneManager.remove(this);
    }
    // passed-by?
    else if (this.angle > Math.PI) {
      this.game.sceneManager.remove(this);
    }
  }
}

export function spawnCoins(game: Game) {
  const nCoins = 1 + Math.floor(Math.random() * 10);
  const d =
    game.world.worldSettings.seaRadius +
    game.world.worldSettings.planeDefaultHeight +
    randomFromRange(-1, 1) * (game.world.worldSettings.planeAmpHeight - 20);
  const amplitude = 10 + Math.round(Math.random() * 10);
  for (let i = 0; i < nCoins; i++) {
    const coin = new Coin(game);
    coin.angle = -(i * 0.02);
    coin.distance = d + Math.cos(i * 0.5) * amplitude;
    coin.mesh.position.y =
      -game.world.worldSettings.seaRadius +
      Math.sin(coin.angle) * coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
  }
  game.state.statistics.coinsSpawned += nCoins;
}
