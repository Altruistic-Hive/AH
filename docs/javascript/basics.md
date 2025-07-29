---
sidebar_position: 2
---

# JavaScript 기초 문법

JavaScript의 기본적인 문법과 개념들을 학습합니다.

## 변수와 데이터 타입

JavaScript에서는 `let`, `const`, `var`를 사용하여 변수를 선언할 수 있습니다.

```javascript
// let - 재할당 가능한 변수
let name = "홍길동";
name = "김철수"; // 가능

// const - 재할당 불가능한 상수
const PI = 3.14159;
// PI = 3.14; // 에러!

// var - 함수 스코프 (권장하지 않음)
var oldWay = "구식 방법";
```

## 함수

JavaScript에서 함수를 정의하는 여러 방법이 있습니다.

```javascript
// 함수 선언식
function greet(name) {
    return `안녕하세요, ${name}님!`;
}

// 함수 표현식
const greet2 = function(name) {
    return `안녕하세요, ${name}님!`;
};

// 화살표 함수
const greet3 = (name) => `안녕하세요, ${name}님!`;
```

## 배열과 객체

```javascript
// 배열
const fruits = ['사과', '바나나', '오렌지'];
fruits.push('포도');

// 객체
const person = {
    name: '홍길동',
    age: 25,
    greet() {
        return `안녕하세요, ${this.name}입니다.`;
    }
};
```

## 조건문과 반복문

```javascript
// if-else
if (age >= 18) {
    console.log('성인입니다.');
} else {
    console.log('미성년자입니다.');
}

// for 반복문
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// forEach
fruits.forEach(fruit => console.log(fruit));
``` 