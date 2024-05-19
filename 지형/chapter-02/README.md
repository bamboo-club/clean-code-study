## 의미 있는 이름

### 🧐이름이 쓰이는 장소

변수와 함수, 클래스와 패키지까지 나아가 깃허브 커밋까지 모두 이름을 붙입니다. 이름을 잘 짓는 것은 나중에 일을 두 번 안해도 되게하는 중요한 역할을 합니다. 해당 챕터에서는 이름을 잘 짓는 간단한 규칙을 소개합니다.

```ts
const user = {
  hobby: '010-1234-5678',
  age: 'Zero1016',
  phone: 10,
};
```

### 👓의도를 분명히 밝혀라

변수나 함수 클래스 이름을 지을때는 다음과 같은 굵직한 질문에 모두 답해야 합니다.

> 변수(혹은 함수나 클래스)의 존재 이유는? 수행 기능은? 사용 방법은?

만약 따로 주석이 필요하다면 이는 의도를 드러내지 못했다는 말입니다.

```ts
const c; // 사용자에게서 받아온 유저 정보
```

이름 c는 아무것도 나타내지 않습니다. 따라서 다른 개발자와 협업을 할 경우 해당 변수가 어떤 의미를 가지는지 모릅니다. 반면 의도가 드러나는 코드는 이해와 변경이 쉬워집니다. 똑같은 기능을 하는 함수를 아래 예시로 살펴보겠습니다.

```ts
function getList() {
  const list = [];
  for (const item of theList) {
    if (item[0] === 4) {
      list.push(item);
    }
  }
  return list;
}
```

해당 함수를 사용하여 다른 개발자들과 협업을 할 경우 해당 코드를 작성한 개발자는 다음 정보를 다른 개발자들도 안다고 가정을 하고 작성을 합니다.

- thisList는 무엇이고 어떤 데이터를 가지고 있는가?
- thisList에서 0번째 아이템이 왜 중요한가?
- 값 4는 어떤 의미인가?

> 가정을 하고 함수를 작성하지만 다른 사용자들은 해당 정보를 기억할 가능성은 현저히 낮습니다.

하지만 위 코드 샘플엔 이와 같은 정보들이 드러나지 않습니다. 따라서 정보제공을 하기에는 좋은 코드는 아닙니다. 이제 변수명을 변경해봅니다.

지뢰찾기 게임을 만든다고 가정합니다. 각 칸은 단순 배열로 표현합니다. 각 개념에 이름만 붙여도 코드가 나아지는 것을 확인할 수 있습니다.

```ts
function getFlaggedCells() {
  const flaggedCells = [];
  for (const cell of gameBoard) {
    if (isFlagged(cell)) {
      flaggedCells.push(cell);
    }
  }
  return flaggedCells;
}
```

코드의 생김새는 똑같습니다. 하지만 코드가 더욱 명확해진 것을 볼 수 있습니다. 이것이 좋은 코드의 영향력입니다.

### 💩그릇된 정보를 피하라

> 그릇된: 꾸며진, 임시의, 적절하지 않은 이라는 뜻을 가지고 있다.

그릇된 정보라는 말은 나름 널리 쓰이는 의미가 있느 단어를 다른 의미로 사용하면 안된다는 것입니다.

예를 들어 `cn`, `hp`, `rin`과 같이 의미가 없는 이름은 변수 이름으로 적절하지 않습니다. 그렇다고 해서 너무 정확하거나 비슷한 이름을 사용한다면 이 또한 문제가 있습니다. `XYZControllerForEfficientStoragesIfStrings`, `XYZControllerForEfficientHandlingOfString`라는 이름을 사용하는 변수명이 있다면 일단 가독성을 해치고 일관성을 떨어트립니다. 때문에 추천 단어를 사용하거나 널리쓰이는 의미를 사용해야 합니다.

또한 끔찍한 예로 소문자 L이나 대문자 O의 변수입니다. 두 변수를 함께 사용하면 더움 끔찍해 보입니다.

```ts
let a = 'l';

if (o == 1) {
  a = 'Ol';
} else {
  l = 01;
}
```

이러한 문제들로 인해 글꼴을 바꿔서 사용하는 등의 방법을 통해 다른 개발자들에게도 문제를 널리 알리는 해결책이 필요합니다.

