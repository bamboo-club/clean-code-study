## 주석

> 나쁜 코드에 주석을 달지마라. 새로짜라.
>
> _브라이언 W. 커니핸, P.J.플라우거_

잘 달린 주석은 그 어떤 정보보다 유용합니다. 경솔하고 근거 없는 주석은 코드를 오히려 이해하기 어렵게 만듭니다.

주석은 실패를 의미합니다. 코드를 이해하지 못하게 만들어두었기에 만회를 하기 위해 주석이라는 방법을 사용하는 것입니다. 때문에 주석은 반가운 손님은 아닙니다.

또한 주석은 오래될수록 신빙성을 잃습니다. 보통 개발자들이 코드를 수정하지 주석을 수정하지는 않으니까요.

가장 성공적인 방법은 코드를 깔끔하게 정리하고 표현력을 강화하는 방향으로 애초에 주석이 필요없는 코드를 만드는 것입니다.

> **부정확한 주석은 아예 없는 주석보다 훨씬 나쁩니다. 잊지마세요.**

### 주석은 나쁜 코드를 보완하지 못한다.

위에서 말했듯이 주석은 나쁜 코드를 만났을 때 생겨납니다. 개발자들은 보통 주석을 달아야한다고 생각합니다. 하지만 표현력이 풍부하고 깔끔하며 주석이 없는 코드가 주석이 달린 코드보다 훨씬 좋습니다.

### 코드로 의도를 표현하라.

코드만으로 의도를 표현하기 어려운 코드가 존재합니다.

```ts
// 직원에게 복지 혜택을 받을 자격이 있는지 검사합니다.
if (employee.flags === HOURLY_FLAG && employee > 65) {
  // ...
}
```

하지만 다음 코드를 본다면 생각이 바뀔수도 있습니다.

```ts
if (employee.isEligibleForFullBenefits()) {
  // ...
}
```

이처럼 주석으로 달려는 설명을 함수로 달아도 충분히 해결이 가능합니다.

### 좋은 주석

**법적인 주석**

회사가 정립한 구현 표준에 맞춰 특정 주석을 넣으라고한 경우 주석을 넣을 수 밖에 없습니다.

**정보를 제공하는 주석**

기본적인 정보를 주석으로 제공하면 편합니다.

다음 주석은 추상 메소드가 반환할 값을 설명합니다.

```ts
// 일치한다면 kk:mm:ss EEE, MMM dd, yyyy 형식입니다.
function timeMatcher(time: string) {
  // ...
}
```

**의도를 설명하는 주석**

때때로 주석은 구현을 이해하게 도와주는 선을 넘어 결정에 깔린 의도까지 설명합니다.

```ts
function compareTo(page) {
  if (page instanceof WikePagePath) {
    const copy = { ...page };
    const compressedName = names.join('');
    const compressedArgumentName = copy.names.join('');

    return Object.is(compressedName, compressedArgumentName);
  }

  return 1; // 옳은 유형이므로 정렬순서가 더 높다.
}
```

**의미를 명료하게 밝히는 주석**

떄떄로 모호한 인수나 반환 값은 그 의미를 읽기 좋게 표현하면 이해하기 쉬워집니다.

일반적으로 인수나 반환 값 자체를 명확하게 만들면 좋겠지만, 인수나 반환 값이 표준 라이브러리나 변경하지 못하는 코드라면 의미를 명료하게 밝히는 주석이 있는 것이 좋습니다.

**결과를 경고하는 주석**

때때로 다른 프로그래머에게 결과를 경고 할 목적으로 주석을 사용합니다.

```ts
// 여유 시간이 충분하지 않다면 실행하지마세요
function testWithReallyBigfile() {
  // ...
}
```

**TODO 주석**

'앞으로 할 일'을 //TODO 주석으로 남겨두면 편합니다. 다음은 함수를 구현하지 않은 이유와 미래 모습을 //TODO 주석으로 설명한 예제입니다.

또한 //TODO로 주석을 남길시 하이라이트를 하거나, 위치를 알려주고, 남아있는 경우 에러를 발생시키는 플러그인이나 세팅방법도 존재합니다.

```ts
// TODO-MaM 현재 필요하지 않습니다.
// 체크아웃 모델을 도입하면 함수가 필요 없습니다.
function makeVersion() {
  return null;
}
```

**중요성을 강조하는 주석**

자칫 대수롭지 않다고 여겨질 뭔가의 중요성을 강조하기 위해서도 주석을 사용합니다.

```ts
function sendContent(type, movieId, content) {
  // type에 따라 다른 mutateFn이 실행이 됩니다.
  if (type === 'review') {
    reviewMutateFn(content);
  } else if (type === 'famous') {
    famousMutateFn(content);
  } else {
    throw new Error('잘못된 접근입니다');
  }
}
```

**공개 API에서 JSDocs**

설명이 잘 된 공개 API는 참 유용하고 만족스럽습니다.

