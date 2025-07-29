---
sidebar_position: 3
---

# Dockerfile 작성 가이드

Dockerfile을 사용하여 커스텀 Docker 이미지를 만드는 방법을 학습합니다.

## Dockerfile 기본 구조

Dockerfile은 Docker 이미지를 만들기 위한 설정 파일입니다.

### 기본 Dockerfile

```dockerfile
# 베이스 이미지 지정
FROM node:16-alpine

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 컨테이너 시작 명령
CMD ["npm", "start"]
```

## Dockerfile 명령어

### FROM - 베이스 이미지 지정

```dockerfile
# 공식 이미지 사용
FROM node:16

# 특정 태그 지정
FROM node:16-alpine

# 다단계 빌드
FROM node:16 AS builder
FROM nginx:alpine AS production
```

### WORKDIR - 작업 디렉터리 설정

```dockerfile
# 작업 디렉터리 설정
WORKDIR /app

# 여러 단계에서 사용
WORKDIR /usr/src/app
WORKDIR /app/frontend
```

### COPY vs ADD

```dockerfile
# COPY - 파일/디렉터리 복사 (권장)
COPY package.json ./
COPY src/ ./src/
COPY . .

# ADD - 추가 기능 (URL 다운로드, 압축 해제)
ADD https://example.com/file.tar.gz /tmp/
ADD archive.tar.gz /app/
```

### RUN - 명령 실행

```dockerfile
# 단일 명령
RUN npm install

# 여러 명령을 하나의 레이어로
RUN apt-get update && \
    apt-get install -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 배열 형태
RUN ["npm", "install"]
```

### ENV - 환경 변수 설정

```dockerfile
# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgresql://user:pass@db:5432/mydb

# 여러 변수 한 번에
ENV NODE_ENV=production \
    PORT=3000 \
    DEBUG=false
```

### EXPOSE - 포트 노출

```dockerfile
# 단일 포트
EXPOSE 3000

# 여러 포트
EXPOSE 3000 8080

# UDP 포트
EXPOSE 53/udp
```

### VOLUME - 볼륨 마운트 포인트

```dockerfile
# 볼륨 마운트 포인트 지정
VOLUME ["/data"]
VOLUME ["/var/log", "/var/db"]
```

### USER - 사용자 지정

```dockerfile
# 사용자 생성 및 전환
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

# 또는 기존 사용자 사용
USER nobody
```

### CMD vs ENTRYPOINT

```dockerfile
# CMD - 기본 명령 (오버라이드 가능)
CMD ["npm", "start"]
CMD npm start

# ENTRYPOINT - 고정 명령 (오버라이드 불가)
ENTRYPOINT ["docker-entrypoint.sh"]
ENTRYPOINT docker-entrypoint.sh

# 함께 사용
ENTRYPOINT ["npm"]
CMD ["start"]
```

## 실제 예제

### Node.js 애플리케이션

```dockerfile
# Dockerfile
FROM node:16-alpine

# 보안을 위한 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production && npm cache clean --force

# 애플리케이션 코드 복사
COPY --chown=nextjs:nodejs . .

# 사용자 전환
USER nextjs

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 시작 명령
CMD ["npm", "start"]
```

### Python Flask 애플리케이션

```dockerfile
# Dockerfile
FROM python:3.9-slim

# 시스템 패키지 업데이트 및 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        && rm -rf /var/lib/apt/lists/*

# 작업 디렉터리 설정
WORKDIR /app

# Python 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 사용자 생성 및 전환
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# 포트 노출
EXPOSE 5000

# 환경 변수
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# 시작 명령
CMD ["flask", "run"]
```

### Java Spring Boot 애플리케이션

```dockerfile
# 다단계 빌드
FROM openjdk:11-jdk-slim AS builder

WORKDIR /app
COPY . .
RUN ./gradlew build -x test

FROM openjdk:11-jre-slim AS production

# 사용자 생성
RUN useradd --create-home --shell /bin/bash spring

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 사용자 전환
USER spring

# 포트 노출
EXPOSE 8080

# JVM 옵션 설정
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# 시작 명령
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Nginx 정적 사이트

```dockerfile
# 다단계 빌드 - React 앱 예제
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production

# 커스텀 nginx 설정
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# nginx 시작
CMD ["nginx", "-g", "daemon off;"]
```

## 최적화 기법

### 레이어 캐싱 최적화

```dockerfile
# 나쁜 예 - 코드 변경 시 의존성도 다시 설치
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]

# 좋은 예 - 의존성은 캐시 활용
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### 이미지 크기 최적화

```dockerfile
# Alpine 이미지 사용
FROM node:16-alpine

# 불필요한 패키지 제거
RUN apk add --no-cache python3 make g++ && \
    npm install && \
    apk del python3 make g++

# 다단계 빌드로 빌드 도구 제거
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

### .dockerignore 파일

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
.coverage.*
.cache
.DS_Store
*.log
```

## 보안 모범 사례

### 보안 강화 Dockerfile

```dockerfile
FROM node:16-alpine

# 보안 업데이트
RUN apk update && apk upgrade

# 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm ci --only=production && \
    npm cache clean --force

# 애플리케이션 코드 복사
COPY --chown=nextjs:nodejs . .

# 불필요한 파일 제거
RUN rm -rf /tmp/* /var/cache/apk/*

# 사용자 전환
USER nextjs

# 읽기 전용 루트 파일시스템
# docker run --read-only 옵션과 함께 사용

EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

## Docker Compose와 함께 사용

### docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 빌드 인자 사용

```dockerfile
# Dockerfile
FROM node:16-alpine

# 빌드 인자 정의
ARG NODE_ENV=development
ARG API_URL=http://localhost:3001

# 환경 변수로 설정
ENV NODE_ENV=${NODE_ENV}
ENV REACT_APP_API_URL=${API_URL}

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 조건부 빌드
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

CMD ["npm", "start"]
```

```bash
# 빌드 시 인자 전달
docker build --build-arg NODE_ENV=production --build-arg API_URL=https://api.example.com -t my-app .
```

## 유용한 빌드 명령어

```bash
# 기본 빌드
docker build -t my-app .

# 특정 Dockerfile 사용
docker build -f Dockerfile.prod -t my-app:prod .

# 빌드 컨텍스트 제외
docker build -t my-app --no-cache .

# 빌드 로그 확인
docker build -t my-app --progress=plain .

# 다중 플랫폼 빌드 (buildx)
docker buildx build --platform linux/amd64,linux/arm64 -t my-app .

# 이미지 레이어 분석
docker history my-app
docker image inspect my-app
```

## 트러블슈팅

### 일반적인 문제들

```dockerfile
# 문제: 권한 에러
# 해결: 파일 소유권 설정
COPY --chown=user:group . .

# 문제: 캐시 무효화
# 해결: .dockerignore 사용 또는 --no-cache 옵션

# 문제: 이미지 크기 큰 경우
# 해결: 다단계 빌드, Alpine 이미지, 불필요한 파일 제거

# 문제: 빌드 시간 오래 걸림
# 해결: 레이어 순서 최적화, 의존성 먼저 복사
```

이제 Docker 디렉터리에 두 개의 추가 문서가 생성되었습니다! `/docs/docker` 페이지에서 문서 목록을 확인할 수 있습니다. 