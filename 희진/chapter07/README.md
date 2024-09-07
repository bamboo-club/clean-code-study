# Chapter 7 오류 처리

상당수 코드 기반은 전적으로 오류 처리 코드에 좌우되는데, 여기저기 흩어진 오류 처리 코드 때문에 실제 코드가 하는 일을 파악하기가 어려워지는 경우가 있다. <br>
오류 처리는 중요하지만 오류 처리 코드로 인해 프로그램 논리를 이해하기 어려워진다면 클린 코드라 부르기 어렵다. <br>
이 장에서는 우아하고 고상하게 오류를 처리하는 기법과 고려 사항 몇 가지를 소개한다.

## 오류 코드보다 예외를 사용하라

얼마 전까지만해도 예외를 지원하지 않는 프로그래밍 언어가 많았는데, 예외를 지원하지 않는 언어는 오류를 처리하고 보고하는 방법이 제한적이었다. <br>
**오류 플래그**를 설정하거나 **호출자에게 오류 코드를 반환하는 방법**이 전부였다.

```java
public class DeviceController {
	...
	public void sendShutDown() {
		// 디바이스 상태를 점검한다.
		if (handle != DeviceHandle.INVALID) {
			// 레코드 필드에 디바이스 상태를 저장한다.
			retrieveDeviceRecord(handle);
			// 디바이스가 일시정지 상태가 아니라면 종료한다.
			if (record.getStatus() != DEVICE_SUSPENDED) {
				pauseDevice(handle);
				clearDeviceWorkQueue(handle);
				closeDevice(handle);
			} else {
				logger.log("Device suspended. Unable to shut down");
			}
		} else {
			logger.log("Invalid hanlde for : " + DEV1.toString());
		}
	}
	...
}
```

위 코드가 이와 같은 예시인데, 함수를 호출한 즉시 오류를 확인해야 하기 때문에 호출자 코드가 복잡해진다. <br>


```java
public class DeviceController {
	...
	public void sendShutDown() {
		try {
			tryToShutDown();
		} catch (DeviceShutDownError e) {
			logger.log(e);
		}
	}

	private void tryToShutDown() throws DeviceShutDownError {
		DeviceHandle handle = getHandle(DEV1);
		DeviceRecord record = retrieveDeviceRecord(handle);

		pauseDevice(handle);
		clearDeviceWorkQueue(handle);
		closeDevice(handle);
	}

	private DeviceHandle getHandle(DeviceID id) {
		...
		throw new DeviceShutDownError("Invalid handle for : " + id.toString());
		...
	}
	...
}
```
위 코드는 오류를 발견하면 예외를 던지는 코드다. 디바이스를 종료하는 알고리즘과 오류를 처리하는 알고리즘을 분리했기 때문에 코드가 깨끗해진 것과 더불어 코드 품질도 나아졌다.

## Try-Catch-Finally 문부터 작성하라

어떤 면에서 `try` 블록은 트랜잭션과 비슷하다. `try` 블록에서 무슨 일이 생기든지 `catch` 블록은 프로그램 상태를 일관성 있게 유지해야 한다. 그러므로 예와가 발생할 코드를 짤 때는 `try-catch-finally` 문으로 시작하는 편이 낫다. 그러면 `try` 블록에서 무슨 일이 생기든지 호출자가 기대하는 상태를 정의하기 쉬워진다. <br>

```java
@Test(expected = StorageException.class)
public void retrieveSectionShouldThrowOnInvalidFileName() {
	sectionStore.retrieveSection("invalid - file");
}
```

위 코드는 파일이 없으면 예외를 던지는지 알아 보는 단위 테스트다. <br>
단위 테스트에 맞춰 다음 코드를 아래와 같이 구현했다.

```java
public List<RecordedGrip> retrieveSection(String sectionName) {
	// 실제로 구현할 때까지 비어 있는 더미를 반환한다.
	return new ArrayList<RecordedGrip>();
}
```
위 코드는 예외를 던지지 않으므로 단위 테스트는 실패한다. 잘못된 파일 접근을 시도하게 구현을 변경하자. <br>
아래 코드는 예외를 던진다.

```java
public List<RecordedGrip> retrieveSection(String sectionName) {
	try {
		FileInputStream stream = new FileInputStream(sectionName)
	} catch (Exception e) {
		throw new StorageException("retrieval error", e);
	}
	return new ArrayList<RecordedGrip>();
}
```
코드가 예외를 던지므로 이제는 테스트가 성공한다. 이 시점에서 `catch` 블록에 **예외 유형을 좁혀** 실제로 `FileInputStream` 생성자가 던지는 `FileNotFoundException`을 잡아내게끔 리팩터링도 가능하다.


