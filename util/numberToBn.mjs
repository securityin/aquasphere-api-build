import { BN_TEN } from '@polkadot/util';
import BN from 'bn.js';
export function numberToBn(num, decimals) {
  const bnDecimals = new BN(decimals);
  const input = num.toString();
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);
  let result;

  if (isDecimalValue) {
    const div = new BN(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '');

    if (modString.length > decimals) {
      throw 'The decimal part is too long';
    }

    const mod = new BN(modString);
    result = div.mul(BN_TEN.pow(bnDecimals)).add(mod.mul(BN_TEN.pow(new BN(decimals - modString.length))));
  } else {
    result = new BN(input.replace(/[^\d]/g, '')).mul(BN_TEN.pow(bnDecimals));
  }

  return result;
}
const zero = '00000000000000000000000000000000000000000';
export function toNumber(num, decimals) {
  const l = num.length;

  if (l <= decimals) {
    return new Number(`0.${zero.substr(0, decimals - l)}${num}`);
  } else {
    return new Number(`${num.substr(decimals)}.${num.substr(l - decimals, l)}`);
  }
}