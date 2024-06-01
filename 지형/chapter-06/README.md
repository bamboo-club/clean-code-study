## 객체와 자료구조

변수를 비공개 처리하는데에는 이유가 있습니다. 리액트의 상태(state)도 `=` 할당을 통해 쉽게 변경할 수 있음에도 곧바로 변경이 되지 못하게 되어있습니다.

### 자료 추상화

```js
// 구체적인 Point 클래스
class Point {
  constructor() {
    this.x = null;
    this.y = null;
  }
}
```

```ts
// 추상적인 Point 인터페이스
interface Point {
  getX: () => number;
  getY: () => number;
  setCartesian: (x: number, y: number) => void;
  getR: () => number;
  getTheta: () => Theta;
  setPolar: (r: number, theta: Theta) => void;
}
```

`interface`로 선언한 두번째 코드의 경우 직교 좌표계를 사용하는지 극 좌표계를 사용하는지 알 길이 없습니다. 그럼에도 구조를 명백하게 표현하고 있습니다.

첫번째 Point의 경우 `private`로 선언이 되어있지 않고 개별적으로 좌표 값을 읽고 설정할 수 있게 강제되어 있습니다. 때문에 각 값마다 조회와 함수 설정을 제공한다면 구현을 외부로 노출하는 셈이 됩니다.

> 구체적인 구현을 숨기고 인터페이스를 통해 추상화를 제공하면, 시스템의 다른 부분과의 결합도를 낮출 수 있습니다. 이는 인터페이스를 사용하는 코드가 구현 세부사항에 의존하지 않게 만들어 줍니다.

```ts
const point = new Point();

// Bad Case 💩
point.x = 30;
point.y = 50;
```

```ts
interface Vehicle {
  getFuelTankCapacityInGallons: () => number;
  getGallonsOfGasoline: () => number;
}
```

```ts
interface Vehicle {
  getPercentFuelRemaining: () => number;
}
```

예시코드가 나올수록 아래코드처럼, 추상 적인 개념으로 표현하는 것이 좋습니다. 만약 아무 생각 없이 조회/서정 함수를 추가한다면 이것은 잘못된 행동이 아닌지 고민을 해봐야합니다.

### 자료/객체 비대칭

앞서 소개한 예제들은 클래스와 인터페이스의 차이, 객체와 자료구조 사이의 차이를 보여주고 있습니다.

객체(인터페이스)는 추상화 뒤로 자료를 숨긴 채 자료를 다루는 함수만 공개합니다.

자료 구조는 자료를 그대로 공개하며 별다른 함수는 제공하고 있지 않습니다.

```js
class Square {
  constructor(shape) {
    this.topLeft = shape.topLeft;
    this.side = shape.side;
  }
}

class Rectangle {
  constructor(shape) {
    this.topLeft = shape.topLeft;
    this.height = shape.height;
    this.width = shape.width;
  }
}

class Circle {
  constructor(shape) {
    this.center = shape.center;
    this.radius = shape.radius;
  }
}

class Geometry {
    this.PI = Math.PI;

    area(shape){
        if (shape instanceof Square) {
            const s = new Square(shape)
            return s.side * s.side;
        }

        if (shape instanceof Rectangle) {
            const r = new Rectangle(shape)
            return r.height * r.width;
        }

        if (shape instanceof Circle) {
            const c = new Circle(shape)
            return this.PI * c.radius * c.radius;
        }

        throw new Error("[Error] is Not Shape")
    }
}
```

위 코드는 클래스가 절차적이라고 한다면 비판받아 마땅한 코드입니다. 그렇다고 해서 비판받을 코드는 아닙니다. 만약 `Geometry` 클래스에 `perimeter` 함수를 추가한다고 해서 영향을 주거나 하지 않습니다.

아래는 객체 지향적으로 변경한 도형 클래스입니다.

```js
class Square implements Shape {
  constructor(shape) {
    this.topLeft = shape.topLeft;
    this.side = shape.side;
  }

  area() {
    return this.side * this.side;
  }
}

class Rectangle implements Shape {
  constructor(shape) {
    this.topLeft = shape.topLeft;
    this.height = shape.height;
    this.width = shape.width;
  }

  area() {
    return this.height * this.width;
  }
}

class Circle implements Shape {
  constructor(shape) {
    this.center = shape.center;
    this.radius = shape.radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}
```

앞에 코드와 뒤의 코드는 서로 상호 보완적인 특징이 있습니다.

```ts
// 절차적인 코드는 기존 자료 구조를 변경하지 않으면서 새 함수를 추가하기 쉽습니다.

// 기존 자료 구조
class Point {
  constructor(public x: number, public y: number) {}
}

// 기존 함수
function printPoint(point: Point) {
  console.log(`(${point.x}, ${point.y})`);
}

// 새로운 함수 추가
function distanceFromOrigin(point: Point): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}
```

