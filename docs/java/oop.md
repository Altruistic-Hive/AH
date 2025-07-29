---
sidebar_position: 2
---

# Java 객체지향 프로그래밍

Java의 핵심인 객체지향 프로그래밍(OOP)의 개념과 구현 방법을 학습합니다.

## 클래스와 객체

클래스는 객체를 만들기 위한 템플릿이고, 객체는 클래스의 인스턴스입니다.

```java
// 클래스 정의
public class Person {
    // 필드 (속성)
    private String name;
    private int age;
    
    // 생성자
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 메서드 (행동)
    public void introduce() {
        System.out.println("안녕하세요, " + name + "입니다. " + age + "살입니다.");
    }
    
    // Getter와 Setter
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}

// 객체 생성과 사용
Person person1 = new Person("홍길동", 25);
person1.introduce(); // "안녕하세요, 홍길동입니다. 25살입니다."
```

## 상속 (Inheritance)

상속은 기존 클래스의 기능을 확장하여 새로운 클래스를 만드는 방법입니다.

```java
// 부모 클래스
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void makeSound() {
        System.out.println("동물이 소리를 냅니다.");
    }
}

// 자식 클래스
public class Dog extends Animal {
    public Dog(String name) {
        super(name); // 부모 클래스 생성자 호출
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + "가 멍멍!");
    }
    
    public void wagTail() {
        System.out.println(name + "가 꼬리를 흔듭니다.");
    }
}

// 사용 예제
Dog myDog = new Dog("멍멍이");
myDog.makeSound(); // "멍멍이가 멍멍!"
myDog.wagTail();   // "멍멍이가 꼬리를 흔듭니다."
```

## 다형성 (Polymorphism)

다형성은 같은 인터페이스를 통해 다양한 객체를 다룰 수 있게 해주는 개념입니다.

```java
// 인터페이스 정의
public interface Shape {
    double getArea();
    double getPerimeter();
}

// 인터페이스 구현
public class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
}

public class Rectangle implements Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
}

// 다형성 활용
Shape[] shapes = {
    new Circle(5),
    new Rectangle(4, 6)
};

for (Shape shape : shapes) {
    System.out.println("면적: " + shape.getArea());
    System.out.println("둘레: " + shape.getPerimeter());
}
```

## 캡슐화 (Encapsulation)

캡슐화는 데이터와 메서드를 하나의 단위로 묶고, 외부에서 직접 접근을 제한하는 개념입니다.

```java
public class BankAccount {
    private double balance; // private으로 외부 접근 차단
    
    public BankAccount(double initialBalance) {
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        }
    }
    
    // public 메서드를 통해서만 접근 가능
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println(amount + "원이 입금되었습니다.");
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            System.out.println(amount + "원이 출금되었습니다.");
            return true;
        } else {
            System.out.println("잔액이 부족합니다.");
            return false;
        }
    }
    
    public double getBalance() {
        return balance;
    }
}
```

## 추상화 (Abstraction)

추상화는 복잡한 시스템에서 핵심적인 개념이나 기능을 간추려 표현하는 것입니다.

```java
// 추상 클래스
public abstract class Vehicle {
    protected String brand;
    protected String model;
    
    public Vehicle(String brand, String model) {
        this.brand = brand;
        this.model = model;
    }
    
    // 추상 메서드 - 구현은 자식 클래스에서
    public abstract void start();
    public abstract void stop();
    
    // 일반 메서드
    public void displayInfo() {
        System.out.println("브랜드: " + brand + ", 모델: " + model);
    }
}

// 추상 클래스 구현
public class Car extends Vehicle {
    public Car(String brand, String model) {
        super(brand, model);
    }
    
    @Override
    public void start() {
        System.out.println("자동차가 시동을 겁니다.");
    }
    
    @Override
    public void stop() {
        System.out.println("자동차가 정지합니다.");
    }
}
``` 