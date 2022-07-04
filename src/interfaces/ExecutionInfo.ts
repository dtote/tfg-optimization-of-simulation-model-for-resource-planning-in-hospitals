export interface IndividualData {
  id: number;
  fitness: number;
  genotype: number[];
}
export interface ExecutionInfo {
  execution: number;
  generations: Array<Array<IndividualData>>;
}
