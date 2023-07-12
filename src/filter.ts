import { LazyIterator, injectLazyIteratorInstance } from "./iterator.js";

/**
 * A lazy iterator that filters values from the source iterator.
 */
export class LazyFilterIterator<
  T,
  TReturn = any,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  constructor(
    public source: LazyIterator<T, TReturn, TNext>,
    public predicate: (value: T) => boolean
  ) {
    super();
  }

  public next(...args: [] | [TNext]) {
    let old = this.source.next(...args);
    while (!old.done) {
      if (this.predicate((old as IteratorYieldResult<T>).value)) {
        break;
      }
      old = this.source.next(...args);
    }
    return old;
  }
}

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that filters values from this lazy iterator.
     * @param predicate The predicate function to use to filter values.
     */
    filter(
      predicate: (value: T) => boolean
    ): LazyFilterIterator<T, TReturn, TNext>;
  }
}

injectLazyIteratorInstance("filter", function (predicate: any) {
  return new LazyFilterIterator(this, predicate);
});
