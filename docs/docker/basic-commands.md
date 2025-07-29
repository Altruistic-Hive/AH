---
sidebar_position: 2
---

# Docker 기본 명령어

Docker를 사용하기 위한 필수 명령어들과 실습 예제를 학습합니다.

## 이미지 관리

### 이미지 검색 및 다운로드

```bash
# Docker Hub에서 이미지 검색
docker search nginx
docker search ubuntu

# 이미지 다운로드 (pull)
docker pull nginx
docker pull nginx:1.21
docker pull ubuntu:20.04

# 로컬 이미지 목록 확인
docker images
docker image ls

# 이미지 상세 정보 확인
docker inspect nginx:latest
docker history nginx:latest
```

### 이미지 삭제

```bash
# 특정 이미지 삭제
docker rmi nginx:latest
docker image rm ubuntu:20.04

# 사용하지 않는 이미지 모두 삭제
docker image prune

# 모든 이미지 삭제 (위험!)
docker rmi $(docker images -q)
```

## 컨테이너 실행

### 기본 컨테이너 실행

```bash
# 기본 실행
docker run hello-world

# 백그라운드 실행 (-d, --detach)
docker run -d nginx

# 포트 매핑 (-p, --publish)
docker run -d -p 8080:80 nginx

# 컨테이너 이름 지정 (--name)
docker run -d --name my-nginx -p 8080:80 nginx

# 환경 변수 설정 (-e, --env)
docker run -d --name my-app -e NODE_ENV=production -p 3000:3000 node:16

# 대화형 모드 (-i, --interactive / -t, --tty)
docker run -it ubuntu:20.04 bash
docker run -it --name my-ubuntu ubuntu:20.04 /bin/bash
```

### 볼륨 마운트

```bash
# 호스트 디렉터리 마운트 (-v, --volume)
docker run -d --name web-server -p 8080:80 -v /host/path:/container/path nginx

# 현재 디렉터리 마운트
docker run -d --name web-server -p 8080:80 -v $(pwd):/usr/share/nginx/html nginx

# Docker 볼륨 사용
docker volume create my-volume
docker run -d --name app -v my-volume:/data alpine

# 읽기 전용 마운트
docker run -d --name web-server -p 8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx
```

## 컨테이너 관리

### 컨테이너 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 상세 정보
docker inspect my-nginx

# 컨테이너 로그 확인
docker logs my-nginx
docker logs -f my-nginx  # 실시간 로그
docker logs --tail 100 my-nginx  # 최근 100줄
```

### 컨테이너 제어

```bash
# 컨테이너 시작/중지/재시작
docker start my-nginx
docker stop my-nginx
docker restart my-nginx

# 컨테이너 일시 중지/재개
docker pause my-nginx
docker unpause my-nginx

# 컨테이너 강제 종료
docker kill my-nginx

# 컨테이너 삭제
docker rm my-nginx

# 중지된 모든 컨테이너 삭제
docker container prune
```

### 컨테이너 내부 접근

```bash
# 실행 중인 컨테이너에 명령 실행
docker exec -it my-nginx bash
docker exec -it my-nginx /bin/sh

# 단일 명령 실행
docker exec my-nginx ls -la /usr/share/nginx/html
docker exec my-nginx cat /etc/nginx/nginx.conf

# 파일 복사
docker cp ./index.html my-nginx:/usr/share/nginx/html/
docker cp my-nginx:/var/log/nginx/access.log ./access.log
```

## 실습 예제

### 웹 서버 실행

```bash
# 1. 간단한 Nginx 웹 서버
docker run -d --name web-server -p 8080:80 nginx

# 2. 커스텀 HTML 파일 서빙
mkdir -p ./html
echo "<h1>Hello Docker!</h1>" > ./html/index.html
docker run -d --name custom-web -p 8081:80 -v $(pwd)/html:/usr/share/nginx/html nginx

# 3. 웹 서버 테스트
curl http://localhost:8080
curl http://localhost:8081
```

### 데이터베이스 실행

```bash
# MySQL 데이터베이스
docker run -d --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=password \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# PostgreSQL 데이터베이스
docker run -d --name postgres-db \
  -e POSTGRES_DB=myapp \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:13

# Redis 캐시
docker run -d --name redis-cache -p 6379:6379 redis:6.2
```

### Node.js 애플리케이션

```bash
# 1. 간단한 Node.js 앱 생성
mkdir node-app && cd node-app
cat > app.js << 'EOF'
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Node.js in Docker!</h1>');
});
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
EOF

