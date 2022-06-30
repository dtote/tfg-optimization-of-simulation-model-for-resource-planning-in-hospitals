import { readFileSync, writeFile } from 'fs';
import path from 'path';
import { Calculator } from '../calculator/Calculator';
import { ExecutionInfo } from '../interfaces/ExecutionInfo';
import { stringify } from '../utils/stringify';

export const computeFitnessEvolution = (filename: string) => {
  const fileData = readFileSync(`${path.join(__dirname, filename)}`, { encoding: 'utf-8' });
  const generations = (JSON.parse(fileData) as ExecutionInfo).generations;

  const result = generations.map((generation, generationIndex) => {
    const fitnesses = generation.map((individual) => individual.fitness);
    const minGenerationFitness = Calculator.min(fitnesses);
    const maxGenerationFitness = Calculator.max(fitnesses);
    const averageGenerationFitness = Calculator.average(fitnesses);

    return {
      generationIndex,
      minGenerationFitness,
      maxGenerationFitness,
      averageGenerationFitness,
    };
  });

  writeFile(
    path.join(__dirname, 'fitness-evolution', filename),
    stringify(result),
    { encoding: 'utf-8', flag: 'a' },
    (err) => {
      if (err) {
        return console.log(err);
      }
    },
  );
};

computeFitnessEvolution('polynomial_25_10_100.json');
computeFitnessEvolution('uniform_25_10_100.json');
computeFitnessEvolution('nonUniform_25_10_100.json');
computeFitnessEvolution('nonUniform_25_10_100_local.json');
computeFitnessEvolution('test_p25_100g_10r_default.json');
computeFitnessEvolution('nonUniform_50_3_100_local.json');
