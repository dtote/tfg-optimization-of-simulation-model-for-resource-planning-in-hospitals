import { NumericRange } from '../GeneticsJS/src/individual/numeric';

export function isDefaultRange(range: NumericRange): boolean {
  return range.lowest === Number.NEGATIVE_INFINITY && range.highest === Number.POSITIVE_INFINITY;
}
