type ShipLength = 2 | 3 | 4 | 5;
type ShipHealth = 0 | 1 | ShipLength;

export default class Ship {
  readonly length: ShipLength;
  private health: ShipHealth;
  private sunk = false;

  constructor(length: ShipLength) {
    this.length = length;
    this.health = length;
  }

  getHealth(): ShipHealth {
    return this.health;
  }

  isSunk(): boolean {
    return this.sunk;
  }

  hit(): void {
    if (this.sunk) return;
    this.health--;
    if (this.health > 0) return;
    this.sunk = true;
  }
}
