import yargs from 'yargs';
import { DockerCommand } from '../commands/DockerCommand';
import { RscriptCommand } from '../commands/RscriptCommand';
import { ExecutionEngine } from '../enums/ExecutionEngine';
import { Generator } from '../GeneticsJS/src/generator/utils';
import { NumericRange } from '../GeneticsJS/src/individual/numeric';
import { AlgorithmResponse } from '../interfaces/AlgorithmResponse';
import { CandidateSolution } from '../interfaces/CandidateSolution';
import { RandomSearchParams } from '../interfaces/RandomSearchParams';
import { isLower } from '../utils/isLower';

export function randomSearch(params: RandomSearchParams): AlgorithmResponse {
  const { engine, numberOfIterations } = params;

  const numberOfInstances = numberOfIterations;

  const instances =
    engine === ExecutionEngine.DOCKER
      ? DockerCommand.generate(numberOfInstances)
      : RscriptCommand.generate(numberOfInstances);

  let bestCandidate = {
    parameters: [],
    output: Number.MAX_SAFE_INTEGER,
  } as CandidateSolution;

  for (let index = 0; index < numberOfIterations; index++) {
    // TODO: revisar que la implementacion del metodo generator normal es igual a la del generator de geneticsjs
    const randomNumber = Generator.generateInteger(new NumericRange(0, instances.length - 1));

    const selectedCandidate =
      engine === ExecutionEngine.DOCKER
        ? DockerCommand.run(instances[randomNumber])
        : RscriptCommand.run(instances[randomNumber]);

    if (isLower(selectedCandidate, bestCandidate)) {
      bestCandidate = selectedCandidate;
    }
  }

  return { candidate: bestCandidate } as AlgorithmResponse;
}

console.time('execution');

const argv = yargs(process.argv.slice(2))
  .options({
    i: { type: 'number', default: 5 },
    t: { type: 'number', default: 1 },
  })
  .alias('i', 'iterations')
  .nargs('i', 1)
  .example('$0 -i 100', 'Runs the random search with specified iterations')

  .alias('t', 'times')
  .nargs('t', 1)
  .example('$0 -t 2', 'Runs the random search t times')

  .help('h')
  .alias('h', 'help')
  .parseSync();

const { iterations, times } = argv;

const results = [];
for (let index = 0; index < times; index++) {
  const { candidate } = randomSearch({ engine: ExecutionEngine.RSCRIPT, numberOfIterations: iterations });
  results.push(candidate);
}

const chartRanges: Record<string, CandidateSolution[]> = {
  '0-20': [],
  '20-40': [],
  '40-60': [],
  '60-80': [],
  '80-100': [],
  '100-120': [],
  '120-140': [],
  '140-160': [],
};

results.forEach((result) => {
  if (result.output < 20) chartRanges['0-20'].push(result);
  if (result.output < 40 && result.output >= 20) chartRanges['20-40'].push(result);
  if (result.output < 60 && result.output >= 40) chartRanges['40-60'].push(result);
  if (result.output < 80 && result.output >= 60) chartRanges['60-80'].push(result);
  if (result.output < 100 && result.output >= 80) chartRanges['80-100'].push(result);
  if (result.output < 120 && result.output >= 100) chartRanges['100-120'].push(result);
  if (result.output < 140 && result.output >= 120) chartRanges['120-140'].push(result);
  if (result.output < 160 && result.output >= 140) chartRanges['140-160'].push(result);
});

console.log({ chartRanges });
console.log({ results });
console.log(Object.keys(chartRanges).map((key) => ({ range: key, quantity: chartRanges[key].length })));
const bestFitness = Math.min(...results.map((s) => s.output));
const bestSolutionParameters = results.filter((s) => s.output === bestFitness);
console.log('Best fitness achieved ', bestFitness);
console.log('Best individual parameters ', bestSolutionParameters);

console.timeEnd('execution');
