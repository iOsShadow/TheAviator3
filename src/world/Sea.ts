import {Mesh, CylinderGeometry, Matrix4, MeshPhongMaterial} from 'three';
import {Game} from '../game';
import {COLOR_SEA_LEVEL} from '../settings';
import {WorldSettings} from '../types';

export class Sea {
  mesh: Mesh;
  waves: any;

  constructor(private game: Game, worldSettings: WorldSettings) {
    var geom = new CylinderGeometry(
      worldSettings.seaRadius,
      worldSettings.seaRadius,
      worldSettings.seaLength,
      40,
      10,
    );
    geom.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
    this.waves = [];
    const arr = geom.attributes.position.array;
    for (let i = 0; i < arr.length / 3; i++) {
      this.waves.push({
        x: arr[i * 3 + 0],
        y: arr[i * 3 + 1],
        z: arr[i * 3 + 2],
        ang: Math.random() * Math.PI * 2,
        amp:
          worldSettings.wavesMinAmp +
          Math.random() * (worldSettings.wavesMaxAmp - worldSettings.wavesMinAmp),
        speed:
          worldSettings.wavesMinSpeed +
          Math.random() * (worldSettings.wavesMaxSpeed - worldSettings.wavesMinSpeed),
      });
    }
    var mat = new MeshPhongMaterial({
      color: COLOR_SEA_LEVEL[0],
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    });
    this.mesh = new Mesh(geom, mat);
    this.mesh.receiveShadow = true;

    this.mesh.position.y = -worldSettings.seaRadius;
    this.game.world.scene.add(this.mesh);
  }

  tick(deltaTime) {
    var arr = this.mesh.geometry.attributes.position.array;
    for (let i = 0; i < arr.length / 3; i++) {
      var wave = this.waves[i];
      arr[i * 3 + 0] = wave.x + Math.cos(wave.ang) * wave.amp;
      arr[i * 3 + 1] = wave.y + Math.sin(wave.ang) * wave.amp;
      wave.ang += wave.speed * deltaTime;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }

  updateColor() {
    this.mesh.material = new MeshPhongMaterial({
      color: COLOR_SEA_LEVEL[(this.game.state.level - 1) % COLOR_SEA_LEVEL.length],
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    });
  }
}
