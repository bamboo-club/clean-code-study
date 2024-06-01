# Chapter 4 주석

> ### 나쁜 코드에 주석을 달지 마라. 새로 짜라. <br>
>
> \- 브라이언 W. 커니핸, P.J. 플라우거

우리는 코드로 의도를 표현하지 못해 주석을 사용한다. <br>
그러므로 주석이 필요한 상황에 처하면 `코드로 의도를 표현할 방법`은 없을지 고민해야 한다.

코드는 변화하고 진화하기 때문에 주석이 코드를 따라가지 못한다. <br>
**그러므로 우리는 주석을 가능한 줄이도록 꾸준히 노력해야 한다.**

<br>

## 1. 주석은 나쁜 코드를 보완하지 못한다

코드에 주석을 추가하는 일반적인 이유는 코드 품질이 나쁘기 때문이다. <br>
**표현력이 풍부하고 갈끔하며 주석이 거의 없는 코드가 복잡하고 어수선하며 주석이 많이 달린 코드보다 훨씬 좋다.**

<br>

## 2. 코드로 의도를 표현하라 !

코드만으로 의도를 설명하기 어려운 경우가 존재하지만, 이를 코드는 훌륭한 수단이 아니라는 의미로 해석하면 안 된다.

```java
// 직원에게 복지 혜택을 받을 자격이 있는지 검사한다.
if ((employee.flags & HOURLY_FLAG) && (employee.age > 65))
```

```java
if (employee.isEligibleForFullBenefits())
```

두 코드를 비교해보자. <br>

몇 초만 더 생각하면 코드로 대다수 의도를 표현할 수 있으며, <br>
많은 경우 **주석으로 달려는 설명을 함수로 만들어 표현해도 충분하다.**

<br>

## 3. 좋은 주석

필요하거나 유익한 주석도 몇 가지 존재한다. <br>
하지만 정말 좋은 주석은 `주석을 달지 않을 방법을 찾아낸 주석`이라는 사실을 명심하기 바란다.

### **_법적인 주석_**

각 소스 파일 첫머리에 주석으로 들어가는 저작권 정보와 소유권 정보는 필요하고도 타당하다.

```java
// Copyright (C) 2003,2004,2005 by Object Mentor, Inc. All rights reserved.
// GNU General Public License 버전 2 이상을 따르는 조건으로 배포한다.
```

### **_정보를 제공하는 주석_**

때로는 기본적인 정보를 주석으로 제공하면 편리하다. <br>

```java
// 테스트 중인 Responder 인스턴스를 반환한다.
protected abstract Resonder responderInstance();
```

```JAVA
// kk:mm:ss EEE, MMM dd, yyyy 형식이다.
Pattern timeMatcher = Pattern.compile("\\d*:\\d*:\\d* \\w*, \\w* \\d*, \\d*");
```

가능하다면 첫 번째 코드는 함수 이름을 `responderBeingTested로`, 두 번째 코드는 `시각과 날짜를 변환하는 클래스`를 만들어 <br> 코드를 옮겨주면 주석이 필요 없어 더 좋을 것이다.

### **_의도를 설명하는 주석_**

때때로 주석은 구현을 이해하게 도와주는 선을 넘어 결정에 깔린 의도까지 설명한다.

```java
public int compareTo(Object o) {
    if(o instanceof WikiPagePath) {
        WikiPagePath p = (WikiPagePath) o;

        String compressedName = String Util.join(names, "");
        String compressedArgumentName = StringUtil.join(p.names, "");
        return compressedName.compareTo(compressedArgumentName);
    }
    return 1; // 오른쪽 유형이므로 정렬 순위가 더 높다.
}
```

아래는 더 나은 예제다. 저자의 의도가 분명히 드러나고 있다.

```java
// 스레드를 대량 생성하는 방법으로 어떻게든 경쟁 조건을 만들려 시도한다.
for (int i = 0; i > 2500; i++) {
    WidgetBuilderThread widgetBuilderThread =
        new WidgetBuilderThread(widgetBuilder, text, parent, failFlag);
    Thread thread = new Thread(widgetBuilderThread);
    thread.start();
}
```

