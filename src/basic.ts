import { LazyIterator, injectLazyIteratorFactory } from "./index.js";

export class BasicLazyIterator<
  T,
  TReturn = any,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  protected source: Iterator<T, TReturn, TNext>;

  constructor(source: Iterator<T, TReturn, TNext>) {
    super();
    this.source = source;
  }

  next(...args: [] | [TNext]): IteratorResult<T, TReturn> {
    return this.source.next(...args);
  }
}

declare module "./index.js" {
  interface LazyIteratorFactory {
    from<T>(source: Iterable<T>): LazyIterator<T, any, undefined>;
    from<T, TReturn, TNext>(
      source: Iterator<T, TReturn, TNext>
    ): LazyIterator<T, TReturn, TNext>;
  }
}

injectLazyIteratorFactory("from", function (source: any) {
  if (typeof source[Symbol.iterator] === "function") {
    return new BasicLazyIterator(source[Symbol.iterator]());
  }
  return new BasicLazyIterator(source);
});