# 2. package.json 생성
cat > package.json << 'EOF'
{
  "name": "docker-node-app",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  }
}
EOF

# 3. Docker로 실행
docker run -d --name node-app -p 3000:3000 -v $(pwd):/usr/src/app -w /usr/src/app node:16 npm start
```

## Docker 네트워킹

### 네트워크 관리

```bash
# 네트워크 목록 확인
docker network ls

# 커스텀 네트워크 생성
docker network create my-network

# 네트워크 상세 정보
docker network inspect my-network

# 컨테이너를 특정 네트워크에 연결
docker run -d --name app1 --network my-network nginx
docker run -d --name app2 --network my-network nginx

# 기존 컨테이너를 네트워크에 연결/해제
docker network connect my-network existing-container
docker network disconnect my-network existing-container
```

### 컨테이너 간 통신

```bash
# 1. 웹 애플리케이션과 데이터베이스 연결
docker network create app-network

# 데이터베이스 실행
docker run -d --name database --network app-network \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=appdb \
  mysql:8.0

# 웹 애플리케이션 실행 (데이터베이스에 연결)
docker run -d --name webapp --network app-network -p 8080:80 \
  -e DB_HOST=database \
  -e DB_NAME=appdb \
  -e DB_USER=root \
  -e DB_PASS=rootpass \
  nginx
```

## 볼륨 관리

### Docker 볼륨

```bash
# 볼륨 생성
docker volume create my-data

# 볼륨 목록 확인
docker volume ls

# 볼륨 상세 정보
docker volume inspect my-data

# 볼륨 사용
docker run -d --name app -v my-data:/app/data alpine

# 사용하지 않는 볼륨 삭제
docker volume prune

# 특정 볼륨 삭제
docker volume rm my-data
```

### 바인드 마운트 vs 볼륨

```bash
# 바인드 마운트 (호스트 경로 직접 마운트)
docker run -d --name app1 -v /host/path:/container/path nginx

# 볼륨 마운트 (Docker가 관리)
docker run -d --name app2 -v my-volume:/container/path nginx

# tmpfs 마운트 (메모리에 마운트)
docker run -d --name app3 --tmpfs /tmp nginx
```

## 리소스 관리

### 리소스 제한

```bash
# 메모리 제한
docker run -d --name limited-app -m 512m nginx

# CPU 제한
docker run -d --name cpu-limited --cpus="1.5" nginx

# 메모리와 CPU 동시 제한
docker run -d --name resource-limited -m 1g --cpus="2" nginx

# 리소스 사용량 확인
docker stats
docker stats limited-app
```

## 정리 명령어

### 시스템 정리

```bash
# 중지된 컨테이너, 사용하지 않는 네트워크, 이미지, 빌드 캐시 정리
docker system prune

# 모든 것 정리 (실행 중이지 않은 모든 리소스)
docker system prune -a

# 특정 리소스만 정리
docker container prune  # 중지된 컨테이너
docker image prune      # 사용하지 않는 이미지
docker network prune    # 사용하지 않는 네트워크
docker volume prune     # 사용하지 않는 볼륨

# 시스템 정보 확인
docker system df        # 디스크 사용량
docker system info      # 시스템 정보
```

## 유용한 팁

### 한 번에 여러 작업

```bash
# 모든 컨테이너 중지
docker stop $(docker ps -q)

# 모든 컨테이너 삭제
docker rm $(docker ps -aq)

# 모든 이미지 삭제
docker rmi $(docker images -q)

# 특정 패턴의 컨테이너만 중지
docker stop $(docker ps -q --filter "name=web*")
```

### 디버깅

```bash
# 컨테이너 프로세스 확인
docker top my-container

# 컨테이너 변경사항 확인
docker diff my-container

# 컨테이너를 이미지로 저장
docker commit my-container my-custom-image

# 이미지를 파일로 저장/로드
docker save nginx > nginx.tar
docker load < nginx.tar

# 컨테이너를 파일로 내보내기/가져오기
docker export my-container > container.tar
docker import container.tar my-imported-image
```

### 로그 관리

```bash
# 로그 크기 제한
docker run -d --name app --log-opt max-size=10m --log-opt max-file=3 nginx

# 로그 드라이버 변경
docker run -d --name app --log-driver json-file nginx

# 로그 실시간 모니터링
docker logs -f --since 2h my-container
docker logs -f --until 2021-01-01T00:00:00 my-container
``` 