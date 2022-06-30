import { nativeMath } from 'random-js';
import { EvolutionaryAlgorithmParams } from '../algorithms/EvolutionaryAlgorithm';
import { OnePointCrossover, OnePointCrossoverParams } from '../crossover/base';
import { MixedGenerator } from '../generator';
import { NumericParams } from '../generator/numeric/base';
import { NumericRange } from '../individual';
import { MixedIndividual } from '../individual/numeric/mixed';
import { MixedNonuniformMutation, NumericNonUniformMutationParams } from '../mutation';
import { MutationParams } from '../mutation/base';
import { NUMBER_OF_PARAMS } from '../optimization/constants/NumberOfParams';
import { FitnessBased, RouletteWheel } from '../selection';
import { FitnessProportionalSelection, FitnessProportionalSelectionParams } from '../selection/base';
import { MaxGenerations } from '../termination';

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
