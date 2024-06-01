# Chapter 5 형식 맞추기

프로그래머라면 형식을 깔끔하게 맞춰 코드를 짜야 한다. <br>
코드 형식을 맞추기 위한 간단한 규칙을 정하고 그 규칙을 착실히 따라야 하며, 팀으로 일한다면 팀이 합의해 규칙을 정하고 모두가 그 규칙을 따라야 한다. <br>
필요하다면 규칙을 자동으로 적용하는 `도구`를 활용한다.

## 형식을 맞추는 목적

**코드 형식은 매우 중요하다.** 너무나도 중요하므로 융통성 없이 맹목적으로 따르면 안 된다. <br>
오랜 시간이 지나 원래 코드의 흔적을 더 이상 찾아보기 어려울 정도로 코드가 바뀌어도 맨 처음 잡아놓은 `구현 스타일`과 `가독성 수준`은 **유지보수 용이성과 확장성에 계속 영향을 미친다.** <br>
그렇다면 원활한 소통을 장려하는 코드 형식은 무엇일까?

## 1. 적절한 행 길이를 유지하라

소스 코드는 얼마나 길어야 적당할까? <br>
500줄을 넘지 않고 대부분 200줄 정도인 파일로도 커다란 시스템을 구축할 수 있다. <br>
(실제로 JUnit, FitNesse, Time and Money는 500줄을 넘어가는 파일이 없으며 대다수가 200줄 미만이다.)

반드시 지킬 엄격한 규칙은 아니지만 **일반적으로 큰 파일보다 작은 파일이 이해하기 쉽다.**

### **_신문 기사처럼 작성하라_**

아주 좋은 신문 기사를 떠올려보면 독자는 위에서 아래로 읽고, 최상단에 기사를 요약하는 표제가 나오며 아래로 내려갈수록 세세한 사실이 조금씩 드러난다. <br>

소스 파일도 신문 기사와 비슷하게 작성하자.

이름은 간단하면서도 설명이 가능하게 짓자. 이름만 보고도 올바른 모듈을 살펴보고 있는지 아닌지를 판단할 정도로 신경써서 지어야 한다. <br>
소스 파일 첫 부분은 고차원 개념과 알고리즘을 설명한다. <br>
아래로 내려갈수록 의도를 세세하게 묘사하며, 마지막에는 가장 저차원 함수와 세부 내역이 나와야 한다.

### **_개념은 빈 행으로 분리하라_**

소스 코드에서 일련의 행 묶음은 완결된 생각 하나를 표현하기 때문에 코드 블록 사이에는 빈 행을 넣어 분리해야 한다. <br>

```java
public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''",
		Pattern.MULTILINE + Pattern.DOTALL
	);

	public BoldWidget(ParentWidget parent, String text) throws Exception {
		super(parent);
		Matcher match = pattern.matcher(text);
		match.find();
		addChildWidgets(match.group(1));
	}

	public String render() throws Exception {
		StringBuffer html = new StringBuffer("<b>");
		html.append(childHtml()).append("</b>");
		return html.toString();
	}
}
```

```java
public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''",
		Pattern.MULTILINE + Pattern.DOTALL);
	public BoldWidget(ParentWidget parent, String text) throws Exception {
		super(parent);
		Matcher match = pattern.matcher(text); match.find();
		addChildWidgets(match.group(1));}
	public String render() throws Exception {
		StringBuffer html = new StringBuffer("<b>");
		html.append(childHtml()).append("</b>");
		return html.toString();
	}
}
```

위의 소스 코드와 아래의 소스 코드는 단지 줄바꿈만 다를 뿐인데 위 코드는 행 묶음이 분리되어 보이지만, 아래 코드는 전체가 한 덩어리로 보인다. <br>
**빈 행만 빼도 코드 가독성이 현저하게 떨어지게 된다.**

### **_세로 밀집도_**

줄바꿈이 개념을 분리한다면 세로 밀집도는 연관성을 의미한다. <br>
즉, 서로 밀접한 코드 행은 세로로 가까이 놓여야 한다는 뜻이다.

```java
public class ReporterConfig {
	/**
	* 리포터 리스너의 클래스 이름
	*/
	private String m_className;

	/**
	* 리포터 리스너의 속성
	*/
	private List<Property> m_properties = new ArrayList<Property>();
	public void addProperty(Property property) {
		m_properties.add(property);
    }
}
```

