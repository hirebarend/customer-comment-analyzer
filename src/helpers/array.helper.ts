export class ArrayHelper {
  public static chunks<T>(array: Array<T>, n: number): Array<Array<T>> {
    return array.reduce((array, item, index) => {
      const chunkIndex: number = Math.floor(index / n);

      if (!array[chunkIndex]) {
        array[chunkIndex] = [];
      }

      array[chunkIndex].push(item);

      return array;
    }, [] as Array<Array<T>>);
  }

  public static repeat<T>(fn: (index: number) => T, n: number): Array<T> {
    const array: Array<T> = [];

    for (let i = 0; i < n; i++) {
      array.push(fn(i));
    }

    return array;
  }
}
