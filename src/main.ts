import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { combineResults } from './functions';
import { ArrayHelper } from './helpers';

(async () => {
  const numberOfChildProcesses: number = 2;

  const childProcesses: Array<child_process.ChildProcess> = ArrayHelper.repeat(
    (index: number) => child_process.fork(path.join(__dirname, 'child.js')),
    numberOfChildProcesses
  );

  const directory: string = path.join(__dirname, '..', 'files');

  const files: Array<string> = fs.readdirSync(
    path.join(__dirname, '..', 'files')
  );

  const filesChunks: Array<Array<string>> = ArrayHelper.chunks(
    files,
    childProcesses.length
  );

  const totalResultsArray: Array<{ [key: string]: number }> = [];

  for (const filesChunk of filesChunks) {
    const resultsArray: Array<{ [key: string]: number }> = await Promise.all(
      filesChunk.map((file: string, index: number) =>
        processFile(childProcesses[index], path.join(directory, file))
      )
    );

    totalResultsArray.push(combineResults(resultsArray));
  }

  for (const x of childProcesses) {
    x.kill();
  }

  const totalResults: { [key: string]: number } =
    combineResults(totalResultsArray);

  console.log(JSON.stringify(totalResults, undefined, 3));
})();

function processFile(
  childProcess: child_process.ChildProcess,
  file: string
): Promise<{ [key: string]: number }> {
  return new Promise((resolve, reject) => {
    let errorListener: ((error: Error) => void) | null = null;
    let messageListener: ((result: string) => void) | null = null;

    errorListener = (error: Error) => {
      if (errorListener) {
        childProcess.removeListener('error', errorListener);
      }

      if (messageListener) {
        childProcess.removeListener('message', messageListener);
      }

      reject(error);
    };

    messageListener = (result: string) => {
      if (errorListener) {
        childProcess.removeListener('error', errorListener);
      }

      if (messageListener) {
        childProcess.removeListener('message', messageListener);
      }

      resolve(JSON.parse(result));
    };

    childProcess.on('error', errorListener);

    childProcess.on('message', messageListener);

    childProcess.send(file);
  });
}