```java
public class ReporterConfig {
	private String m_className;
	private List<Property> m_properties = new ArrayList<Property>();

	public void addProperty(Property property) {
		m_properties.add(property);
	}
}
```

의미없는 주석으로 두 인스턴스 변수를 떨어뜨려 놓은 위 코드보다 아래 코드가 훨씬 더 읽기 쉽고 '한눈'에 들어오는 것을 알 수 있다.

### **_수직 거리_**

서로 밀접한 개념은 세로로 가까이 둬야 한다. <br>
물론 두 개념이 서로 다른 파일에 속한다면 규칙이 통하지 않는다. 하지만 타당한 근거가 없다면 서로 밀접한 개념은 한 파일에 속해야 한다. <br>
**이게 바로 protected 변수를 피해야 하는 이유 중 하나다.**

같은 파일에 속할 정도로 밀접한 두 개념은 세로 거리로 연관성을 표현한다. <br>
여기서 연관성이란 `한 개념을 이해하는 데 다른 개념이 중요한 정도`이다. <br>
**연관성이 깊은 두 개념이 멀리 떨어져 있으면 코드를 읽는 사람이 소스 파일과 클래스를 여기저기 뒤지게 된다.**

#### 변수 선언

변수는 `사용하는 위치에 최대한 가까이` 선언한다. <br>
우리가 만든 함수는 매우 짧으므로 **지역 변수는 각 함수 맨 처음에 선언한다.** <br>

#### 인스턴스 변수

반면, 인스턴스 변수는 `클래스 맨 처음`에 선언한다. <br>
변수 간에 세로로 거리를 두지 않는다. 잘 설계한 클래스는 대다수가 **클래스 메서드가 인스턴스 변수를 사용하기 때문**이다. <br>
일반적으로 C++에서는 모든 인스턴스 변수를 클래스 마지막에 선언한다는 가위 규칙(scis-sors rule)을 적용한다. <br>
자바에서는 보통 클래스 맨 처음에 인스턴스 변수를 선언한다. <br>
어느쪽이든 상관 없지만 잘 알려진 위치에 인스턴스 변수를 모은다는 사실이 중요하다. 변수 선언을 어디서 찾을지 모두가 알고 있어야 한다.

#### 종속 함수

한 함수가 다른 함수를 호출한다면 두 함수는 세로로 가까이 배치한다. <br>
또한 가능하다면 호출하는 함수를 호출되는 함수보다 먼저 배치한다. 그러면 프로그램이 자연스럽게 읽힌다. <br>
규칙을 일관적으로 적용한다면 독자는 방금 호출한 함수가 잠시 후에 정의되리라는 사실을 예측한다.

#### 개념적 유사성

개념적인 친화도가 높을수록 코드를 가까이 배치한다. <br>
다음 예시들이 개념적인 친화도가 높다고 할 수 있는 예시이다.

1. 한 함수가 다른 함수를 호출해 생기는 직접적인 종속성
2. 변수와 그 변수를 사용하는 함수
3. 비슷한 동작을 수행하는 일군의 함수

```java
public class Assert {
	static public void assertTrue(String message, boolean condition) {
		if (!condition)
			fail(message);
	}

	static public void assertTrue(boolean condition) {
		assertTrue(null, condition);
	}

	static public void assertFalse(String message, boolean condition) {
		assertTrue(message, !condition);
	}

	static public void assertFalse(boolean condition) {
		assertFalse(null, condition);
	}
...
```

위 함수들은 명명법이 똑같고 기본 기능이 유사하고 간단하다. <br>
서로가 서로를 호출하는 관계는 부차적인 요인이며 종속적인 관계가 없더라도 가까이 배치할 함수들이다.

### **_세로 순서_**

일반적으로 함수 호출 종속성은 아래 방향으로 유지한다. 다시 말해, 호출되는 함수를 호출하는 함수보다 나중에 배치한다. (파스칼, C, C++는 반대) <br>
그러면 소스 코드 모듈이 고차원에서 저차원으로 자연스럽게 내려간다. <br>

신문 기사와 마찬가지로 `가장 중요한 개념을 가장 먼저 표현`한다. <br>
이때 `가장 중요한 개념은 세세한 사항을 최대한 배제`하고 표현한다. `세세항 사항은 가장 마지막에 표현`한다. <br>
그러면 독자가 세세항 사항까지 파고들 필요 없이 소스 파일에서 첫 함수 몇 개만 읽어도 개념을 파악하기 쉬워진다.

