import { LazyIterator, injectLazyIteratorInstance } from "./iterator.js";

/**
 * The enum of which iterator finished first in a zip iterator.
 */
export enum ZipDoneType {
  /**
   * The first iterator finished first.
   */
  iter1,
  /**
   * The second iterator finished first.
   */
  iter2,
}

/**
 * The return type of a zip iterator.
 * @member type The type of iterator that finished.
 * @member value The value returned by the iterator.
 */
export type ZipReturn<TReturn1, TReturn2> =
  | {
      type: ZipDoneType.iter1;
      value: TReturn1;
    }
  | {
      type: ZipDoneType.iter2;
      value: TReturn2;
    };

/**
 * A lazy iterator that zips two iterators together.
 */
export class LazyZipIterator<
  T1,
  T2,
  TReturn1 = any,
  TReturn2 = any,
  TNext1 = undefined,
  TNext2 = undefined
> extends LazyIterator<
  [T1, T2],
  ZipReturn<TReturn1, TReturn2>,
  [TNext1, TNext2]
> {
  constructor(
    public source1: LazyIterator<T1, TReturn1, TNext1>,
    public source2: LazyIterator<T2, TReturn2, TNext2>
  ) {
    super();
  }

  public next(args: [TNext1, TNext2]) {
    const old1 = this.source1.next(args[0]);
    const old2 = this.source2.next(args[1]);
    const done = old1.done || old2.done;
    const result = done
      ? {
          done: true as const,
          value: old1.done
            ? ({
                type: ZipDoneType.iter1,
                value: old1.value,
              } as const)
            : ({
                type: ZipDoneType.iter2,
                value: (old2 as IteratorReturnResult<TReturn2>).value,
              } as const),
        }
      : {
          done: false as const,
          value: [
            (old1 as IteratorYieldResult<T1>).value,
            (old2 as IteratorYieldResult<T2>).value,
          ] as [T1, T2],
        };
    return result;
  }
}

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that zips the source iterators.
     * @param other The other iterator to zip with.
     */
    zip<U, UReturn, UNext>(
      other: LazyIterator<U, UReturn, UNext>
    ): LazyZipIterator<T, U, TReturn, UReturn, TNext, UNext>;
  }
}

injectLazyIteratorInstance("zip", function (other: any) {
  return new LazyZipIterator(this, other);
});

/**
 * A lazy iterator that zips the source iterators, filling in missing values with a fill value.
 */
export class LazyZipLongestIterator<
  T1,
  T2,
  TReturn1 = any,
  TReturn2 = any,
  TNext1 = undefined,
  TNext2 = undefined
> extends LazyIterator<[T1, T2], [TReturn1, TReturn2], [TNext1, TNext2]> {
  constructor(
    public source1: LazyIterator<T1, TReturn1, TNext1>,
    public source2: LazyIterator<T2, TReturn2, TNext2>,
    public fillValue1: T1,
    public fillValue2: T2
  ) {
    super();
  }

  public next(args: [TNext1, TNext2]) {
    const old1 = this.source1.next(args[0]);
    const old2 = this.source2.next(args[1]);
    const done = old1.done && old2.done;
    const result = done
      ? {
          done: true as const,
          value: [
            old1.value,
            (old2 as IteratorReturnResult<TReturn2>).value,
          ] as [TReturn1, TReturn2],
        }
      : {
          done: false as const,
          value: [
            old1.done
              ? this.fillValue1
              : (old1 as IteratorYieldResult<T1>).value,
            old2.done
              ? this.fillValue2
              : (old2 as IteratorYieldResult<T2>).value,
          ] as [T1, T2],
        };
    return result;
  }
}

declare module "./iterator" {
  interface LazyIterator<T, TReturn, TNext> {
    /**
     * Creates a lazy iterator that zips the source iterators, filling in missing values with a fill value.
     * @param other The other iterator to zip with.
     * @param fillThis The value to fill in for the source iterator when it is done.
     * @param fillOther The value to fill in for the other iterator when it is done. Defaults to `fillThis`.
     */
    zipLongest<UReturn, UNext>(
      other: LazyIterator<T, UReturn, UNext>,
      fillThis: T,
      fillOther?: T
    ): LazyZipLongestIterator<T, T, TReturn, UReturn, TNext, UNext>;
    /**
     * Creates a lazy iterator that zips the source iterators, filling in missing values with a fill value.
     * @param other The other iterator to zip with.
     * @param fillThis The value to fill in for the source iterator when it is done.
     * @param fillOther The value to fill in for the other iterator when it is done. Defaults to `fillThis`.
     */
    zipLongest<U, UReturn, UNext>(
      other: LazyIterator<U, UReturn, UNext>,
      fillThis: T,
      fillOther: U
    ): LazyZipLongestIterator<T, U, TReturn, UReturn, TNext, UNext>;
  }
}

injectLazyIteratorInstance(
  "zipLongest",
  function (other: any, fillThis: any, fillOther: any = fillThis) {
    return new LazyZipLongestIterator(this, other, fillThis, fillOther);
  }
);
