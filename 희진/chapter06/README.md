# Chapter 6 객체와 자료 구조

변수를 private로 정의하는 이유는 남들이 변수에 의존하지 않게 만들고 싶어서다. <br>
그렇다면 어째서 수많은 프로그래머가 `getter`와 `setter`를 당연하게 public으로 만들어 private로 선언한 변수를 외부에 노출할까?

## 자료 추상화
```java
// 구체적인 Point 클래스
public class Point {
	public double x;
	public double y;
} 
```
```java
// 추상적인 Point 클래스
public interface Point {
	double getX();
	double getY();
	void setCartesian(double x, double y);
	double getR();
	double getTheta();
	void setPolar(double r, double theta);
}
```
두 클래스 모두 2차원 점을 표현하지만 한 클래스는 구현을 외부로 노출하고, 다른 클래스는 구현을 완전히 숨긴다. <br>


## 자료/객체 비대칭

## 디미터 법칙

### **_기차 충돌_**

### **_잡종 구조_**

### **_구조체 감추기_**

## 자료 전달 객체

### **_활성 레코드_**

## 결론
