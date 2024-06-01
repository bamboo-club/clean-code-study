## 오류 처리

깨끗한 코드와 오류 처리는 연관성이 있습니다. 여기 저기 흩어진 오류 처리 코드 때문에 실제 코드가 하는 일은 파악하기 거의 불가능 할 수도 있습니다.

### 오류 코드보다 예외를 사용하라

예외 처리를 지원하지 않는 프로그래밍 언어는 많았습니다.

```typescript
const sendShutDown = async () => {
  const handle = await getHandle(DEV1);
  // 디바이스 상태를 점검합니다.
  if (handle.status !== DeviceHandle.INVALID) {
    // 레코드 필드에 디바이스 상태를 점검합니다.
    retrieveDeviceRecord(handle.data);
    // 디바이스가 일시정지 상태가 아니라면 존재합니다.
    if (record.getStatus() !== DEVICE_SUSPENDED) {
      pauseDevice(handle);
      clearDeviceWorkQueue(handle);
      closeDevice(handle);
    } else {
      console.error('Device suspended. Unable to shut down');
    }
  } else {
    console.error('Invalid handle for: ' + DEV1.toString());
  }
};
```

위와 같은 함수를 반복한다면 이는 호출자 코드가 복잡해지고 가독성을 해집니다. 따라서 오류가 발생하면 오류를 던지는 코드가 있는 것이 좋습니다.

```typescript
const sendShutDown = async () => {
  try {
    await tryToShutDown();
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

const tryToShutDown = () => {
  const handle = getHandle(DEV1);
  const record = retrieveDeviceRecord(handle);

  pauseDevice(handle);
  clearDeviceWorkQueue(handle);
  closeDevice(handle);
};
```

이처럼 예외처리로 코드를 분리할 경우 보기만 좋아진게 아니라 품질도 좋아졌습니다. 각 코드를 독립적으로 살펴보고 이해할 수 있습니다.

### Try-Catch-Finally 문부터 작성하라.

`try` 블록에 들어가는 코드를 실행하면 어느 시점에서든 에러가 난다면 `catch` 블록으로 넘어갈 수 있습니다.

다음은 파일이 없을 경우 예외를 발생하는 단위테스트입니다.

```typescript
export const FileReaderComponent = ({ filePath }) => {
  let fileContent;
  try {
    fileContent = fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error('Failed to read file');
  }

  return <div>{fileContent}</div>;
};

test('throws an error when file does not exist', () => {
  expect(() => render(<FileReaderComponent filePath="non-existent-file.txt" />)).toThrow(
    'Failed to read file'
  );
});

test('renders content when file exists', () => {
  const { getByText } = render(<FileReaderComponent filePath="existent-file.txt" />);
  expect(getByText('file content')).toBeInTheDocument();
});
```

하지만 해당 테스트는 컴포넌트를 부르고 해당 컴포넌트에서 텍스트를 호출까지하기에 많은 일들을 하고 있습니다.

때문에 코드를 분리해주는 것이 좋기도 합니다.

먼제 예외를 일으키는 테스트 케이스를 작성한 후 테스트를 통과하게 코드를 작성하는 TDD도 권장합니다.

그러면 자연스럽게 try 블록의 트랜잭션 범위부터 구현하게 되므로 본질을 유지하기 쉬워집니다.

### 미확인 예외를 사용해라

확인된 예외는 OCP를 위반합니다.

> `javascript`에서는 확인된 예외와 미확인된 예외의 개념이 없지만 예외처리를 통해 비정상적인 상태를 다룰 수 있습니다.

```typescript
async function fetchData(url) {
  try {
    let response = await fetch(url);

    // HTTP 상태 코드가 200이 아닐 경우 예외 발생
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // 필요에 따라 예외를 다시 던질 수 있습니다.
  }
}

// 사용 예시
fetchData('https://api.example.com/data')
  .then((data) => console.log('Data received:', data))
  .catch((error) => console.error('Error occurred:', error));
```

### 예외에 의미를 제공하라

예외를 던질 때는 전후 상황을 충분히 덧붙여야 합니다. 오류 메시지에 정보를 담아 예외와 함께 던져주고. 실패한 연산 이름과 실패 유형도 언급하는 것이 좋습니다.

### 호출자를 고려해 예외 클래스를 정의하라

오류를 분류하는 방법은 수없이 많습니다. 오류가 발생한 위치로 분류가 가능합니다.

