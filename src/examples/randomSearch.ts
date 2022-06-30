import { randomSearch } from '../algorithms/RandomSearch';
import { ExecutionEngine } from '../enums/ExecutionEngine';

const { candidate: dockerCandidate } = randomSearch({
  engine: ExecutionEngine.DOCKER,
  numberOfIterations: 1,
});
const { candidate: rscriptCandidate } = randomSearch({
  engine: ExecutionEngine.RSCRIPT,
  numberOfIterations: 1,
});

console.log(`Best docker candidate parameters: [${dockerCandidate.parameters}]`);
console.log(`Best docker candidate output: ${dockerCandidate.output}`);
console.log(`Best rscript candidate parameters: [${rscriptCandidate.parameters}]`);
console.log(`Best rscript candidate output: ${rscriptCandidate.output}`);