```ts
// 객체지향 코드는 기존 함수를 변경하지 않으면서 짜기 쉽습니다

// 기존 클래스
class Point {
  constructor(private x: number, private y: number) {}

  print() {
    console.log(`(${this.x}, ${this.y})`);
  }

  distanceFromOrigin(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

// 새로운 클래스 추가
class PolarPoint {
  constructor(private r: number, private theta: number) {}

  print() {
    console.log(`(${this.r} @ ${this.theta} radians)`);
  }

  distanceFromOrigin(): number {
    return this.r;
  }
}
```

```ts
// 절차 적인 코드는 새로운 자료구조를 추가하기가 어렵습니다.

// 새로운 자료 구조
class PolarPoint {
  constructor(public r: number, public theta: number) {}
}

// 기존 함수 수정
function printPoint(point: Point | PolarPoint) {
  if (point instanceof Point) {
    console.log(`(${point.x}, ${point.y})`);
  } else {
    console.log(`(${point.r} @ ${point.theta} radians)`);
  }
}

// 기존 함수 수정
function distanceFromOrigin(point: Point | PolarPoint): number {
  if (point instanceof Point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  } else {
    return point.r;
  }
}
```

```ts
// 객체지향 코드는 새로운 함수를 추가하기 어렵습니다. 그러려면 모든 클래스를 고쳐야합니다.

// 새로운 메서드 추가를 위해 기존 클래스 수정
class Point {
  constructor(private x: number, private y: number) {}

  print() {
    console.log(`(${this.x}, ${this.y})`);
  }

  distanceFromOrigin(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // 새로운 메서드 추가
  getCoordinates(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}

// 새로운 메서드 추가를 위해 기존 클래스 수정
class PolarPoint {
  constructor(private r: number, private theta: number) {}

  print() {
    console.log(`(${this.r} @ ${this.theta} radians)`);
  }

  distanceFromOrigin(): number {
    return this.r;
  }

  // 새로운 메서드 추가
  getCoordinates(): { r: number; theta: number } {
    return { r: this.r, theta: this.theta };
  }
}
```

### 디미터의 법칙

> 각각의 모듈은 자신이 조작하는 객체의 속사정을 몰라야 한다는 법칙입니다.

객체는 조회 함수로 내부 구조를 공개하지 않고 함수를 공개해야 합니다.

_**기차 충돌**_

아래와 같은 코드를 메소드 체이닝 다른 말로는 기차 충돌이라고 부릅니다.

```ts
const outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
```

이는 일반적으로 조잡하다 여겨지는 방식이므로 피하는 것이 좋습니다. 또는 나누는 것도 좋습니다.

```ts
const options = ctxt.getOptions();
const scratchDir = options.getScratchDir();
const absolutePath = scratchDir.getAbsolutePath();
```

위 코드가 디미터의 법칙을 위반할거라는 질문에는 자료 구조인가 객체인가에 따라 다릅니다. 자료 구조라면 내부 구조를 노출하므로 디미터 법칙이 적용되지 않습니다.

자료 구조는 무조건 함수 없이 공개 변수만 포함하고 객체는 비공개 변수와 공개 함수만 포함한다면 간다합니다.

**잡종 구조**

이런 혼란으로 때대로 절반은 객체, 절반은 자료 구조인 잡종 구조가 나오기도 합니다. 이는 비공개 변수를 귿로 노출하기도 하고 중요한 기능을 수행하는 함수도 있습니다. 이는 양쪽 세상의 단점만 모아놓은 구조입니다.

### 자료 전달 객체

자료 구조체의 전형적인 형태는 공개 변수만 있고 함수가 없는 클래스입니다. 이를 우리는 자료 전달 객체 `DTO`라고 부르기도 합니다.

> DTO는 DB에 저장된 가공되지 않은 정보를 애플리케이션 코드에 사용할 객체로 변환하는 일련의 단계에서 가장 처음으로 사용하는 구조체를 말합니다.

#### 🙏🏻끝으로

객체 지향적인 코드와 함수 지향적인 코드는 많은 면에서 닮았지만, 중요한 차이점도 존재합니다. 두 패러다임은 서로 다른 목표를 추구하며, 사용하는 언어에 따라 그 지향점이 달라질 수 있습니다.

또한, 새로운 타입을 추가하여 유연성을 확보할지, 아니면 기존 코드를 변경할지에 대한 결정도 상황에 따라 달라질 수 있습니다.

최적의 해결책을 찾기 위해서는 다양한 의견과 지속적인 학습이 필요하다고 생각하였습니다.
