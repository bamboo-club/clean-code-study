## 형식 맞추기

### 형식을 맞추는 목적

사람들은 "돌아가는 코드"가 일차적인 의무라고 여길수도 있습니다. 하지만 오늘 구현할 기능은 다음 버전에서 바뀔 확률이 매우 높습니다. 때문에 오늘 구현한 코드의 가독성은 앞으로 바뀔 코드의 품질에 지대한 영향을 끼칩니다.

따라서 **맨 처음 잡아놓은 구현 스타일과 가독성 수준은 유지보수 용이성과 확정성의 영향을 끼칠 정도로 중요하단 것**을 알 수 있습니다.

### 적절한 행 길이를 유지하라

소스 길이를 어느정도로 유지해야 할 지 생각할 때가 있습니다. 대다수의 라이브러리의 크기들을 조사했더니 500줄을 넘어가는 파일이 없으며 대다수가 200줄 미만인 것을 볼 수 있습니다. 반면, 몇개의 코드들은 수천 줄이 넘어가는 코드들도 있습니다. 따라서 엄격한 규칙은 아니지만 바람직한 규칙으로 삼아 행 길이를 유지하면 좋습니다. 큰 파일보다 작은 파일이 이해하기 쉽습니다.

_**신문 기사 처럼 작성하라**_

좋은 신문기사를 떠올린다면, 독자는 위에서 아래로 읽습니다. 최상단에 기사를 몇 마디로 요약하는 표제도 나옵니다. 첫 문단은 전체 기사 내용을 요약하고 세세한 사실은 숨기고 커다란 그림을 보여줍니다.

첫 부분은 고차원 개념과 알고리즘을 설명하고 내려갈수록 의도를 세세하게 묘사합니다. 가장 마지막에는 가장 저차원 함수와 세부 내역이 나옵니다.

신문은 다양한 기사로 이뤄집니다. 대다수 기사가 아주 짧습니다. 어떤 기사는 조금 길고 어떤 기사는 거의 없기도 합니다.날짜, 이름 등을 무작위로 뒤섞은 긴 가사만 싣는다면 아무도 읽지 않을겁니다.

_**개념은 빈 행으로 분리하라**_

거의 모든 코드는 왼쪽에서 오른쪽으로 또 위에서 아래로 읽힙니다. 각 행은 수식이나 절을 나타내고 일련의 행 묶음은 완결된 생각 하나를 표현합니다.

예를 들어 빈 행은 새로운 개념을 시작한다는 시각적 단서가 될 수 있습니다. 각 함수 사이에 빈 행이 들어갑니다. 이는 다른 사람들로 하여금 새로운 개념이 시작되었다는 시각적 단서를 줄 수 있습니다.

```ts
import './global.scss';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Provider } from '@/app/provider';

export const metadata: Metadata = {
  title: 'TodoList',
  description: '오늘 할 일을 어제의 나에게 맡긴다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
```

각각의 `import`문 부터 객체의 선언과 함수의 `export`까지 각 행이 빈행을 통해 구분이 되어있습니다. 빈행이 없다면 이는 이해하기 힘든, 가독성이 떨어진 것을 확인할 수 있습니다.

```ts
import './global.scss';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Provider } from '@/app/provider';
export const metadata: Metadata = {
  title: 'TodoList',
  description: '오늘 할 일을 어제의 나에게 맡긴다.',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
```

_**수직 거리**_

서로 밀접한 개념은 가까이에 두어야 합니다. 함수나 변수가 정의된 코드를 찾으려 상속 관계를 줄줄이 거슬러 올라가거나 다른 폴더를 뒤지는 등, 이는 결코 달갑지 않은 행동입니다.

```plain text
📂 auth
    🗂️ hook
        🔵use-sign-in-form.ts
    🗂️ lib
        🔵sign-in.ts
    🗂️ schema
        🔵sign-in-schema.ts
    🗂️ ui
        🔷SignForm.tsx
```

**변수**는 사용하는 위치에 최대한 가까이 선언해야하고, 함수는 짧게 작성할 계획으로 작성할 지역 변수는 최상단에 선언을 해줍니다.

물론 이게 맞는 것은 아닙니다. 아주 긴 함수의 경우 반복문이 시작되기 이전에 변수를 선언하기도 합니다.

