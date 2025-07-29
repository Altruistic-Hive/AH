---
sidebar_position: 2
---

# MySQL 기본 쿼리

MySQL에서 가장 기본적이고 자주 사용되는 SQL 쿼리들을 학습합니다.

## 데이터베이스 관리

### 데이터베이스 생성 및 선택

```sql
-- 데이터베이스 생성
CREATE DATABASE my_database;

-- 데이터베이스 선택
USE my_database;

-- 데이터베이스 목록 조회
SHOW DATABASES;

-- 현재 데이터베이스 확인
SELECT DATABASE();
```

### 테이블 생성

```sql
-- 기본 테이블 생성
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 외래키가 있는 테이블 생성
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_user_posts ON posts(user_id);
```

## 데이터 조작 (DML)

### INSERT - 데이터 삽입

```sql
-- 단일 행 삽입
INSERT INTO users (username, email, password) 
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- 여러 행 삽입
INSERT INTO users (username, email, password) VALUES 
    ('jane_smith', 'jane@example.com', 'hashed_password'),
    ('bob_wilson', 'bob@example.com', 'hashed_password'),
    ('alice_brown', 'alice@example.com', 'hashed_password');

-- SELECT 결과를 INSERT
INSERT INTO users (username, email, password)
SELECT username, email, password FROM old_users WHERE active = 1;
```

### SELECT - 데이터 조회

```sql
-- 모든 컬럼 조회
SELECT * FROM users;

-- 특정 컬럼만 조회
SELECT id, username, email FROM users;

-- 조건부 조회
SELECT * FROM users WHERE created_at >= '2024-01-01';

-- 정렬
SELECT * FROM users ORDER BY created_at DESC;

-- 제한된 결과
SELECT * FROM users LIMIT 10;

-- 페이지네이션
SELECT * FROM users LIMIT 10 OFFSET 20; -- 21-30번째 행

-- 중복 제거
SELECT DISTINCT username FROM users;

-- 집계 함수
SELECT 
    COUNT(*) as total_users,
    AVG(YEAR(CURRENT_DATE) - YEAR(birth_date)) as avg_age,
    MAX(created_at) as latest_user
FROM users;
```

### UPDATE - 데이터 수정

```sql
-- 단일 행 수정
UPDATE users 
SET email = 'new_email@example.com' 
WHERE id = 1;

-- 여러 행 수정
UPDATE users 
SET last_login = CURRENT_TIMESTAMP 
WHERE last_login IS NULL;

-- 조건부 수정
UPDATE posts 
SET view_count = view_count + 1 
WHERE id = 123;

-- JOIN을 사용한 수정
UPDATE posts p
JOIN users u ON p.user_id = u.id
SET p.author_name = u.username
WHERE p.author_name IS NULL;
```

### DELETE - 데이터 삭제

```sql
-- 단일 행 삭제
DELETE FROM users WHERE id = 1;

-- 조건부 삭제
DELETE FROM users WHERE last_login < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 모든 데이터 삭제 (테이블 구조는 유지)
DELETE FROM users;

-- 테이블 전체 삭제 (구조도 삭제)
DROP TABLE users;
```

## JOIN - 테이블 연결

### INNER JOIN

```sql
-- 기본 INNER JOIN
SELECT u.username, p.title, p.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- 여러 테이블 JOIN
SELECT u.username, p.title, c.content as comment
FROM users u
INNER JOIN posts p ON u.id = p.user_id
INNER JOIN comments c ON p.id = c.post_id;
```

### LEFT JOIN

```sql
-- 모든 사용자와 그들의 게시물 (게시물이 없는 사용자도 포함)
SELECT u.username, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- 게시물이 없는 사용자만 조회
SELECT u.username
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE p.id IS NULL;
```

### RIGHT JOIN

```sql
-- 모든 게시물과 작성자 (작성자가 삭제된 게시물도 포함)
SELECT p.title, u.username
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;
```

## 서브쿼리

### WHERE 절에서 서브쿼리

```sql
-- 평균보다 많은 게시물을 작성한 사용자
SELECT username
FROM users
WHERE id IN (
    SELECT user_id 
    FROM posts 
    GROUP BY user_id 
    HAVING COUNT(*) > (
        SELECT AVG(post_count) 
        FROM (
            SELECT COUNT(*) as post_count 
            FROM posts 
            GROUP BY user_id
        ) as avg_posts
    )
);
```

### FROM 절에서 서브쿼리

```sql
-- 사용자별 게시물 수와 댓글 수
SELECT u.username, p.post_count, c.comment_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as post_count
    FROM posts
    GROUP BY user_id
) p ON u.id = p.user_id
LEFT JOIN (
    SELECT p.user_id, COUNT(c.id) as comment_count
    FROM posts p
    LEFT JOIN comments c ON p.id = c.post_id
    GROUP BY p.user_id
) c ON u.id = c.user_id;
```

## 집계 함수와 GROUP BY

```sql
-- 사용자별 게시물 수
SELECT u.username, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.username;

-- 월별 게시물 작성 수
SELECT 
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    COUNT(*) as post_count
FROM posts
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;

-- HAVING을 사용한 조건
SELECT user_id, COUNT(*) as post_count
FROM posts
GROUP BY user_id
HAVING COUNT(*) > 5;
```

## 인덱스와 성능

### 인덱스 생성

```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_email ON users(email);

-- 복합 인덱스
CREATE INDEX idx_user_date ON posts(user_id, created_at);

-- 유니크 인덱스
CREATE UNIQUE INDEX idx_username ON users(username);

-- 인덱스 확인
SHOW INDEX FROM users;

-- 인덱스 삭제
DROP INDEX idx_email ON users;
```

### EXPLAIN을 사용한 쿼리 분석

```sql
-- 쿼리 실행 계획 확인
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 인덱스 사용 여부 확인
EXPLAIN SELECT * FROM posts WHERE user_id = 1 AND created_at > '2024-01-01';
```

## 트랜잭션

```sql
-- 트랜잭션 시작
START TRANSACTION;

-- 여러 쿼리 실행
INSERT INTO users (username, email, password) VALUES ('user1', 'user1@example.com', 'pass1');
INSERT INTO posts (title, content, user_id) VALUES ('First Post', 'Hello World', LAST_INSERT_ID());

-- 트랜잭션 커밋
COMMIT;

-- 또는 롤백
-- ROLLBACK;
```

## 저장 프로시저

```sql
-- 저장 프로시저 생성
DELIMITER //
CREATE PROCEDURE GetUserPosts(IN user_id INT)
BEGIN
    SELECT p.title, p.content, p.created_at
    FROM posts p
    WHERE p.user_id = user_id
    ORDER BY p.created_at DESC;
END //
DELIMITER ;

-- 저장 프로시저 호출
CALL GetUserPosts(1);

-- 저장 프로시저 삭제
DROP PROCEDURE GetUserPosts;
```

## 뷰 (View)

```sql
-- 뷰 생성
CREATE VIEW user_post_summary AS
SELECT 
    u.username,
    COUNT(p.id) as post_count,
    MAX(p.created_at) as last_post_date
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.username;

-- 뷰 사용
SELECT * FROM user_post_summary WHERE post_count > 0;

-- 뷰 삭제
DROP VIEW user_post_summary;
``` 