### 🌈의미 있게 구분하라

데이터를 추가할 때 의미가 불분명한 불용어를 사용한 경우가 있습니다. `Info`나 `Data`는 `a`, `an`, `the`와 마찬가지로 의미가 불분명한 불용어입니다.

> 위 말은 `a`나 `the` 같은 접두어를 사용하지 말라는 소리가 아닙니다. `zero`라는 변수가 있다고 해서 `theZero`라는 변수를 사용하지 말라는 것입니다.

이처럼 불용어는 중복을 나타낼 수 있습니다. 이러한 불용어들은 개발자들이 코드를 읽다가 `StudentData`라는 클래스와 `StudentInfo` 클래스가 있다고 하면 무엇을 나타내는 데이터인지 혼동을 줄 수 있습니다.

```ts
getUsers();
getAllUser();
getAllUsers();
```

다른 개발자들은 어떤 함수를 호출을 해야하는지 모릅니다. 따라서 읽는 사람이 차이를 알도록 이름을 짓는 것이 좋습니다.

> 만약 JavaScript를 사용한다면 JSDoc, TypeScript를 사용한다면 TSDoc을 이용하여 함수나 타입에 대한 설명을 추가할 수도 있습니다.

```js
// JSDoc

/**
 * 인사말을 생성합니다.
 * @param name 인사할 사람의 이름
 * @param title 그 사람의 칭호
 * @returns 사람이 보기 좋은 형태의 인사말
 * */
export function greet(name: string, title: string) {
  return `Hello ${title} ${name}`;
}
```

```ts
// TSDoc

/**
 * 이 _type_ 은 사용자의 정보를 나타내는 **세 가지** 속성을 가집니다.
 */
type User = {
  /** 사용자의 이름을 나타냅니다. */
  name: string;
  /** 사용자의 나이를 나타냅니다. */
  age: number;
  /** 사용자의 성별을 나타냅니다. */
  gender: 'male' | 'female';
};
```

> TSDoc 주석은 마크다운(markdown) 형식으로 꾸며지므로 굵은 글씨, 기울임 글씨, 글머리 기호 목록을 사용할 수 있습니다.

### 🤬발음하기 쉬운 이름을 사용하라

발음하기 어려운 이름은 토론을 하기도 어렵습니다. 이는 바보처럼 들리기 쉽상입니다.

아래 코드를 예시로 들어보겠습니다.

```ts
// 발음하기 어려운 변수 이름
const lüdewigSchteinberg = 42;

// 코드 사용 예시
if (lüdewigSchteinberg > 10) {
  console.log('루-데-비히-슈타인베르크 값이 10보다 큽니다.');
}

// 발음하기 쉬운 변수 이름
const count = 42;
if (count > 10) {
  console.log('카운트 값이 10보다 큽니다.');
}
```

이 경우, count라는 변수 이름은 발음하기 쉽고 의미가 명확하여 다른 개발자들이 코드를 볼 때의 코드의 가독성을 향상시켜줍니다.

무엇보다 지적인 대화를 가능하게 해줍니다. `루-데-비히-슈타인베르크 값이 10보다 클 경우 분기처리를 해줘.`와 `카운트 값이 10보다 클 경우 분기처리를 해줘`를 비교할 경우 알 수 있습니다.

### 🗂️검색하기 쉬운 이름을 사용하라

문자 하나를 사용하는 이름과 상수는 텍스트 코드에서 쉽게 눈에 띄지 않는다는 문제점이 있습니다.

다음 코드는 가독성이 없는 코드로 빠르고 효율적이게 설계하였습니다.

```tsx
export function Component({ g, h, i, j, k }: Readonly<Props>) {
  const { data } = useSuspenseQuery({
    j,
    k,
  });

  return (
    <section className={styles.a}>
      <div className={styles.bb}>
        <nav>
          <h2 className={styles.big}>{g}</h2>
          <h3 className={styles.bih}>{h}</h3>
        </nav>
        <Link className={styles.c} href={i}>
          <p>더보기</p>
        </Link>
      </div>
      <ComponentList className={styles.f} listData={data.results} />
    </section>
  );
}
```

위 코드를 수정하거나 사용할 때 무슨 값이 들어가는지 알 수 있을 확률이 매우 적습니다. 따라서 적절한 변수명을 넣어주는 것이 좋습니다.