**인스턴스 변수**도 지역변수와 같이 클래스 맨 처음에 선언합니다.

```ts
export function timeAgo(pastDate: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} 초 전`;
  } else if (minutes < 60) {
    return `${minutes} 분 전`;
  } else if (hours < 24) {
    return `${hours} 시간 전`;
  } else if (days < 7) {
    return `${days} 일 전`;
  } else if (weeks < 4) {
    return `${weeks} 주 전`;
  } else if (months < 12) {
    return `${months} 월 전`;
  } else {
    return `${years} 년 전`;
  }
}
```

**종속 함수**, 한 함수가 다른 함수를 호출한다면 해당 함수는 서로 가까이 배치하는 것이 좋습니다. 또한 호출하는 함수를 호출되는 함수보다 먼저 배치하는 것이 좋습니다. 그러면 코드가 자연스럽게 읽히고 모듈 전체의 가독성도 좋아집니다.

```js
class LottoController {
  #user;
  #lottoManager;
  #checkManager;

  async #setUser() {
    this.#user = new User();
    await this.#user.readAndSetUserMoney();
  }

  async #setLottoNumber() {
    this.#lottoManager = await LottoManager.readSetLuckyNumber();
    await this.#lottoManager.readAndSetBonusNumber(this.#lottoManager.getLuckyNumber());
  }

  #setCheckManager() {
    this.#checkManager = new CheckManager(
      this.#lottoManager.getLuckyNumber(),
      this.#lottoManager.getBonusNumber(),
      this.#user.getCount()
    );
  }

  #printResult(ranks) {
    outputView.printResult(ranks);
    outputView.printRevenue(ranks);
  }

  async play() {
    await this.#setUser();
    await this.#setLottoNumber();
    this.#setCheckManager();
    this.#printResult(this.#checkManager.getRanks());
  }
}
```

**개념적 유사성** 어떤 코드는 서로를 끌어당기기도 합니다. 개념 친화도가 높기 때문입니다. 따라서 친화도가 높을 수록 가까이에 배치합니다. 위의 예시와 동일합니다.

```plain text
📂 auth
    🗂️ hook
        🔵use-sign-in-form.ts
    🗂️ lib
        🔵sign-in.ts
    🗂️ schema
        🔵sign-in-schema.ts
    🗂️ ui
        🔷SignForm.tsx
```

**세로 순서**

일반적으로 함수 호출 종속성을 아래 방향으로 유지합니다. 즉 호출되는 함수를 호출하는 함수보다 나중에 배치합니다. 그러면 고차원에서 저차원으로 자연스럽게 내려갑니다.

```ts
// 저차원 함수: 사용자 이름을 가져옵니다.
function getUserName(user) {
  return user.name;
}

// 저차원 함수: 사용자 이메일을 가져옵니다.
function getUserEmail(user) {
  return user.email;
}

// 저차원 함수: 사용자 나이를 가져옵니다.
function getUserAge(user) {
  return user.age;
}

// 고차원 함수: 사용자 정보를 처리합니다.
function processUserInfo(user) {
  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userAge = getUserAge(user);

  return {
    name: userName,
    email: userEmail,
    age: userAge,
  };
}

