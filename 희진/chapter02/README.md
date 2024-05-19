# Chapter 2 의미 있는 이름

소프트웨어에서 이름은 어디나 쓰이며, 의미 있는 이름을 짓는 것은 중요하다.
### 이름을 잘 짓는 간단한 규칙을 몇 가지 소개한다.

## 1. 의도를 분명히 밝혀라

~~~java
int d; // 경과 시간(단위 : 날짜)
~~~
위 변수 d가 어떤 의도로 생성이 된 건지 변수명만 보고 알 수 있을까?

~~~java
int elapsedtimeinDays;
int daysSinceCreation;
int daysSinceModification;
int fileAgeInDays;
~~~
해당 변수들은 측정하려는 값과 단위를 표현하고자 하는 의도가 드러나있다. <br>

__어느 변수가 더 코드 이해와 변경이 쉬울까?__

~~~java
public List<int []> getThem() {
  List<int []> list1 = new ArrayList<int []>();

  for (int[] x : theList)
    if (x[0] == 4)
      list1.add(x);
  return list1;
}
~~~
-  theList에 무엇이 들었는가?
-  theList에서 0번째 값이 어째서 중요한가?
-  값 4는 무슨 의미인가?
-  함수가 반환하는 리스트 list1을 어떻게 사용하는가?

#### 위 코드 샘플엔 이와 같은 정보가 드러나지 않는다.

~~~java
public List<Cell> getFlaggedCells() {
  List<Cell> flaggedCells = new ArrayList<Cell>();
  for (Cell cell : gameBoard)
    if (cell.isFlaaged())
      flaggedCells.add(cell);
  return flaggedCells;
}
~~~
#### 코드의 단순성은 변하지 않았지만 코드는 더욱 명확해졌다.

변수나 함수, 클래스 이름은 다음과 같은 굵직한 질문에 모두 답해야 한다.
1. 변수(혹은 함수나 클래스)의 존재 이유는?
2. 수행 기능은?
3. 사용 방법은?

따로 주석이 필요하다면 __의도를 분명히 드러내지 못했다는 말이다.__

<br>

## 2. 그릇된 정보를 피하라

그릇된 단서는 코드 의미를 흐린다.

~~~java
  int hp;
~~~
hp는 직각삼각형의 빗변(hypotenuse)를 의미할 수도,<br>
유닉스 플랫폼이나 유닉스 변종을 가리키는 이름일 수도 있다.

__즉, 프로그래머에게 그릇된 단서를 남길 수 있는 이름이다.__

~~~java
  int a = l;
  if ( O == l)
  a = Ol;
  else
  l = 01;
~~~
영어 대문자 O는 숫자 0와 유사하며, <br>
영어 소문자 l은 숫자 1과 유사하다.

위 코드에서 어떤 것이 알파벳이고, 어떤 것지 숫자인지 확실히 알 수 있는가? <br>
글꼴을 바꿔 차이를 드러낼 수 있는 해결책이 있지만, 이름만 바꾸면 쉽게 문제를 해결할 수 있다.

<br>

## 3. 의미 있게 구분하라

프로그래밍은 동일한 범위 안에서 다른 두 개념에 같은 이름을 사용하지 못한다. <br>
컴파일러를 통과할지라도 연속된 숫자를 덧붙이거나 __불용어(noise word)__ 를 추가 하는 방식은 적절하지 못한다. <br>

##### 불용어는 프로그래밍에서 변수, 함수, 클래스 등의 이름에 포함되어 있으나, 실제로는 아무런 의미를 전달하지 않는 단어들을 의미한다.


__이름이 달라야 한다면 의미도 달라져야 한다.__

~~~java
getActiveAccount();
getActiveAccounts();
getActiveAccountInfo();
~~~
3개의 함수가 있다면 프로그래머는 어느 함수를 호출할지 어떻게 알 수 있을까?

~~~java
// 불용어 사용 예시
int thePriceOfProduct = 100;

