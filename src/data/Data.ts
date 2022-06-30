import { existsSync, mkdirSync, writeFile } from 'fs';
import path from 'path';
import { MixedIndividual } from '../GeneticsJS/src/individual/numeric/mixed';
import { ExecutionInfo } from '../interfaces/ExecutionInfo';
import { stringify } from '../utils/stringify';

interface StoreExecutionData {
  fitness: number;
  individual: MixedIndividual;
  populationSize: number;
}

export class ExecutionData {
  static iteration: number = 0;

  constructor(private executionInfo: ExecutionInfo) {}

  store(data: StoreExecutionData) {
    const { fitness, populationSize, individual } = data;
    const generation = Math.floor(this.getIteration() / populationSize);
    const individualNumber = Math.abs(populationSize * generation - this.getIteration()) + 1;

    console.log(`FITNESS: Gen ${generation}, Ind ${individualNumber}: ${fitness}\n`);

    ExecutionData.iteration++;

    if (!this.executionInfo.generations[generation]) {
      this.executionInfo.generations[generation] = [];
    }

    this.executionInfo.generations[generation].push({
      id: generation,
      fitness,
      genotype: individual.genotype,
    });
  }

  write(saveFilePath: string) {
    console.log('Checking', saveFilePath);

    if (!existsSync(path.dirname(saveFilePath))) {
      mkdirSync(path.dirname(saveFilePath), { recursive: true });
    }

    console.log('Writing...');
    writeFile(saveFilePath + '.json', stringify(this.executionInfo), { encoding: 'utf-8', flag: 'a' }, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log(path.basename(saveFilePath + '.json'), 'has been saved');
    });

    console.log('Fittest candidate located at ', saveFilePath + '.json');
  }

  getIteration() {
    return ExecutionData.iteration;
  }
}