예를 들어 오류가 발생한 컴포넌트로 분류한다던지, 아니면 유형으로도 분류가 가능합니다.

오류를 정의할 때 프로그래머에게 가장 중요한 관심사는 오류를 잡아내는 방법이 되어야 합니다.

```js
async function fetchingData() {
  try {
    const port = new ACMPort(12);

    port.open();
  } catch (err) {
    throw new reportPortError();
    console.log(err.message);
  } finally {
    //...
  }
}
```

예외를 던지는 함수를 감싸는 `wrapper function` 함수도 좋습니다.

```js
async function fetchWithHandling(url, options = {}) {
  try {
    let response = await fetch(url, options);

    // HTTP 상태 코드가 200이 아닐 경우 예외 발생
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    // 필요에 따라 예외를 다시 던질 수 있습니다.
    throw error;
  }
}

// 사용 예시
fetchWithHandling('https://api.example.com/data')
  .then((data) => console.log('Data received:', data))
  .catch((error) => console.error('Error occurred:', error));
```

외부 라이브러리를 사용할 경우 wrapper 함수로 감싸주면 외부 라이브러리와 프로그램 사이의 의존성이 크게 줄업듭니다. 또한 특정 업체가 API를 설계한 방식에 발목이 잡히지 않습니다.

### 정상 흐름을 정의하라

코드 중간에 예외 처리에 대한 로직이 있다면 이는 가독성을 해치고 알기 힘들게 합니다. 때문에 때때로는 중단이 적합하지 않은 경우도 있습니다.

### null을 반환하지 마라

오류를 처리하는 방법 중 가장 많이하는 사례가 `null`를 반환하는 습관입니다.

```ts
function registerItem(item: Item) {
  if (item !== null) {
    const registry = peristentStore.getItemRegistry();
    if (registry !== null) {
      const existing = registry.getItem(item.getId());
      if (existing.getBillingPeriod().hasRetailOwner()) {
        existing.register(item);
      }
    }
  }
}
```

위 코드는 일거리를 늘리고 호출자(클라이언트)에게 문제(예외처리)를 떠넘기는 등 나쁜 코드입니다.

```ts
function getEmployees(){
    if (/* 직원이 없다면 */) {
        return []
    }
    return Employees
}
```

이렇게 코드를 변경한다면 코드가 깔끔해질뿐더러 `Null`을 처리하기 위한 예외처리도 하지 않아도 되니 코드가 깔끔해질 수 있습니다.

### null을 전달하지 마라

메소드에서 `null`을 반환하는 방식도 나쁘지만 메소드로 `null`을 전달하는 방식은 더 나쁩니다. 인수로 `null` 전달을 기대하는 API가 아니라면 메소드로 `null`을 저달하는 코드는 최대한 피합니다.

### 🙏🏻끝으로

오류처리는 많이 하지 않아왔습니다. 기본적으로 사용하는 tanstack-query의 경우 지원이 좋을분더러 error-boundary의 존재도 있으니 딱히 에러에 대해 심각하게 생각하지 않았습니다.

그래도 공감이 갔던 부분은 `null`을 사용하는 호출 값, 인자 값에 대해 처리를 하는 부분이었습니다. 만약 데이터가 없다고 해서 서버에서 빈 값을 보내게 된다면 클라이언트단에서는 한번 더 해당 데이터가 있는지 없는지 검사를 하는 절차를 밟습니다.

```tsx
const TodoList = () => {
  const { data } = getTodo();

  if (Object.is(null, data)) {
    return null;
  }

  return (
    <ul>
      {data.map((todo) => (
        <OneTodo key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
```

하지만 빈 배열로 올 경우 해당 데이터에 대한 유효성 검사를 하는 코드를 없앨 수 있고 코드가 좀 더 가독성있게 읽히게 되었습니다.

```tsx
const TodoList = () => {
  const { data } = getTodo();

  return (
    <ul>
      {data.map((todo) => (
        <OneTodo key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
```

이는 외부 사람들과 프로젝트를 할 때 겪었던 문제로 처음에는 `null`이나 배열이나 상관없이 받아왔지만 뒤로 갈수록 빈 배열을 전달해달라고 요청을 하고 있습니다.

깨끗한 코드는 읽기도 좋아야 하지만 안정성도 높아야 한다고 생각합니다. 오류 처리를 프로그램 논리와 분리하면 독립적인 추론이 가능해지며 코드 유지 보수성도 좋아진다고 생각합니다.
