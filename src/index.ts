export interface LazyIterator<T, TReturn = any, TNext = undefined> {
  //...
}

export interface LazyIteratorFactory {
  //...
}

export const undoneSymbol = Symbol();

export abstract class LazyIterator<T, TReturn = any, TNext = undefined>
  implements IterableIterator<T>
{
  protected done: typeof undoneSymbol | TReturn = undoneSymbol;

  public abstract next(...args: [] | [TNext]): IteratorResult<T, TReturn>;

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}

export class LazyIteratorFactory {}

export function injectLazyIteratorFactory(k: string | symbol, sth: any) {
  Object.defineProperty(LazyIteratorFactory.prototype, k, {
    value: sth,
  });
}

export const lazyIteratorFactory = new LazyIteratorFactory();

/*
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
*/

export function injectLazyIterator(k: string | symbol, sth: any) {
  Object.defineProperty(LazyIterator.prototype, k, {
    value: sth,
  });
}
