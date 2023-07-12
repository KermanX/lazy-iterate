import { injectLazyIteratorInstance } from "./iterator.js";

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that yields the first n values from this lazy iterator.
     * @param n The number of values to take.
     */
    take<N extends number>(n: N): T[] & { readonly length: N };
  }
}

injectLazyIteratorInstance("take", function (n: number) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const next = this.next();
    if (next.done) {
      throw new Error("take: iterator exhausted");
    }
    result.push(next.value);
  }
  return result as any;
});
