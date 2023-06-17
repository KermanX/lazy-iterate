import { injectLazyIterator } from "./index.js";

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    toArray(): T[];
  }
}

injectLazyIterator("toArray", function () {
  const result = [];
  for (let next = this.next(); !next.done; next = this.next()) {
    result.push(next.value);
  }
  return result;
});
