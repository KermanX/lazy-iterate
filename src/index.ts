export interface LazyIterator<T, TReturn = any, TNext = undefined> {
  //...
}

export type YieldMapper<F, T> = (value: F, index: number) => T;

export const doneSymbol = Symbol();
export const undoneSymbol = Symbol();

export abstract class LazyIterator<T, TReturn = any, TNext = undefined>
  implements IterableIterator<T>
{
  protected done: typeof undoneSymbol | TReturn = undoneSymbol;

  public abstract next(...args: [] | [TNext]): IteratorResult<T, TReturn>;

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  public static from<T>(iterable: Iterable<T>) {
    return new BasicLazyIterator(iterable[Symbol.iterator]());
  }
}

export abstract class LazyCachedIterator<
  T,
  TReturn = any,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  protected cache: T[] = [];

  public get currentPos() {
    return this.cache.length;
  }

  public get(pos: number): T | undefined {
    if (pos < this.cache.length) {
      return this.cache[pos];
    }
    return this.calcUntil(pos);
  }

  protected calcUntil(pos: number): T {
    for (let i = this.cache.length; i < pos; i++) {
      if (this.next().done) {
        throw new RangeError();
      }
    }
    const v = this.next();
    if (v.done) {
      throw new RangeError();
    }
    return (v as IteratorYieldResult<T>).value;
  }

  protected cacheResult(result: IteratorResult<T, TReturn>) {
    if (result.done) {
      this.done = result.value;
    } else {
      this.cache.push((result as IteratorYieldResult<T>).value);
    }
  }
}

export function injectLazyIterator(k: string | symbol, sth: any) {
  Object.defineProperty(LazyIterator.prototype, k, {
    value: sth,
  });
}

export type ReturnMapper<F, T> = (value: F) => T;

export class LazyMapIterator<
  F,
  T,
  FReturn = any,
  TReturn = FReturn,
  TNext = undefined
> extends LazyCachedIterator<T, TReturn, TNext> {
  protected source: LazyIterator<F, FReturn, TNext>;
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
    const old = this.source.next(...args);
    let neo = old.done
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
    this.cacheResult(neo);
    return neo;
  }
}

export interface LazyIterator<T, TReturn = any, TNext = undefined> {
  map<N, NReturn>(
    yieldMapper: YieldMapper<T, N>,
    returnMapper: ReturnMapper<TReturn, NReturn>
  ): LazyMapIterator<T, N, TReturn, NReturn, TNext>;
}
injectLazyIterator("map", function (yieldMapper: any, returnMapper: any) {
  return new LazyMapIterator(this, yieldMapper, returnMapper);
});

export class BasicLazyIterator<
  T,
  TReturn = any,
  TNext = undefined
> extends LazyIterator<T, TReturn, TNext> {
  protected source: Iterator<T, TReturn, TNext>;

  constructor(source: Iterator<T, TReturn, TNext>) {
    super();
    this.source = source;
  }

  next(...args: [] | [TNext]): IteratorResult<T, TReturn> {
    return this.source.next(...args);
  }
}
