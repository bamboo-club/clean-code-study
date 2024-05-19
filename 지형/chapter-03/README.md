## 함수

> 코드를 짤 때 길이가 길거나 중복된 코드가 많을 경우 코드를 이해하기 힘듭니다. 해당 챕터에서는 함수를 작성하는 효율적인 방법들에 대해서 정리합니다.

**이해하기 쉽게 함수형 컴포넌트를 기준으로 정리합니다.**

### 작게 만들어라!

> 함수를 만드는 첫째 규칙은 작게 만드는 것 두번째는 더 작게 만드는 것입니다.

아래는 AppBar 컴포넌트를 나타내고 있습니다.

해당 AppBar는 `type`에 따라 보여지는 컴포넌트가 다르게 정의가 되어있습니다.

_~~하지만 해당 코드를 본다면 반복되는 컴포넌트가 있을뿐더러 코드가 직관적이지 않습니다.~~_

```tsx
export function AppBar({
  title = '',
  textButton,
  line = false,
  count = 0,
  icon = 0,
  type = 'default',
}) {
  return (
    <header className="header">
      {type === 'default' && (
        <>
          <div className="default-left-section">
            <Image width={11} height={20} src="/svg/arrow-left.svg" alt="뒤로가기 아이콘" />
          </div>
          <div className="default-center-section">{title}</div>
          {textButton ? (
            textButton
          ) : (
            <IconBox className="default-right-section" type={type} icon={icon} />
          )}
        </>
      )}
      {type === 'home' && (
        <>
          <Logo className="home-left-section" />
          <IconBox className="home-right-section" type={type} icon={icon} />
        </>
      )}
      {type === 'chat' && (
        <>
          <div className="chat-left-section">
            <div className="chat-back-icon">
              <Image width={11} height={20} src="/svg/arrow-left.svg" alt="뒤로가기 아이콘" />
            </div>
            <span className="chat-box">{title}</span>
            {!!count && <span className="chat-count">{count}</span>}
          </div>
          <IconBox className="chat-right-section" type={type} icon={icon} />
        </>
      )}
    </header>
  );
}
```

해당 코드를 아래와 같이 변경합니다.

반복이되는 코드는 줄이고 좀 더 직관적이게 변경하였습니다.

```tsx
export function AppBar({ title, textButton, line = false, count = 0, icon = 0, type = 'default' }) {
  const isDefault = type === 'default';
  const isHome = type === 'home';
  const isChat = type === 'chat';

  return (
    <header className="header">
      {isDefault && <DefaultContent title={title} icon={icon} textButton={textButton}>}
      {isHome && <HomeContent title={title} icon={icon} />}
      {isChat && <ChatContent title={title} icon={icon} />}
    </header>
  );
}
```

여기서 알아야할 점은 `if`, `else`, `while` 문 등에 들어가는 코드가 한 줄이라는 것입니다. 그러면 바깥을 감싸는 함수가 작아질 뿐 아니라, 블록 안에서 호출하는 함수 이름을 적절히 짓는 다면 코드를 이해하는 것도 쉬워집니다.

즉 중첩 구조가 생긴다면 컴포넌트의 크기가 커집니다. 따라서 함수에서 들여쓰기 수준은 1단이나 2단을 안넘어가게 해야합니다. 그래야 함수를 읽고 이해하기 쉬워집니다.

### 한 가지만 해라!

> 함수는 한 가지를 해야 한다. 그 한 가지를 매우 잘해야 한다. 그 한 가지만을 해야 한다.

위 충고에서 문제라면 그 '한 가지'가 무엇인지 알기가 어렵다는 것입니다.

아래 함수를 보겠습니다.

