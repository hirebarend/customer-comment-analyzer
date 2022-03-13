import {
  RegexCommentAnalyzer,
  ShorterThanCommentAnalyzer,
} from './comment-analyzers';
import { readFileAsync } from './functions';
import { ICommentAnalyzer } from './interfaces';

process.on('message', async (file: string) => {
  try {
    const result = await processFile(file, {
      MOVER_MENTIONS: new RegexCommentAnalyzer(new RegExp(/mover/gi)),
      SHAKER_MENTIONS: new RegexCommentAnalyzer(new RegExp(/shaker/gi)),
      SHORTER_THAN_15: new ShorterThanCommentAnalyzer(15),
      SPAM: new RegexCommentAnalyzer(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)),
      QUESTIONS: new RegexCommentAnalyzer(new RegExp(/\?/gi)),
    });

    if (process.send) {
      process.send(JSON.stringify(result));
    }
  } catch {
    if (process.send) {
      process.send(JSON.stringify(null));
    }
  }
});

async function processFile(
  file: string,
  commentAnalyzers: { [key: string]: ICommentAnalyzer }
): Promise<{ [key: string]: number }> {
  const content: string = await readFileAsync(file);

  const lines: Array<string> = content.split('\n');

  const result: { [key: string]: number } = {};

  for (const line of lines) {
    const commentAnalyzerKeys: Array<string> = Object.keys(commentAnalyzers);

    for (const commentAnalyzerKey of commentAnalyzerKeys) {
      const commentAnalyzer: ICommentAnalyzer =
        commentAnalyzers[commentAnalyzerKey];

      if (commentAnalyzer.valid(line)) {
        if (!result[commentAnalyzerKey]) {
          result[commentAnalyzerKey] = 0;
        }

        result[commentAnalyzerKey] += 1;
      }
    }
  }

  return result;
}
