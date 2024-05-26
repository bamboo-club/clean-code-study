## 클래스

### 클래스 체계

클래스를 정의하는 관례를 통해 얘기를 하자면 가장 먼저 변수목록, 정적(static) 공개(public) 상수가 있다면 맨 처음에 나옵니다. 다음으로 정적 비공개 변수가 나오고 인스턴수 변수가 나옵니다.

변수 목록 다음에는 공개 함수가 나오고 비공개 함수는 자신을 호출하는 공개 함수 직후에 넣습니다. 즉 추상화 단계가 순차적으로 내려갑니다.

```javascript
class Example {
    // 정적 공개 상수
    static PUBLIC_CONSTANT = 'This is a public constant';

    // 정적 비공개 변수
    static #privateStaticVariable = 'This is a private static variable';

    // 인스턴스 변수
    constructor(value) {
        this.instanceVariable = value;
    }

    // 공개 함수
    publicMethod() {
        console.log('This is a public method');
        this.#privateMethod();
    }

    // 비공개 함수 (자신을 호출하는 공개 함수 직후에 위치)
    #privateMethod() {
        console.log('This is a private method');
    }

    // 또 다른 공개 함수 (추가적인 공개 함수가 있을 경우)
    anotherPublicMethod() {
        console.log('This is another public method');
    }
}

// 클래스 사용 예시
const exampleInstance = new Example('Instance Value');
console.log(Example.PUBLIC_CONSTANT); // This is a public constant
exampleInstance.publicMethod(); // This is a public method / This is a private method
exampleInstance.anotherPublicMethod(); // This is another public method

// 정적 비공개 변수에 직접 접근할 수 없습니다.
// console.log(Example.#privateStaticVariable); // SyntaxError
```

_캡슐화_

> 변수와 유틸리티 함수는 가능한 공개하지 않는 편이 낫지만 반드시 숨겨야 한다는 법칙은 없습니다.

`#`를 붙인다면 `private`로 선언이 되어 외부에서 접근을 하지 못하게 합니다.

만약 같은 패키지 안에서 테스트 코드를 호출하거나 변수를 사용해야 한다면 패키지 전체를 공개로 변경해야 합니다.

하지만 그 전에 비공개 상태를 유지할 온갖 방법을 강구하는 것이 좋습니다,

> 캡슐화를 풀어주는 결정은 언제나 최후의 수단입니다.

### 클래스는 작아야 합니다.

클래스를 만들 떄 첫번째 규칙은 크기, 두번째 규칙도 크기입니다. 함수와 마찬가지로, '작게' 만드는 것이 기본 규칙입니다.

또한 클래스 이름은 해당 클래스 책임을 기술해야 합니다. 간결한 이름이 떠오르지 않는다면 클래스의 크기가 크거나 클래스 책임이 많아서 입니다.

만약 클래스 이름에 Processor, Manager, Super 등과 같이 모호한 단어가 있다면 클래스에다 여러 책임을 떠안겼다는 증거입니다.

또한 클래스 설명은 만일(if), 그리고(and), (하)며(or), 하지만(but)과 같은 단어들을 사용하지 않고서 25단어 내외로 가능해야합니다. 그렇지 않다면 이는 너무 많은 일을 처리하고 있다는 증거입니다.

_단일 책임 원칙_

클래스나 모듈을 변경할 이유가 하나, 단 하나뿐이어야 한다는 원칙입니다. 단일 책임 원칙은 책임이라는 개념을 정의하며 적절한 클래스 크기를 제시합니다.

변경할 이유를 파악하려 애쓰다 보면 코드를 추상화 하기도 쉬워지고, 더 좋은 추상화가 더 쉽게 떠오릅니다.

하지만 단일 책임 원칙은 개발자들이 가장 안지키는 규칙입니다. 관심사를 분리하는 작업은 프로그램 뿐만 아니라 프로그래밍 활동에서도 마찬가지로 중요합니다.

규모가 어느 정도에 이르는 시스템은 논리가 많고도 복잡합니다. 따라서 체계적인 정리가 필수입니다.

> 도구 상자를 어떻게 관리하고 싶은가? 작은 서랍을 많이 두고 기능과 이름이 명확한 컴포넌트를 컴포넌트를 나눠 넣고 싶은가? 아니면 큰 서랍 몇 개들 두고 모두를 던져넣고 싶은가?

_응집도_

클래스 인스턴수 변수 수가 작아야 합니다.

메소드가 변수를 맣이 사용할 수록 메소드와 클래스간에 응지도가 높다고 말을 할 수도 있습니다.

아래는 Stack을 구현한 클래스입니다.

```javascript
class Stack {
    #topOfStack = 0;
    elements = [];

    size() {
        return this.#topOfStack;
    }

    push(element) {
        this.#topOfStack++;
        this.elements.push(element);
    }

    pop() {
        if (this.#topOfStack === 0) {
            throw new PoppedWhenEmpty();
        }
        
        this.#topOfStack--;
        return this.elements.pop();
    }
}
```

함수는 작게, 매개변수 목록은 짧게 라는 전약을 따르다 보면 몇몇 메서드만이 사용하는 인스턴스 변수가 많아집니다.

이는 새로운 클래스로 쪼개야한다는 신호입니다.

### 변경하기 쉬운 클래스

