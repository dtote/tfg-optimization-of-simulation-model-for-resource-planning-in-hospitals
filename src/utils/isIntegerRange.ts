import { RangeI } from '../interfaces/RangeI';

export function isIntegerRange(range: RangeI) {
  return Number.isInteger(range.lower) && Number.isInteger(range.upper);
}
