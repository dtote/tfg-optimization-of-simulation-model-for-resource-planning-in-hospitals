import { readFileSync } from 'fs';
import path from 'path';
import { ExecutionInfo } from '../interfaces/ExecutionInfo';

export const getBestAndWorstFitnessFromFile = (filepath: string) => {
  const regex = /(?<=fitness":).*?(?=,)/g;
  const fileData = readFileSync(filepath, { encoding: 'utf-8' });
  const fitnessValuesInString = fileData.match(regex);
  const fitnessValues = fitnessValuesInString!.map(Number);

  return { max: Math.max(...fitnessValues), min: Math.min(...fitnessValues) };
};

export const getIndividualsFromFitness = (filepath: string, min: number, max: number) => {
  const fileData = readFileSync(filepath, { encoding: 'utf-8' });
  const json: ExecutionInfo = JSON.parse(fileData);
  const searchedGenerations = json.generations
    .map((generation) => generation.find((individual) => individual.fitness === min || individual.fitness === max))
    .filter(Boolean);

  return searchedGenerations;
};

const filepath = path.join(__dirname, 'test_p25_100g_10r_default.json');
const { max, min } = getBestAndWorstFitnessFromFile(filepath);
const individuals = getIndividualsFromFitness(filepath, min, max);

console.log(individuals);
