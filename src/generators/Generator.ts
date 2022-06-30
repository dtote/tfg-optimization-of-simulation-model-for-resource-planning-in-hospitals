import { NUMBER_OF_PARAMS } from '../constants/NumberOfParams';
import { RANGES } from '../constants/Ranges';
import { RangeI } from '../interfaces/RangeI';
import { isIntegerRange } from '../utils/isIntegerRange';

export class Generator {
  static randomFloatFromRange(range: RangeI) {
    return Math.random() * (range.upper - range.lower) + range.lower;
  }

  static randomIntegerFromRange(range: RangeI) {
    return Math.floor(Math.random() * (range.upper - range.lower)) + range.lower;
  }

  static randomSimulatorParams(numberOfParams = NUMBER_OF_PARAMS, ranges: RangeI[] = RANGES): number[] {
    const candidate = [];

    for (let index = 0; index < numberOfParams; index++) {
      if (isIntegerRange(ranges[index])) {
        candidate.push(Generator.randomIntegerFromRange(ranges[index]));
      } else {
        candidate.push(Generator.randomFloatFromRange(ranges[index]));
      }
    }

    return candidate;
  }
}
