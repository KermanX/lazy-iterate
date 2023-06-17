import { injectLazyIterator } from "./index.js";

declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    take<N extends number>(n: N): T[] & { readonly length: N };
  }
}

injectLazyIterator("take", function (n: number) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const next = this.next();
    if (next.done) {
      throw new Error("take: iterator exhausted");
    }
    result.push(next.value);
  }
  return result as any;
});