### **_의미를 명료하게 밝히는 주석_**

일반적으로 인수나 반환값 자체를 명확하게 만들면 더 좋겠지만, <br>
인수나 반환값이 변경하지 못하는 코드에 속한다면 `의미를 명료하게 밝히는 주석`이 유용하다.

```java
public void testCompareTo() throws Exception {
    WikiPagePath a = PathParser.parse("PageA");
    WikiPagePath ab = PathParser.parse("PageA.PageB");
    WikiPagePath b = PathParser.parse("PageB");
    WikiPagePath ba = PathParser.parse("PageB.PageA");
    WikiPagePath aa = PathParser.parse("PageA.PageA");
    WikiPagePath bb = PathParser.parse("PageB.PageB");

    assertTrue(a.compareTo(a) == 0); // a == a
    assertTrue(a.compareTo(b) != 0); // a != b
    assertTrue(ab.compareTo(ab) == 0); // ab == ab
    assertTrue(a.compareTo(b) == -1); // a < b
    assertTrue(aa.compareTo(ab) == -1); // aa < ab
    assertTrue(ba.compareTo(bb) == -1); // ba < bb
    assertTrue(b.compareTo(a) == 1); // b > a
    assertTrue(ab.compareTo(aa) == 1); // ab > aa
    assertTrue(bb.compareTo(ba) == 1); // bb > ba
}
```

하지만 해당 코드는 그릇된 주석을 달아놓을 취험이 상당히 높기 때문에 위와 같은 주석을 달 때는 <br>
더 나은 방법이 없는지 고민하고 정확히 달도록 주의해야 한다.

### **_결과를 경고하는 주석_**

때로는 다른 프로그래머에게 결과를 경고할 목적으로 주석을 사용한다. <br>

```java
// 여유 시간이 충분하지 않다면 실행하지 마십시오.
public void _testWithReallyBigFile() {
	writeLinesToFile(10000000);

	response.setBody(testFile);
	response.readyToSend(this);
	String responseString = output.toString();
	assertSubString("Content-Length: 1000000000", responseString);
	assertTrue(bytesSent > 1000000000);
}
```

이로인해 프로그래머가 실수를 면하거나 시간이 많이 소요되는 것을 막을 수 있다.

### **_TODO 주석_**

```java
// TODO-MdM 현재 필요하지 않다.
// 체크아웃 모델을 도입하면 함수가 필요 없다.
protected VersionInfo makeVersion() throws Exception {
    return null;
}
```

TODO 주석은 프로그래머가 `필요하다 여기지만 당장 구현하기 어려운 업무`를 기술한다. <br>
하지만 TODO로 떡칠한 코드는 바람직하지 않기 때문에 **주기적으로 TODO 주석을 점검해 없애도 괜찮은 주석은 없애**라고 권한다.

### **_중요성을 강조하는 주석_**

대수롭지 않다고 여겨질 무언가의 중요성을 강조하기 위해서도 주석을 사용한다.

```java
String listItemContent = match.group(3).trim();
// 여기서 trim은 정말 중요하다. trim 함수는 문자열에서 시작 공백을 제거한다.
// 문자열에 시작 공백이 있으면 다른 문자열로 인식되기 때문이다.
new ListItemWidget(this, listItemContent, this.level + 1);
return buildList(text.substring(match.end()));
```

### **_공개 API에서 Javadocs_**

설명이 잘 된 공개 API는 유용하며 표준 자바 라이브러리에서 사용한 Javadocs가 좋은 예시다. <br>
하지만 Javadocs 역시 여느 주석과 마찬가지로 **프로그래머를 오도하거나, 잘못 위치하거나, 그릇된 정보를 전달할 가능성이 존재**한다.

<br>

## 4. 나쁜 주석

대다수 주석은 허술한 코드를 지탱하거나, 엉성한 코드를 변명하거나, 미숙한 결정을 합리화하는 등 프로그래머가 주절거리는 독백에서 크게 벗어나지 못한다.

