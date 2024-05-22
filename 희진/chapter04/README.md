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

**_주절거리는 주석_**

**_같은 이야기를 중복하는 주석_**

**_오해할 여지가 있는 주석_**

**_의무적으로 다는 주석_**

**_이력을 기록하는 주석_**

**_있으나 마나 한 주석_**

**_무서운 잡음_**

**_함수나 변수로 표현할 수 있다면 주석을 달지 마라_**

**_위치를 표시하는 주석_**

**_닫는 괄호에 다는 주석_**

**_공로를 돌리거나 저자를 표시하는 주석_**

**_주석으로 처리한 코드_**

**_HTML 주석_**

**_전역 정보_**

**_너무 많은 정보_**

**_모호한 관계_**

**_함수 헤더_**

**_비공개 코드에서 Javadocs_**
