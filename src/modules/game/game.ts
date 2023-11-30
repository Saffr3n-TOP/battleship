import type { GameboardPosition } from '../gameboard/gameboard';
import Player from '../player/player';

export default class Game {
  readonly player = new Player();
  readonly enemy = new Player();

  playRound(attackPosition: GameboardPosition): void {
    const [x, y] = attackPosition;

    if (this.getWinner() !== null || this.enemy.gameboard.get()[x][y].hit) {
      return;
    }

    this.enemy.gameboard.receiveAttack(attackPosition);
    if (this.enemy.gameboard.allShipsAreSunk()) return;
    this.player.gameboard.receiveRandomAttack();
  }

  getWinner(): Player | null {
    if (this.player.gameboard.allShipsAreSunk()) {
      return this.enemy;
    }

    if (this.enemy.gameboard.allShipsAreSunk()) {
      return this.player;
    }

    return null;
  }
}
