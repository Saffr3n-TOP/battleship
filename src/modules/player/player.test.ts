import { describe, expect, test } from '@jest/globals';
import Player from './player';
import Gameboard from '../gameboard/gameboard';
import Ship from '../ship/ship';

describe('player instance', () => {
  const player = new Player();

  test('is instace of Player class', () => {
    expect(player instanceof Player).toBe(true);
  });

  test('has gameboard', () => {
    expect(player.gameboard instanceof Gameboard).toBe(true);
  });

  test('has 10 ships', () => {
    expect(player.ships.length).toBe(10);
  });

  test('ships are instances of Ship class', () => {
    expect(
      player.ships.every((ship) => {
        return ship instanceof Ship;
      })
    ).toBe(true);
  });
});
