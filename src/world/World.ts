import * as THREE from 'three';
import {Game} from '../game';
import {Sea} from './Sea';
import {WORLD_DEFAULT_SETTINGS} from '../settings';
import {Light} from './Light';
import {WorldSettings} from '../types';
import {Airplane} from './airplane/Airplane';
import {Sky} from './Sky';

export class World {
  public scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sea: Sea;
  sea2: Sea;
  worldSettings: WorldSettings;
  airplane: Airplane;
  sky: any;
  light: Light;

  constructor(private game: Game) {
    // create the world
    this.worldSettings = WORLD_DEFAULT_SETTINGS;
    this.createScene();
  }

  private setupCamera() {
    this.renderer.setSize(this.game.uiManager.width, this.game.uiManager.height);
    this.camera.aspect = this.game.uiManager.width / this.game.uiManager.height;
    this.camera.updateProjectionMatrix();
  }

  public createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.game.uiManager.width / this.game.uiManager.height,
      0.1,
      10000,
    );
    this.game.audioManager.setCamera(this.camera);
    this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.game.uiManager.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.game.uiManager.width, this.game.uiManager.height);
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    this.renderer.shadowMap.enabled = true;

    this.setupCamera();
    this.game.uiManager.onResize(() => this.setupCamera());

    // const controls = new THREE.OrbitControls(camera, renderer.domElement)
    // controls.minPolarAngle = -Math.PI / 2
    // controls.maxPolarAngle = Math.PI
    // controls.addEventListener('change', () => {
    // 	console.log('camera changed', 'camera=', camera.position, ', airplane=', airplane.position, 'camera.rotation=', camera.rotation)
    // })
    // setTimeout(() => {
    // 	camera.lookAt(airplane.mesh.position)
    // 	controls.target.copy(airplane.mesh.position)
    // }, 100)

    // controls.noZoom = true
    //controls.noPan = true

    // handleWindowResize()
  }

  public initializeWorldAssets() {
    // We create a second sea that is not animated because the animation of our our normal sea leaves holes at certain points and I don't know how to get rid of them. These holes did not occur in the original script that used three js version 75 and mergeVertices. However, I tried to reproduce that behaviour in the animation function but without succes - thus this workaround here.

    this.sea = new Sea(this.game, this.worldSettings);
    this.sea2 = new Sea(this.game, this.worldSettings);
    this.sky = new Sky(this.game);
    this.light = new Light(this.scene);
    this.airplane = new Airplane(this.game);
    this.game.gameManager.resetMap();
  }

  public setSideView() {
    this.game.state.fpv = false;
    this.game.world.camera.position.set(0, this.game.world.worldSettings.planeDefaultHeight, 200);
    this.game.world.camera.setRotationFromEuler(new THREE.Euler(0, 0, 0));
  }

  public setFollowView() {
    this.game.state.fpv = true;
    this.game.world.camera.position.set(-89, this.game.world.airplane.mesh.position.y + 20, 0);
    this.game.world.camera.setRotationFromEuler(
      new THREE.Euler(-1.490248, -1.4124514, -1.48923231),
    );
    this.game.world.camera.updateProjectionMatrix();
  }
}
