import { injectLazyIteratorInstance } from "./iterator.js";

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates an array from the values in this lazy iterator.
     */
    toArray(): T[];
  }
}

injectLazyIteratorInstance("toArray", function () {
  const result = [];
  for (let next = this.next(); !next.done; next = this.next()) {
    result.push(next.value);
  }
  return result;
});
