import { ExecutionEngine } from '../enums/ExecutionEngine';

export interface RandomSearchParams {
  engine: ExecutionEngine;
  numberOfIterations: number;
}