## 3. 가로 형식 맞추기

한 행은 가로로 얼마나 길어야 적당할까? 일반적인 프로그램에서 20자에서 60자 사이인 행이 총 행 수의 40%에 달한다. <br>
프로그래머가 명백하게 짧은 행을 선호한다는 뜻이다. <br>

100자나 120자에 달해도 나쁘지 않지만 그 이상은 솔직히 주의부족이다. <br>
요즘은 모니터가 아주 커서 글꼴 크기를 왕창 줄여 200자까지도 한 화면에 들어가게 할 수 있지만 가급적이면 그렇게 하지 말기를 권한다. <br>

필자 개인적으로는 `120자 정도로 행 길이를 제한`한다.

### **_가로 공백과 밀집도_**

가로로는 공백을 사용해 밀접한 개념과 느슨한 개념을 표현한다. <br>

```java
private void measureLine(String line) {
	lineCount++;
	int lineSize = line.length();
	totalChars += lineSize;
	lineWidthHistogram.addLine(lineSize, lineCount);
	recordWidestLine(lineSize);
}
```

대입 연산자(=, +=)를 강조하려고 `앞뒤에 공백`을 줌으로써 왼쪽 요소와 오른쪽 요소가 분명히 나뉜다. <br>
반면, 함수 이름과 이어지는 괄호 사이(lineSize, lineCount)에는 공백을 넣지 않았다. `함수와 인수는 서로 밀접하기 때문`이다. <br>
함수를 호출하는 코드에서 괄호 안 인수끼리는 `쉼표 뒤에 공백`으로 분리함으로써 별개라는 사실을 보여주고 있다. <br>

연산자 우선순위를 강조하기 위해서도 공백을 사용한다.

```java
public class Quadratic {
    public static double root1(double a, double b, double c) {
        double determinant = determinant(a, b, c);
        return (-b + Math.sqrt(determinant)) / (2*a);
    }

    public static double root2(int a, int b, int c) {
        double determinant = determinant(a, b, c);
        return (-b - Math.sqrt(determinant)) / (2*a);
    }

    private static double determinant(double a, double b, double c) {
        return b*b - 4*a*c;
    }
}
```

곱셈은 우선순위가 가장 높기 때문에 승수 사이에는 공백이 없지만, 덧셈과 뺄셈은 우선순위가 곱셈보다 낮기 때문에 항 사이에는 공백이 들어간다. <br>
하지만 코드 형식을 자동으로 맞춰주는 도구의 대다수가 연산자 우선순위를 고려하지 못해 수식에 똑같은 간격을 적용한다. <br>
따라서 위와 같이 공백을 넣어줘도 나중에 도구에서 없애는 경우가 흔하다.

### **_가로 정렬_**

```java
public class FitNesseExpediter implements ResponseSender {
    private   Socket          socket;
    private   InputStream     input;
    private   OutputStream    output;
    private   Request         request;
    private   Response        response;
    private   FitNesseContext context;
    protected long            requestParsingTimeLimit;
    private   long            requestProgress;
    private   long            requestParsingDeadline;
    private   boolean         hasError;

    public FitNesseExpediter(Socket          s,
                             FitNesseContext context) throws Exception
    {
        this.context =            context;
        socket =                  s;
        input =                   s.getInputStream();
        output =                  s.getOutputStream();
        requestParsingTimeLimit = 10000;
    }
}
```

필자는 어셈블리어 프로그래머였던 시절에 특정 구조를 강조하고자 위와 같은 가로 정렬을 사용했지만 별로 유용하지 못하다는 사실을 깨달았다. <br>
위 선언부를 읽다 보면 변수 유형은 무시하고 변수 이름부터 읽게 되며, 위 할당문도 할당 연산자는 보이지 않고 오른쪽 피연산자에만 눈이 간다. <br>
설상가상 코드 형식을 자동으로 맞춰주는 도구는 대다수가 위와 같은 정렬을 무시한다. <br>