// 개선된 코드
int price = 100;
~~~
위의 예시에서 thePriceOfProduct는 __the__ 와 __OfProduct__ 가 불용어이다. <br>
__price만으로도 충분히 의미를 전달할 수 있다.__

<br>

## 4. 발음하기 쉬운 이름을 사용하라
~~~java
// generate date, year, month, day, hour, minute, second
  genymdhms
~~~
위의 단어를 발음해보자. <br>
누군가는 __"젠 와이 엠 디 에이취 엠 에스"__ 라고 부르겠지만, <br>
다른 누군가는 __"젠 야 무다 힘즈"__ 라고 읽을 수도 있다.


~~~java
class DtaRcrd102 {
  private Date genymdhms;
  private Date modymdhms;
  private final String pszqint = "102";
  /* ... */
}
~~~

~~~java
class Customer {
  private Date generationTimestamp;
  private Date modificationTimestamp;
  private final String recordId = "102";
  /* ... */
}
~~~

위 두 코드를 비교해보자. <br>
둘째 코드는 지적인 대화가 가능해진다.

<br>

## 5. 검색하기 쉬운 이름을 사용하라

문자 하나를 사용하는 이름과 상수는 텍스트 코드에서 쉽게 눈에 띄지 않는다는 문제점이 있다.
MAX_CLASSES_PER_STUDENT는 grep으로 찾기가 쉽지만, 숫자 7이나 e라는 문자는 검색이 어려운 탓에 변수 이름으로 적합하지 못하다. 의도와 다른 경우가 모두 검색되기 때문이다.

~~~java
for (int j=0; j<34; j++) {
  s += (t[j]*4/5);
}
~~~

~~~java
int realDaysPerIdealDay = 4;
const int WORK_DAYS_PER_WEEK = 5;
int sum = 0;
for (int j=0; j < NUMBER_OF_TASKS; j++) {
  int realTaskDays = taskEstimate[j] * realDaysPerIdealDay;
  int realTaskWeeks = (realTaskDays / WORK_DAYS_PER_WEEK);
  sum += realTaskWeeks;
}
~~~
위 두 예제를 비교해보자.
위 코드에서 sum이 별로 유용하진 않으나 최소한 검색이 가능하다.
이름을 의미있게 지으면 함수가 길어진다는 단점이 생기지만, WORK_DAYS_PER_WEEK를 찾기가 얼마나 쉬운지 생각해보라.

__이름 길이는 범위 크기에 비례해야 한다.__

<br>

## 6. 인코딩을 피하라

프로그래밍에서 “인코딩”은 **변수, 함수, 클래스 등의 이름에 특정 의미나 정보를 암호처럼 포함하는 것**을 의미한다. <br>
즉, 인코딩을 피하라는 말은 __코드의 이름을 지을 때 불필요한 접두사나 약어, 데이터 타입 등을 포함하지 말고,__ 그 자체로 의미를 명확하게 전달하는 이름을 사용하라는 뜻이다.

이름 길이가 제한된 언어를 사용하던 옛날에는 어쩔 수 없이 인코딩한 이름을 사용할 수 밖에 없었다. <br>
당시는 컴파일러가 타입을 점검하지 않았으므로 프로그래머에게 타입을 기억할 단서가 필요했고, 이를 위해 헝가리안 표기법을 주로 사용했다.

_헝가리안 표기법_

헝가리안 표기법은	변수명에 데이터 타입을 포함하는 방식으로 예시는 다음과 같다.
~~~java
  int strName, iAge, arrItems;
~~~
더 이상 자바 프로그래머는 변수 이름에 타입을 인코딩할 필요가 없다. <br>
IDE는 코드를 컴파일하지 않고도 타입 오류를 감지할 정도로 발전했다.

따라서 이제는 헝가리식 표기법이나 기타 인코딩 방식이 오히려 방해가 될 뿐이다. <br>
변수, 함수, 클래스 이름이나 타입을 바꾸기가 어려워지며, 읽기도 어려워진다.

*변수 접두어*

