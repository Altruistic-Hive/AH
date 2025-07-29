---
sidebar_position: 2
---

# React Hooks

React Hooks는 함수형 컴포넌트에서 상태와 생명주기를 관리할 수 있게 해주는 기능입니다.

## useState - 상태 관리

`useState`는 컴포넌트에서 상태를 관리하는 가장 기본적인 Hook입니다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('홍길동');

  return (
    <div>
      <h2>카운터: {count}</h2>
      <p>이름: {name}</p>
      
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
      
      <button onClick={() => setCount(count - 1)}>
        감소
      </button>
      
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
      />
    </div>
  );
}
```

## useEffect - 생명주기 관리

`useEffect`는 컴포넌트의 생명주기와 관련된 작업을 처리합니다.

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트될 때와 userId가 변경될 때 실행
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // 의존성 배열

  // 컴포넌트가 언마운트될 때 정리 작업
  useEffect(() => {
    return () => {
      console.log('컴포넌트가 언마운트됩니다.');
    };
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>이메일: {user.email}</p>
      <p>가입일: {user.joinDate}</p>
    </div>
  );
}
```

## useContext - Context API

`useContext`는 React Context를 사용하여 전역 상태를 관리합니다.

```jsx
import React, { createContext, useContext, useState } from 'react';

// Context 생성
const ThemeContext = createContext();

// Context Provider 컴포넌트
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Context를 사용하는 컴포넌트
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        padding: '10px 20px',
        border: '1px solid #ccc'
      }}
    >
      {theme === 'light' ? '다크 모드' : '라이트 모드'}
    </button>
  );
}

// App 컴포넌트
function App() {
  return (
    <ThemeProvider>
      <div>
        <h1>테마 예제</h1>
        <ThemedButton />
      </div>
    </ThemeProvider>
  );
}
```

## useReducer - 복잡한 상태 관리

`useReducer`는 복잡한 상태 로직을 관리할 때 사용합니다.

```jsx
import React, { useReducer } from 'react';

// 리듀서 함수
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  });

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  return (
    <div>
      <h2>할 일 목록</h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.elements.todo;
        if (input.value.trim()) {
          addTodo(input.value);
          input.value = '';
        }
      }}>
        <input name="todo" placeholder="할 일을 입력하세요" />
        <button type="submit">추가</button>
      </form>

      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## useRef - DOM 요소 참조

`useRef`는 DOM 요소에 직접 접근하거나 값을 저장할 때 사용합니다.

```jsx
import React, { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트되면 자동으로 포커스
    inputRef.current.focus();
  }, []);

  const handleClick = () => {
    // 버튼 클릭 시 입력 필드에 포커스
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} placeholder="자동으로 포커스됩니다" />
      <button onClick={handleClick}>포커스</button>
    </div>
  );
}

// 값 저장용 useRef
function Timer() {
  const [count, setCount] = React.useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div>
      <h2>카운터: {count}</h2>
      <button onClick={stopTimer}>정지</button>
    </div>
  );
}
```

## 커스텀 Hook

자주 사용하는 로직을 커스텀 Hook으로 만들어 재사용할 수 있습니다.

```jsx
import { useState, useEffect } from 'react';

// API 호출을 위한 커스텀 Hook
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 로컬 스토리지를 위한 커스텀 Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 사용 예제
function UserProfile({ userId }) {
  const { data: user, loading, error } = useApi(`/api/users/${userId}`);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>현재 테마: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        테마 변경
      </button>
    </div>
  );
}
``` 