"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberToBn = numberToBn;

var _util = require("@polkadot/util");

var _bn = _interopRequireDefault(require("bn.js"));

function numberToBn(num, decimals) {
  const bnDecimals = new _bn.default(decimals);
  const input = num.toString();
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);
  let result;

  if (isDecimalValue) {
    const div = new _bn.default(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '').substr(0, decimals);
    const mod = new _bn.default(modString);
    result = div.mul(_util.BN_TEN.pow(bnDecimals)).add(mod.mul(_util.BN_TEN.pow(new _bn.default(decimals - modString.length))));
  } else {
    result = new _bn.default(input.replace(/[^\d]/g, '')).mul(_util.BN_TEN.pow(bnDecimals));
  }

  return result;
}