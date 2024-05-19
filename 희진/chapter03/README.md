# Chapter 3 함수

의도를 분명히 표현하는 함수를 어떻게 구현할 수 있을까? <br>
함수에 어떤 속성을 부여해야 처음 읽는 사람이 프로그램 내부를 직관적으로 파악할 수 있을까?

## 1. 작게 만들어라 !
함수를 만드는 첫 번째 규칙은 **'작게!'** 다.

*블록과 들여쓰기*

if문/else문/while문 등에 들어가는 블록은 한 줄이어야 한다. <br>
그러면 바깥을 감싸는 함수(enclosing function)가 작아질 뿐 아니라, 블록 안에서 호출하는 함수 이름을 적절히 짓는다면 코드를 이해하기도 쉬워진다.


## 2. 한 가지만 해라 !

~~~java
public static Strign renderPageWithSetupsAndTeardowns(
  PageData pageData, boolean isSuite) throws Exception {
    if (isTestPage(pageData))
      includeSetupAndTeardownPages(pageData, isSuite);
    return pageData.getHtml();
  }
~~~

다음 코드는 한 가지만 한다고 할 수 있을까? 세 가지를 한다고 주장할 수도 있다.
1. 페이지가 테스트 페이지인지 판단한다.
2. 그렇다면 설정 페이지와 해제 페이지를 넣는다.
3. 페이지를 HTML로 렌더링한다.

**지정된 함수 이름 아래에서 추상화 수준이 하나인 단계만 수행한다면 그 함수는 한 가지 작업만 한다.** <br>
즉, 위 코드는 의미를 유지하면서 코드를 더 이상 줄이기란 불가능하다. 따라서 한 가지만 한다고 말할 수 있다.


## 3. 함수 당 추상화 수준은 하나로 !

함수가 확실히 '한 가지' 작업만 하려면 함수 내 모든 문장의 추상화 수준이 동일해야 한다.

**추상화 수준은 코드가 얼마나 세부적이거나 일반적인지에 대한 수준을 나타낸다.** <br>
예를 들어, 고수준 추상화는 큰 개념이나 작업을 설명하고, 저수준 추상화는 구체적인 세부사항이나 절차를 설명한다.

~~~java
public static Strign renderPageWithSetupsAndTeardowns(
  PageData pageData, boolean isSuite) throws Exception {
    if (isTestPage(pageData))
      includeSetupAndTeardownPages(pageData, isSuite);
    return pageData.getHtml();
  }
~~~

위 코드를 다시 보자. 위 코드에서 getHtml()은 추상화 수준이 아주 높다. <br>
반면, String pagePathName = PathParser.render(pagepath);는 추상화 수준이 중간이다. <br>
그리고 .append("\n")와 같은 코드는 추상화 수준이 아주 낮다.

추상화 수준이 하나인 함수를 구현하기란 쉽지 않지만 매우 중요한 규칙이다. <br>
핵심은 짧으면서도 '한 가지'만 하는 함수다. <br>
**위에서 아래로 TO 문단을 읽어내려 가듯이 코드를 구현하면 추상화 수준을 일관되게 유지하기 쉬워진다.**


## 4. Switch문
본질적으로 switch문은 N가지를 처리하기 때문에 완전히 피할 방법은 없다.
하지만 각 switch문을 저차원 클래스에 숨기고 절대로 반복하지 않는 방법은 있다. 물론 다형성(polymorphism)을 이용한다.

~~~java
public Money calculatePay(Employee e) throws InvalidEmployeeType {
  switch (e.type) {
    case COMMISSIONED:
      return calculateHourlyPay(e);
    case HOURLYL:
      return calculateHourlyPay(e);
    case SALARIED:
      return calculateSalariedPay(e);
    default:
      throw new InvalidEmployeeType(e.type);
  }
}
~~~

