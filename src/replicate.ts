import { LazyIterator, injectLazyIteratorFactory } from "./iterator.js";

/**
 * A lazy iterator that repeats the given value for given times.
 */
export class LazyReplicateIterator<T> extends LazyIterator<
  T,
  undefined,
  undefined
> {
  protected currentPos = -1;

  constructor(public source: T, public count: number) {
    super();
  }

  public next() {
    this.currentPos++;
    if (this.currentPos >= this.count) {
      return {
        done: true as const,
        value: undefined,
      };
    }
    return {
      done: false as const,
      value: this.source,
    };
  }
}

declare module "./iterator" {
  interface LazyIteratorFactory {
    /**
     * Creates a lazy iterator that repeats the given value for given times.
     * @param source The value to repeat
     * @param count The number of times to repeat the value
     */
    replicate<T>(source: T, count: number): LazyReplicateIterator<T>;
  }
}

injectLazyIteratorFactory("replicate", function (source: any, count: any) {
  return new LazyReplicateIterator(source, count);
});
