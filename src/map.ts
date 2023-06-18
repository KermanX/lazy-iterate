import { LazyIterator, injectLazyIterator } from "./index.js";

export type YieldMapper<F, T> = (value: F, index: number) => T;
export type ReturnMapper<F, T> = (value: F) => T;

export class LazyMapIterator<
  F,
  T,
  FReturn = any,
  TReturn = FReturn,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  protected source: LazyIterator<F, FReturn, TNext>;
  protected currentPos = -1;

  protected yieldMapper: YieldMapper<F, T>;
  protected returnMapper: ReturnMapper<FReturn, TReturn>;

  constructor(
    source: LazyIterator<F, FReturn, TNext>,
    yieldMapper: YieldMapper<F, T>,
    returnMapper: ReturnMapper<FReturn, TReturn>
  ) {
    super();
    this.source = source;
    this.yieldMapper = yieldMapper;
    this.returnMapper = returnMapper;
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

declare module "./index.js" {
  interface LazyIterator<T, TReturn = any, TNext = undefined> {
    map<N, NReturn>(
      yieldMapper: YieldMapper<T, N>,
      returnMapper: ReturnMapper<TReturn, NReturn>
    ): LazyMapIterator<T, N, TReturn, NReturn, TNext>;
  }
}

injectLazyIterator("map", function (yieldMapper: any, returnMapper: any) {
  return new LazyMapIterator(this, yieldMapper, returnMapper);
});
