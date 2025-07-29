---
sidebar_position: 2
---

# TypeScript 고급 타입

TypeScript의 강력한 타입 시스템을 활용한 고급 타입 기법들을 학습합니다.

## 유니온 타입 (Union Types)

여러 타입 중 하나가 될 수 있는 값을 표현합니다.

```typescript
type StringOrNumber = string | number;

function formatValue(value: StringOrNumber): string {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    return value.toString();
}

// 사용 예제
console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(42)); // "42"
```

## 교차 타입 (Intersection Types)

여러 타입을 모두 만족하는 타입을 생성합니다.

```typescript
interface Person {
    name: string;
    age: number;
}

interface Employee {
    employeeId: number;
    department: string;
}

type PersonEmployee = Person & Employee;

const worker: PersonEmployee = {
    name: "홍길동",
    age: 30,
    employeeId: 12345,
    department: "개발팀"
};
```

## 제네릭 (Generics)

타입을 매개변수화하여 재사용 가능한 컴포넌트를 만듭니다.

```typescript
// 기본 제네릭
function identity<T>(arg: T): T {
    return arg;
}

const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);

// 제네릭 인터페이스
interface Repository<T> {
    findById(id: number): T | null;
    save(entity: T): void;
    delete(id: number): void;
}

class UserRepository implements Repository<User> {
    findById(id: number): User | null {
        // 구현
        return null;
    }
    
    save(user: User): void {
        // 구현
    }
    
    delete(id: number): void {
        // 구현
    }
}
```

## 조건부 타입 (Conditional Types)

조건에 따라 다른 타입을 선택합니다.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = T extends string 
    ? { message: T } 
    : T extends number 
    ? { code: T } 
    : { data: T };

// 사용 예제
type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { code: number }
type ObjectResponse = ApiResponse<User>; // { data: User }
```

## 매핑된 타입 (Mapped Types)

기존 타입을 변환하여 새로운 타입을 생성합니다.

```typescript
// 모든 속성을 선택적으로 만들기
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// 모든 속성을 읽기 전용으로 만들기
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 특정 키만 선택하기
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// 사용 예제
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

type PartialUser = Partial<User>; // 모든 속성이 선택적
type ReadonlyUser = Readonly<User>; // 모든 속성이 읽기 전용
type UserInfo = Pick<User, 'name' | 'email'>; // name과 email만 선택
```

## 템플릿 리터럴 타입

문자열 리터럴 타입을 조합하여 새로운 타입을 생성합니다.

```typescript
type EventName = 'click' | 'scroll' | 'mousemove';
type EventHandler<T extends string> = `on${Capitalize<T>}`;

type ClickHandler = EventHandler<'click'>; // 'onClick'
type ScrollHandler = EventHandler<'scroll'>; // 'onScroll'

// 더 복잡한 예제
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts' | '/comments';
type ApiUrl<M extends HttpMethod, E extends Endpoint> = `${M} ${E}`;

type GetUsers = ApiUrl<'GET', '/users'>; // 'GET /users'
type PostComment = ApiUrl<'POST', '/comments'>; // 'POST /comments'
```

## 유틸리티 타입

TypeScript에서 제공하는 내장 유틸리티 타입들입니다.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Partial - 모든 속성을 선택적으로
type PartialUser = Partial<User>;

// Required - 모든 속성을 필수로
type RequiredUser = Required<PartialUser>;

// Omit - 특정 속성 제외
type PublicUser = Omit<User, 'password'>;

// Record - 키-값 타입 생성
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// Extract - 조건에 맞는 타입만 추출
type StringKeys = Extract<keyof User, string>; // 'id' | 'name' | 'email' | 'password'

// Exclude - 조건에 맞지 않는 타입 제외
type NonIdKeys = Exclude<keyof User, 'id'>; // 'name' | 'email' | 'password'
```

## 고급 함수 타입

함수의 타입을 정교하게 정의합니다.

```typescript
// 함수 오버로드
function processData(data: string): string;
function processData(data: number): number;
function processData(data: boolean): boolean;
function processData(data: string | number | boolean): string | number | boolean {
    if (typeof data === 'string') {
        return data.toUpperCase();
    }
    if (typeof data === 'number') {
        return data * 2;
    }
    return !data;
}

// 고차 함수 타입
type Middleware<T> = (value: T) => T;

function pipe<T>(...middlewares: Middleware<T>[]): Middleware<T> {
    return (value: T) => middlewares.reduce((acc, fn) => fn(acc), value);
}

// 사용 예제
const addOne: Middleware<number> = (x) => x + 1;
const double: Middleware<number> = (x) => x * 2;
const processNumber = pipe(addOne, double);

console.log(processNumber(5)); // 12 ((5 + 1) * 2)
```

## 타입 가드 (Type Guards)

런타임에서 타입을 좁혀나가는 기법입니다.

```typescript
// 사용자 정의 타입 가드
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isUser(obj: any): obj is User {
    return obj && 
           typeof obj.id === 'number' && 
           typeof obj.name === 'string' && 
           typeof obj.email === 'string';
}

// 사용 예제
function processValue(value: unknown) {
    if (isString(value)) {
        // 여기서 value는 string 타입으로 좁혀짐
        console.log(value.toUpperCase());
    }
}

function processObject(obj: unknown) {
    if (isUser(obj)) {
        // 여기서 obj는 User 타입으로 좁혀짐
        console.log(`User: ${obj.name} (${obj.email})`);
    }
}
```

## 브랜드 타입 (Branded Types)

구조적으로 같지만 의미적으로 다른 타입을 구분합니다.

```typescript
// 브랜드 타입 정의
type Brand<T, U> = T & { __brand: U };

type UserId = Brand<number, 'UserId'>;
type ProductId = Brand<number, 'ProductId'>;

// 타입 생성 함수
function createUserId(id: number): UserId {
    return id as UserId;
}

function createProductId(id: number): ProductId {
    return id as ProductId;
}

// 사용 예제
function getUser(id: UserId): User | null {
    // UserId만 받을 수 있음
    return null;
}

function getProduct(id: ProductId): Product | null {
    // ProductId만 받을 수 있음
    return null;
}

const userId = createUserId(123);
const productId = createProductId(456);

getUser(userId); // ✅ 올바름
// getUser(productId); // ❌ 타입 에러
// getUser(123); // ❌ 타입 에러
```

## 실무 활용 예제

```typescript
// API 응답 타입 시스템
type ApiResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};

// 비동기 작업 상태 관리
type AsyncState<T> = 
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: string };

// 폼 검증 시스템
type ValidationResult<T> = {
    [K in keyof T]: T[K] extends string 
        ? string | null 
        : T[K] extends number 
        ? number | null 
        : never;
};

// 사용 예제
interface LoginForm {
    email: string;
    password: string;
}

type LoginValidation = ValidationResult<LoginForm>;
// { email: string | null; password: string | null; }
```

이제 TypeScript 디렉터리에 2개의 문서가 있어서 카테고리가 제대로 동작할 것입니다! 