```tsx
export function Component({ title, description, href, queryKey, queryFn }: Readonly<Props>) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
  });

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <nav className={styles.navbar}>
          <h2 className={styles.title}>{title}</h2>
          <h3 className={styles.description}>{description}</h3>
        </nav>
        <Link className={styles.moreIcon} href={href}>
          <p>더보기</p>
        </Link>
      </div>
      <ComponentList className={styles.movieList} listData={data.results} />
    </section>
  );
}
```

그렇다고해서 `v`, `i`와 같은 한글자 변수명을 사용하지 말라는 것은 아닙니다. 만약 간단한 메서드에서나 로컬 변수에서 사용할 경우 한 문자를 사용하는 것도 좋습니다.

```tsx
export function ComponentList({ listData, className }: Props) {
  const { ref, onMouseDown } = useDragHandler()

  return (
    <ul onMouseDown={onMouseDown} ref={ref} className={classNames(styles.container, className)}>
      {listData.map((v, i)) => (
        <li className={styles.card} key={i}>
          <Card cardData={v} />
        </li>
      ))}
    </ul>
  )
}
```

이와 같이 주로 사용하는 콜백 함수의 인자로 한 글자 변수명을 사용하는 것도 괜찮습니다.

> 그러나 `l`과 같이 다른 문자와 혼동을 주는 문자의 경우 사용해서는 안됩니다.

명확히 의미를 전달해야할 경우 적절한 변수명을 생각하여 작성하기도 해야합니다.

```tsx
listData.map((item, index) => (
  <li className={styles.card} key={index}>
    {item}
  </li>
));
```

### 😓인코딩을 피하라

과거 프로그래밍을 할 경우 IDE가 발달이 안되어있어 컴파일러가 타입을 따로 점검하지 않았으므로 개발자에게 타입을 기억할 단서가 필요하였습니다.

> 요즘 나오는 프로그래밍 언어는 훨씬 많은 타입을 지원합니다. 또한 컴파일러가 타입을 기억하고 강제까지 합니다. 클래스와 함수의 격차는 적어지고 변수를 선언하는 위치와 사용하는 위치가 멀지 않습니다.

타입스크립트는 Object로 이루어져있으며, 타입스크립트를 사용하는 IDE 대다수는 코드를 컴파일하지 않고 타입을 검사하고 개발자에게 보여줍니다. 따라서 표기법을 다르게 한다던가. 인코딩 방식을 추가하는 식으로 안해도 됩니다.

```ts
// 💩 bad case
const user_name_string = 'zero1016';

// 👍🏻good
const user_name = 'zero1016';
```

### 😎자신의 기억력을 자랑하지 마라

일반적으로 개발자들은 똑똑하고 때때로 자신의 기억력을 과시하고 싶어집니다. 다음은 주어진 데이터 배열과 특정 배열을 기반으로 월별 평균 가격을 계산하여 반환하는 함수입니다.

```ts
const getMonthPriceAvg = (a, b) => {
  return b
    .map((s) => s.slice(0, 7))
    .map((c) => ({
      d: c,
      e: a.filter((item) => c === item.date.slice(0, 7)).length,
      f: a
        .filter((item) => c === item.date.slice(0, 7))
        .reduce((acc, curr) => acc + Number(curr.avgPrice), 0),
    }))
    .map(({ d, e, f }) => ({
      g: d,
      h: e ? Math.floor(f / e) : 0,
    }))
    .map(({ g, h }) => ({
      i: `${Number(g.split('-')[1])}월`,
      j: h,
    }));
};

export default getMonthPriceAvg;
```

만약 개발자가 자기만의 키 값을 생각하고 만든다면 해당 코드는 본인도 나중에 무슨 코드인지 이해를 못할 수도 있고, 처음 보는 사람들은 무슨 동작인지 알지 못할수도 있습니다.

> 똑똑한 프로그래머와 전문적인 프로그래머의 차이는 명료함이 최고라는 사실을 이해하는 것입니다.

따라서 다음과 같이 우리는 코드를 분리하고 다른 사람들도 알기 쉽게 변수명을 작성하여 코드를 설명할 수 있습니다.

