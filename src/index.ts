import Game from './modules/game/game';
import DOM from './modules/dom/dom';
import '../assets/styles/style.scss';

(() => {
  const game = new Game();
  const dom = new DOM(game);
})();
