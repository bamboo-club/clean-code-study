# Chapter 2 의미 있는 이름

코드를 단순화하는 것과 별개로 이름에 어떤 함축성을 내재하고 있는지

#### 이름을 잘 짓는 규칙은 다음과 같다.

1. 의도를 분명히 밝혀라

```java
int d; // 경과 시간(단위 : 날짜)
```

```java
int elapsedtimeinDays;
int daysSinceCreation;
int daysSinceModification;
int fileAgeInDays;
```

위 변수의 이름 d는 아무 의미도 드러나지 않는다. <br>
그러나 아래 변수는 측정하려는 값과 단위를 표현하고자 하는 의도가 드러나있다.

어느 변수가 더 코드 이해와 변경이 쉬울까?

```java
public List<int []> getThem() {
  List<int []> list1 = new ArrayList<int []>();

  for (int[] x : theList)
    if (x[0] == 4)
      list1.add(x);
  return list1;
}
```

1. theList에 무엇이 들었는가?
2. theList에서 0번째 값이 어째서 중요한가?
3. 값 4는 무슨 의미인가?
4. 함수가 반환하는 리스트 list1을 어떻게 사용하는가?

#### 위 코드 샘플엔 이와 같은 정보가 드러나지 않는다.

```java
public List<Cell> getFlaggedCells() {
  List<Cell> flaggedCells = new ArrayList<Cell>();
  for (Cell cell : gameBoard)
    if (cell.isFlaaged())
      flaggedCells.add(cell);
  return flaggedCells;
}
```

#### 코드의 단순성은 변하지 않았지만 코드는 더욱 명확해졌다.

- 변수나 함수, 클래스 이름은 다음과 같은 굵직한 질문에 모두 답해야 한다.

1. 변수(혹은 함수나 클래스)의 존재 이유는?
2. 수행 기능은?
3. 사용 방법은?

따로 주석이 필요하다면 의도를 분명히 드러내지 못했다는 말이다.

<br>
2. 그릇된 정보를 피하라
<br>
그릇된 단서는 코드 의미를 흐린다.

```java
  int a = l;
  if ( O == l)
  a = Ol;
  else
  l = 01;
```

3. 의미 있게 구분하라

4. 발음하기 쉬운 이름을 사용하라

5. 검색하기 쉬운 이름을 사용하라

6. 인코딩을 피하라

7. 자신의 기억력을 자랑하지 마라

8. 클래스이름

9. 메서드 이름

10. 기발한 이름은 피하라

11. 한 개념에 한 단어를 사용하라

12. 말장난을 하지 마라

13. 해법 영역에서 가져온 이름을 사용하라

14. 문제 영역에서 가져온 이름을 사용하라

15. 의미 있는 맥락을 추가하라

16. 불필요한 맥락을 없애라

## 정리