위 함수에는 몇 가지 문제가 존재한다.
1. 함수가 길다.
2. '한 가지' 작업만 수행하지 않는다.
3. SRP(Single Responsibility Principle)를 위반한다.
4. OCP(Open Closed Principle)를 위반한다.
5. 위 함수와 구조가 동일한 함수가 무한정 존재한다.

이 문제를 해결하기 위해선 어떻게 작성해야 할까?

~~~java
public abstract class Employee {
  public abstract boolean isPayday();
  public abstract Money calculatePay();
  public abstract void deliverPay(Money pay);
}
~~~

~~~java
public interface EmployeeFactory {
  public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType;
}
~~~

~~~java
public class EmployeeFactoryImpl implements EmployeeFactory {
  public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
    switch (r.type) {
      case COMMISSIONED:
        return new CommissionedEmployee(r);
      ccase HOURLYL:
      return new HourlyEmployee(r);
    case SALARIED:
      return new SalariedEmployee(r);
    default:
      throw new InvalidEmployeeType(r.type);
    }
  }
}
~~~

다음 코드를 보자. <br>
switch문을 추상 팩토리(ABSTRACT FACTORY)에 숨긴다.
팩토리는 switch문을 사용해 적절한 Employee 파생 클래스의 인스턴스를 생성한다.
calculatePay, isPayday, deliverPay 등과 같은 함수는 Employee 인터페이스를 거쳐 호출된다. 그러면 다형성으로 인해 실제 파생 클래스의 함수가 실행된다.

이렇게 상속 관계로 숨긴 후에는 절대로 다른 코드에 노출하지 않는다.
물론 불가피한 상황도 생길 수 있다.

## 5. 서술적인 이름을 사용하라!

좋은 이름이 주는 가치는 아무리 강조해도 지나치지 않다. 이름이 길어도 괜찮다. <br>
길고 서술적인 이름이 짧고 어려운 이름보다 좋다. 길고 서술적인 이름이 길고 서술적인 주석보다 좋다. <br>

함수 이름을 정할 때는 여러 단어가 쉽게 읽히는 명명법을 사용한다. <br>
그런 다음, 여러 단어를 사용해 함수 기능을 잘 표현하는 이름을 선택한다.

서술적인 이름을 사용하면 코드를 개선하기 쉬워진다. <br>
이름을 붙일 때는 일관성이 있어야 한다. 모듈 내에서 함수 이름은 같은 문구, 명사, 동사를 사용한다.


## 6. 함수 인수

함수에서 이상적인 인수 개수는 0개(무항)다. 다음은 1개(단항)고, 다음은 2개(이항)다. <br>
3개(삼항)는 가능한 피하는 편이 좋다. 4개 이상(다항)은 특별한 이유가 필요하다. 특별한 이유가 있어도 **사용하면 안 된다.**

*많이 쓰는 단항 형식*

함수에 인수 1개를 넘기는 이유로 가장 흔한 경우는 두 가지다. <br>
~~~java
boolean fileExists("MyFIle") // 좋은 예
~~~
하나는 인수에 질문을 던지는 경우다.
<br>
또 하나는 인수를 뭔가로 변환해 결과를 반환하는 경우다.
~~~java
InputStream fileOpen("MyFile")
~~~
위 코드는 String 형의 파일 이름을 InputStream으로 변환한다.
<br>
이들 두 경우는 독자가 당연하게 받아들인다.

다소 드물게 사용하지만 아주 유용한 단항 함수 형식이 이벤트다. <br>
이벤트 함수는 입력 인수만 있고 출력 인수는 없다. <br>
이벤트 함수는 조심해서 사용해야 하며, 이벤트라는 사실이 코드에 명확히 드러나야 한다.

*플래그 인수*

함수로 bool 값을 넘기는 관례는 정말 끔찍하다. <br>
render(boolean isSuite)라는 함수는 <br>
**renderForSuite()와 renderForSingleTest()라는 함수로 나눠야 마땅하다.**

*이항 함수*

