import { ICommentAnalyzer } from '../interfaces';

export class ShorterThanCommentAnalyzer implements ICommentAnalyzer {
  constructor(protected length: number) {}

  public valid(str: string): boolean {
    return str.length < this.length;
  }
}
