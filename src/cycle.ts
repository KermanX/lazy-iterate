import { LazyIterator, injectLazyIteratorInstance } from "./iterator.js";

/**
 * A lazy iterator that cycles through the source iterator.
 */
export class LazyCycleIterator<T, TNext = undefined> extends LazyIterator<
  T,
  never,
  TNext
> {
  protected cache: T[] = [];
  protected currentPos = -1;

  constructor(public source: LazyIterator<T, any, TNext>) {
    super();
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

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that cycles through this lazy iterator.
     */
    cycle(): LazyCycleIterator<T, TNext>;
  }
}

injectLazyIteratorInstance("cycle", function () {
  return new LazyCycleIterator(this);
});
