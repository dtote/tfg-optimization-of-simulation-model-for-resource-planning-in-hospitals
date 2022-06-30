import { readFileSync, writeFile } from 'fs';
import path from 'path';
import { Calculator } from '../calculator/Calculator';
import { ExecutionInfo } from '../interfaces/ExecutionInfo';
import { stringify } from '../utils/stringify';

const getBestIndividual = (
  value: number,
  generation: {
    id: number;
    fitness: number;
    genotype: number[];
  }[],
) => generation.find((individual) => individual.fitness === value);

export function computeStats(filename: string) {
  const fileData = readFileSync(`${path.join(__dirname, filename)}`, { encoding: 'utf-8' });
  const generations = (JSON.parse(fileData) as ExecutionInfo).generations;

  const fitnesses = generations.reduce((result, generation) => {
    return [...result, ...generation.map((individual) => individual.fitness)];
  }, [] as number[]);

  const minFitness = Calculator.min(fitnesses);
  const maxFitness = Calculator.max(fitnesses);
  const averageFitness = Calculator.average(fitnesses);
  const medianFitness = Calculator.median(fitnesses);

  const stats = { minFitness, maxFitness, averageFitness, medianFitness, filename };

  generations.forEach((generation) => {
    const fittestIndividual = getBestIndividual(minFitness, generation);

    if (fittestIndividual) {
      Object.assign(stats, { ...stats, fittestIndividual });
      return;
    }
  });

  writeFile(
    path.join(__dirname, 'execution-stats', filename),
    stringify(stats),
    { encoding: 'utf-8', flag: 'a' },
    (err) => {
      if (err) {
        return console.log(err);
      }
    },
  );
}

computeStats('polynomial_25_10_100.json');
computeStats('uniform_25_10_100.json');
computeStats('nonUniform_25_10_100.json');
computeStats('nonUniform_25_10_100_local.json');
computeStats('test_p25_100g_10r_default.json');
computeStats('nonUniform_50_3_100_local.json');