```java
public List<RecordedGrip> retrieveSection(String sectionName) {
	try {
		FileInputStream stream = new FileInputStream(sectionName);
		stream.close();
	} catch (FileNotFoundException e) {
		throw new StorageException("retrieval error", e);
	}
	return new ArrayList<RecordedGrip>();
}
```
위 코드는 `FileInputStream` 객체를 생성하고 `stream.close();` 바로 닫는 코드 사이에 필요한 논리가 구현되지 않았으므로 TDD를 사용해 나머지 논리를 추가해야 한다. 먼저 강제로 예외를 일으키는 테스트 케이스를 작성한 후, 테스트를 통과하는 코드를 작성하는 방법을 권장한다. 그러면 자연스럽게 `try` 블록의 트랜잭션 범위부터 구현하게 되므로 범위 내에서 트랜잭션 본질을 유지하기 쉬워진다.


## 미확인(unchecked) 예외를 사용하라

자바 첫 버전이 확인된 예외를 선보였던 당시는 `checked` 예외가 멋진 아이디어로 여겨졌다. 실제로도 `checked` 예외는 몇 가지 장점을 제공한다. 하지만 지금은 안정적인 소프트웨어를 제작하는 요소로 확인된 예외가 반드시 필요하지는 않다는 사실이 분명해졌다. 그러므로 우리는 `checked` 오류가 치르는 비용에 상응하는 이익을 제공하는지 철저히 따져봐야 한다. <br>

`checked` 예외는 `OCP(Open Closed principle)`를 위반한다. <br>
대규모 시스템에서 단계를 내려갈수록 호출하는 함수 수는 늘아는데 최하위 함수를 변경해 새로운 오류를 던지려면 선언부에 `throws` 절을 추가해야 한다. 그러면 **변경한 함수 모두가 `catch` 블록에서 새로운 예외를 처리하거나** **선언부에 `throws` 절을 추가해야 한다.** `throws` 경로에 위치하는 모든 함수가 최하위 함수에서 던지는 예외를 알아야 하므로 캡슐화가 깨진다. 오류를 원거리에서 처리하기 위해 예외를 사용한다는 사실을 감안한다면 이처럼 `checked` 예외가 캡슐화를 깨버리는 현상은 참으로 유감스럽다. <br>

아주 중요한 라이브러리를 작성한다면 모든 예외를 잡아야 하기 때문에 checked 예외가 유용할 수 있다. <br>
하지만 일반적인 애플리케이션은 의존성이라는 비용이 이익보다 크다.

## 예외에 의미를 제공하라

예외를 던질 때는 전후 상황을 충분히 덧붙여야 오류가 발생한 원인과 위치를 찾기 쉽다. <br>
자바는 모든 예외에 호출 스택을 제공하지만 실패한 코드의 의도를 파악하려면 호출 스택만으로 부족하다. <br>
오류 메세지에 정보를 담아 예외와 함께 던져라. 실패한 연산 이름과 실패 유형도 언급하라. <br>
애플리케이션이 로깅 기능을 사용한다면 `catch` 블록에서 오류를 기록하도록 충분한 정보를 넘겨라.

## 호출자를 고려해 예외 클래스를 정의하라

오류를 분류하는 방법은 수없이 많다. 오류가 발생한 위치로 분류하거나 오류가 발생한 컴포넌트로 분류할 수도 있고 아니면 유형으로도 분류가 가능하다. 하지만 애플리케이션에서 오류를 정의할 때 프로그래머에게 가장 중요한 관심사는 **오류를 잡아내는 방법**이 되어야 한다. <br>

아래 코드는 오류를 형편없이 분류한 예시다. 외부 라이브러리가 던질 예외를 모두 잡아내고 있다.
```java
ACMEPort port = new ACMEPort(12);

try {
	port.open();
} catch (DeviceResponseException e) {
	reportPortError(e);
	logger.log("Device response exception", e);
} catch (ATM1212UnlockedException e) {
	reportPortError(e);
	logger.log("Unlock exception", e);
} catch (GMXError e) {
	reportPortError(e);
	logger.log("Device response exception");
} finally {
	...
}
```
위 코드는 예외 유형과는 무관하게 예외를 거의 동일한 방식으로 처리하고 있기 때문에 코드를 간결하게 고치기 쉽다. 호출하는 라이브러리 API를 감싸면서 예외 유형 하나를 반환하면 된다.