```tsx
export function TextField({ name, defaultValue, validationFn, onChange, error }) {
  return (
    <div className="text-container">
      <div className="text-contents">
        <label className="text-label">{name}</label>
        <input
          className="text-input"
          type="text"
          onChange={onChange}
          name={name}
          defaultValue={defaultValue}
        />
        {validationFn && (
          <button className="validation-button" onClick={validationFn}>
            확인
          </button>
        )}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

해당 `TextField` 컴포넌트는 다음과 같이 여러가지 일을 동시에 수행하고 있습니다.

1. 라벨과 인풋 필드를 렌더링합니다.

2. 조건부로 버튼을 렌더링합니다 (검증 함수가 있다면).

3. 조건부로 에러 메시지를 렌더링합니다.

이는 다음과 같이 분리해서 사용할 수 있습니다.

```tsx
export function withLabel(Component) {
  return function LabeledComponent({ name, ...rest }) {
    return (
      <>
        <label className="text-label">{name}</label>
        <Component {...rest} />
      </>
    );
  };
}

export function withValidationFn(Component) {
  return function ValidatedComponent({ validationFn, ...rest }) {
    return (
      <>
        <Component {...rest} />
        {validationFn && (
          <button className="validation-button" onClick={validationFn}>
            확인
          </button>
        )}
      </>
    );
  };
}

export function withError(Component) {
  return function ErrorComponent({ error, ...rest }) {
    return (
      <>
        <Component {...rest} />
        {error && <span className="error">{error}</span>}
      </>
    );
  };
}

const TextFieldWithLabelAndValidation = withError(withValidationFn(withLabel(TextField)));

// 컴포넌트 사용 예시

<TextFieldWithFeatures
  name="User Name"
  onChange={onChange}
  validationFn={validationFn}
  error={nameError}
  defaultValue="John Doe"
