import {Object3D, BoxGeometry, MeshPhongMaterial, Mesh} from 'three';
import {Colors} from '../settings';
import {Game} from '../game';

//region World
class Cloud {
  mesh: Object3D;

  constructor() {
    this.mesh = new Object3D();
    const geom = new BoxGeometry(20, 20, 20);
    const mat = new MeshPhongMaterial({
      color: Colors.white,
    });
    const nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {
      const m = new Mesh(geom.clone(), mat);
      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.y = Math.random() * Math.PI * 2;
      m.rotation.z = Math.random() * Math.PI * 2;
      const s = 0.1 + Math.random() * 0.9;
      m.scale.set(s, s, s);
      this.mesh.add(m);
      m.castShadow = true;
      m.receiveShadow = true;
    }
  }

  tick(_deltaTime) {
    const l = this.mesh.children.length;
    for (let i = 0; i < l; i++) {
      let m = this.mesh.children[i];
      m.rotation.y += Math.random() * 0.002 * (i + 1);
      m.rotation.z += Math.random() * 0.005 * (i + 1);
    }
  }
}

export class Sky {
  mesh: Object3D;
  nClouds: number;
  clouds: any[];

  constructor(private game: Game) {
    this.mesh = new Object3D();
    this.nClouds = 20;
    this.clouds = [];
    const stepAngle = (Math.PI * 2) / this.nClouds;
    for (let i = 0; i < this.nClouds; i++) {
      const c = new Cloud();
      this.clouds.push(c);
      var a = stepAngle * i;
      var h = this.game.world.worldSettings.seaRadius + 150 + Math.random() * 200;
      c.mesh.position.y = Math.sin(a) * h;
      c.mesh.position.x = Math.cos(a) * h;
      c.mesh.position.z = -300 - Math.random() * 500;
      c.mesh.rotation.z = a + Math.PI / 2;
      const scale = 1 + Math.random() * 2;
      c.mesh.scale.set(scale, scale, scale);
      this.mesh.add(c.mesh);
    }

    this.mesh.position.y = -game.world.worldSettings.seaRadius;
    this.game.world.scene.add(this.mesh);
  }

  tick(deltaTime) {
    for (var i = 0; i < this.nClouds; i++) {
      var c = this.clouds[i];
      c.tick(deltaTime);
    }
    this.mesh.rotation.z += this.game.state.speed * deltaTime;
  }
}