```java
Local Port port = new LocalPort(12);
try {
	port.open();
} catch (PortDeviceFailure e) {
	reportError(e);
	logger.log(e.getMessage(), e);
} finally {
	...
}
```
여기서 LocalPort 클래스는 단순히 ACMEPort 클래스가 던지는 예외를 잡아 변환하는 `wrapper` 클래스이다.

```java
public class LocalPort {
	private ACMEPort innerPort;

	public LocalPort(int portNumber) {
		innerPort = new ACMEPort(portNumber);
	}

	public void open() {
		try {
			innerPort.open();
		} catch (DeviceResponseException e) {
			throw new PortDeviceFailure(e);
		} catch (ATM1212UnlockedException e) {
			throw new PortDeviceFailure(e);
		} catch (GMXError e) {
			throw new PortDeviceFailure(e);
		}
	}
	...
}
```
`LocalPort` 클래스처럼 `wrapper` 클래스는 매우 유용하다. 실제로 외부 API를 사용할 때는 `wrapper` 클래스를 사용하는 것이 최선이다. <br>

`wrapper` 클래스를 사용했을 때 다음과 같은 장점이 있다. <br>
1. 외부 라이브러리와 프로그램 사이에서 의존성이 크게 줄어든다.
2. `wrapper` 클래스에서 외부 API를 호출하는 대신 테스트 코드를 넣으면 테스트하기도 쉬워진다.
3. 특정 업체가 API를 설게한 방식에 발목 잡히지 않는다.
4. 프로그램이 훨씬 깨끗해진다.

예외 클래스에 포함된 정보로 오류를 구분해도 괜찮은 경우라면 예외 클래스가 하나만 있어도 충분하다. <br>
한 예외는 잡아내고 다른 예외는 무시해도 괜찮은 경우라면 여러 예외 클래스를 사용하자.

## 정상 흐름을 정의하라

앞 절에서 충고한 지침을 충실히 따른다면 비즈니스 논리와 오류 처리가 잘 분리된 코드가 나온다. <br>
코드 대부분이 깨끗하고 간결한 알고리즘으로 보이기 시작하지만 그러다 보면 오류 감지가 프로그램 언저리로 밀려난다.<br>
외부 API를 감싸 독자적인 예외를 던지고 코드 위에 처리기를 정의해 중단된 계산을 처리하는 방식은 대개는 좋지만 때로는 적합하지 않은 때도 있다.

예제를 살펴보자. 다음은 비용 청구 애플리케이션에서 총계를 계산하는 허술한 코드다.

```java
try {
	MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
	m_total += expoenses.getTotal();
} catch(MealExpensesNotFound e) {
	m_total += getMealPerDiem();
}
```
식비를 비용으로 청구했다면 직원이 청구한 식비를 총계에 더하고, 식비를 비용으로 청구하지 않았다면 일일 기본 식비를 총계에 더하고 있다. 이 코드는 예외가 논리를 따라가기 어렵게 만들고 있다. 특수 상황을 처리할 필요가 없다면 코드가 훨씬 더 간결해질 것이다.

```java
MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
m_total += expenses.getTotal();
```
```java
public class PerDiemMealExpenses implements MealExpenses {
	public int getTotal() {
		// 기본값으로 일일 기본 식비를 반환한다.
	}
}
```
`ExpenseReportDAO`를 수정해 언제나 `MealExpense` 객체를 반환하도록 하였다. <br>
청구한 식비가 없다면 일일 기본 식비를 반환하는 `MealExpense` 객체를 반환한다.

이를 `특수 사례 패턴(SPECIAL CASE PATTERN)`이라 부른다. 클래스를 만들거나 객체를 조작해 특수 사례를 처리하는 방식이다. 클래스나 객체가 예외적인 상황을 캡슐화해서 처리하므로 **클라이언트 코드가 예외적인 상황을 처리할 필요가 없어진다.**

## null을 반환하지 마라

```java
public void registerItem(Item item) {
	if (item != null) {
		ItemRegistry registry = persistentStore.getItemRegistry();
		if (registry != null) {
			Item existing = registry.getItem(item.getID());
			if (existing.getBillingPeriod().hasRetailOwner()) {
				existing.register(item);
			}
		}
	}
}
```
위 코드처럼 한 줄 건너 하나씩 `null`을 확인하는 코드는 나쁜 코드다. `null`을 반환하는 코드는 일거리를 늘릴 뿐만 아니라 호출자에게 문제를 떠넘긴다. <br>

