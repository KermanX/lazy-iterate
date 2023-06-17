import { injectLazyIterator } from "./index.js";

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    reduce(reducer: (accumulator: T, value: T) => T): T;
    reduce(reducer: (accumulator: T, value: T) => T, initialValue: T): T;
    reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U;
  }
}

injectLazyIterator("reduce", function (reducer: any, initialValue?: any) {
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
});

/*
type InitialValueArgs<T, U> = (<X>() => T) extends <X>() => U
  ? (<X>() => U) extends <X>() => T
    ? [initialValue?: U]
    : [initialValue: U]
  : [initialValue: U];

export class LazyReduceIterator<
  T,
  TReturn = any,
  TNext = undefined,
  U = T
> extends LazyIterator<U, TReturn, TNext> {
  protected source: LazyIterator<T, TReturn, TNext>;
  protected reducer: (accumulator: U, value: T) => U;

  protected accumulator: U;

  constructor(
    source: LazyIterator<T, TReturn, TNext>,
    reducer: (accumulator: U, value: T) => U,
    ...initialValueArgs: InitialValueArgs<T, U>
  ) {
    super();
    this.source = source;
    this.reducer = reducer;
    this.accumulator =
      initialValueArgs[0] ??
      (() => {
        const result = this.source.next();
        if (result.done) {
          throw new TypeError("Reduce of empty iterator with no initial value");
        }
        return (result as IteratorYieldResult<T>).value as unknown as U;
      })();
  }

  public next(...args: [] | [TNext]) {
    let old = this.source.next(...args);
    if (old.done) {
      return old;
    }
    this.accumulator = this.reducer(
        this.accumulator,
        (old as IteratorYieldResult<T>).value
    );
    return {
        done: false as const,
        value: this.accumulator,
    };
  }
}

*/
