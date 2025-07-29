---
sidebar_position: 3
---

# DOM 조작

JavaScript를 사용하여 웹 페이지의 요소들을 동적으로 조작하는 방법을 학습합니다.

## DOM이란?

DOM(Document Object Model)은 HTML 문서를 객체로 표현한 것입니다. JavaScript를 통해 HTML 요소들을 선택하고, 내용을 변경하고, 스타일을 수정할 수 있습니다.

## 요소 선택하기

```javascript
// ID로 요소 선택
const element = document.getElementById('myId');

// 클래스로 요소 선택 (첫 번째 요소)
const element = document.querySelector('.myClass');

// 클래스로 모든 요소 선택
const elements = document.querySelectorAll('.myClass');

// 태그명으로 요소 선택
const paragraphs = document.getElementsByTagName('p');
```

## 요소 내용 변경하기

```javascript
// 텍스트 내용 변경
element.textContent = '새로운 텍스트';

// HTML 내용 변경
element.innerHTML = '<strong>굵은 텍스트</strong>';

// 속성 변경
element.setAttribute('class', 'newClass');
element.className = 'newClass';
```

## 새로운 요소 생성하기

```javascript
// 새로운 요소 생성
const newDiv = document.createElement('div');
newDiv.textContent = '새로운 div 요소';

// 부모 요소에 추가
parentElement.appendChild(newDiv);

// 특정 위치에 삽입
parentElement.insertBefore(newDiv, referenceElement);
```

## 이벤트 처리하기

```javascript
// 클릭 이벤트
element.addEventListener('click', function(event) {
    console.log('클릭되었습니다!');
});

// 폼 제출 이벤트
form.addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 동작 방지
    console.log('폼이 제출되었습니다!');
});

// 키보드 이벤트
input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        console.log('Enter 키가 눌렸습니다!');
    }
});
```

## 실습 예제

```html
<!DOCTYPE html>
<html>
<head>
    <title>DOM 조작 예제</title>
</head>
<body>
    <h1 id="title">제목</h1>
    <button id="changeBtn">제목 변경</button>
    <div id="container"></div>

    <script>
        const title = document.getElementById('title');
        const changeBtn = document.getElementById('changeBtn');
        const container = document.getElementById('container');

        changeBtn.addEventListener('click', function() {
            title.textContent = '변경된 제목!';
            
            const newParagraph = document.createElement('p');
            newParagraph.textContent = '새로운 문단이 추가되었습니다!';
            container.appendChild(newParagraph);
        });
    </script>
</body>
</html>
``` 