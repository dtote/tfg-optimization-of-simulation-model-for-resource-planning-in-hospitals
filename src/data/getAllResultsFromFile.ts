import { readFileSync } from 'fs';
import path from 'path';

export const getIndividualsFromFitness = (filepath: string) => {
  const fileData = readFileSync(filepath, { encoding: 'utf-8' });
  return JSON.parse(fileData).generations;
};

const filepath = path.join(__dirname, 'test_p25_100g_10r_default.json');
const individuals = getIndividualsFromFitness(filepath);

const lastElement = individuals[individuals.length - 1][individuals[individuals.length - 1].length - 1];
const firstElement = individuals[0][0];
const elements = individuals.length;
console.log(elements);
console.log(firstElement);
console.log(lastElement);
