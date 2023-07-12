# lazy-iterator

Yet another package for lazy iteration in JavaScript.

- Full TypeScript support
- No dependencies

## Installation

```bash
npm install @kermanx/lazy-iterator
```

## Usage

```typescript
import { lazyIteratorFactory } from "@kermanx/lazy-iterator";

const iterator = lazyIteratorFactory.from([1, 2, 3]).map((x) => x * 2);

for (const x of iterator) {
  console.log(x);
}
```

**You can extend the `LazyIterator` and `LazyIteratorFactory` class to create your own lazy iterators.** See [src/iterator.ts](./src/iterator.ts) for details.
