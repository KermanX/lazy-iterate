import { LazyIterator, injectLazyIterator } from "./index.js";

export class LazyCycleIterator<T, TNext = undefined> extends LazyIterator<
  T,
  never,
  TNext
> {
  protected source: LazyIterator<T, any, TNext>;
  protected cache: T[] = [];
  protected currentPos = -1;

  constructor(source: LazyIterator<T, any, TNext>) {
    super();
    this.source = source;
  }

  public next(...args: [] | [TNext]) {
    this.currentPos++;
    const result = this.source.next(...args);
    if (result.done) {
      return {
        done: false as const,
        value: this.cache[this.currentPos % this.cache.length],
      };
    }
    this.cache.push((result as IteratorYieldResult<T>).value);
    return result as IteratorYieldResult<T>;
  }
}

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    cycle(): LazyCycleIterator<T, TNext>;
  }
}

injectLazyIterator("cycle", function () {
  return new LazyCycleIterator(this);
});