```java
public class FitNesseExpediter implements ResponseSender {
    private Socket socket;
    private InputStream input;
    private OutputStream output;
    private Request request;
    private Response response;
    private FitNesseContext context;
    protected long requestParsingTimeLimit;
    private long requestProgress;
    private long requestParsingDeadline;
    private boolean hasError;

    public FitNesseExpediter(Socket s, FitNesseContext context) throws Exception {
        this.context = context;
        socket = s;
        input = s.getInputStream();
        output = s.getOutputStream();
        requestParsingTimeLimit = 10000;
    }
}
```

위 코드처럼 정렬하지 않으면 오히려 중대한 결함을 찾기 쉬워진다. <br>
정렬이 필요할 정도로 목록이 길다면 문제는 `목록 길이`지 정렬 부족이 아니다. <br>
위 코드처럼 선언부가 길다면 `클래스를 쪼개야 한다는 의미`이다.

### **_들여쓰기_**

프로그래머는 스코프(scope)로 이뤄진 계층을 표현하기 위해 코드를 들여쓰며 들여쓰는 정도는 계층에서 코드가 자리잡은 수준에 비례한다. <br>

```java
public class FitNesseServer implements SocketServer { private FitNesseContext
context; public FitNesseServer(FitNesseContext context) { this.context =
context; } public void serve(Socket s) { serve(s, 10000); } public void
serve(Socket s, long requestTimeout) { try { FitNesseExpediter sender = new
FitNesseExpediter(s, context);
sender.setRequestParsingTimeLimit(requestTimeout); sender.start(); }
catch (Exception e) { e.printStackTrace(); } } }
```

```java
public class FitNesseServer implements SocketServer {
    private FitNesseContext context;
    public FitNesseServer(FitNesseContext context) {
        this.context = context;
    }

    public void serve(Socket s) {
        serve(s, 10000);
    }

    public void serve(Socket s, long requestTimeout) {
        try {
            FitNesseExpediter sender = new FitNesseExpediter(s, context);
            sender.setRequestParsingTimeLimit(requestTimeout);
            sender.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

위 코드를 봐도 들여쓰기한 파일은 구조가 한 눈에 들어온다는 것을 알 수 있다. <br>

#### 들여쓰기 무시하기

때로는 간단한 if문, while문, 짧은 함수에서 들여쓰기 규칙을 무시하고픈 유혹이 생긴다.

```java
public class CommentWidget extends TextWidget {
    public static final String REGEXP = "^#[^\\r\\n]*(?:(?:\\r\\n)|\\n|\\r)?";

    public CommentWidget(ParentWidget parent, String text){super(parent, text);}
    public String render() throws Exception {return ""; }
}
```

이런 유혹이 생길 때에도 원점으로 돌아가 들여쓰기를 넣어 범위를 제대로 표현한 코드를 작성하자.

```java
public class CommentWidget extends TextWidget {
    public static final String REGEXP = "^#[^\\r\\n]*(?:(?:\\r\\n)|\\n|\\r)?";

    public CommentWidget(ParentWidget parent, String text){
        super(parent, text);
    }

    public String render() throws Exception {
        return "";
    }
}
```

### **_가짜 범위_**

때로는 빈 while문이나 for문을 접한다. <br>
이런 구조는 가능한 한 피하는 것이 좋지만, 피하지 못할 때는 빈 블록을 올바로 들여쓰고 괄호로 감싸자. <br>
while문은 아래 코드와 같이 `새 행에다 세미콜론`을 제대로 들여써서 넣어주자. 이렇게 하지 않으면 눈에 띄지 않는다.

```java
while (dis.read(buf, 0, readBufferSize) != -1)
;
```

## 4. 팀 규칙

프로그래머라면 각자 선호하는 규칙이 있지만 팀에 속한다면 자신이 선호해야 할 규칙은 바로 `팀 규칙`이다. <br>
**팀은 한 가지 규칙에 합의해야 하며 모든 팀원은 그 규칙을 따라야 한다.** <br>
어디에 괄호를 넣을지, 들여쓰기는 몇 자로 할지, 클래스와 변수와 메서드 이름은 어떻게 지을지 등이 이에 해당한다. <br>

좋은 소프트웨어 시스템은 읽기 쉬운 문서로 이뤄진다는 사실을 기억하자. <br>
**스타일은 일관적이고 매끄러워야 한다.** 온갖 스타일을 뒤섞어 소스 코드를 필요 이상으로 복잡하게 만드는 실수는 반드시 피하자.
