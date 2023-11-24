import { describe, test, expect } from '@jest/globals';
import Gameboard from './gameboard';
import Ship from '../ship/ship';

describe('new gameboard', () => {
  const gameboard = new Gameboard();

  test('is instance of Gameboard class', () => {
    expect(gameboard instanceof Gameboard).toBe(true);
  });

  test('has correct size', () => {
    expect(gameboard.size).toBe(10);
  });

  test('has correct amount of columns', () => {
    expect(gameboard.get().length).toBe(gameboard.size);
  });

  test('has correct amount of rows', () => {
    expect(
      gameboard.get().every((col) => {
        return col.length === gameboard.size;
      })
    ).toBe(true);
  });

  test('is filled with gameboard cells', () => {
    expect(
      gameboard.get().every((col) => {
        return col.every((cell) => Object.keys(cell).includes('ship'));
      })
    ).toBe(true);
  });

  test('correctly registers hits', () => {
    gameboard.receiveAttack([9, 9]);
    expect(gameboard.get()[9][9].hit).toBe(true);
  });

  test('has no sunk ships', () => {
    expect(gameboard.allShipsAreSunk()).toBe(false);
  });
});

describe('gameboard with new ships', () => {
  const gameboard = new Gameboard();
  const shipHorizontal = new Ship(2);
  const shipVertical = new Ship(2);

  gameboard.placeShip(shipHorizontal, [9, 0], 'horizontal');
  gameboard.placeShip(shipVertical, [0, 9], 'vertical');

  test('correctly places ships at available positions', () => {
    expect(gameboard.get()[8][0].ship).toEqual(shipHorizontal);
    expect(gameboard.get()[8][0].available).toBe(false);
    expect(gameboard.get()[9][0].ship).toEqual(shipHorizontal);
    expect(gameboard.get()[9][0].available).toBe(false);
    expect(gameboard.get()[0][8].ship).toEqual(shipVertical);
    expect(gameboard.get()[0][8].available).toBe(false);
    expect(gameboard.get()[0][9].ship).toEqual(shipVertical);
    expect(gameboard.get()[0][9].available).toBe(false);
  });

  test('marks adjacent to ships positions unavailable', () => {
    expect(gameboard.get()[7][0].available).toBe(false);
    expect(gameboard.get()[7][1].available).toBe(false);
    expect(gameboard.get()[8][1].available).toBe(false);
    expect(gameboard.get()[9][1].available).toBe(false);
    expect(gameboard.get()[0][7].available).toBe(false);
    expect(gameboard.get()[1][7].available).toBe(false);
    expect(gameboard.get()[1][8].available).toBe(false);
    expect(gameboard.get()[1][9].available).toBe(false);
  });

  test('does not accept ships at unavailable positions', () => {
    gameboard.placeShip(new Ship(2), [9, 1], 'horizontal');
    expect(gameboard.get()[9][1].ship).toBeNull();
  });

  test('has no sunk ships', () => {
    expect(gameboard.allShipsAreSunk()).toBe(false);
  });
});

describe('gameboard with sunk ships', () => {
  const gameboard = new Gameboard();
  const ship = new Ship(2);

  gameboard.placeShip(ship, [0, 0], 'horizontal');
  gameboard.receiveAttack([0, 0]);
  gameboard.receiveAttack([1, 0]);

  test('has all ships sunk', () => {
    expect(gameboard.allShipsAreSunk()).toBe(true);
  });
});
