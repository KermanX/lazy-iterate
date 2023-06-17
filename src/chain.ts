import {
  injectLazyIteratorFactory,
  lazyIteratorFactory,
} from "./index.js";

export function* LazyChainIterator<T>(
  ...iterables: Iterable<T>[]
): Iterable<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

declare module "./index.js" {
  interface LazyIteratorFactory {
    chain<T>(...iterables: Iterable<T>[]): BasicLazyIterator<T>;
    chain<T, TNext = undefined>(
      ...iterators: Iterator<T, any, TNext>[]
    ): LazyIterator<T, any, TNext>;
    chain<T, TNext = undefined>(
      ...iterators: LazyIterator<T, any, TNext>[]
    ): LazyIterator<T, any, TNext>;
  }
}

injectLazyIteratorFactory("chain", function (...iterables: any[]) {
  return lazyIteratorFactory.from(LazyChainIterator(...iterables));
});
