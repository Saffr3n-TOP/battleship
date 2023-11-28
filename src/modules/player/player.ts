import Gameboard from '../gameboard/gameboard';
import Ship from '../ship/ship';

export default class Player {
  private readonly CRUISERS_AMOUNT = 1;
  private readonly BATTLESHIPS_AMOUNT = 2;
  private readonly DESTROYERS_AMOUNT = 3;
  private readonly PATROL_BOATS_AMOUNT = 4;

  private readonly CRUISER_LENGTH = 5;
  private readonly BATTLESHIP_LENGTH = 4;
  private readonly DESTROYER_LENGTH = 3;
  private readonly PATROL_BOAT_LENGTH = 2;

  readonly ships: readonly Ship[];
  readonly gameboard = new Gameboard();

  constructor() {
    const arr: Ship[] = [];

    for (let i = 0; i < this.CRUISERS_AMOUNT; i++) {
      arr.push(new Ship(this.CRUISER_LENGTH));
    }

    for (let i = 0; i < this.BATTLESHIPS_AMOUNT; i++) {
      arr.push(new Ship(this.BATTLESHIP_LENGTH));
    }

    for (let i = 0; i < this.DESTROYERS_AMOUNT; i++) {
      arr.push(new Ship(this.DESTROYER_LENGTH));
    }

    for (let i = 0; i < this.PATROL_BOATS_AMOUNT; i++) {
      arr.push(new Ship(this.PATROL_BOAT_LENGTH));
    }

    this.ships = arr;
  }
}