```ts
const getMonthPriceAvg = (dataArray, monthArray) => {
  // 월 정보만 추출
  const dateArray = monthArray.map((month) => month.slice(0, 7));

  // 월별 데이터 길이와 총 가격 계산
  const monthData = dateArray.map((date) => {
    const filteredData = dataArray.filter((item) => date === item.date.slice(0, 7));
    const length = filteredData.length;
    const totalPrice = filteredData.reduce((acc, curr) => acc + Number(curr.avgPrice), 0);
    return { date, length, totalPrice };
  });

  // 평균 가격 계산
  const monthlyAvgPrices = monthData.map(({ date, length, totalPrice }) => {
    const avgPrice = length ? Math.floor(totalPrice / length) : 0;
    return { date, avgPrice };
  });

  // 결과 형식으로 변환
  const result = monthlyAvgPrices.map(({ date, avgPrice }) => {
    const name = `${Number(date.split('-')[1])}월`;
    return { name, 평균가: avgPrice };
  });

  return result;
};

export default getMonthPriceAvg;
```

### ✨클래스 네이밍

> 클래스 이름과 객체 이름은 명사나 명사구가 적합합니다.
>
> ex) Customer, WikiPage, Account, AddressParser

Manager, Processor, Data, Info와 같은 단어는 피하고, 동사는 사용하지 않습니다.

### ✨메서드 네이밍

> 메서드 이름은 동사나 동사구가 적합합니다.
>
> ex) postPayment, deletePage, save

접근자 (ex: `set`, `get`, `is`)등을 붙여 나타낼 수도 있습니다.

생성자를 여러번 사용할 때는 정적 팩토리 메소드를 사용합니다. 메소드는 인수를 설명하는 이름을 사용하는 것이 좋습니다.

```ts
// 학생 객체 생성
const student = Human.createStudent('Alice', 20, 'XYZ University');

// 위 코드가 아래 코드보다 좋습니다.

// 학생 객체 생성
const student = new Human('Alice', 20, 'XYZ University');
```

### 😶기발한 이름은 피하라

이름이 너무 기발하면 유머코드가 맞는 사람 또는 농담을 기억하는 동안에만 이해를 할 수 있습니다.

```ts
// 기발한 이름을 사용한 함수
function makeTeaAndCookies(name, age) {
  return { name, age, hobby: 'tea and cookies' };
}

// 이 함수의 용도를 바로 알기 어렵습니다.
const person = makeTeaAndCookies('Alice', 30);
console.log(person);
// 출력: { name: 'Alice', age: 30, hobby: 'tea and cookies' }
```

```ts
// 명확한 이름을 사용한 함수
function createPersonWithHobby(name, age, hobby) {
  return { name, age, hobby };
}

// 이 함수의 용도를 쉽게 알 수 있습니다.
const person = createPersonWithHobby('Alice', 30, 'reading');
console.log(person);
// 출력: { name: 'Alice', age: 30, hobby: 'reading' }
```

`makeTeaAndCookies`라는 함수 이름은 너무 기발해서 이 함수가 무엇을 하는지 바로 이해하기 어렵습니다. 반면에 `createPersonWithHobby`라는 이름은 이 함수가 사람 객체를 생성하고 그 사람의 취미를 설정한다는 것을 명확히 나타냅니다. 명확한 이름을 사용하면 코드를 읽고 이해하는 것이 훨씬 쉬워집니다.

### 🙈한 개념에 한 단어를 사용하라

> 추상적인 개념에 단어 하나를 선택해 이를 고수해야합니다.

똑같은 메서드를 `manager`, `controller`로 제각각 부르면 혼란스럽습니다. 또 사람들은 클래스에서 어느 이름을 썼는지 기억하기도 어렵습니다.

따라서 메서드 이름은 독자적이고 일관적이어야 합니다. 그래야 주석을 뒤져보지도 않고도 프로그래머가 올바른 메소드를 선택할 수 있습니다.

### 🤭말장난을 하지 마라

> 한 단어를 두 가지 목적으로 사용하면 안됩니다.

예를 들어 두개의 값을 더하는 메서드인 `add`라는 메서드가 있습니다. 지금 구현한 `add`라는 메서드는 모두 기존 값을 더해 새로운 값을 만듭니다. 하지만 새롭게 추가되는 집합에 값을 추가하는 메서드가 있습니다.

