/**
 * A mergeable interface used to extend the `LazyIterator` instances.
 *
 * @example
 * ```typescript
 * // Declaring the instance method by merging this interface:
 * declare module "@kermanx/lazy-iterator" {
 *   interface LazyIterator<T, TReturn, TNext> {
 *     instanceMethod(): void;
 *   }
 * }
 *
 * // Injecting the instance method to `LazyIterator` prototype:
 * injectLazyIterator("instanceMethod", function () {
 *   // do something
 * });
 *
 * // Using the instance method:
 * lazyIteratorFactory.from([1, 2, 3]).instanceMethod();
 * ```
 */
export interface LazyIterator<T, TReturn = any, TNext = undefined> {
  //...
}

/**
 * A mergeable interface used to extend the `LazyIteratorFactory`.
 *
 * @example
 * ```typescript
 * // Declaring the method by merging this interface:
 * declare module "@kermanx/lazy-iterator" {
 *   interface LazyIteratorFactory {
 *     aNewWayToCreateLazyIterator(): LazyIterator<any>;
 *   }
 * }
 *
 * // Injecting the method to `LazyIteratorFactory` prototype:
 * injectLazyIteratorFactory("aNewWayToCreateLazyIterator", function () {
 *   return ...
 * });
 *
 * // Using the method:
 * const iter = lazyIteratorFactory.aNewWayToCreateLazyIterator();
 * ```
 */
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

/**
 * Injects a property to the LazyIteratorFactory.
 * @param key The key of the static property to inject
 * @param value The value of the static property to inject
 * @param descriptorOptions The descriptor options of the static property to inject
 */
export function injectLazyIteratorFactory(
  key: string | symbol,
  value: any,
  descriptorOptions: Omit<PropertyDescriptor, "value"> = {}
) {
  Object.defineProperty(LazyIteratorFactory.prototype, key, {
    ...descriptorOptions,
    value,
  });
}

/**
 * The default LazyIteratorFactory.
 */
export const lazyIteratorFactory = new LazyIteratorFactory();

/**
 * Injects a property to the `LazyIterator` prototype.
 * @param key The key of the instance property to inject
 * @param descriptorOptions The descriptor options of the static property to inject
 */
export function injectLazyIteratorInstance(key: string | symbol, value: any) {
  Object.defineProperty(LazyIterator.prototype, key, {
    value,
  });
}