### **_주절거리는 주석_**

주석을 달기로 결정했다면 충분한 시간을 들여 최고의 주석을 달도록 노력해야 한다.

```java
public void loadProperties() {
    try {
    	String propertiesPath = propertiesLocation + "/" + PROPERTIES_FILE;
    	FileInputStream propertiesStream = new FileInputStream(propertiesPath);
    	loadedProperties.load(propertiesStream);
    } catch (IOException e) {
    	// 속성 파일이 없다면 기본값을 모두 메모리로 읽어 들였다는 의미다.
    }
}
```

위 catch 블록에 있는 주석은 다른 사람들에게 의미가 전해지지 않는다. <br>
주석을 제대로 달았다면 상당히 유용했을 코드이지만, 그냥 주절거려 놓았기에 판독이 불가능하다.

**이해가 안 되어 다른 모듈까지 뒤져야 하는 주석은 독자와 제대로 소통하지 못하는 주석이다.**

### **_같은 이야기를 중복하는 주석_**

```java
// this.closed가 true일 때 반환되는 유틸리티 메서드다.
// 타임아웃에 도달하면 예외를 던진다.
public synchronized void waitForClose(final long timeoutMillis) throws Exception {
    if (!closed) {
        wait(timeoutMillis);
        if (!closed) {
            throw new Exception("MockResponseSender could not be closed");
        }
    }
}
```

위 예시는 헤더에 달린 주석이 같은 코드 내용을 그대로 중복한다. <br>
코드 자체가 이미 명확하게 설명하고 있는 내용을 **주석으로 반복해서 설명하는 것은 코드의 가독성을 오히려 해칠 수 있다.**

### **_오해할 여지가 있는 주석_**

```java
// 이메일 형식을 검증합니다.
public boolean validateEmail(String email) {
    return email.contains("@");
}
```

해당 코드에는 이메일 형식을 검증한다고 설명하지만, 실제로는 `@` 문자가 포함되어 있는지만 확인한다. <br>
만약 해당 파라미터로 넘어온 값이 test@email 이라면? <br>
유효성 검증을 통과할 것이고 더 큰 참사를 불러 일으킬 수 있을 것이다.

### **_의무적으로 다는 주석_**

```java
/**
 * 이 클래스는 간단한 계산기입니다.
 * 더하기와 빼기 기능을 제공합니다.
 */
public class Calculator {

    /**
     * 두 수를 더합니다.
     *
     * @param a 첫 번째 숫자
     * @param b 두 번째 숫자
     * @return 두 숫자의 합
     */
    public int add(int a, int b) {
        return a + b;
    }

    /**
     * 두 수를 뺍니다.
     *
     * @param a 첫 번째 숫자
     * @param b 두 번째 숫자
     * @return 두 숫자의 차이
     */
    public int subtract(int a, int b) {
        return a - b;
    }
}
```

모든 함수에 Javadocs를 달거나 모든 변수에 주석을 달아야 한다는 규칙은 어리석기 그지없다. <br>
이런 주석은 코드를 복잡하게 만들며, 거짓말을 퍼뜨리고, 혼동과 무질서를 초래한다.

### **_이력을 기록하는 주석_**

예전에는 **소스 코드 관리 시스템이 없었기 때문에** 모든 모듈 첫머리에 변경 이력을 기록하고 관리하는 관례가 바람직했다. <br>
하지만 이제는 혼란만 가중할 뿐이다. 완전히 제거하는 편이 좋다. <br>

```java
/**
 * 변경 이력 (11-Oct-2001부터)
 * --------------------------------
 * 11-Oct-2001 : 클래스를 다시 정리하고 새로운 패키지인 com.jrefinery.date로 옮겼다 (DG);
 * 05-Nov-2001 : getDescription() 메서드를 추가했으며 NotableDate class를 제거했다 (DG);
 * 12-Nov-2001 : IBD가 setDescription() 메서드를 요구한다 NotableDate 클래스를 없앴다 (DG);
 *               getFollowingDayOfWeek(), getNearestDayOfWeek()를 변경해 버그를 수정했다 (DG);
 * 05-Dec-2001 : SpreadsheetDate 클래스에 존재하는 버그를 수정했다 (DG);
 * 29-May-2002 : month 상수를 독자적인 인터페이스로 옮겼다 (MonthConstants) (DG);
 */
```

