import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTileBackTheme,
  isValidTileBack,
  TILE_BACK_LIST,
} from './tileThemes';

test('tile back theme list contains Parlor Blue, Classic Wood, Royal Velvet, and Vintage Slate', () => {
  const names = TILE_BACK_LIST.map((t) => t.name);
  assert.deepEqual(names, [
    'Parlor Blue',
    'Classic Wood',
    'Royal Velvet',
    'Vintage Slate',
  ]);
});

test('isValidTileBack validates known ids and rejects invalid values', () => {
  assert.equal(isValidTileBack('classic-wood'), true);
  assert.equal(isValidTileBack('royal-velvet'), true);
  assert.equal(isValidTileBack('vintage-slate'), true);
  assert.equal(isValidTileBack('denim-parlor'), true);
  assert.equal(isValidTileBack('unknown-theme'), false);
  assert.equal(isValidTileBack(null), false);
});

test('getTileBackTheme returns requested theme details', () => {
  const wood = getTileBackTheme('classic-wood');
  assert.equal(wood.name, 'Classic Wood');
  assert.ok(wood.outerBg.startsWith('#'));
});
