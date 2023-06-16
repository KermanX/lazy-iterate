import { LazyIterator, injectLazyIterator } from "./index.js";

export class LazyFilterIterator<
  T,
  TReturn = any,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  protected source: LazyIterator<T, TReturn, TNext>;
  protected predicate: (value: T) => boolean;

  constructor(
    source: LazyIterator<T, TReturn, TNext>,
    predicate: (value: T) => boolean
  ) {
    super();
    this.source = source;
    this.predicate = predicate;
  }

  public next(...args: [] | [TNext]) {
    let old = this.source.next(...args);
    while (!old.done) {
      if (this.predicate((old as IteratorYieldResult<T>).value)) {
        break;
      }
      old = this.source.next(...args);
    }
    this.cacheResult(old);
    return old;
  }
}

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    filter(
      predicate: (value: T) => boolean
    ): LazyFilterIterator<T, TReturn, TNext>;
  }
}

injectLazyIterator("filter", function (predicate: any) {
  return new LazyFilterIterator(this, predicate);
});