인수가 2개인 함수는 인수가 1개인 함수보다 이해하기 어렵다. <br>
~~~java
Point P = New Point(0,0)
~~~
다음 코드를 보자.
직표 좌표계 점은 일반적으로 인수 2개를 취하므로 인수 2개를 사용하는 것이 적절하다고 할 수 있다.

~~~java
writeField(outputStream, name)
~~~
다음 코드는 한 값을 표현하지도, 자연적인 순서가 있지도 않다.

**위처럼 적절한 경우가 아니라면 가능한 단항 함수로 바꾸도록 애써야 한다.**

*동사와 키워드*

함수의 의도나 인수의 순서와 의도를 제대로 표현하려면 좋은 함수 이름이 필수다. <br>

단항 함수는 함수와 인수가 동사/명사 쌍을 이뤄야 한다. <br>
write(name)은 누구나 곧바로 이해할 수 있는 이름이지만 좀 더 나은 이름은 writeField(name)이다. <br>

함수 이름에 인수 이름을 넣으면 인수 순서를 기억할 필요가 없어지기 때문에 <br>
**함수 이름에 키워드를 추가하는 것도 좋다.**

## 7. 부수 효과를 일으키지 마라 !

부수 효과(Side Effect)는 함수가 예상하지 못한 작업을 수행하거나, 예상 외의 상태를 변경하는 것을 의미한다.

~~~java
public class UserValidator {
  private Cryptographer cryptographer;

  public boolean checkPassword(String username, String password) {
    User user = UserGateway.findByName(username);
    if (user != null) {
      String codedPhrase = user.getPhraseEncodedByPassword();
      String phrase = cryptographer.decrypt(codedPhrase, password);
      if ("Valid Password".equals(phrase)) {
        Session.initialize();
        return true;
      }
    }
    return false;
  }
}
~~~

다음 코드는 아주 무해하게 보이는 함수이지만, Session.initialize()를 호출하는 부분에서 부수 효과를 일으킨다. <br>
checkPassword 함수는 비밀번호를 검증하는 기능 외에 세션을 초기화한다. 따라서 함수 이름만 보고 함수를 호출하는 사용자는 사용자를 인증하면서 기존 세션 정보를 지워버릴 위험에 처한다.


## 8. 명령과 조회를 분리하라 !

함수는 뭔가를 수행하거나 뭔가에 답하거나 둘 중 하나만 해야 한다. <br>
객체 상태를 변경하거나 아니면 객체 정보를 반환하거나 둘 중 하나다. 둘 다 하면 혼란을 초래한다.
~~~java
public class UserManager {
  public boolean setUserAge(User user, int age) {
    if (age < 0 || age > 150) {
      return false;
    }
    user.setAge(age);
    return true;
  }
}
~~~
위 함수는 명령과 조회를 혼합하고 있다. <br>
나이를 설정하는 명령(setAge)과 유효성 검사를 통한 조회가 결합되어 있다. <br>
명령과 조회를 분리하여 작성하는 것이 좋습니다.

다음 코드처럼 명령과 조회를 분리해 혼란을 막자.
~~~java
public class UserManager {
  public boolean isValidAge(int age) {
    return age >= 0 && age <= 150;
  }

  public void setUserAge(User user, int age) {
    if (isValidAge(age)) {
      user.setAge(age);
    } else {
      throw new IllegalArgumentException("Invalid age");
    }
  }
}
~~~


## 9. 오류 코드보다 예외를 사용하라 !

오류 코드를 반환하면 호출자가 그 코드를 확인하고 처리해야 한다. <br> 
이는 코드의 복잡성을 증가시키므로, 대신 예외를 사용하자. 오류 처리가 더 간단하고 명확해진다.

~~~java
public class DeviceController {
  public void sendShutDown() {
    DeviceHandle handle = getHandle(DEV1);
    // 오류 코드를 확인하고 처리하는 예
    if (handle != DeviceHandle.INVALID) {
      retrieveDeviceRecord(handle);
      if (record != DEVICE_SUSPENDED) {
        pauseDevice(handle);
        clearDeviceWorkQueue(handle);
        closeDevice(handle);
      } else {
        logger.log("Device suspended. Unable to shut down");
      }
    } else {
      logger.log("Invalid handle. Unable to shut down");
    }
  }
}
~~~

