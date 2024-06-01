## 단위 테스트

### TDD의 법칙 세가지

1. 실패하는 단위 테스트를 작성할 때까지 실제 코드를 작성하지 않습니다.

2. 컴파일은 실패하지 않으면서 실행이 실패하는 정도로만 단위 테스트를 작성합니다.

3. 현재 실패하는 테스트를 통과할 정도로만 실제 코드를 작성합니다.

TDD를 지키면서 일을 할 경우 수 백, 수 천개의 해당하는 테스트 케이스가 나옵니다. 이러한 테스트 케이스들은 실제 코드와 맞먹을 정도로 방대하기도 하며 심각한 관리 문제를 유발하기도 합니다.

### 깨끗한 테스트 코드 유지하기

테스트 코드는 실제 코드보다 대충 만들어도 되지않나라는 생각을 사람들이 가지곤합니다. 하지만 실제 코드가 진화함에 따라 테스트 코드도 진화를 해야합니다.

하지만 테스트 코드가 지접분할수록 변경하기가 어려워집니다. 때문에 실패하는 코드를 더더욱 성공시키기 어려워집니다.

점차 테스트 코드는 개발자 사이에서 가장 큰 불만으로 자리잡게 됩니다.

> 테스트 코드는 실제 코드 못지 않게 중요합니다.

_테스트는 유연셩, 유지보수성, 재사용성을 제공합니다._

테스트 코드를 깨끗하게 유지하지 않으면 결국은 잃어버립니다. 또한 실제 코드를 유연하게 만드는 버팀목도 사라집니다.

> 코드에 유연성, 유지보수성, 재사용성을 제공하는 버팀목이 바로 단위 테스트입니다.

아키텍처가 아무리 유연하더라도, 설계를 아무리 잘 나눴더라도 테스트 케이스가 없으면 개발자는 변경을 주저하게 됩니다. 자기도 모르는 버그가 있을수도 있기 때문입니다.

하지만 테스트 케이스가 있다면 공포가 사라지게 됩니다. 테스트 커버리지가 높을수록 공포는 사라지게되고 오히려 안심하고 아키텍처와 설계를 진행할 수 있습니다.

따라서 **테스트 코드가 지저분하면 코드를 변경하는 능력도 떨어지고 코드 구조를 개선하는 능력도 떨어지게 됩니다.**

### 깨끗한 테스트 코드

깨끗한 테스트 코드를 만들기 위해서는 가독성이 중요합니다.

```ts
describe('로또 맞은 갯수 테스트', () => {
  let lotto;

  beforeEach(() => {
    lotto = new Lotto([7, 5, 10, 12, 17, 42]);
  });

  test('동일한 갯수가 2개일 경우', () => {
    // given
    const userCheck = [10, 20, 30, 40, 45, 5];

    // when
    const result = lotto.matcher(userCheck);

    // then
    expect(result).toBe(2);
  });

  test('동일한 갯수가 없을 경우', () => {
    // given
    const userCheck = [1, 2, 3, 4, 6, 8];

    // when
    const result = lotto.matcher(userCheck);

    // then
    expect(result).toBe(0);
  });

  test('전부 다 맞았을 경우', () => {
    // given
    const userCheck = [7, 5, 10, 12, 17, 42];

    // when
    const result = lotto.matcher(userCheck);

    // then
    expect(result).toBe(6);
  });
});
```

`jest` 혹은 `vitest`를 사용할 경우 `description`으로 테스트 코드에 대한 설명을 추가할 수 있고 `test`를 사용함으로서 무슨 `test`인지 명시할 수 있습니다.

### 테스트 당 assert는 하나

> 테스트당 하나의 assert(검증)을 하라는 원칙은 각 테스트가 단일 검증을 할 수 있게 작성하면 됩니다.

```ts
// user.js
export function createUser(name, age) {
  return { name, age, active: true };
}
```

```ts
// user.test.js
import { createUser } from './user';

test('createUser returns an object with the correct name', () => {
  const user = createUser('Zero', 30);
  expect(user.name).toBe('Zero');
});

test('createUser returns an object with the correct age', () => {
  const user = createUser('Zero', 30);
  expect(user.age).toBe(30);
});

test('createUser returns an object with active set to true', () => {
  const user = createUser('Zero', 30);
  expect(user.active).toBe(true);
});
```

`give-when-then` 관례를 사용하는 것도 좋습니다.

물론 반복문을 사용해서 여러 테스트를 한번에 진행할 수도 있습니다. 하지만 개녕 당 assert문 수를 최소로 줄이는거와는 반대된다.

테스트 함수 하나당 개념 하나만 테스트 하는것이 좋다.

```ts
  describe("Lotto 생성 테스트", () => {
    // given
    const lottoCases = [
      {
        case: [11, 2, 30, 42, 5, 36, 5],
        expected: "[ERROR] 중복된 값을 입력 받았습니다."
      },
      {
        case: [10, 20, 30, 40, 15, 26, -1]
        expected: "[ERROR] 범위에 맞지 않는 값을 입력 받았습니다"
      },
      {
        case: [5, 6, 9, 12, 133, 5, 7]
        expected: "[ERROR] 범위에 맞지 않는 값을 입력 받았습니다"
      },
    ];

    test.each(lottoCases)(
      ({ input, expected }) => {
		// when
        const result = new Lotto(input);

        // then
        expect(result).toBe(expected);
      },
    );
  });
```

### F.I.R.S.T

깨끗한 테스트는 다음 다섯 가지 규칙을 따릅니다.

1. F: Fast 테스트는 빨라야 한다. 테스트가 느리다면 자주 돌릴 엄두가 나지 않는다.

2. I: Independent 각 테스트는 서로 의존하면 안된다. 한 테스트가 다음 테스트가 실행될 환경을 준비해서는 안된다. 이는 하나의 테스트가 실패할 경우 여러 테스트가 순차적으로 실패할 수 있기에 어떤 순서로 실행을 하더라도 문제가 없어야 한다.

3. R: Repeatable 테스트는 어떤 환경에서도 반복이 가능하여야 합니다.

4. S: Self-Validating 테스트는 부울 값으로 결과를 나타내어야 합니다. 성공 아니면 실패여야합니다. 통과 여부를 알리고 로그 파일을 읽게 만들어서는 안됩니다.

5. T: Timely 테스트는 적시에 구현이 되어야 합니다. 단위 테스트는 테스트 하려는 실제 코드를 구현하기 직전에 구현해야 합니다. 실제 코드를 구현한다음 테스트 코드를 만든다면 실제 코드가 테스트 하기 어렵다는 사실을 발견할 수도 있습니다.

### 🙏🏻끝으로

테스트는 아주 민감한 주제입니다. 프론트엔드에서 테스트는 기본적으로 로직을 테스트하는 방법도 있지만 컴포넌트 단위를 테스트 할 수 있는 테스트도 존재하고 시각적으로 변화한 것을 테스트하는 방법도 존재합니다. 또, 백엔드에서와 달리 실제로 구현을 하는 것이다보니 아무래도 테스트를 실제로 사용해야하나? 라는 생각이 많이 오고가기도 합니다.

하지만 안전한 코드와 협업을 위해 테스트코드를 작성하는 방법과 실제로 사용하는 방법정도는 알아둘 필요가 있다고 생각합니다.

따라서 테스트코드에 대해 한번 생각하고 정리하는 시간을 가져야 할 것 같습니다.