### **_있으나 마나 한 주석_**

```java
int count = 10; // count를 10으로 설정
```

```java
// 두 수를 더한다
int sum = a + b;
```

위 코드는 너무 당연한 사실을 언급하며 새로운 정보를 제공하지 못하고 있다. <br>
위와 같은 주석은 개발자가 주석을 무시하는 습관에 빠질 수 있다. <br>
있으나 마나 한 주석을 달려는 유혹에서 벗어나 코드를 정리하자.

### **_무서운 잡음_**

때로는 Javadocs도 잡음이다.

```java
/** The name. */
private String name;

/** The version. */
private String version;

/** The licenceName. */
private String licenceName;

/** The version. */
private String info;
```

위 주석의 잘라서 붙여넣기 오류가 보이는가? <br>
단지 문서를 제공해야 한다는 잘못된 욕심으로 잡음이 탄생했으며, 독자는 여기서 이익을 얻을 수 없다.

### **_함수나 변수로 표현할 수 있다면 주석을 달지 마라_**

```java
// 잔액 목록 <smodule>에 속하는 모듈이 우리가 속한 하위 시스템에 의존하는가?
if (smodule.getDependSubSystems().contains(subSysMod.getSubSystem()))
```

위 코드에서 주석을 없애고 다시 표현하면 다음과 같다.

```java
ArrayList moduleDependees = smodule.getDependSubsystems();
String ourSubSystem = subSysMod.getSubSystem();
if (moduleDependees.contains(ourSubSystem))
```

위와 같이 주석이 필요하지 않도록 코드를 개션하는 것이 더 좋다.

### **_위치를 표시하는 주석_**

```java
// Actions //////////////////////////
```

프로그래머는 때때로 코드의 특정 부분을 찾기 쉽게 하기위해 위치를 표시하는 주석을 사용한다. <br>
하지만 일반적으로 위와 같은 주석은 가독성만 낮추므로 제거해야 한다. <br>
**특히 뒷부분에 슬래시(/)로 이어지는 잡음은 제거하는 편이 좋다.**

### **_닫는 괄호에 다는 주석_**

```java
try {
	while ((line = in.readLine()) != null) {
    	...
    } // while
} // try
catch (IOException e) {
	...
} // catch
```

위처럼 때로는 프로그래머들이 닫는 괄호에 특수한 주석을 달아놓는 경우가 있다. <br>
중첩이 심하고 장황한 함수라면 의미가 있을지 모르지만, 작고 캡슐화된 함수에는 잡음일 뿐이다. <br>

**닫는 괄호에 주석을 다는 것 대신 함수를 줄이려 시도하자.**

### **_공로를 돌리거나 저자를 표시하는 주석_**

```java
/* 릭이 추가함 */
```

다른 사람들이 코드에 관해 누구한테 물어볼지 아니까 위와 같은 주석이 유용하다 여길 수도 있지만, <br>
현실적으로 이런 주석은 **오랫동안 코드에 방치되어 점차 부정확하고 쓸모없는 정보**로 변하기 쉽다. <br>
위와 같은 정보는 `소스 코드 관리 시스템`에 저장하는 것이 좋다.

### **_주석으로 처리한 코드_**

```java
InputStreamResponse response = new InputStreamResponse();
// InputSTream resultsTream = formatter.getResultStream();
// StreamReader reader = new StreamReader(resultsStream);
```

주석으로 처리된 코드는 이유가 있어 남겨놓았으리라고, 중요하니까 지우면 안 된다고 생각해서 다른 사람들이 지우기를 주저한다. <br>
우리는 오래전부터 우수한 소스 코드 관리 시스템을 사용해왔기 때문에 이제는 주석으로 처리할 필요가 없다. <br>

