## map, filter, reduce

### map

``` javascript
const products = [
  {name: "robot", price: 1000},
  {name: "doll", price: 2000}
]

const map  = (func, iterable) => {
  let result = [];
  for(const element of iterable) {
    result.push(func(p)) // (1)
  }
  return result
}

const result = map(product => product.name, products)

console.log(result) // [ 'robot', 'doll' ]
```

- (1)번에서, 데이터를 어떻게 처리해야 할지는 인자로 받는 `func`함수에게 해당 역할을 위임하므로 활용도가 좀 더 높아질 수 있다. (다형성 증가)

<br/>

### 이터러블 프로토콜을 따른 map의 다형성

``` javascript

const map  = (func, iterable) => {
  let result = [];
  for(const element of iterable) {
    result.push(func(element))
  }
  return result
}


const nodeList = document.querySelectorAll("*"); 
console.log(nodeList) // // NodeList{...}

const result = map(node => node.nodeName, nodeList); 
console.log(result) // [ 'HTML', 'HEAD', 'TITLE', 'BODY' ]


function *gen (){
  yield 1;
  yield 2;
  yield 3;
  return 100
}

const result2 = map(num => num * 10, gen());

console.log(result2) // [ 10, 20, 30 ]
```

- 위처럼 이터러블 프로토콜을 따르는 다양한 함수들에게 사용이 될 수 있다. (map 뿐만이 아니라 다음으로 생성할 filter, reduce에게도 이터러블을 프로토콜을 따르는 함수들에게 적용이 가능하다.)

<br/>

### filter

``` javascript
const products = [
  {name: "robot", price: 3000},
  {name: "doll", price: 5000},
  {name: "lego", price: 2000}
]

const filter  = (func, iterable) => {
  let result = [];
  for(const element of iterable) {
    if(func(element)) {
     result.push(element)
    }    
  }
  return result
}


const result = filter((product) => product .price< 4000,products)

console.log(result) // [{ name: 'robot', price: 3000 },{ name: 'lego', price: 2000 }]
```

<br/>

### reduce

``` javascript
const numbers = [1,2,3,3,4]

const reduce  = (func, acc, iterable) => {
  if(!iterable) {
    iterable = acc[Symbol.iterator]();
    acc = iterable.next().value;
  }
  
  for(const element of iterable) {
    console.log(element)
    acc = func(acc, element)   
  }
  return acc
}

const add = (a,b) => a + b

const result = reduce(add,10,[10,5,1])
const result2 = reduce(add,[2,10,5])


console.log(result) // 26
console.log(result2) // 17
```

<br/>

### map + filter + reduce 중첩사용

``` javascript
const add = (a,b) => a + b;

const products = [
  {name: "반팔티", price: 15000},
  {name: "긴팔티", price: 13000},
  {name: "핸드폰 케이스", price: 20000},
  {name: "후드티", price: 18000},
  {name: "바지", price: 9000},
]

reduce(
  add, 
  map(item => item.price, 
      filter(item => item.price > 16000, products))) // 38000
```
