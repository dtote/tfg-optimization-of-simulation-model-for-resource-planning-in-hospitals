import { execSync } from 'child_process';
import { DOCKER_COMMAND } from '../constants/Commands';
import { Generator } from '../generators/Generator';
import { CandidateSolution } from '../interfaces/CandidateSolution';

// Docker command example: "docker run --rm mrebolle/r-geccoc:Track1 -c 'Rscript objfun.R '13,11,5,9,5,8,3,7,29,20,4,5,0.9379808054800287,0.08441531200677291,0.08528385813225592,0.012347186091480816,0.08135414963870324,0.0009032053168092967,0.09879778452268863,0.2988875557348542,0.09238234658431071,0.6483335697959305,0.0007918733764480738,3,0.32341500161548464,0.004169911269926939,2,5,0.6175714436270859' '"

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
      const parameters = Generator.randomSimulatorParams();
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