대다수 시스템은 지속적인 변경이 가해집니다. 변경할 때마다 시스템이 의도대로 동작하지 않을 위험이 따릅니다. 꺠끗한 시스템은 체계적으로 정리해 변경에 수반하는 위험을 낮춥니다.

```javascript
class PaymentProcessor {
    process(paymentMethod, amount) {
        if (paymentMethod === 'creditCard') {
            this.processCreditCard(amount);
        } else if (paymentMethod === 'paypal') {
            this.processPayPal(amount);
        } else {
            throw new Error('Unsupported payment method');
        }
    }

    processCreditCard(amount) {
        console.log(`Processing credit card payment of ${amount}`);
        // Credit card payment logic
    }

    processPayPal(amount) {
        console.log(`Processing PayPal payment of ${amount}`);
        // PayPal payment logic
    }
}

// 기존 코드 사용 예시
const processor = new PaymentProcessor();
processor.process('creditCard', 100); // Processing credit card payment of 100
processor.process('paypal', 200); // Processing PayPal payment of 200
```

위 예제에서 새로운 결제 수단을 추가하려면 PaymentProcessor 클래스의 process 메서드에 새로운 else if 블록을 추가해야 합니다. 이는 개방-폐쇄 원칙에 위배됩니다.

```javascript
class PaymentProcessor {
    constructor() {
        this.paymentMethods = {};
    }

    registerPaymentMethod(methodName, paymentMethod) {
        this.paymentMethods[methodName] = paymentMethod;
    }

    process(paymentMethod, amount) {
        if (this.paymentMethods[paymentMethod]) {
            this.paymentMethods[paymentMethod].process(amount);
        } else {
            throw new Error('Unsupported payment method');
        }
    }
}

class CreditCardPayment {
    process(amount) {
        console.log(`Processing credit card payment of ${amount}`);
        // Credit card payment logic
    }
}

class PayPalPayment {
    process(amount) {
        console.log(`Processing PayPal payment of ${amount}`);
        // PayPal payment logic
    }
}

// 새로운 결제 수단을 추가하려면 새로운 클래스를 정의하고 등록하면 됩니다.
class BitcoinPayment {
    process(amount) {
        console.log(`Processing Bitcoin payment of ${amount}`);
        // Bitcoin payment logic
    }
}

// 기존 코드 사용 예시
const processor = new PaymentProcessor();
processor.registerPaymentMethod('creditCard', new CreditCardPayment());
processor.registerPaymentMethod('paypal', new PayPalPayment());
processor.registerPaymentMethod('bitcoin', new BitcoinPayment());

processor.process('creditCard', 100); // Processing credit card payment of 100
processor.process('paypal', 200); // Processing PayPal payment of 200
processor.process('bitcoin', 300); // Processing Bitcoin payment of 300
```

위 예제에서는 PaymentProcessor 클래스가 닫힌 클래스 집합입니다. 새로운 결제 수단을 추가할 때 PaymentProcessor 클래스는 수정되지 않고, 새로운 결제 수단 클래스를 정의하고 이를 등록하기만 하면 됩니다.

이 예시를 통해 변경이 필요한 클래스(손대야 하는 클래스)와 변경 없이 확장 가능한 클래스(닫힌 클래스 집합)의 차이를 알 수 있습니다. 이와 같은 설계는 유지보수성과 확장성을 크게 향상시킵니다.

각 코드는 단순하고 함수 하나를 수정 하였을 때 혹은 추가 하였을 때, 다른 함수가 망가질 위험이 줄어들었습니다.

_변경으로 부터 격리_

요구사항은 변하기 마련이기에 코드도 변하기 마렵입니다.

상세한 구현에 의존하는 클라이언트 클래스는 구현이 바뀌면 위험에 빠집니다. 때문에 인터페이스와 추상 클래스를 사용하여 미치는 영향을 격리할 수 있습니다.

때문에 테스트용 클래스를 만들어 둠으로서 테스트가 가능할정도로 결합도를 낮추면 유연성과 재사용성도 더욱 높아집니다.

결합도가 낮다는 것은 각 시스템 요소가 다른 요소로부터의 변경으로 부터 잘 격리되어 있는 것을 의미합니다. 시스템 요소가 서로 잘 격리되어 있으면 각 요소를 이해하기도 더욱 쉬워집니다.

이렇게 결합도를 최소로 줄인다면 자연스럽게 또 다른 클래스 설계 원칙인 DIP를 따르는 클래스가 나옵니다.

> DIP는 클래스가 상세한 구현이 아니라 추상화에 의존해야 한다는 원칙입니다.

### 🙏🏻끝으로

자바의 `class`와 `interface`와 javascript 혹은 typescript의 `class`와 `interface`는 다른 개념입니다.

`prototype`을 기반으로해서 움직이는 `javascript`는 `interface`를 통해 구현체가 없는 추상 클래스를 만들수 없습니다. 때문에 이 장에서 소개하는 추상 클래스(interface)를 이용한 클래스를 여러개 만드는 것이 다소 멀게 느껴졌습니다.

하지만 그렇다고 해서 `prototype`을 기반한 `javascript`의 `class`에 대해 설명을 요구한다면 설명을 하지 못할것 같기에 정리가 필요할 것 같습니다.