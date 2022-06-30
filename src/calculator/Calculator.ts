export class Calculator {
  static average(values: number[]): number {
    return Calculator.sum(values) / values.length;
  }

  static median(values: number[]): number {
    values.sort((a, b) => a - b);
    const lowCenter = Math.floor((values.length - 1) / 2);
    const highCenter = Math.ceil((values.length - 1) / 2);

    return (values[lowCenter] + values[highCenter]) / 2;
  }

  static sum(values: number[]): number {
    return values.reduce((prev, curr) => {
      return (curr += prev);
    }, 0);
  }

  static min(values: number[]): number {
    return Math.min(...values);
  }

  static max(values: number[]): number {
    return Math.max(...values);
  }
}
