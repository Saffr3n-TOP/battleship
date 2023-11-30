import type Game from '../game/game';

export default class DOM {
  private readonly gameboardSize = 10;
  private readonly game: Game;

  private readonly playerGameboard = document.querySelector(
    '.gameboard_player'
  ) as HTMLDivElement;

  private readonly enemyGameboard = document.querySelector(
    '.gameboard_enemy'
  ) as HTMLDivElement;

  private readonly placeShipsRandomlyBtn: HTMLButtonElement;
  private readonly startBtn: HTMLButtonElement;
  private readonly restartBtn: HTMLButtonElement;

  constructor(game: Game) {
    this.game = game;
    this.generateGameboard('player');
    this.generateGameboard('enemy');

    const btns = document.querySelectorAll('.button');
    this.placeShipsRandomlyBtn = btns[0] as HTMLButtonElement;
    this.startBtn = btns[1] as HTMLButtonElement;
    this.restartBtn = btns[2] as HTMLButtonElement;

    this.placeShipsRandomlyBtn.addEventListener('click', () => {
      this.startBtn.disabled = false;
      game.player.gameboard.placeShipsRandomly(game.player.ships);
      this.generateGameboard('player');
    });

    this.startBtn.addEventListener('click', () => {
      this.placeShipsRandomlyBtn.style.display = 'none';
      this.startBtn.style.display = 'none';
      this.restartBtn.style.display = 'inline';
      game.enemy.gameboard.placeShipsRandomly(game.enemy.ships);
      this.generateGameboard('enemy');
    });

    this.restartBtn.addEventListener('click', () => {
      window.location.reload();
    });

    this.enemyGameboard.addEventListener('click', (e) => {
      if (this.restartBtn.style.display === 'none') return;

      const cell = e.target as HTMLDivElement;

      if (cell.classList.contains('gameboard__cell_pos')) {
        const pos = JSON.parse(cell.getAttribute('data-pos') as string);
        this.game.playRound(pos);
        this.generateGameboard('player');
        this.generateGameboard('enemy');
      }

      const winner = this.game.getWinner();
      if (winner !== null) {
        if (winner === this.game.player) alert('You win!');
        else alert('You lose...');
      }
    });
  }

  private generateGameboard(target: 'player' | 'enemy'): void {
    const gameboardObj =
      target === 'player'
        ? this.game.player.gameboard
        : this.game.enemy.gameboard;

    const gameboardEl =
      target === 'player' ? this.playerGameboard : this.enemyGameboard;

    gameboardEl.innerHTML = '';

    const emptyCell = document.createElement('div');
    emptyCell.className = 'gameboard__cell gameboard__cell_emp';
    gameboardEl.appendChild(emptyCell);

    for (let i = 0; i < this.gameboardSize; i++) {
      const colCell = document.createElement('div');
      colCell.className = 'gameboard__cell gameboard__cell_col';
      colCell.textContent = (i + 1).toString();
      gameboardEl.appendChild(colCell);
    }

    for (let i = 0; i < this.gameboardSize; i++) {
      const rowCell = document.createElement('div');
      rowCell.className = 'gameboard__cell gameboard__cell_row';
      rowCell.innerHTML = i + 1 + '&nbsp;';
      gameboardEl.appendChild(rowCell);

      for (let j = 0; j < this.gameboardSize; j++) {
        const cellObj = gameboardObj.get()[i][j];
        const cellEl = document.createElement('div');
        cellEl.className = 'gameboard__cell gameboard__cell_pos';
        if (target === 'player' && cellObj.ship !== null) {
          cellEl.classList.add('gameboard__cell_ship');
        }
        if (cellObj.hit) {
          cellEl.textContent = 'x';
          if (cellObj.ship !== null)
            cellEl.classList.add('gameboard__cell_hit');
          else cellEl.classList.add('gameboard__cell_miss');
        }
        cellEl.setAttribute('data-pos', `[${i}, ${j}]`);
        gameboardEl.appendChild(cellEl);
      }
    }
  }
}
