import { LazyIterator, injectLazyIteratorFactory } from "./iterator.js";

/**
 * A lazy iterator that repeats the given value forever.
 */
export class LazyRepeatIterator<T> extends LazyIterator<T, never, undefined> {
  constructor(public value: T) {
    super();
  }

  public next() {
    return {
      done: false as const,
      value: this.value,
    };
  }
}

declare module "./iterator" {
  interface LazyIteratorFactory {
    /**
     * Creates a lazy iterator that repeats the given value forever.
     * @param value The value to repeat
     */
    repeat<T>(value: T): LazyRepeatIterator<T>;
  }
}

injectLazyIteratorFactory("repeat", function (value: any) {
  return new LazyRepeatIterator(value);
});
