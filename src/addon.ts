import { LazyIterator, injectLazyIterator } from "./index.js";

const log = globalThis.console.log.bind(globalThis.console);

//export class Addon<T,TReturn,TNext> extends LazyIterator<T,TReturn,TNext>
declare module "./index.js" {
  interface LazyIterator<T, TReturn, TNext> {
    foo(): number;
  }
}

injectLazyIterator("foo", function () {
  return this.currentPos;
});

const v = LazyIterator.from([1, 1, 4, 5, 1, 4]);

log("before mapping");

const v2 = v.map(
  (v) => {
    log("mapping", v);
    return v + "!";
  },
  (v) => {
    v;
  }
);

log("after mapping");

for (const i of v2) {
  log(i);
}
