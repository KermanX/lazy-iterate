import { injectLazyIterator } from "./index.js";
import { LazyMapIterator } from "./map.js";

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    entries(): LazyMapIterator<T, [number, T], TReturn, TReturn, TNext>;
  }
}

injectLazyIterator("entries", function () {
  return this.map(
    (v, i) => [i, v],
    (v) => v
  );
});