예외를 사용하면 코드가 더 깔끔하고 읽기 쉬워진다.

~~~java
public class DeviceController {
  public void sendShutDown() {
    try {
      DeviceHandle handle = getHandle(DEV1);
      retrieveDeviceRecord(handle);
      pauseDevice(handle);
      clearDeviceWorkQueue(handle);
      closeDevice(handle);
    } catch (DeviceShutDownException e) {
      logger.log(e.getMessage());
    }
  }

  private DeviceHandle getHandle(String dev1) {
    // handle을 얻는 코드
  }

  private void retrieveDeviceRecord(DeviceHandle handle) throws DeviceShutDownException {
    // 기록을 가져오는 코드
  }

  private void pauseDevice(DeviceHandle handle) throws DeviceShutDownException {
    // 장치를 일시 중지하는 코드
  }

  private void clearDeviceWorkQueue(DeviceHandle handle) throws DeviceShutDownException {
    // 작업 큐를 지우는 코드
  }

  private void closeDevice(DeviceHandle handle) throws DeviceShutDownException {
    // 장치를 닫는 코드
  }
}
~~~

*Try/Catch 블록 뽑아내기*

try/catch 블록은 원래 추하다. 코드 구조에 혼란을 일으키며, 정상 동작과 오류 처리 동작을 뒤섞는다. <br>
따라서 try/catch 블록을 별도 함수로 뽑아내는 편이 좋다.

~~~java
public void delete(Page page) {
  try {
    deletePageAndAllReferences(page);
  } catch (Exception e) {
    logError(e);
  }
}

private void eletePageAndAllReferences(Page page) throws Exception {
  deletePage(page);
  registry.deleteReference(page.name);
  configKeys.deleteKey(page.name.makeKey());
}

private void logError(Exception e) {
  logger.log(e.getMessage());
}
 ~~~

 *오류 처리도 한 가지 작업이다.*

 함수는 '한 가지' 작업만 해야 한다. 오류 처리도 '한 가지' 작업에 속한다. <br>
 따라서 오류를 처리하는 함수는 오류만 처리해야 마땅하다.

## 10. 반복하지 마라 !

중복은 소프트웨어에서 모든 악의 근원이다. <br>

E. F. Codd는 자료에서 중복을 제거할 목적으로 관게형 데이터베이스에 정규 형식을 만들었다. <br> 
구조적 프로그래밍, AOP(Aspect Oriented Programming), COP(Component Oriented Programming) 모두 어떤 면에서 중복 제거 전략이다.

## 11. 구조적 프로그래밍

데이크스트라의 구조적 프로그래밍 원칙에서 <br>
모든 함수와 함수 내 모든 블록에는 입구와 출구가 하나만 존재해야 한다.<br>
즉, 함수는 return문이 하나여야 한다. 루프 안에서 break나 continue를 사용해선 안 되며, **goto는 절대로 안 된다.**

**하지만 함수를 작게 만든다면 간혹 return, break, continue를 여러 차례 사용해도 괜찮다.** <br>
반면, goto 문은 큰 함수에서만 의미가 있으므로, 작은 함수에서는 피해야만 한다.

## 12. 함수를 어떻게 짜죠?

소프트웨어를 짜는 행위는 여느 글짓기과 비슷하다. 처음에는 길고 복잡하다. 들여쓰기 단계도 많고 중복된 루프도 많다. <br>
코드를 다듬고, 함수를 만들고, 이름을 바꾸고, 중복을 제거하며, 메서드를 줄이고 순서를 바꾼다. 때로는 전체 클래스를 쪼개기도 한다. 이와중에도 코드는 항상 단위 테스트를 통과한다. <br>
최종적으로는 이 장에서 설명한 규칙을 따르는 함수가 얻어진다. 


