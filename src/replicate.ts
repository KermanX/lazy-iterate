import { LazyIterator, injectLazyIteratorFactory } from "./index.js";

export class LazyReplicateIterator<T> extends LazyIterator<
  T,
  undefined,
  undefined
> {
  protected source: T;
  protected count: number;

  protected currentPos = -1;

  constructor(source: T, count: number) {
    super();
    this.source = source;
    this.count = count;
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

declare module "./index.js" {
  interface LazyIteratorFactory {
    replicate<T>(source: T, count: number): LazyReplicateIterator<T>;
  }
}

injectLazyIteratorFactory("replicate", function (source: any, count: any) {
  return new LazyReplicateIterator(source, count);
});
