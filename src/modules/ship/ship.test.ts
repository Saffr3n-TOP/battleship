import { describe, test, expect } from '@jest/globals';
import Ship from './ship';

describe('new ship', () => {
  const ship = new Ship(2);

  test('is instance of Ship class', () => {
    expect(ship instanceof Ship).toBe(true);
  });

  test('has correct length', () => {
    expect(ship.length).toBe(2);
  });

  test('health equals its length', () => {
    expect(ship.getHealth() === ship.length).toBe(true);
  });

  test('is not sunk', () => {
    expect(ship.isSunk()).toBe(false);
  });
});

describe('damaged ship', () => {
  const ship = new Ship(2);
  ship.hit();

  test('health decreased', () => {
    expect(ship.getHealth() === ship.length - 1).toBe(true);
  });

  test('is not sunk', () => {
    expect(ship.isSunk()).toBe(false);
  });
});

describe('destroyed ship', () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();

  test('has no health', () => {
    expect(ship.getHealth()).toBe(0);
  });

  test('is sunk', () => {
    expect(ship.isSunk()).toBe(true);
  });
});
