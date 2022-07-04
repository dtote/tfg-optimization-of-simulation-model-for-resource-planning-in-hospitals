import { readFileSync } from 'fs';
import path from 'path';
import { nativeMath } from 'random-js';
import yargs from 'yargs';
import { Calculator } from '../calculator/Calculator';
import { RscriptCommand, SeedType } from '../commands/RscriptCommand';
import { NUMBER_OF_PARAMS } from '../constants/NumberOfParams';
import { ExecutionData } from '../data/Data';
import { EvolutionaryAlgorithm } from '../GeneticsJS/src/algorithms';
import { nonUniformMutationParams } from '../GeneticsJS/src/config/nonUniform';
import { polynomialMutationParams } from '../GeneticsJS/src/config/polynomial';
import { uniformMutationParams } from '../GeneticsJS/src/config/uniform';
import { CrossoverParams } from '../GeneticsJS/src/crossover';
import { FitnessFunction } from '../GeneticsJS/src/fitness';
import { MixedGenerator, NumericParams } from '../GeneticsJS/src/generator';
import { NumericRange } from '../GeneticsJS/src/individual';
import { MixedIndividual } from '../GeneticsJS/src/individual/numeric/mixed';
import { MutationParams } from '../GeneticsJS/src/mutation';
import { Population } from '../GeneticsJS/src/population';
import { FitnessProportionalSelectionParams } from '../GeneticsJS/src/selection';
import { MaxGenerations } from '../GeneticsJS/src/termination';
import { ExecutionInfo } from '../interfaces/ExecutionInfo';

console.time('execution');
const argv = yargs(process.argv.slice(2))
  .options({
    f: {
      type: 'string',
      requiresArg: true,
      default: 'nonUniform.ts',
      choices: ['uniform.ts', 'nonUniform.ts', 'polynomial.ts'],
    },
    r: { type: 'number', default: 1 },
    p: { type: 'number', default: 5 },
    g: { type: 'number', default: 5 },
    c: { type: 'number', default: 0.8 },
    o: { type: 'string', default: 'genetic' },
  })
  .alias('f', 'file')
  .nargs('f', 1)
  .demandOption(['f'])
  .example('$0 -f uniform.ts', 'Uses the given file configuration')

  .alias('r', 'replics')
  .nargs('r', 1)
  .example('$0 -r 2', 'Runs genetic with specified number of replics')

  .alias('p', 'populationSize')
  .alias('p', 'population')
  .nargs('p', 1)
  .example('$0 -p 2', 'Runs genetic with specified population size')

  .alias('c', 'crossoverRate')
  .nargs('c', 1)
  .example('$0 -c 0.8', 'Runs genetic with specified crossover rate')

  .alias('g', 'maxGenerations')
  .alias('g', 'generations')
  .nargs('g', 1)
  .example('$0 -g 2', 'Runs genetic with specified max number of generations')

  .alias('o', 'outputFile')
  .alias('o', 'output')
  .nargs('o', 1)
  .example('$0 -o output', 'Runs genetic with specified name for output file')

  .help('h')
  .alias('h', 'help')
  .parseSync();

const { file, replics, populationSize, crossoverRate, maxGenerations, outputFile } = argv;

try {
  const configurationFilePath = path.join(__dirname, '..', 'config', file);

  readFileSync(configurationFilePath);
} catch (e) {
  throw new Error(`Error reading configuration file: ${e}`);
}

const configurations: Record<string, any> = {
  'polynomial.ts': polynomialMutationParams,
  'uniform.ts': uniformMutationParams,
  'nonUniform.ts': nonUniformMutationParams,
};

const params = configurations[file];
params.populationSize = populationSize;
params.selectionParams.selectionCount = populationSize;
params.crossoverParams.crossoverThreshold = crossoverRate;
params.replacementParams.selectionCount = populationSize;
params.terminationCondition = new MaxGenerations(maxGenerations);
const saveFilePath = path.join(__dirname, '..', 'data', outputFile);

const experiments = new ExecutionData({
  execution: Number(path.basename(saveFilePath).slice(4)),
  generations: [],
} as ExecutionInfo);

let logger = false;

const fitnessFunction: FitnessFunction<MixedIndividual, number> = (individual) => {
  const { genotype: params } = individual;

  const fitnesses = [];
  for (let index = 0; index < replics; index++) {
    const instance = RscriptCommand.build(params, { type: SeedType.GENETIC, value: index });
    const { output: fitness } = RscriptCommand.run(instance);
    fitnesses.push(fitness);
    if (!logger) break;
  }

  const averageFitness = Calculator.average(fitnesses);

  if (logger) {
    experiments.store({ fitness: averageFitness, individual, populationSize });
  }

  return averageFitness;
};

params.fitnessFunction = fitnessFunction;

const createPopulation = () => {
  const population = new Population<MixedIndividual, number>(
    (currentBestFitness, newFitness) => newFitness < currentBestFitness,
  );

  for (let index = 0; index < populationSize; index++) {
    const mixedGenerator = new MixedGenerator();
    const individual = mixedGenerator.generateWith({
      length: NUMBER_OF_PARAMS,
      engine: nativeMath,
      range: new NumericRange(),
    });

    const fitness = fitnessFunction(individual);

    population.pushIndividual(individual, fitness);
  }

  return population;
};

logger = true;

const evolutionaryAlgorithm = new EvolutionaryAlgorithm<
  MixedIndividual,
  number,
  NumericParams,
  FitnessProportionalSelectionParams<MixedIndividual, number>,
  CrossoverParams<MixedIndividual, number>,
  MutationParams
>(params, createPopulation());

evolutionaryAlgorithm.run();

const bestCandidate = evolutionaryAlgorithm.population.getFittestIndividualItem()?.individual;
const fitness = evolutionaryAlgorithm.population.getFittestIndividualItem()?.fitness;

if (bestCandidate === undefined) {
  throw 'Not fittest individual found';
}

experiments.write(saveFilePath);

console.log('Best fitness achieved ', fitness);
console.timeEnd('execution');
