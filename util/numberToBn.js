"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberToBn = numberToBn;
exports.toNumber = toNumber;

var _util = require("@polkadot/util");

var _bn = _interopRequireDefault(require("bn.js"));

function numberToBn(num, decimals) {
  const bnDecimals = new _bn.default(decimals);
  const input = num.toString();
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);
  let result;

  if (isDecimalValue) {
    const div = new _bn.default(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '');

    if (modString.length > decimals) {
      throw 'The decimal part is too long';
    }

    const mod = new _bn.default(modString);
    result = div.mul(_util.BN_TEN.pow(bnDecimals)).add(mod.mul(_util.BN_TEN.pow(new _bn.default(decimals - modString.length))));
  } else {
    result = new _bn.default(input.replace(/[^\d]/g, '')).mul(_util.BN_TEN.pow(bnDecimals));
  }

  return result;
}

const zero = '00000000000000000000000000000000000000000';

function toNumber(num, decimals) {
  const l = num.length;

  if (l <= decimals) {
    return new Number(`0.${zero.substr(0, decimals - l)}${num}`);
  } else {
    return new Number(`${num.substr(decimals)}.${num.substr(l - decimals, l)}`);
  }
}