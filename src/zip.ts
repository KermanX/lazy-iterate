import {
  LazyIterator,
  injectLazyIterator,
  LazyCachedIterator,
} from "./index.js";

export class LazyZipIterator<
  T1,
  T2,
  TReturn1 = any,
  TReturn2 = any,
  TNext1 = undefined,
  TNext2 = undefined
> extends LazyCachedIterator<[T1, T2], TReturn1 | TReturn2, [TNext1, TNext2]> {
  protected source1: LazyIterator<T1, TReturn1, TNext1>;
  protected source2: LazyIterator<T2, TReturn2, TNext2>;

  constructor(
    source1: LazyIterator<T1, TReturn1, TNext1>,
    source2: LazyIterator<T2, TReturn2, TNext2>
  ) {
    super();
    this.source1 = source1;
    this.source2 = source2;
  }

  public next(args: [TNext1, TNext2]) {
    const old1 = this.source1.next(args[0]);
    const old2 = this.source2.next(args[1]);
    const done = old1.done || old2.done;
    const result = done
      ? {
          done: true as const,
          value: old1.done
            ? old1.value
            : (old2 as IteratorReturnResult<TReturn2>).value,
        }
      : {
          done: false as const,
          value: [
            (old1 as IteratorYieldResult<T1>).value,
            (old2 as IteratorYieldResult<T2>).value,
          ] as [T1, T2],
        };
    this.cacheResult(result);
    return result;
  }
}

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    zip<U, UReturn, UNext>(
      other: LazyIterator<U, UReturn, UNext>
    ): LazyZipIterator<T, U, TReturn, UReturn, TNext, UNext>;
  }
}

injectLazyIterator("zip", function (other: any) {
  return new LazyZipIterator(this, other);
});