이제는 변수에 m_ (멤버 변수), g_ (글로벌 변수) 등. 접두어를 붙일 필요도 없다.

하지만 때로는 인코딩이 필요한 경우도 있다. <br>
예를 들어 도형을 생성하는 ABSTRACT FACTORY를 구현한다고 가정하자.

이 팩토리는 인터페이스 클래스(interface class)이고, 구현은 구체 클래스(concrete class)에서 한다. <br>
그렇다면 두 클래스 이름을 어떻게 지어야 좋을까? **IShapeFactory**와 **ShapeFactory**?
저자는 개인적으로 인터페이스 이름은 접두어를 붙이지 않는 편이 좋다고 생각한다고 했다. <br>

**인터페이스 클래스 이름과 구현 클래스 이름 중 하나를 인코딩해야 한다면 구현 클래스 이름을 택하자.**
**ShapeFacotryImp나** **CShapeFactory**가 IShapeFactory보다 좋다.

<br>

## 7. 자신의 기억력을 자랑하지 마라

코드를 읽는 사람이 코드를 작성한 사람처럼 모든 세부 사항을 기억하거나 이해해야만 코드를 이해할 수 있게 작성하지 마라.

문자 하나만 사용하는 변수 이름은 문제가 있다. <br>
루프에서 반복 횟수를 세는 변수 i, j, k는 괜찮다. **(l은 절대 안 된다!)** <br>
루프에서 반복 횟수 변수는 전통적으로 한 글자를 사용하기 떄문이다. 그 외에는 대부분 적절하지 못하다.


### 클래스 이름
**클래스 이름과 객체 이름은 명사나 명사구가 적합하다. 동사는 사용하지 않는다.**

#### 좋은 예
- Customer
- WikiPage
- Account
- AddressParser

#### 나쁜 예
- Manager
- Processor
- Data
- Info

### 메서드 이름
**메서드 이름은 동사나 동사구가 적합하다.**

#### 좋은 예
- postPayment
- deletePage
- save

<br>