/>;
```

이렇게 역할을 분리한 것을 리액트에서는 고차 컴포넌트(HOC)라고 말합니다.

각각의 컴포넌트는 명확하게 자신의 역할만 수행하고 있으며, 전체적인 컴포넌트 구조가 더욱 깔끔하고 관리하기 쉬워집니다. 또한 에러 처리가 더 효과적이고 일관성 있는 방법으로 수행됩니다.

만약에 컴포넌트 컴포지션 패턴을 사용하면 더욱 직관적이고 효율적으로 만들 수 있습니다.

```tsx
function TextField({ onChange, name, defaultValue, children }) {
  return (
    <div className="text-container">
      {children}
      <input
        className="text-input"
        type="text"
        onChange={onChange}
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
}

function Label({ name }) {
  return <label className="text-label">{name}</label>;
}

function ValidationButton({ validationFn }) {
  return (
    <button className="validation-button" onClick={validationFn}>
      확인
    </button>
  );
}

function ErrorMessage({ error }) {
  return error ? <span className="error">{error}</span> : null;
}

// 컴포넌트 사용 예시

function App() {
  const handleOnChange = (event) => {
    console.log(event.target.value);
  };

  const handleValidation = () => {
    console.log('Validating...');
  };

  return (
    <div>
      <TextField onChange={onChange} name="username" defaultValue="Zero-1016">
        <Label name="Username" />
        <ValidationButton validationFn={validationFn} />
        <ErrorMessage error="Error 발생" />
      </TextField>
    </div>
  );
}
```

해당 패턴을 사용할 경우 각 컴포넌트의 역할이 명확하게 분리되어 있어 역할이 분명합니다.

또한 Label, ValidationButton, ErrorMessage등 다른 입력 필드나 다른 부분에서도 재사용이 가능합니다.

컴포지션 패턴을 사용함으로써 필요한 기능만 선택하여 조합할 수 있습니다.

> 함수가 '한 가지'만 하는지 판단하는 방법이 하나 더 있습니다. 단순히 다른 표현이 아니라 의미 있는 이름으로 다른 함수를 추출할 수 있다면 그 함수는 여러 작업을 하는 것입니다.

### 함수 당 추상화 수준은 하나로!

함수가 확실히 '한 가지' 작업만 하려면 함수 내 모든 문장의 추상화 수준이 동일해야합니다.

```ts
// 추상화 수준이 높다.
const html = getHtml();

// 추상화 수준이 중간이다.
const pagePathName = PathParser.render(pagePath);

// 추상화 수준이 낮다 = 구체적인 세부 사항을 다루고 있습니다.
const DomTree = []
DomTree.push("\");
```

한 함수 내에 추상화 수준을 섞어서 사용을 할 경우 코드를 읽는 사람이 헷갈립니다. 특정 표현이 근본 개념인지 세부 사항인지 구분하기 어려운 탓입니다.

하지만 문제는 이뿐만이 아니라 깨어진 창문과 같이 사람들이 함수에 세부사항을 점점 더 추가할 것입니다.

**위에서 아래로 코드 읽기: _내려가기 규칙_**

코드는 위에서 아래로 이야기처럼 읽혀야 좋습니다.

한 함수 다음에는 추상화 수준이 한 단계 낮은 함수가 옵니다. 즉, 위에서 아래로 프로그램을 읽을 경우 추상화 수준이 한 번에 한 단계씩 낮아집니다.

아래의 예제에서는 사용자 데이터를 처리하는 시스템을 구현하고 있습니다. 이 시스템은 사용자 정보를 받아 처리하고, 최종적으로 데이터베이스에 저장합니다. 코드는 "내려가기 규칙"을 따라 작성됩니다.

```ts
// 고수준의 비즈니스 로직 함수
function processUserData(userId) {
  const userData = fetchUserData(userId);
  const validatedData = validateUserData(userData);
  saveUserData(validatedData);
}

// 중간 수준의 데이터 처리 로직
function fetchUserData(userId) {
  const data = database.getUserData(userId);
  return data ? transformUserData(data) : null;
}

function validateUserData(userData) {
  if (userData.age < 18) {
    throw new Error('User must be at least 18 years old.');
  }
  return userData;
}

// 낮은 수준의 구체적인 구현
function transformUserData(data) {
  return {
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
  };
}

function saveUserData(userData) {
  database.save(userData);
}
```

이처럼 문단을 읽어내려 가듯 코드를 구현하면 추상화 수준을 일관되게 유지하기가 쉬워집니다.

### Switch문

Switch문을작게 만들기는 어렵습니다. 분기가 단 두 개인 switch 문도 4줄 이상 차지해야 할 정도로 길기 때문에 단일 블록이나, 함수를 선호합니다.

또한 '한 가지' 작업만 하는 switch 문을 구현하기는 쉽지 않습니다.

다음은 직원 유형에 따라 다른 값을 계산해 반환하는 함수입니다.

```ts
function calculatePay(e: Employee){
    switch(e.type) {
        case: "COMMISSIONED":
            return calculateCommissionPay(e);
        case: "HOURLY":
            return calculateHourlyPay(e);
        case: "SALARIED":
            return calculateSalariedPay(e);
        default:
            throw new Error("[Error] InvalidEmployType", e.type);
    }
}
```

위 함수에는 몇 가지 문제가 있는데 대표적인 예시로, 새 직원 유형을 추가할 때마다 코드를 변경해야하기 때문입니다.

또 위 함수와 구조가 동일한 함수가 무한정 존재가 가능하기 때문입니다.

예를 들어 아래와 다음과 같은 함수 사용이 가능합니다.

```ts
isPayday(employee, date);

// 혹은
deliverPay(employee, pay);
```

때문에 팩토리 패턴을 사용하여 객체 생성 로직을 클라이언트 코드로분터 분리할 수 있습니다.

```ts
function calculatePay(e: Employee){
    switch(e.type) {
        case: "COMMISSIONED":
            return new CommissionPay(e);
        case: "HOURLY":
            return new HourlyPay(e);
        case: "SALARIED":
            return new SalariedPay(e);
        default:
            throw new Error("[Error] InvalidEmployType", e.type);
    }
}
```

사용할 때는 아래와 같이 사용합니다.

```ts
const payday = calculatePay(employee).isPayday(date);

const pay = calculatePay(employee).deliverPay(pay);
```

### 서술적인 이름을 사용하라!

이전에 함수명을 `testableHTML()` 에서 `SetupTeardownIncluder.render`로 변경하여 진행하였습니다. 함수가 하는 일을 더 잘 표현하므로 훨씬 좋은 이름이 되었습니다.

> 좋은 이름이 주는 가치는 아무리 강조해도 부족합니다.

만약 함수가 작고 단순할수록 서술적인 이름을 고르기가 쉬워집니다.

이름이 길어도 괜찮습니다. 이는 짧고 어려운 이름보다 좋습니다. 한 가지만 하는 작은 함수에 좋은 이름을 붙인다면 이런 원칙은 이미 절반은 성공한 것과 다름이 없습니다.

> 단 이름을 붙일 때에는 일관성이 있어야 합니다.

모듈 내에서 함수 이름은 같은 문구, 명사, 동사를 사용해야 합니다.

같은 페이지에서 사용할 경우 컴포넌트 이름에 같은 문구 혹은 페이지 명을 붙여줄 수 있습니다. `MainMovieList.tsx` `MainMovieBanner.tsx`

다음은 함수의 예시입니다.

```ts
// 💩 Bad
calcPrice();

// 🎇 Good
calculateTotalPrice();

// 💩 Bad
getData();

// 🎇 Good
fetchMainMovieListData();

// 💩 Bad
setUser();

// 🎇 Good
setUserProfileData();
```

### 함수 인수

함수에서 이상적인 인수 개수는 0개(무항)입니다. 다음은 1개(단항)이고, 다음은 2개(이항)입니다. 3개 이상부터는 피하는 편이 좋습니다. 4개 이상은 특별한 이유가 필요합니다. 없을 경우 사용하면 안됩니다.

인수는 조심해야 합니다. `includeSetupPageInto(new PageContent())` 보다 `includeSetupPage()` 의 코드가 좀 더 직관인 것을 알 수 있듯이 인수의 유무에 따라 추상화 수준이 달라지기도 합니다.

테스트 관점에서도 인수는 어렵습니다. 인수의 개수에 따라 테스트를 하나씩 추가한다고 한다면 검증해야할 케이스가 엄청 많아질 것이라고 예상할 수 있습니다.

그러나 출력 인수는 입력 인수보다 이해하기 어렵습니다. 이는 개발자가 직접 코드를 보지 않는 이상 해결 할 수 없습니다.

> 위에 함수에서 new PageContent()가 무엇인지 확인하려면 코드를 확인해야합니다.

따라서 최선은 입력 인수가 없는 경우이며, 차선은 입력 인수가 1개 뿐인 경우입니다.

_**많이 쓰는 단항 형식**_

함수에 인수 1개를 넘기는 이유는 가장 흔한 경우는 두가지 입니다. 하나는 인수에 질문을 던지는 경우 입니다. 다른 하나는 인수를 뭔가로 변환해 결과를 반환하는 경우입니다.

```ts
const myFileData = fs.readFileSync('myFile.txt', 'utf8');
```

`readFileSync`는 파일을 읽어 텍스트 형태로 변환합니다.

또 다른 예시로 이벤트가 있습니다. 이벤트 함수는 입력 인수만 있습니다. 출력 인수는 없습니다. 따라서 이벤트 함수는 조심해서 사용해야 합니다. 이벤트라는 사실이 코드에 명확히 드러나야 합니다.

이를 위해 `on` 접두사를 사용한다거나 어떤 이벤트를 처리하는지 관련 명사를 포함하기도 합니다.

```ts
// 로그인 관련 모듈
onLoginFormSubmit();
onLoginButtonClick();
onUsernameInputChange();
onPasswordInputChange();

// 쇼핑 카트 관련 모듈
onCartItemAdd();
onCartItemRemove();
onCartCheckout();
onCartItemQuantityChange();
```

**플래그 인수**

플래그 인수는 추합니다. 함수로 부울 값을 넘기는 관례는 끔찍합니다.

**이항 함수**
인수가 2개인 함수는 인수가 1개인 함수보다 이해하기 어렵습니다. `setUser(data)`와 `setUser(data, name)` 의미는 명확하지만 직접 코드를 들여다보지 않는 이상 이해하기가 어렵습니다.

하지만 인수가 2개인 경우가 좋은 예인 경우도 있습니다. `const point = new Point(0, 0)`과 같이 직교 좌표계 점은 일반적으로 2개를 취합니다. 오히려 `new Point(0, 0)`의 경우 더 놀랄 수 있습니다.

또한 2개의 인자를 받는 함수를 사용하면 인자의 순서도 인위적으로 기억을 해야합니다.

그렇다고해서 2개의 인수를 받는 함수가 꼭 나쁜 것은 아닙니다. 그래도 이해하고 가능하다면 하나의 인자만 받은 함수로 바꾸도록 애를 써야합니다.

_**삼항 함수**_

3개의 인수는 2개의 인수를 갖는 함수보다 어렵다 때문에 삼항 함수를 만들 때는 신중히 고려해야합니다.

**인수 객체**
인수가 2~3개 필요하다면 일부를 독자적인 클래스 변수로 선언할 가능성을 짚어보는 것이 좋습니다.

```ts
const cirCle = new CirCle(x, y, radius);

const cirCle = new CirCle(point, radius);
```

위 함수를 본다면 변수를 묶어 넘긴다면 개념을 표현하기 때문에 함수의 생김새나 사용방법을 알기 쉽습니다.

**동사와 키워드**

함수의 의도나 인수의 순서와 의도를 제대로 표현하려면 좋은 함수 이름이 필요합니다. 단항 함수는 함수와 인순가 동사/명사 쌍을 이루어야 합니다.

예를들어 `write(name)`과 같이 바로 이해할 수 있습니다.

마지막은 함수 이름에 키워드를 추가하는 것입니다. 예를들어 `makeCirCle(point, radius)` 함수가 있다면 다음과 같이 변경할 수 있습니다. `makeCirClePointRadius(point, radius)` 그렇다면 인수 순서를 기억할 필요가 없어집니다.

### 부수 효과를 일으키지 마라

함수에서 한 가지를 하겠다고 약속을 하였지만 여러가지 일을 할 수도 있습니다. 전역 변수를 사용하거나 받아오는 인수나 클래스 변수를 수정하는 등의 행동입니다. 이런 부수효과들은 사용자가 예측하지 못한 상황을 만들 수 있습니다.

만약 결합이 필요하다면 함수 이름에 분명히 명시하는 것이 좋습니다.

> checkPasswordAndInitializeSession()

그렇지만 이는 함수가 '한 가지'만 한다는 규칙을 위반할 수 있습니다.

### 출력 인수

일반적으로 인수는 입력 인수만 생각합니다. 또 객체지향 언어에서는 출력 인수를 사용할 경우가 없습니다. 하지만 함수지향적인 코딩을 한다면 순수 함수와 불변성을 강조하기에 기존에 값이 변하지 않고 출력이 되는 출력 인수에 대해 생각을 해야합니다.

```ts
// 💩 Bad
function transformList(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * arr[i];
  }
  return arr;
}

const originalList = [1, 2, 3, 4];
const transformedList = transformList(originalList);
console.log(transformedList); // [1, 4, 9, 16]
console.log(originalList); // [1, 4, 9, 16] -> 원본 리스트가 변형됨

// 🎇 Good
function transformList(arr) {
  return arr.map((x) => x * x);
}

const originalList = [1, 2, 3, 4];
const transformedList = transformList(originalList);
console.log(transformedList); // [1, 4, 9, 16]
console.log(originalList); // [1, 2, 3, 4] -> 원본 리스트는 변형되지 않음
```

### 명령과 조회를 분리하라!

함수는 뭔가를 수행하거나 답하거나 둘 중하나만 해야 합니다. 둘 다 해서는 안됩니다. 객체 상태를 변경하거나 아니면 객체 정보를 반환하거나 둘 중 하나입니다. 둘 다 한다면 혼란을 초래합니다.

다음 set 함수는 무슨 함수인지 코드만 봐서는 알 수 없습니다.

```ts
if (set(user, name)) {
  // ...
}
```

이처럼 명령과 조회를 하는 부분에 있어서 명백히 분리하는 것이 좋습니다.

```ts
setUserName(user, name);

if (getUserName(user)) {
  // ...
}
```

### 오류 코드보다 예외를 사용하라!

> 명령 함수에서 오류 코드를 반환하는 방식은 명령/조회 분리 규칙을 미묘하게 위반합니다.

명령 함수에서 오류 코드를 반환하는 형식에 따라 코드를 이어나간다면 여러 단계로 중첩되는 코드를 야기합니다. 때문에 오류 코드를 곧바로 처리해야 한다는 문제에 부딪힙니다.

```ts
if (deletePage(page) === E_OK) {
  if (registry.deleteReference(page.name) === E_OK) {
    if (configKeys.deleteKey(page.name.makeKey()) === E_OK) {
      console.log('page deleted');
    } else {
      console.log('config Key not deleted');
    }
  } else {
    // ...
  }
  // ...
}
```

반면 오류 코드 대신 예외를 사용하면 오류 처리 코드가 원래 코드에서 분리되므로 코드가 깔끔해집니다.

```ts
try {
    deletePage(page);
    registry.deleteReference(page.name)
    configKeys.deleteKey(page.name.makeKey()
} catch (err) {
    console.error(err.message)
}
```

**Try/Catch로 블록 뽑아내기**

try/catch를 이용해서 코드를 작성한다면 코드가 더러워질 수 있습니다. 따라서 코드를 분리하는 것이 좋습니다.

```ts
function deletePageAndAllReferences(page){
    deletePage(page);
    registry.deleteReference(page.name)
    configKeys.deleteKey(page.name.makeKey()
}

function delete(page){
    try {
        deletePageAndAllReferences(page)
    } catch (err) {
        console.error(err.message)
    }
}
```

`delete`함수에서 모든 오류를 처리합니다. 때문에 코드를 이해하기 쉽습니다. 실제로 페이지를 제거하는 함수는 `deletePageAndAllReferences()` 입니다만 해당 함수는 오류를 처리하지 않기에 가독성이 좋습니다.

_**오류 처리도 한 가지 작업이다**_

함수는 '한 가지'작업만 해야합니다. 오류 처리도 '한 가지'에 속합니다. 그러므로 오류를 처리하는 함수는 오류만 처리해야 마땅합니다.

**반복하지 마라**

알고리즘이나 코드가 반복이 된다면 소스코드에서 중복을 제거하여 함수로 만드는 것을 생각을 해야합니다.

만약 똑같은 일을 하는 코드들인데 로직이 변경이 된다면 모든 함수를 변경해야 하므로 하나의 함수로 관리하는 것이 좋습니다.

**구조적 프로그래밍**

> 모든 함수는 입구와 출구가 하나만 존재해야합니다.

즉 함수는 `return` 문이 하나여야 합니다. 루프안에서 `break`나 `continue`등을 사용하지 말라는 것입니다.

그러므로 함수를 작게 만든다면 여러 차례 사용해도 괜찮습니다. 오히려 때로는 이를 으용하는게 더 쉬워집니다.

**함수를 어떻게 짜죠?**

> 소프트웨어를 짜는 행위는 글짓기와 비슷합니다.

초안은 대개 서투르고 어수선하므로 원하는 대로 읽힐 때까지 말을 다듬고 문장을 고치고 문단을 정리해야 합니다.

함수도 마찬가지로 처음에는 길고 복잡하고 들여쓰기 단계도 많고 중복된 루프도 많습니다. 이를 분리하기위해 단위 테스트를 만들고 실행하다보면 어느새 함수가 완성되게 됩니다.

#### 🙏🏻끝으로

리액트 생태계와 함수는 많은 관련이 있습니다. 함수형 컴포넌트를 만들다보면 인수의 개수는 많게는 5개 이상으로도 구현을 해본적이 있습니다. 하지만 해당 글을 보고 인수를 뭉쳐보거나 객체와 같이 큰 덩어리로 넘기면 어떨까 생각을 하였습니다.

구조적 프로그램이의 경우 `go to`를 조심하라고 강조를 하였는데 자바스크립트에서는 할 수 없는 개념이었습니다. 반대로 함수형 프로그래밍을 지향하기에 객체지향방법에서는 하지 않는 출력문에 대해 조금 더 신경을 써야할 것을 느끼었습니다.

다행히도 JSDoc이나 TSDoc을 이용하면 함수로 이동하지 않고도 입력 인수나 출력 인수에 대한 설명을 볼 수 있어 해당 부분에 대해서는 다행이라고 생각하였습니다.
