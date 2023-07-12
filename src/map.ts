import { LazyIterator, injectLazyIteratorInstance } from "./iterator.js";

export type YieldMapper<F, T> = (value: F, index: number) => T;
export type ReturnMapper<F, T> = (value: F) => T;

/**
 * A lazy iterator that maps values from the source iterator.
 */
export class LazyMapIterator<
  F,
  T,
  FReturn = any,
  TReturn = FReturn,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  protected currentPos = -1;

  constructor(
    public source: LazyIterator<F, FReturn, TNext>,
    public yieldMapper: YieldMapper<F, T>,
    public returnMapper: ReturnMapper<FReturn, TReturn>
  ) {
    super();
  }

  public next(...args: [] | [TNext]) {
    this.currentPos++;
    const old = this.source.next(...args);
    return old.done
      ? {
          done: true as const,
          value: this.returnMapper(old.value),
        }
      : {
          done: false as const,
          value: this.yieldMapper(
            (old as IteratorYieldResult<F>).value,
            this.currentPos
          ),
        };
  }
}

declare module "./iterator" {
  interface LazyIterator<T, TReturn = any, TNext = undefined> {
    /**
     * Creates a lazy iterator that maps values from this lazy iterator.
     * @param yieldMapper The mapper function to use to map values.
     * @param returnMapper The mapper function to use to map the return value.
     */
    map<N, NReturn>(
      yieldMapper: YieldMapper<T, N>,
      returnMapper?: ReturnMapper<TReturn, NReturn>
    ): LazyMapIterator<T, N, TReturn, NReturn, TNext>;
  }
}

injectLazyIteratorInstance(
  "map",
  function (yieldMapper: any, returnMapper: any = (v) => v) {
    return new LazyMapIterator(this, yieldMapper, returnMapper);
  }
);
