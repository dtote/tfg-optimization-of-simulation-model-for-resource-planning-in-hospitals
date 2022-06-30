export interface ExecutionInfo {
  execution: number;
  generations: Array<Array<{ id: number; fitness: number; genotype: number[] }>>;
}
