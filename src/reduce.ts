import { injectLazyIteratorInstance } from "./iterator.js";

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that reduces the values in this lazy iterator to a single value.
     * @param reducer The reducer function to use to reduce values.
     */
    reduce(reducer: (accumulator: T, value: T) => T): T;
    /**
     * Creates a lazy iterator that reduces the values in this lazy iterator to a single value.
     * @param reducer The reducer function to use to reduce values.
     * @param initialValue The initial value to use for the accumulator.
     */
    reduce(reducer: (accumulator: T, value: T) => T, initialValue: T): T;
    /**
     * Creates a lazy iterator that reduces the values in this lazy iterator to a single value.
     * @param reducer The reducer function to use to reduce values.
     * @param initialValue The initial value to use for the accumulator.
     */
    reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U;
  }
}

injectLazyIteratorInstance(
  "reduce",
  function (reducer: any, initialValue?: any) {
    let accumulator =
      initialValue ??
      (() => {
        const result = this.next();
        if (result.done) {
          throw new TypeError("Reduce of empty iterator with no initial value");
        }
        return result.value;
      })();
    let next = this.next();
    while (!next.done) {
      accumulator = reducer(accumulator, next.value);
      next = this.next();
    }
    return accumulator;
  }
);