```ts
import { useEffect, useState } from 'react';
import { Loader, LoaderOptions } from '../util/kakaoMapApiLoader';

/**
 * Kakao Map Api를 Loading 합니다.
 *
 * 해당 hook은 cleanup 시점에도 Kakao Map Api를 제거 하지 않고, 동일한 hook를 여러 위치에서 호출 하더라도 최초 한번만 Loading 됩니다.
 *
 * 내부에서 반환하는 `loading` state는 hook를 통해 제어할 때 사용하도록 제공하는 state 입니다.
 *
 * loading를 통한 `Map` 컴포넌트를 conditional rendering를 하지 않아도 됩니다.
 */
export const useKakaoLoader = (options: LoaderOptions) => {
  const [state, setState] = useState<[loading: boolean, error: ErrorEvent | undefined]>([
    true,
    undefined,
  ]);

  useEffect(() => {
    new Loader({ ...options })
      .load()
      .then(() => setState([false, undefined]))
      .catch((error) => {
        setState([false, error]);
      });
  }, [JSON.stringify(options)]);

  return state;
};
```

이처럼 모르는 사람들위해 공개하는 API를 작성하다보면 반드시 훌륭한 JSDoc을 작성할려고 노력을 할겁니다. 이외에도 나머지 충고도 명심하는 것이 좋습니다.

### 나쁜 주석

**주절 거리는 주석**

특별한 이유없이 의무감으로 하지못해다는 주석을 말합니다.

```ts
// 영화 정보를 불러온다.
function getMovieData(movieId) {
  try {
    //...
  } catch (err) {
    // 영화를 불러오는데에 있어서 실패하였다는 의미이다.
  }
}
```

위 코드에서 왜 실패하였는지 무슨 의미인지 아무도 이해를 할 수 없습니다.
이 주석은 독자와 제대로 소통하지 못하는 주석입니다. 이러한 주석은 바이트 낭비만 할 뿐입니다.

**같은 이야기를 중복하는 주석**

코드 내용이 주석과 그대로 일치하면 오히려 읽는 시간을 오래걸리게 합니다.

```ts
// closed가 true일때 실행되는 메소드입니다.
// 타임아웃에 도달하면 예외를 던집니다.

function waitForClose(time) {
  if (!closed) {
    setTimeout(() => {
      if (!closed) throw new Error('MockResponseSender could not be closed');
    }, time);
  }
}
```

또한 변수명과 주석이 일치하면 오히려 좋지 않습니다.

```ts
// 💩 나쁜 예시

export type Movie = {
  /** 성인 영화의 여부 */
  adult: boolean;
  /** 배경주소 */
  backdrop_path: string | null;
  /** 해당 영화의 장르 종류 */
  genre_ids: number[];
  /** 영화 아이디 */
  id: number;
  /** 만들어진 나라의 언어 */
  original_language: string;
  /** 만들어진 나라의 제목 */
  original_title: string;
  /** 한 줄 소개 */
  overview: string;
  /** 방문자 수 */
  popularity: number;
  /** 포스터 주소 */
  poster_path: string | null;
  /** 개봉 날짜 */
  release_date: string;
  /** 제목 */
  title: string;
  /** 비디오가 있는지의 여부 */
  video: boolean;
  /** 평균 점수 */
  vote_average: number;
  /** 평균 점수를 평가한 사람들의 수 */
  vote_count: number;
};
```

**오해의 여지가 있는 주석**

아까 있었던 코등비니다.

```ts
// closed가 true일때 실행되는 메소드입니다.
// 타임아웃에 도달하면 예외를 던집니다.
function waitForClose(time) {
  if (!closed) {
    setTimeout(() => {
      if (!closed) throw new Error('MockResponseSender could not be closed');
    }, time);
  }
}
```

해당 주석은 중복이 많으면서도 오해할 여지가 있습니다.

왜냐하면 closed가 만약 true라면 메소드는 반환하는 출력 인수가 없습니다. this.closed가 true일 경우에만 반환이 됩니다.

이처럼 알기 어려운 주석때문에 다른 개발자들이 closed가 true로 변하는 순간에 함수가 반환되리라고 생각을 못해 함수를 호출을 못할수도 있습니다.

**의무적으로 다는 주석**

> 모든 코드에 주석을 달아야하는 규칙은 어리석기 그지없다.

이런 주석은 코드를 복잡하게 만들며, 거짓말을 퍼뜨리고, 혼동과 무질서를 초래합니다.

**있으나 마나 한 주석**

떄떄로 있으나 마나 한 주석을 접합니다. 이는 너무 당연한 사실을 언급하며 새로운 정보를 제공하지 못하는 주석입니다.

이러한 주석들은 개발자가 주석을 무시하는 습관에 빠지게 합니다.

> 있으나 마나한 주석을 달려는 유혹에서 벗어나 코드를 정리하라. 더 낫고, 행복한 프로그래머가 되는 지름길이다.

**무서운 잡음**

때로는 JSDoc도 잡읍입니다.이는 단지 문서를 제공해야한다는 욕심으로 탄생한 잡음입니다.

```ts
// The name
const name = 'zero1016';

// The version
const version = '12.7.6';

// The licenceName
const licenceName = 'clean-code';
```

