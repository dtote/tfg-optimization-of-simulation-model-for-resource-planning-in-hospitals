import { nativeMath } from 'random-js';
import { EvolutionaryAlgorithmParams } from '../algorithms/EvolutionaryAlgorithm';
import { OnePointCrossover, OnePointCrossoverParams } from '../crossover/base';
import { MixedGenerator } from '../generator';
import { NumericParams } from '../generator/numeric/base';
import { NumericRange } from '../individual';
import { MixedIndividual } from '../individual/numeric/mixed';
import { MixedUniformMutation } from '../mutation';
import { MutationParams, UniformMutationParams } from '../mutation/base';
import { NUMBER_OF_PARAMS } from '../optimization/constants/NumberOfParams';
import { FitnessBased, RouletteWheel } from '../selection';
import { FitnessProportionalSelection, FitnessProportionalSelectionParams } from '../selection/base';
import { MaxGenerations } from '../termination';

export const populationSize = 5;
export const maxGenerations = 5;
export const uniformMutationParams: EvolutionaryAlgorithmParams<
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
  mutation: new MixedUniformMutation(),
  mutationParams: {
    engine: nativeMath,
    mutationRate: 1.0 / NUMBER_OF_PARAMS,
  } as UniformMutationParams,
  replacement: new FitnessBased(true),
  replacementParams: {
    selectionCount: populationSize,
  },
  fitnessFunction: () => 1,
  terminationCondition: new MaxGenerations(maxGenerations),
};
