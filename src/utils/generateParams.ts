import { NUMBER_OF_PARAMS } from '../constants/NumberOfParams';
import { RANGES } from '../constants/Ranges';
import { NumericRange } from '../GeneticsJS/src';
import { Generator } from '../GeneticsJS/src/generator/utils';
import { isIntegerRange } from './isIntegerRange';

export function getRandomSimulatorParams(numberOfParams = NUMBER_OF_PARAMS, ranges = RANGES): number[] {
  const candidate = [];

  for (let index = 0; index < numberOfParams; index++) {
    const [lower, upper] = [ranges[index].lower, ranges[index].upper];
    if (isIntegerRange(ranges[index])) {
      candidate.push(Generator.generateInteger(new NumericRange(lower, upper)));
    } else {
      candidate.push(Generator.generateFloating(new NumericRange(lower, upper)));
    }
  }

  return candidate;
}
