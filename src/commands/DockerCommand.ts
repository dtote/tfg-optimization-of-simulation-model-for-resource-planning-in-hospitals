import { execSync } from 'child_process';
import { DOCKER_COMMAND } from '../constants/Commands';
import { CandidateSolution } from '../interfaces/CandidateSolution';
import { getRandomSimulatorParams } from '../utils/generateParams';

export class DockerCommand {
  static run(command: string): CandidateSolution {
    try {
      const buffer: Buffer = execSync(command);
      const output = Number(buffer.toString());
      const candidate = {
        parameters: DockerCommand.toParameters(command),
        output,
      } as CandidateSolution;

      return candidate;
    } catch (error) {
      throw new Error('Error during execution.');
    }
  }

  static build(parameters: number[]): string {
    const joinedParameters = parameters.join(',');
    const instance = `${DOCKER_COMMAND} '${joinedParameters}' '`;

    return instance;
  }

  static generate(numberOfInstances: number): string[] {
    const instances = [];

    for (let index = 0; index < numberOfInstances; index++) {
      const parameters = getRandomSimulatorParams();
      const instance = DockerCommand.build(parameters);

      instances.push(instance);
    }

    return instances;
  }

  static toParameters(command: string) {
    const endOfLetters = command.indexOf('.R') + 2;
    const commandWithoutLetters = command.slice(endOfLetters);
    const commandValuesAsStrings = commandWithoutLetters.replace(/[' ]/g, '').split(',');

    return commandValuesAsStrings.map((value) => Number(value));
  }
}