접근자(Accessor), 변경자(Mutator), 조건자(Predicate)는 [javabean 표준](https://www.oracle.com/java/technologies/javase/javabeans-spec.html)에 따라 값 앞에 get, set, is를 붙인다.
~~~java
string name = employee.getName();
customer.setName("mike");
if (paycheck.isPosted())...
~~~

생성자(Constructor)를 중복 정의(overload)할 때는 정적 팩토리 메서드를 사용한다. <br>
메서드는 인수를 설명하는 이름을 사용한다.

예를 들어

~~~Java
Complex fulcrumPoint = Complex.FromRealNumber(23.0);
~~~

~~~Java
Complex fulcrumPoint = new Complex(23.0);
~~~

위 코드가 아래 코드보다 좋다.

<br>

## 8. 기발한 이름은 피하라

**HolyHandGrenade**라는 함수는 <<몬티 파이썬>>에 나오는 가상의 무기(수류탄)을 의미하며, <br>
기발한 이름이지만 이를 알지 못하는 사람은 이름을 기억하기 어려울 것이다. <br>
따라서 **DeleteItems**가 더 좋다.

kill() 대신 whack()이라 부르거나, Abort() 대신 eatMyShort()라 부르는 등 <br>
**특정 문화에서만 사용하는 농담은 피하고 의도를 분명하고 솔직하게 표현하라.**

<br>

## 9. 한 개념에 한 단어를 사용하라

추상적인 개념 하나에 단어 하나를 선택해 이를 고수해야 한다. <br>
똑같은 메서드를 클래스마다 fetch, retrieve, get으로 제각각 부르면 혼란스러울 것이다. <br>
메서드 이름은 독자적이고 일관적이어야 주석을 뒤져보지 않고도 프로그래머가 올바른 메서드를 선택할 수 있을 것이다. <br>

이름이 다르면 코드를 읽는 사람은 당연히 클래스도 다르고 타입도 다르다 생각할 것이다. <br>
**일관성 있는 어휘는 코드를 사용할 프로그래머가 반갑게 여길 선물이다.**

<br>

## 10. 말장난을 하지 마라

**한 단어를 두 가지 목적으로 사용하지 마라.** <br>
다른 개념에 같은 단어를 사용한다면 그것은 말장난에 불과하다.

모든 add 메서드의 매개변수와 반환값이 의미적으로 똑같다면 여러 클래스에 add라는 메서드를 만들어도 괜찮다. <br>
만약 기존에 구현한 add 메서드는 모두가 기존 값 두 개를 더하거나 이어서 새로운 값을 만든다고 가정하자. <br> 
새로 작성하는 메서드는 집함에 값 하나를 추가한다. 이 메서드를 add라 불러도 괜찮을까? <br>

**새 메서드는 기존 add와 맥락이 다르므로 insert나 append라는 이름이 적당하다.**

## 11. 해법 영역에서 가져온 이름을 사용하라

코드를 읽는 사람도 프로그래머이다. <br>
따라서 전산 용어, 알고리즘 이름, 패턴 이름, 수학 용어 등을 사용해도 괜찮다.


**1. 컬렉션 관련 용어**
- list, queue, stack, map

**2. 디자인 패턴 관련 용어**
- Factory, Observer, Decorator

**3. 프레임워크나 라이브러리 관련 용어**
- Controller, Service, Repository

다음 용어들은 프로그래머라면 이해하기 쉬울 것이다. 기술 개념에는 기술 이름이 가장 적합한 선택이다.

<br>

## 12. 문제 영역에서 가져온 이름을 사용하라

만약 적절한 '프로그래머 용어'가 없다면 문제 영역(domain)에서 이름을 가져온다. <br>
예를 들어 금융 소프트웨어에서는 금융 용어가, 의료 소프트웨어에서는 의료 용어가 문제 영역의 용어에 해당된다.

만약 문제 영역 개념과 관련이 깊은 코드라면 문제 영역에서 이름을 가져와야 한다. <br>
문제 영역에서 이름을 가져올 경우 코드를 보수하는 프로그래머가 분야 전문가에게 의미를 물어 용어를 파악할 수 있다.

<br>

## 13. 의미 있는 맥락을 추가하라

스스로 의미가 분명한 이름이 없는 것은 아니지만 대다수 이름은 그렇지 못하다. <br>
따라서 **클래스, 함수, 이름 공간에 넣어 맥락을 부여해야 한다.** <br>
**모든 방법이 실패하면 마지막 수단으로 접두어를 붙인다.** <br>
~~~java
  String firstName;
  String lastName;
  String street;
  int houseNumber;
  String city;
  String state;
  int zipcode;
~~~
만약 이런 변수가 있다고 가정하자.
변수를 쭉 훑어보면 주소라는 사실을 금방 알아챌 수 있지만 <br>
어느 메서드가 state라는 변수 하나만 사용한다면 변수 state가 주소 일부라는 사실을 금방 알아챌 수 있을까?

addr라는 접두어를 추가해 **addrFirstName**, **addrLastName**, **addrState**라 쓰면 맥락이 좀 더 분명해진다.

물론 Address라는 클래스를 생성하면 더 좋다.

<br>

## 14. 불필요한 맥락을 없애라

'고급 휘발유 충전소(Gas Station Deluxe)'라는 애플리케이션을 만들 때 모든 클래스 이름을 GSD로 시작하는 것이 바람직할까? <br>
GSD 회계 모듈에 MailingAddress 클래스를 추가하면서 GSDAccountAddress로 이름을 바꿨다면, <br>
나중에 다른 고객 관리 프로그램에서 고객 주소가 필요하다면 GSDAccountAddress 클래스를 사용할까? <br>

**이름 17자 중 10자는 중복이거나 부적절하다.**

일반적으로 짧은 이름이 긴 이름보다 좋지만, 이는 의미가 분명한 경우에 한해서다. <br>
**이름에 불필요한 맥락을 추가하지 않도록 주의해야 한다.**