위 코드에서 `persistentStore`가 `null`이라면 실행 시 어떤 일이 벌어질까? `null`을 체크하는 코드가 누락되었기 때문에 `NullPointException`이 발생하리라. 위쪽 어디선가 `NullPointException`을 잡을지도 모르고 아닐지도 모르지만 어느 쪽이든 나쁘다.

위 코드는 `null` 확인이 누락된 문제라고 말할 수도 있지만 실상은 `null` **확인이 너무 많아 문제**다. <br>
메서드에서 `null`을 반환하고픈 유혹이 든다면 그 대신 예외를 던지거나 특수 사례 객체를 반환하라. <br>
사용하려는 외부 API가 `null`을 반환한다면 `wrapper` 메서드를 구현해 예외를 던지거나 특수 사례 객체를 방식을 고려해라.

```java
List<Employee> employees = getEmployees();
if (employees != null) {
	for (Employee e : employees) {
		totalPay += e.getPay();
	}
}
```
위에서 `getEmployees`는 `null`도 반환한다. 반드시 `null`을 반환할 필요가 있을까? <br>
`getEmployees`를 변경해 빈 리스트를 반환한다면 코드가 훨씬 깔끔해진다.

```java
List<Employee> employees = getEmployees();
for (Employee e : employees) {
	totalPay += e.getPay();
}
```
```java
public List<Employee> getEmployees() {
	if ( .. 직원이 없다면 .. )
		return Collections.emptyList();
}
```
자바에는 `Collections.emptyList()`라는 미리 정의(Pre-defined)된, 읽기 전용(immutable) 리스트를 반환하는 유틸리티 메서드가 있기 때문에 사용자는 `null`을 체크할 필요 없이 바로 리스트를 처리할 수 있다. <br>
이렇게 코드를 변경하면 코드도 깔끔해질뿐더러 `NullPointerException`이 발생할 가능성도 줄어든다.

## null을 전달하지 마라

메서드에서 `null`을 반환하는 방식도 나쁘지만 메서드로 `null`을 전달하는 방식은 더 나쁘다. <br>
정상적인 인수로 `null`을 기대하는 API가 아니라면 메서드로 `null`을 전달하는 코드는 최대한 피하라.

다음은 두 지점 사이의 거리를 계산하는 간단한 메서드다.
```java
public class MetricsCalculator {
	public double xProjection(Point p1, Point p2) {
		return (p2.x - p1.x) * 1.5;
	}
	...
}
```
```java
calculator.xProjection(null, new Point(12, 13));
```
누군가 인수로 null을 전달하면 어떤 일이 벌어질까?
당연히 `NullPointerException`이 발생한다. <br>

#### 어떻게 코드를 고치면 좋을까?

```java
public class metricsCalculator {
	public double xProjection(Point p1, Point p2) {
		if (p1 == null || p2 == null) {
			throw InvalidArgumentException("Invalid argument for MetricsCalculator.xProjection");
		}
		return (p2.x - p1.x) * 1.5;
	}
}
```
원래 코드를 고쳐 새로운 예외 유형을 만들어 던져보았다. <br>

위 코드가 원래 코드보다 나을까? `NullPointerException` 보다는 조금 나을지도 모르겠다. <br>
하지만 위 코드는 `InvalidArgumentException`을 잡아내는 처리기가 필요하다. <br>
처리기는 `InvalidArgumentException` 예외를 어떻게 처리해야 좋을까? 좋은 방법이 있을까?


```java
public class metricsCalculator {
	public double xProjection(Point p1, Point p2) {
		assert p1 != null : "p1 should not be null";
		assert p2 != null : "p2 should not be null";
		return (p2.x - p1.x) * 1.5;
	}
}
```
또 다른 대안으로 `assert` 문을 사용하는 방법도 있다. <br>
문서화가 잘 되어 코드 읽기는 편하지만 문제를 해결하지는 못한다. 누군가 `null`을 전달하면 여전히 실행 오류가 발생한다. <br>

대다수 프로그래밍 언어는 호출자가 실수로 넘기는 `null`을 적절히 처리하는 방법이 없다. <br>
그렇다면 애초에 `null`을 넘기지 못하도록 금지하는 정책이 제일 좋은 방법이다.


## 결론
깨끗한 코드는 읽기도 좋아야 하지만 안정성도 높아야 하며 이 둘은 상충하는 목표가 아니다. <br>
오류 처리를 프로그램 논리와 분리하면 튼튼하고 깨끗한 코드를 작성할 수 있어 독립적인 추론이 가능해지며 코드 유지보수성도 크게 높아진다.
