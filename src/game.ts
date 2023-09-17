import '@fontsource/dela-gothic-one';
import {AudioManager} from './manager/AudioManager';
import {GameStatus, State} from './types';
import {UIManager} from './manager/UIManager';
import {LoadingProgressManager} from './manager/LoadingProgressManager';
import {GameManager} from './manager/GameManager';
import {ModelManager} from './manager/ModelManager'
import {World} from './world/World';
import {DEFAULT_STATE, WORLD_DEFAULT_SETTINGS} from './settings';
import {SceneManager} from './manager/SceneManager';
import {Projectile} from './mechanic/Shooting'

var game: Game;

export class Game {
  uiManager: UIManager;
  gameManager: GameManager;
  audioManager: AudioManager;
  sceneManager: SceneManager;
  loadingProgressManager: LoadingProgressManager;
  modelManager: ModelManager;
  allProjectiles: Array<Projectile>;


  state: State;
  world: World;

  constructor() {
    window.addEventListener('load', this.onWebsiteLoaded, false);
  }

  public onWebsiteLoaded(_event) {
    this.state = {...DEFAULT_STATE};
    this.loadingProgressManager = new LoadingProgressManager();

    this.audioManager = new AudioManager(this);
    this.allProjectiles = [];
    console.log('onWebsiteLoaded', game);

    // load models @todo
    this.modelManager = new ModelManager('/models')
    this.modelManager.load('heart', require('/models/heart.obj'));
    this.sceneManager = new SceneManager(this);

    this.uiManager = new UIManager(this);
    this.gameManager = new GameManager(this);
    this.world = new World(this);

    this.loadingProgressManager.catch(err => {
      this.uiManager.showError(err.message);
    });
  }
}

game = new Game();
