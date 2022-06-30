import { randomSearch } from './algorithm/RandomSearch';
import { ExecutionEngine } from './types/enums/ExecutionEngine';

const { candidate: docker } = randomSearch({
  engine: ExecutionEngine.DOCKER,
  numberOfIterations: 1,
});
const { candidate: rscript } = randomSearch({
  engine: ExecutionEngine.RSCRIPT,
  numberOfIterations: 1,
});

console.log(`Best docker candidate parameters: [${docker.parameters}]`);
console.log(`Best docker candidate output: ${docker.output}`);
console.log(`Best rscript candidate parameters: [${rscript.parameters}]`);
console.log(`Best rscript candidate output: ${rscript.output}`);
