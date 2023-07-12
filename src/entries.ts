import { injectLazyIteratorInstance } from "./iterator.js";
import { LazyMapIterator } from "./map.js";

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that yields [index, value] pairs for each value in this lazy iterator.
     */
    entries(): LazyMapIterator<T, [number, T], TReturn, TReturn, TNext>;
  }
}

injectLazyIteratorInstance("entries", function () {
  return this.map(
    (v: any, i: any) => [i, v],
    (v: any) => v
  );
});
