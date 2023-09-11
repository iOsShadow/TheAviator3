import '@fontsource/dela-gothic-one';
import {AudioManager} from './manager/AudioManager';
import {GameStatus, State} from './types';
import {UIManager} from './manager/UIManager';
import {LoadingProgressManager} from './manager/LoadingProgressManager';
import {GameManager} from './manager/GameManager';
import {World} from './world/World';
import {DEFAULT_STATE, WORLD_DEFAULT_SETTINGS} from './settings';
import {SceneManager} from './manager/SceneManager';

var game: Game;

export class Game {
  uiManager: UIManager;
  gameManager: GameManager;
  audioManager: AudioManager;
  sceneManager: SceneManager;
  loadingProgressManager: LoadingProgressManager;

  state: State;
  world: World;

  constructor() {
    window.addEventListener('load', this.onWebsiteLoaded, false);
  }

  public onWebsiteLoaded(_event) {
    this.state = {...DEFAULT_STATE};
    this.loadingProgressManager = new LoadingProgressManager();

    this.audioManager = new AudioManager(this);

    console.log('onWebsiteLoaded', game);

    // load models @todo
    // modelManager.load('heart');
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
