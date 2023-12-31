import Ship from '../ship/ship';

type ShipOrientation = 'horizontal' | 'vertical';
type GameboardAxis = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GameboardPosition = [GameboardAxis, GameboardAxis];

interface GameboardCell {
  ship: Ship | null;
  available: boolean;
  hit: boolean;
}

export default class Gameboard {
  readonly size = 10;
  private gameboard: GameboardCell[][];
  private readonly ships: Ship[] = [];

  constructor() {
    this.create();
  }

  private create(): void {
    this.gameboard = new Array(this.size);

    for (let i = 0; i < this.size; i++) {
      this.gameboard[i] = new Array(this.size);

      for (let j = 0; j < this.size; j++) {
        this.gameboard[i][j] = { ship: null, available: true, hit: false };
      }
    }
  }

  get(): GameboardCell[][] {
    const copy = new Array(this.size);

    for (let i = 0; i < this.size; i++) {
      copy[i] = new Array(this.size);

      for (let j = 0; j < this.size; j++) {
        const cell = this.gameboard[i][j];
        const shipOrig = cell.ship;
        const available = cell.available;
        const hit = cell.hit;

        if (shipOrig === null) {
          copy[i][j] = { ship: shipOrig, available, hit };
          continue;
        }

        const shipCopy = new Ship(shipOrig.length);
        const hitsTaken = shipOrig.length - shipOrig.getHealth();

        for (let k = 0; k < hitsTaken; k++) {
          shipCopy.hit();
        }

        copy[i][j] = { ship: shipCopy, available, hit };
      }
    }

    return copy;
  }

  placeShip(
    ship: Ship,
    position: GameboardPosition,
    orientation: ShipOrientation
  ): void {
    const shipLength = ship.length;
    position = this.normalizePosition(shipLength, position, orientation);
    if (!this.positionIsAvailable(shipLength, position, orientation)) return;
    this.ships.push(ship);

    for (let i = -1; i <= shipLength; i++) {
      for (let j = -1; j <= 1; j++) {
        const xOffset = orientation === 'horizontal' ? i : j;
        const yOffset = orientation === 'vertical' ? i : j;
        const x = position[0] + xOffset;
        const y = position[1] + yOffset;

        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) {
          continue;
        }

        const cell = this.gameboard[x][y];
        cell.available = false;

        if (i === -1 || i === shipLength || j !== 0) {
          continue;
        }

        cell.ship = ship;
      }
    }
  }

  placeShipsRandomly(ships: readonly Ship[]): void {
    this.create();

    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipLength = ship.length;
      const orientation = this.randomOrientation();
      const position = this.normalizePosition(
        shipLength,
        this.randomPosition(),
        orientation
      );

      if (!this.positionIsAvailable(shipLength, position, orientation)) {
        i--;
        continue;
      }

      this.placeShip(ship, position, orientation);
    }
  }

  private randomPosition(): GameboardPosition {
    const x = Math.floor(Math.random() * this.size);
    const y = Math.floor(Math.random() * this.size);

    return [x, y] as GameboardPosition;
  }

  private randomOrientation(): ShipOrientation {
    if (Math.floor(Math.random() * 2) === 0) {
      return 'horizontal';
    } else {
      return 'vertical';
    }
  }

  private normalizePosition(
    shipLength: Ship['length'],
    position: GameboardPosition,
    orientation: ShipOrientation
  ): GameboardPosition {
    let [x, y] = position;

    if (orientation === 'horizontal' && x > this.size - shipLength) {
      x = (this.size - shipLength) as GameboardAxis;
    }

    if (orientation === 'vertical' && y > this.size - shipLength) {
      y = (this.size - shipLength) as GameboardAxis;
    }

    return [x, y];
  }

  private positionIsAvailable(
    shipLength: Ship['length'],
    position: GameboardPosition,
    orientation: ShipOrientation
  ): boolean {
    const [x, y] = position;

    for (let i = 0; i < shipLength; i++) {
      const xOffset = orientation === 'horizontal' ? i : 0;
      const yOffset = orientation === 'vertical' ? i : 0;
      const cell = this.gameboard[x + xOffset][y + yOffset];
      if (!cell.available) return false;
    }

    return true;
  }

  receiveAttack(position: GameboardPosition): GameboardPosition {
    const [x, y] = position;
    const cell = this.gameboard[x][y];

    cell.hit = true;

    if (cell.ship !== null) {
      cell.ship.hit();
    }

    return [x, y];
  }

  receiveRandomAttack(): GameboardPosition {
    let x: GameboardAxis;
    let y: GameboardAxis;
    let cell: GameboardCell;

    do {
      x = Math.floor(Math.random() * this.size) as GameboardAxis;
      y = Math.floor(Math.random() * this.size) as GameboardAxis;
      cell = this.gameboard[x][y];
    } while (cell.hit);

    return this.receiveAttack([x, y]);
  }

  allShipsAreSunk(): boolean {
    if (this.ships.length === 0) return false;

    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].isSunk()) return false;
    }

    return true;
  }
}
