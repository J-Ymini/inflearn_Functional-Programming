const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 13000 },
  { name: '핸드폰 케이스', price: 20000 },
  { name: '후드티', price: 18000 },
  { name: '바지', price: 9000 },
];

const filter = (func, iterable) => {
  let result = [];
  for (const element of iterable) {
    if (func(element)) {
      result.push(element);
    }
  }
  return result;
};

const map = (func, iterable) => {
  let result = [];
  for (const element of iterable) {
    result.push(func(element)); // (1)
  }
  return result;
};

const reduce = (func, acc, iterable) => {
  if (!iterable) {
    iterable = acc[Symbol.iterator]();
    acc = iterable.next().value;
  }

  for (const element of iterable) {
    acc = func(acc, element);
  }
  return acc;
};

const go = (...args) => reduce((a, f) => f(a), args);

const pipe =
  (f, ...functions) =>
  (...as) =>
    go(f(...as), ...functions);

const curry =
  (f) =>
  (a, ...rest) =>
    rest.length ? f(a, ...rest) : (...rest) => f(a, ...rest);

const newMap = curry((func, iterable) => {
  let result = [];
  for (const element of iterable) {
    result.push(func(element)); // (1)
  }
  return result;
});

const newReduce = curry((func, acc, iterable) => {
  if (!iterable) {
    iterable = acc[Symbol.iterator]();
    acc = iterable.next().value;
  }

  for (const element of iterable) {
    acc = func(acc, element);
  }
  return acc;
});

const newFilter = curry((func, iterable) => {
  let result = [];
  for (const element of iterable) {
    if (func(element)) {
      result.push(element);
    }
  }
  return result;
});

go(
  products,
  newFilter((product) => product.price < 20000),
  newMap((product) => product.price),
  newReduce((a, b) => a + b)
);

pipe(
  (a, b) => a + b,
  (a) => a + 20
)(5, 10);

const L = {};

const range = (length) => {
  let i = -1;
  result = [];
  while (++i < length) {
    result.push(i);
  }
  return result;
};

const list = range(5);

const take = curry((limit, iter) => {
  const result = [];

  for (const a of iter) {
    result.push(a);
    if (result.length === limit) {
      return result;
    }
  }
});

L.range = function* (length) {
  let i = -1;
  while (++i < length) {
    yield i;
  }
};

L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) if (f(a)) yield a;
});

L.entries = curry(function* (obj) {
  for (const key in obj) yield [key, obj[key]];
});

const getQueryString = (obj) =>
  go(
    obj,
    Object.entries,
    newMap(([key, value]) => `${key}=${value}`),
    newReduce((a, b) => `${a}&${b}`)
  );

const getQueryString_ver2 = pipe(
  Object.entries,
  L.map(([key, value]) => `${key}=${value}`),
  newReduce((a, b) => `${a}&${b}`)
);

getQueryString({ limit: 10, offset: 10, type: 'male' });

const join = curry((seperator = ',', iterable) =>
  reduce((a, b) => `${a}${seperator}${b}`, iterable)
);

const getQueryString_ver3 = pipe(
  Object.entries,
  L.map(([key, value]) => `${key}=${value}`),
  join('&')
);

getQueryString_ver3({ limit: 10, offset: 10 });

const getQueryString_ver4 = pipe(
  L.entries,
  L.map(([key, value]) => `${key}=${value}`),
  join('&')
);

getQueryString_ver4({ limit: 10, offset: 10, type: 'male' });

const find = (f, iter) => go(iter, newFilter(f), take(1), ([a]) => a);

const users = [{ age: 32 }, { age: 30 }, { age: 28 }, { age: 15 }, { age: 31 }];

console.log(
  // {age: 32}
  find((a) => {
    return a.age > 30;
  }, users)
);
