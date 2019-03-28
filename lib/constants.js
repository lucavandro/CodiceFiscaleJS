"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHECK_CODE_CHARS = exports.OMOCODIA_TABLE = exports.CHECK_CODE_EVEN = exports.CHECK_CODE_ODD = exports.MONTH_CODES = void 0;
var MONTH_CODES = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
exports.MONTH_CODES = MONTH_CODES;
var CHECK_CODE_ODD = {
  0: 1,
  1: 0,
  2: 5,
  3: 7,
  4: 9,
  5: 13,
  6: 15,
  7: 17,
  8: 19,
  9: 21,
  A: 1,
  B: 0,
  C: 5,
  D: 7,
  E: 9,
  F: 13,
  G: 15,
  H: 17,
  I: 19,
  J: 21,
  K: 2,
  L: 4,
  M: 18,
  N: 20,
  O: 11,
  P: 3,
  Q: 6,
  R: 8,
  S: 12,
  T: 14,
  U: 16,
  V: 10,
  W: 22,
  X: 25,
  Y: 24,
  Z: 23
};
exports.CHECK_CODE_ODD = CHECK_CODE_ODD;
var CHECK_CODE_EVEN = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25
};
exports.CHECK_CODE_EVEN = CHECK_CODE_EVEN;
var OMOCODIA_TABLE = {
  0: 'L',
  1: 'M',
  2: 'N',
  3: 'P',
  4: 'Q',
  5: 'R',
  6: 'S',
  7: 'T',
  8: 'U',
  9: 'V'
};
exports.OMOCODIA_TABLE = OMOCODIA_TABLE;
var CHECK_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.CHECK_CODE_CHARS = CHECK_CODE_CHARS;