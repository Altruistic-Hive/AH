---
sidebar_position: 2
---

# EC2 기초

Amazon Elastic Compute Cloud(EC2)는 AWS의 핵심 컴퓨팅 서비스입니다.

## EC2란?

EC2는 클라우드에서 확장 가능한 컴퓨팅 용량을 제공하는 서비스입니다. 가상 서버를 몇 분 안에 시작할 수 있으며, 필요에 따라 용량을 늘리거나 줄일 수 있습니다.

## 인스턴스 유형

### 범용 인스턴스
- **t3, t4g**: 버스트 가능한 성능
- **m5, m6i**: 균형 잡힌 컴퓨팅, 메모리, 네트워킹

### 컴퓨팅 최적화
- **c5, c6i**: 고성능 프로세서

### 메모리 최적화
- **r5, r6i**: 메모리 집약적 애플리케이션

### 스토리지 최적화
- **i3, i4i**: 높은 순차 읽기/쓰기

## 기본 사용법

### 1. 인스턴스 시작
```bash
# AWS CLI로 인스턴스 시작
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --count 1 \
    --instance-type t3.micro \
    --key-name my-key-pair \
    --security-group-ids sg-903004f8 \
    --subnet-id subnet-6e7f829e
```

### 2. 인스턴스 연결
```bash
# SSH로 연결
ssh -i "my-key.pem" ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```

### 3. 인스턴스 관리
```bash
# 인스턴스 중지
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# 인스턴스 시작
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# 인스턴스 종료
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0
```

## 보안 그룹

보안 그룹은 EC2 인스턴스의 가상 방화벽 역할을 합니다.

```bash
# 보안 그룹 생성
aws ec2 create-security-group \
    --group-name my-security-group \
    --description "My security group"

# 인바운드 규칙 추가 (SSH)
aws ec2 authorize-security-group-ingress \
    --group-id sg-903004f8 \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

# 인바운드 규칙 추가 (HTTP)
aws ec2 authorize-security-group-ingress \
    --group-id sg-903004f8 \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0
```

## 키 페어

EC2 인스턴스에 안전하게 연결하기 위한 키 페어를 관리합니다.

```bash
# 키 페어 생성
aws ec2 create-key-pair \
    --key-name my-key-pair \
    --query 'KeyMaterial' \
    --output text > my-key-pair.pem

# 키 파일 권한 설정
chmod 400 my-key-pair.pem

# 키 페어 목록 확인
aws ec2 describe-key-pairs
```

## 사용자 데이터

인스턴스 시작 시 자동으로 실행할 스크립트를 지정할 수 있습니다.

```bash
# 사용자 데이터와 함께 인스턴스 시작
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --count 1 \
    --instance-type t3.micro \
    --key-name my-key-pair \
    --security-group-ids sg-903004f8 \
    --user-data file://my-script.sh
```

```bash
#!/bin/bash
# my-script.sh
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from EC2!</h1>" > /var/www/html/index.html
```

## 모니터링

### CloudWatch 메트릭
- CPU 사용률
- 네트워크 In/Out
- 디스크 읽기/쓰기

### 상세 모니터링 활성화
```bash
aws ec2 monitor-instances --instance-ids i-1234567890abcdef0
```

## 비용 최적화

### 1. 예약 인스턴스
- 1년 또는 3년 약정으로 최대 75% 할인

### 2. 스팟 인스턴스
- 온디맨드 가격의 최대 90% 할인
- 중단 가능한 워크로드에 적합

```bash
# 스팟 인스턴스 요청
aws ec2 request-spot-instances \
    --spot-price "0.05" \
    --instance-count 1 \
    --type "one-time" \
    --launch-specification file://specification.json
```

### 3. 인스턴스 크기 조정
```bash
# 인스턴스 중지
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# 인스턴스 유형 변경
aws ec2 modify-instance-attribute \
    --instance-id i-1234567890abcdef0 \
    --instance-type "{\"Value\": \"t3.small\"}"

# 인스턴스 시작
aws ec2 start-instances --instance-ids i-1234567890abcdef0
```

## 백업과 복구

### AMI 생성
```bash
# AMI 생성
aws ec2 create-image \
    --instance-id i-1234567890abcdef0 \
    --name "My server backup" \
    --description "Backup of my server"
```

### 스냅샷 생성
```bash
# EBS 볼륨 스냅샷 생성
aws ec2 create-snapshot \
    --volume-id vol-1234567890abcdef0 \
    --description "My snapshot"
```

이제 AWS 디렉터리에 2개의 문서가 있어서 카테고리가 제대로 동작할 것입니다! 