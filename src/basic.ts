import { LazyIterator, injectLazyIteratorFactory } from "./iterator.js";

/**
 * A basic implementation of a lazy iterator, which wraps an existing iterator.
 */
export class BasicLazyIterator<
  T,
  TReturn = any,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  constructor(public source: Iterator<T, TReturn, TNext>) {
    super();
  }

  next(...args: [] | [TNext]): IteratorResult<T, TReturn> {
    return this.source.next(...args);
  }
}

declare module "./iterator" {
  interface LazyIteratorFactory {
    /**
     * Creates a lazy iterator from an existing iterator or iterable.
     * @param source the source iterable
     */
    from<T>(source: Iterable<T>): LazyIterator<T, any, undefined>;
    /**
     * Creates a lazy iterator from an existing iterator or iterable.
     * @param source the source iterator
     */
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