그냥 코드를 삭제하라. 잃어버릴 염려는 없다.

### **_HTML 주석_**

```java
/**
 * 적합성 테스트를 수행하기 위한 과업
 * 이 과업은 적합성 테스트를 수행해 결과를 출력한다.
 * <p/>
 * <pre>
 * 용법:
 * &lt;taskdef name=&quot;execute-fitnesse-tests&quot; classname=&quot;fitnesse.ant.ExecuteFitnesseTestsTask&quot; classpathref=&quot;classpath&quot; /&gt;
 * 또는
 * &lt;taskdef classpathref=&quot;classpath&quot; resource=&quot;tasks.properties&quot; /&gt
 * </p>
 * ...
 */
```

HTML 주석은 주석을 읽기 쉬워야 하는 편집기/IDE에서조차 읽기가 어렵다. <br>
Javadocs와 같은 도구로 주석을 뽑아 웹 페이지에 올리려고 했다면 **주석에 HTML 태그를 삽입해야 하는 책임은 프로그래머가 아닌 도구가 져야 한다.**

### **_전역 정보_**

```java
/**
* 적합성 테스트가 동작하는 포트: 기본값은 <b>8082</b>;
*
* @param fitnessePort
*/
public void setFitnessPort(int fitnessePort) {
	this.fitnessePort = firnessePort;
}
```

**주석을 달아야 한다면 근처에 있는 코드만 기술하라.** <br>
위 코드는 포트 기본값을 전혀 통제하지 못한다. 즉 바로 **아래 함수가 아니라 시스템 어딘가에 있는 다른 함수를 설명**하고 있다는 것이다. <br>
만약 포트 기본값을 설정하는 코드가 변경되어도 위 주석이 변경될 것이라는 보장은 전혀 없다.

### **_너무 많은 정보_**

주석에다 흥미로운 역사나 관련 없는 정보를 장황하게 늘어놓지 마라. <br>

```java
/*
  RFC 2045.- Multipurpose Internet Mail Extensions (MIME)
  1부: 인터넷 메시지 본체 형식
  6.8절. Base64 내용 전송 인코딩
  인코딩 과정은 입력 비트 중 24비트그룹을 인코딩된 4글자로 구성된
  출력 문자열로 표현한다. 왼쪽에서 오른쪽으로 진행해가며, 3개를 묶어 8비트 입력
  그룹을 형성한다. ..
  ...
*/
```

위 주석은 RFC 번호를 제외하면 독자에게 불필요하며 불가사의한 정보일 뿐이다.

### **_모호한 관계_**

주석과 주석이 설명하는 코드는 둘 사이 관계가 명백해야 한다.

```java
/*
* 모든 픽셀을 담을 만큼 충분한 배열로 시작한다(여기에 필터 바이트를 더한다).
* 그리고 헤더 정보를 위해 200바이트를 더한다.
*/
this.pngBytes = new byte[((this.width + 1) * this.height * 3) + 200];
```

다음 코드는 독자가 주석과 코드를 읽어봐도 코드가 무엇을 하는지, 각 요소가 어떻게 상호작용하는지 파악하기 어렵지 않은가? <br>
주석 자체가 다시 설명을 요구하고 있다는 것은 명확하게 설명하지 못했음을 의미한다.

### **_함수 헤더_**

짦은 함수는 긴 설명이 필요 없다. <br> 짧고 한 가지만 수행하며 이름을 잘 붙인 함수가 주석으로 헤더를 추가한 함수보다 훨씬 좋다.

### **_비공개 코드에서 Javadocs_**

공개 API는 Javadocs가 유용하지만 **공개하지 않을 코드라면 Javadocs는 쓸모가 없다.** <br>
시스템 내부에 속한 클래스와 함수에 Javadocs를 생성할 필요는 없다. <br>
유용하지 않을 뿐만 아니라 Javadocs 주석이 요구하는 형식으로 인해 코드만 보기 싫고 산만해질 뿐이다.
