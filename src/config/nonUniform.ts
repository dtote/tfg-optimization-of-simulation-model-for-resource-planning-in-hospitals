import { nativeMath } from 'random-js';
import { NUMBER_OF_PARAMS } from '../constants/NumberOfParams';
import { EvolutionaryAlgorithmParams } from '../GeneticsJS/src/algorithms';
import { OnePointCrossover, OnePointCrossoverParams } from '../GeneticsJS/src/crossover/base';
import { NumericParams } from '../GeneticsJS/src/generator/numeric/base';
import { MixedGenerator } from '../GeneticsJS/src/generator/numeric/mixed';
import { NumericRange } from '../GeneticsJS/src/individual/numeric/base';
import { MixedIndividual } from '../GeneticsJS/src/individual/numeric/mixed';
import { MutationParams } from '../GeneticsJS/src/mutation/base';
import { NumericNonUniformMutationParams } from '../GeneticsJS/src/mutation/numeric/base';
import { MixedNonuniformMutation } from '../GeneticsJS/src/mutation/numeric/mixed';
import { FitnessProportionalSelection, FitnessProportionalSelectionParams } from '../GeneticsJS/src/selection/base';
import { RouletteWheel } from '../GeneticsJS/src/selection/implementation';
import { FitnessBased } from '../GeneticsJS/src/selection/replacement';
import { MaxGenerations } from '../GeneticsJS/src/termination';

export const populationSize = 5;
export const maxGenerations = 5;
export const nonUniformMutationParams: EvolutionaryAlgorithmParams<
  MixedIndividual,
  number,
  NumericParams,
  FitnessProportionalSelectionParams<MixedIndividual, number>,
  OnePointCrossoverParams<MixedIndividual, number>,
  MutationParams
> = {
  populationSize,
  generator: new MixedGenerator(),
  generatorParams: {
    engine: nativeMath,
    length: NUMBER_OF_PARAMS,
    range: new NumericRange(),
  },
  selection: new FitnessProportionalSelection(),
  selectionParams: {
    engine: nativeMath,
    selectionCount: populationSize,
    subSelection: new RouletteWheel(),
  },
  crossover: new OnePointCrossover<MixedIndividual, number>(),
  crossoverParams: {
    engine: nativeMath,
    individualConstructor: MixedIndividual,
    crossoverThreshold: 0.8,
  },
  mutation: new MixedNonuniformMutation(),
  mutationParams: {
    engine: nativeMath,
    stepSize: 2.0,
  } as NumericNonUniformMutationParams,
  replacement: new FitnessBased(true),
  replacementParams: {
    selectionCount: populationSize,
  },
  fitnessFunction: () => 1,
  terminationCondition: new MaxGenerations(maxGenerations),
};
