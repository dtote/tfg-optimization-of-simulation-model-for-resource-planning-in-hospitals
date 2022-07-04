import { spawnSync } from 'child_process';
import { RSCRIPT_COMMAND } from '../constants/Commands';
import { Generator } from '../GeneticsJS/src/generator/utils';
import { NumericRange } from '../GeneticsJS/src/individual/numeric';
import { CandidateSolution } from '../interfaces/CandidateSolution';
import { getRandomSimulatorParams } from '../utils/generateParams';

export enum SeedType {
  GENETIC = '--genetic-seed',
  RANDOM_SEARCH = '--random-seed',
}

export class RscriptCommand {
  static run(command: string): CandidateSolution {
    try {
      const buffer = spawnSync(command, { shell: true });
      const stdout = buffer.stdout
        .toString()
        .replace(/\[1]/g, '')
        .replace(/^\s+|\s+$|\s+(?=\s)/g, '');

      const output = Number(stdout);

      if (isNaN(output)) {
        throw new Error('Error during execution');
      }

      const candidate = {
        output,
        parameters: RscriptCommand.toParameters(command),
      } as CandidateSolution;

      return candidate;
    } catch (error) {
      throw new Error('Error during execution.');
    }
  }

  static build(parameters: number[], seedOptions: { type: SeedType; value: number }): string {
    const joinedParameters = parameters.join(' ');
    const instance = `${RSCRIPT_COMMAND} ${joinedParameters} ${seedOptions.type} ${seedOptions.value}`;

    return instance;
  }

  static generate(numberOfInstances: number): string[] {
    const instances = [];

    const randomGeneratedSeed = Generator.generateInteger(new NumericRange(1, 2147483647));
    for (let index = 0; index < numberOfInstances; index++) {
      const parameters = getRandomSimulatorParams();
      const instance = RscriptCommand.build(parameters, {
        type: SeedType.RANDOM_SEARCH,
        value: randomGeneratedSeed,
      });

      instances.push(instance);
    }

    return instances;
  }

  static toParameters(command: string) {
    const endOfLetters = command.indexOf('.R') + 3;
    const startOfSeed = command.indexOf('--') - 1;
    const commandWithoutLetters = command.slice(endOfLetters, startOfSeed);
    const parameters = commandWithoutLetters.split(' ').map((str) => Number(str));

    return parameters;
  }
}
