import { writeFile } from 'fs';
import path from 'path';
import yargs from 'yargs';
import { DockerCommand } from '../commands/DockerCommand';
import { RscriptCommand } from '../commands/RscriptCommand';
import { ExecutionEngine } from '../enums/ExecutionEngine';
import { Generator } from '../generators/Generator';
import { stringify } from '../GeneticsJS/src/optimization/utils/stringify';
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
    const randomNumber = Generator.randomIntegerFromRange({
      lower: 0,
      upper: instances.length - 1,
    });

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
    o: { type: 'string', default: 'randomSearch.json' },
  })
  .alias('i', 'iterations')
  .nargs('i', 1)
  .example('$0 -i 100', 'Runs the random search with specified iterations')

  .alias('t', 'times')
  .nargs('t', 1)
  .example('$0 -t 2', 'Runs the random search t times')

  .alias('o', 'outputFile')
  .alias('o', 'output')
  .nargs('o', 1)
  .example('$0 -o output', 'Runs random search with specified name for output file')

  .help('h')
  .alias('h', 'help')
  .parseSync();

const { iterations, times, output } = argv;

const results = [];
for (let index = 0; index < times; index++) {
  const { candidate } = randomSearch({ engine: ExecutionEngine.RSCRIPT, numberOfIterations: iterations });
  results.push(candidate);
}

const outputfile = path.join(__dirname, '..', 'data', `${output}.json`);
writeFile(outputfile, stringify(results), { encoding: 'utf-8', flag: 'a' }, (err) => {
  if (err) {
    return console.log(err);
  }
});

const bestFitness = Math.min(...results.map((s) => s.output));
console.log('Best fitness achieved ', bestFitness);
console.log('Results saved on file ', outputfile);
console.timeEnd('execution');