// 최상위 함수: 사용자 정보를 가져와서 출력합니다.
function printUserInfo() {
  const user = {
    name: 'Zero1016',
    email: 'Zero1016@naver.com',
    age: 20,
  };

  const userInfo = processUserInfo(user);
  console.log(`Name: ${userInfo.name}`);
  console.log(`Email: ${userInfo.email}`);
  console.log(`Age: ${userInfo.age}`);
}
```

### 가로 형식 맞추기

프로젝트 7개 정도를 조사해보았을 때 결과는 놀랍게도 규칙적이었다. 20 ~ 45자 사이인 행이 총 행수의 40%에 달할정도로 45자정도로 작성한 것을 볼 수 있습니다. 이처럼 짧은 행을 선호합니다.

그러나 80자 제한은 다소 인위적입니다. 100자나 120자 정도로 나쁘지 않습니다. 이는 `prettier`의 `printWidth`로 자동 줄바꿈이 되게 설정할 수 있습니다.

_가로 공백과 밀집도_

가로로는 공백을 사용해 밀접한 개념과 느슨한 개념을 표현할 수 있습니다.

```ts
export async function measureLine(line) {
  await setLineCount((prev) => prev + 1);
  const lineSize = line.length;
  await setTotalChars((prev) => prev + lineSize);
  lineWidthHistogram.addLine(lineSize, lineCount);
  recordWidestLine(lineSize);
}
```

할당 연산자를 강조하려고 앞뒤에 공백을 주기도하고 함수에서는 쉼표를 분리하여 강조하는 등 인수가 별개라는 사실도 보여줬습니다.

_가로 정렬_

특정 구문을 강조하기 위해 가로 정렬을 하는 경우도 있습니다.

```plain text
export type Movie = {
  adult:                boolean;
  backdrop_path:        string | null;
  genre_ids:            number[];
  id:                   number;
  original_language:    string;
  original_title:       string;
  overview:             string;
  popularity:           number;
  poster_path:          string | null;
  release_date:         string;
  title:                string;
  video:                boolean;
  vote_average:         number;
  vote_count:           number;
};
```

하지만 위와 같은 구조의 정렬은 유용하지 못합니다. 코드가 엉뚱한 부분을 강조하여 진짜 의도가 가려지기 때문입니다. 왼쪽의 변수명은 제외하고 유형만 먼저 읽게되기 때문입니다.

따라서 다음과 같이 작성하는 것이 좋습니다.

```ts
export type Movie = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
```

_들여쓰기_

소스 파일은 윤곽도와 계층이 비슷합니다. 파일 전체에 적용되는 정보가 있고, 파일 내 클래스에 적용되는 정보가 있고, 메소드 내에서만 적용되는 정보가 있듯이 javascript는 블록 단위의 계층을 가지고 있습니다.

이렇듯 범위, 스코프로 이뤄진 계층을 표현하기 위해서 우리는 코드를 들여쓸 수 있습니다.

개발자는 이런 들여쓰기 체계에 크게 의존합니다. 왼쪽으로 코드를 맞춰 코드가 속하는 범위를 시작적으로 표현할 수 있습니다. 그러면 범위끼리 이동도 간단해지고 변수나 클래스를 찾기에도 쉬워집니다.

_들여쓰기 무시하기_

때로는 간단한 `if`문 짧은 `while` 문, 짧은 함수에서 들여쓰기 규칙을 무시하고픈 유혹이 생기기도 합니다.

```ts
if (user === null) throw new Error('[Error] 유저 정보가 존재하지 않습니다.');
```

그러나 제대로된 표현을 선호합니다. (이는 글쓴이의 주관적인 의도입니다.)

```ts
if (user === null) {
  throw new Error('[Error] 유저 정보가 존재하지 않습니다.');
}
```

_팀 규칙_

팀은 한 가지 규칙에 합의해야 합니다. 또 모든 팀원은 그 규칙을 따라야 합니다. 그래야 소프트웨어가 일반적인 스타일을 보입니다.

어디에 괄호를 넣을지, 들여쓰기는 몇 자로 할지, 클래스와 변수와 메소드 이름은 어떻게 지을지 등, 좋은 소프트웨어 시스템은 읽기 쉬운 문서로 이뤄진다는 사실을 잊지 말아야 합니다. 스타일도 일관적이로 매끄러워야합니다.

스타일이 일치하지 않는다면 다른 사람으로 하여금 신뢰도를 잃게 됩니다.

#### 🙏🏻끝으로

프로젝트를 진행할 때마다 새롭게 규칙을 정하는 것들은 재밌기도 하지만 귀찮기도 합니다. 어느 한 레포에서는 컨벤션이 없는 것을 컨벤션으로 할 정도로 사람들 마다 생각하는 중요도의 차이가 다르기도 한 것 같습니다.

하지만 코드는 가독성과 다른 개발자들과 소통을 할 수 있는 하나의 언어입니다. 때문에 작성하거나 생각할 때 귀찮기도 하겠지만 다른 사람들과 스타일을 맞추고 합의를 함으로서 일치를 시키는 것은 중요하다고 생각합니다.

아래는 우아한 뉴스레터 5월호에 실린 팀을 위한 공유 설정파일, 컨벤션을 정할 수 있는 ESLint와 Prettier에 대한 글입니다.

[참고할만한 문서 - 우리 팀을 위한 ESLint, Prettier 공유 컨피그 만들어보기](https://techblog.woowahan.com/15903/)
