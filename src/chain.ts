import { injectLazyIteratorFactory, lazyIteratorFactory } from "./iterator.js";
import { BasicLazyIterator } from "./basic.js";

export function* LazyChainIterator<T>(
  ...iterables: Iterable<T>[]
): Iterable<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

declare module "./iterator" {
  interface LazyIteratorFactory {
    /**
     * Creates a lazy iterator that chains the given iterables.
     * @param iterables The iterables to chain
     */
    chain<T>(...iterables: Iterable<T>[]): BasicLazyIterator<T>;
  }
}

injectLazyIteratorFactory("chain", function (...iterables: any) {
  return lazyIteratorFactory.from(LazyChainIterator(...iterables));
});