_**함수나 변수로 표현할 수 있다면 주석을 달지마라**_

```tsx
// 주어진 배열에서 짝수를 필터링하는 함수
function processNumbers(numbers) {
  // 결과를 저장할 배열
  let result = [];
  for (let number of numbers) {
    // 숫자가 짝수인지 확인
    if (number % 2 === 0) {
      // 짝수라면 결과 배열에 추가
      result.push(number);
    }
  }
  return result;
}
```

**위치를 표시하는 주석**

다음과 같이 위치를 표시하는 주석이 있습니다.

```ts
// movieAPI ///////////////////////////

/*
... 영화를 불러오는 api 목록
*/

// authAPI ////////////////////////////

/*
... 회원 정보에 접근하는 api 목록
*/
```

이러한 주석들은 가독성만 낮추므로 제거하는 것이 좋습니다.

**닫는 괄호에 다는 주석**

때때로 닫는 프로그램에 주석을 달아두기도 합니다. 장황한 함수라면 의미가 있을수도 있지만 작고 캡슐화된 함수에서는 잡음일 뿐입니다.

```tsx
function processNumbers(numbers) {
  let result = [];
  for (let number of numbers) {
    if (number % 2 === 0) {
      result.push(number);
    } // if
  } // for
  return result;
}
```

**공로를 돌리거나 저자를 표시하는 주석**

코드는 시간이 지날수록 변화하기 나름입니다. 때문에 누가 기여를 했는지 누가 수정을 했는지 작성을 하면서 코드를 오염시킬 필요는 없습니다.

**주석으로 처리한 코드**

주석으로 처리한 코드만큼 밉살스러운 관행은 없습니다.

주석으로 처리된 코드는 다른 개발자들이 지우기도 주저합니다. 이유가 있어 남겨놓았으리라고, 중요하니까 지우면 안 된다고 생각합니다. 이러한 코드들은 앙금이 쌓이듯 쓸모 없는 코드로 점차 쌓여가게 됩니다.

**HTML 주석**

소스코 코드에서 HTML 주석은 혐오 그 자체입니다. HTML 태그를 삽입해야하는 책임은 프로그래머가 아니라 도구가 져야합니다.

**전역 정보**

주석을 달아야한다면 근처에 있는 코드만 달아야 합니다.

```ts
// API 엔드포인트 URL
const API_ENDPOINT = 'https://api.example.com/data';

// 아래 함수는 데이터를 가져옵니다.
const TIMEOUT = 5000;

function fetchData() {
  fetch(API_ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// fetch 함수에 타임아웃을 추가할 수 있습니다.
```

위 코드에서 주석은 올바른 위치에 존재하지 않습니다. 이를 통해 코드를 보는 다른 개발자들에게 혼동을 줄 수 있습니다.

**너무 많은 정보**

흥미로운 역사나 관련 없는 정보를 늘어놓는 것은 옳지 않은 주석입니다. 이는 독자에게 불필요하며 불가사의한 정보입니다.

**모호한 관계**

주석과 주석이 설명하는 코드는 둘 사이 관계가 명백해야 합니다. 주석을 달았다면 다른 개발자가 보더라도 해당 코드가 무슨 소린지 이해를 해야합니다.

```ts
const MAX_USERS = 100;

// 이 변수는 최대 사용자를 나타냅니다.
const TIMEOUT = 5000;

// 데이터를 가져오는 함수입니다.
function fetchData() {
  fetch(API_ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}
```

위 함수는 잘못된 변수를 설명하고 있습니다. 주석을 달았다면 올바른 위치에 정확한 설명을 하면서 달려야합니다.

**함수 헤더**

짧은 함수는 긴 설명이 필요없다. 한 가지 일만 수행하며 이름을 잘붙인 함수가 주석으로 헤더를 추가한 함수보다 좋습니다.

**비공개 코드에서 JSDoc**

공개 API의 경우 JSDoc이 유용하지만 공개 되지 않을 경우 팀내 혹은 개인만 확인하기 때문에 따로 생성할 필요는 없습니다. 하지만 추후에 리팩토링이나 알아봐야할 필요가 있다면 미래의 자신 혹은 다른 개발자를 위해 달아두는 것도 좋습니다.

#### 🙏🏻끝으로

그동안 주석은 많이 작성을 하였습니다. JavaScript에서도 주석을 다는 방법이 있지만 TypeScript에서 제공하는 TSDoc을 이용하면 좀 더 세부적으로 입력 인수와 출력 인수 또 생김새와 같은 부분도 상세히 나타낼 수 있습니다.

이전에 오루리 프로젝트를 진행할 때 프로젝트가 길어질 것 같아 컴포넌트마다 주석을 남기는 것을 마음먹고 진행을 하였는데 이것은 오히려 코드의 가독성을 떨어트렸을수도 있다는 것을 깨달았습니다.

주석을 다는것을 정하는 컨벤션을 한다는 것은 미련한 짓이란 것을 알게되었고 만약 설명하기 힘들거나 주석이 필요한 부분에만 주석을 달 것 같습니다.
