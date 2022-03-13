import { ICommentAnalyzer } from '../interfaces';

export class RegexCommentAnalyzer implements ICommentAnalyzer {
  constructor(protected regExp: RegExp) {}

  public valid(str: string): boolean {
    return this.regExp.test(str);
  }
}
