---
sidebar_position: 2
---

# Express.js 기초

Express.js는 Node.js를 위한 빠르고 간결한 웹 애플리케이션 프레임워크입니다.

## Express.js란?

Express.js는 Node.js 위에서 실행되는 웹 애플리케이션 프레임워크로, 웹 서버와 API를 쉽게 구축할 수 있게 해줍니다.

## 설치 및 설정

```bash
# 새 프로젝트 초기화
npm init -y

# Express 설치
npm install express

# 개발 의존성 설치
npm install --save-dev nodemon
```

## 기본 서버 생성

```javascript
// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 기본 라우트
app.get('/', (req, res) => {
    res.send('Hello Express!');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
```

## 라우팅

### 기본 라우팅

```javascript
// GET 요청
app.get('/users', (req, res) => {
    res.json({ message: '모든 사용자 조회' });
});

// POST 요청
app.post('/users', (req, res) => {
    res.json({ message: '사용자 생성' });
});

// PUT 요청
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `사용자 ${id} 수정` });
});

// DELETE 요청
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `사용자 ${id} 삭제` });
});
```

### 라우트 매개변수

```javascript
// 단일 매개변수
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ userId: id });
});

// 여러 매개변수
app.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params;
    res.json({ userId, postId });
});

// 선택적 매개변수
app.get('/products/:id?', (req, res) => {
    const { id } = req.params;
    if (id) {
        res.json({ productId: id });
    } else {
        res.json({ message: '모든 제품 조회' });
    }
});
```

### 쿼리 매개변수

```javascript
// /search?q=javascript&limit=10
app.get('/search', (req, res) => {
    const { q, limit = 10 } = req.query;
    res.json({ 
        query: q, 
        limit: parseInt(limit),
        results: `"${q}"에 대한 검색 결과`
    });
});
```

## 미들웨어

### 내장 미들웨어

```javascript
// JSON 파싱
app.use(express.json());

// URL 인코딩된 데이터 파싱
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static('public'));
```

### 커스텀 미들웨어

```javascript
// 로깅 미들웨어
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

app.use(logger);

// 인증 미들웨어
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: '토큰이 필요합니다' });
    }
    
    // 토큰 검증 로직
    req.user = { id: 1, name: '홍길동' }; // 예시
    next();
};

// 보호된 라우트
app.get('/profile', authenticate, (req, res) => {
    res.json({ user: req.user });
});
```

### 에러 처리 미들웨어

```javascript
// 에러 처리 미들웨어 (맨 마지막에 위치)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: '서버 내부 오류가 발생했습니다',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 처리
app.use('*', (req, res) => {
    res.status(404).json({ error: '페이지를 찾을 수 없습니다' });
});
```

## 라우터 모듈화

### users.js 라우터

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 사용자 목록 조회
router.get('/', (req, res) => {
    res.json({ users: [] });
});

// 사용자 상세 조회
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ user: { id, name: '홍길동' } });
});

// 사용자 생성
router.post('/', (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({ 
        message: '사용자가 생성되었습니다',
        user: { id: Date.now(), name, email }
    });
});

module.exports = router;
```

### 메인 앱에서 라우터 사용

```javascript
// app.js
const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);

app.listen(3000, () => {
    console.log('서버가 실행 중입니다');
});
```

## 템플릿 엔진 (EJS)

```bash
# EJS 설치
npm install ejs
```

```javascript
// 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', './views');

// 템플릿 렌더링
app.get('/home', (req, res) => {
    const data = {
        title: '홈페이지',
        users: ['홍길동', '김철수', '이영희']
    };
    res.render('home', data);
});
```

```html
<!-- views/home.ejs -->
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <ul>
        <% users.forEach(user => { %>
            <li><%= user %></li>
        <% }); %>
    </ul>
</body>
</html>
```

## 데이터베이스 연동 (MongoDB)

```bash
# MongoDB 드라이버 설치
npm install mongodb
# 또는 Mongoose ODM
npm install mongoose
```

### Mongoose 사용 예제

```javascript
const mongoose = require('mongoose');

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 스키마 정의
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 사용자 생성 API
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 사용자 조회 API
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## 세션과 쿠키

```bash
# 세션 미들웨어 설치
npm install express-session
```

```javascript
const session = require('express-session');

// 세션 설정
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // HTTPS에서는 true
        maxAge: 1000 * 60 * 60 * 24 // 24시간
    }
}));

// 로그인
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // 사용자 인증 로직
    if (username === 'admin' && password === 'password') {
        req.session.user = { username };
        res.json({ message: '로그인 성공' });
    } else {
        res.status(401).json({ error: '인증 실패' });
    }
});

// 로그아웃
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: '로그아웃 실패' });
        }
        res.json({ message: '로그아웃 성공' });
    });
});

// 세션 확인 미들웨어
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: '로그인이 필요합니다' });
    }
};

// 보호된 라우트
app.get('/dashboard', requireAuth, (req, res) => {
    res.json({ user: req.session.user });
});
```

## 파일 업로드

```bash
# multer 설치
npm install multer
```

```javascript
const multer = require('multer');
const path = require('path');

// 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB 제한
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다'));
        }
    }
});

// 단일 파일 업로드
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '파일이 업로드되지 않았습니다' });
    }
    
    res.json({ 
        message: '파일 업로드 성공',
        filename: req.file.filename,
        path: req.file.path
    });
});

// 여러 파일 업로드
app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
    res.json({ 
        message: '파일들이 업로드되었습니다',
        files: req.files.map(file => ({
            filename: file.filename,
            path: file.path
        }))
    });
});
```

## 환경 설정

```bash
# dotenv 설치
npm install dotenv
```

```javascript
// .env 파일
PORT=3000
DB_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

```javascript
// app.js
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
```

이제 Node.js 디렉터리에 2개의 문서가 있어서 카테고리가 제대로 동작할 것입니다! 