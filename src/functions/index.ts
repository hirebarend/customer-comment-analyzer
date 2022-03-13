import * as fs from 'fs';

export function combineResults(array: Array<{ [key: string]: number }>): {
  [key: string]: number;
} {
  return array.reduce(
    (a: { [key: string]: number }, b: { [key: string]: number }) => {
      const keys: Array<string> = Object.keys(b);

      for (const key of keys) {
        if (!a[key]) {
          a[key] = b[key];
        } else {
          a[key] += b[key];
        }
      }

      return a;
    }
  );
}

export async function readFileAsync(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (error, data: string) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(data);
    });
  });
}
