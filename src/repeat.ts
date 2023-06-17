import { LazyIterator, injectLazyIteratorFactory } from "./index.js";

export class LazyRepeatIterator<T> extends LazyIterator<T, never, undefined> {
  protected value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  public next() {
    return {
      done: false as const,
      value: this.value,
    };
  }
}

declare module "./index.js" {
  interface LazyIteratorFactory {
    repeat<T>(value: T): LazyRepeatIterator<T>;
  }
}

injectLazyIteratorFactory("repeat", function (value: any) {
  return new LazyRepeatIterator(value);
});