해당 메서드를 사용한다면 `add`라고 불러야하나 헷갈릴 수 있습니다. 하지만 다시 본다면 기존의 메서드와는 성격이 다른 것을 알 수 있습니다. 따라서 `insert` 혹은 `append`와 같이 사용할 수 있습니다.

### 🙃해법 영역에서 가져온 코드를 사용하라

> 코드를 읽을 사람도 프로그래머라는 사실을 명심한다.

그러므로 전산 용어, 알고리즘 이름, 패턴 이름, 수학 용어등을 사용해도 좋습니다. 하지만 이런식으로 모든 이름을 문제 영역 `domain`에서 가져오는 정책은 현명하지 못합니다.

같은 개념을 다른 이름으로 이해하던 동료들이 매번 고객에게 의미를 물어봐야 하기 때문입니다.

### 🙂문제 영역에서 가져온 이름을 사용하라

> `적절한 프로그래머 용어`가 없다면 문제 영역에서 이름을 가져옵니다.

문제 영역에서 이름을 가져올 경우 분야 전문가에게 의미를 물어 파악할 수 있습니다.

우수한 프로그래머와 설계자라면 해법 영역와 문제 영역을 구분할 줄 알아야 합니다.

```ts
class Customer {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.orders = [];
  }

  // 문제 영역에서 가져온 용어를 사용한 메소드
  placeOrder(product, quantity) {
    const order = new Order(product, quantity);
    this.orders.push(order);
  }

  printOrders() {
    console.log(`Orders for ${this.name}:`);
    this.orders.forEach((order) => {
      console.log(`- ${order.quantity} ${order.product}`);
    });
  }
}

class Order {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }
}

const customer = new Customer('Alice', 30);
customer.placeOrder('Laptop', 1);
customer.placeOrder('Smartphone', 2);
customer.printOrders();
// 출력:
// Orders for Alice:
// - 1 Laptop
// - 2 Smartphone
```

### ➕의미 있는 맥락을 추가하라

스스로 의미가 분명한 이름이 없지 않습니다. 하지만 대다수의 이름은 그렇지 못합니다.

예를 들어 `name`, `title`, `isOpen`와 같은 변수들이 있습니다. 해당 변수만을 보았을 경우 해당 변수의 역할이 무엇인지 구분이 되지 않습니다. 하지만 만약 접두어를 추가한다면 이해를 할 수 있습니다.

```ts
let name;
let title;
let isOpen;

let userName;
let movieTitle;
let modalIsOpen;
```

물론 해당 변수들을 합치는 클래스를 생성하면 더 좋습니다. 그러면 더 큰 개념에 속한다는 것을 컴파일러에게도 전달 할 수 있습니다.

[자신의 기억력을 자랑하지 마라](#자신의-기억력을-자랑하지-마라)에서 나온 예시에서 볼 수 있듯이 의미가 불문명한 이름을 가진 변수를 사용하는 것은 혼란을 줄 수 있습니다.

### ➖불필요한 맥락을 없애라

> 일반적으로 짧은 이름이 긴 이름보다 좋습니다. 단 의미가 분명한 경우에 한해서입니다.

`Address` 클래스 인스턴스로 `accountAddress`와 `customerAddress`는 좋은 이름입니다. 이들은 클래스 이름으로 사용할 때는 적합하지 못한 것을 알 수 있습니다. 만약 주소를 좀 더 구분을 해야 한다면 `PostalAddress`, `Mac`, `URL`이라는 이름도 좋은 인스턴스 예시가 될 것입니다.

#### 🙏🏻끝으로

프로젝트를 진행하면서 변수 이름을 생각하지 않고 급급하게 만들었던 기억이 많습니다. 이는 추후 리팩토링을 하거나 다른 기능을 추가할 때 다리를 잡았던 경험이 있습니다.

최신 IDE의 경우 (ex: 인텔리제이, 웹 스톰) 자동 완성이나 문구를 추천해줄 정도로 많이 발전을 해왔습니다. 변수명을 짓는게 헷갈리다면 이러한 프로그램에게 기대는 것도 나쁘지 않을 것 같다고 생각을 하였습니다. 또한 직접 예시를 보면서 다른 사람들의 코드를 볼 때 어떤 시선으로 느껴질지 생각을 해보았습니다.
