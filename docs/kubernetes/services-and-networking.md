---
sidebar_position: 3
---

# Services와 네트워킹

Kubernetes에서 Pod 간 통신과 외부 접근을 위한 Service와 네트워킹 개념을 학습합니다.

## Service란?

Service는 Pod들에 대한 안정적인 네트워크 엔드포인트를 제공합니다. Pod는 언제든지 재시작되거나 교체될 수 있지만, Service는 일관된 IP와 DNS 이름을 제공합니다.

## Service 타입

### 1. ClusterIP (기본값)

클러스터 내부에서만 접근 가능한 서비스입니다.

```yaml
# clusterip-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
  - port: 80        # 서비스 포트
    targetPort: 8080 # Pod의 컨테이너 포트
    protocol: TCP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: nginx:1.21
        ports:
        - containerPort: 8080
```

```bash
# 서비스 생성 및 확인
kubectl apply -f clusterip-service.yaml
kubectl get services
kubectl describe service my-app-service

# 클러스터 내부에서 서비스 테스트
kubectl run test-pod --image=curlimages/curl -it --rm -- sh
# Pod 내부에서
curl http://my-app-service:80
```

### 2. NodePort

각 노드의 특정 포트를 통해 외부에서 접근 가능한 서비스입니다.

```yaml
# nodeport-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nodeport-service
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080  # 30000-32767 범위 (생략 시 자동 할당)
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

```bash
# NodePort 서비스 테스트
kubectl apply -f nodeport-service.yaml

# 노드 IP 확인
kubectl get nodes -o wide

# 브라우저나 curl로 접근
# http://<NODE_IP>:30080
```

### 3. LoadBalancer

클라우드 제공업체의 로드 밸런서를 사용하는 서비스입니다.

```yaml
# loadbalancer-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: loadbalancer-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"  # AWS NLB 사용
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  # loadBalancerSourceRanges:  # 특정 IP 범위만 허용
  # - 10.0.0.0/8
```

### 4. ExternalName

외부 서비스에 대한 DNS 별칭을 제공합니다.

```yaml
# externalname-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: external-database
spec:
  type: ExternalName
  externalName: db.example.com
  ports:
  - port: 5432
```

## Ingress

HTTP/HTTPS 트래픽을 라우팅하는 API 객체입니다.

### Ingress 설정

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
  - host: admin.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: admin-service
            port:
              number: 3000
```

### HTTPS와 TLS 설정

```yaml
# https-ingress.yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # base64 인코딩된 인증서
  tls.key: LS0tLS1CRUdJTi... # base64 인코딩된 개인키
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: https-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - secure.example.com
    secretName: tls-secret
  rules:
  - host: secure.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: secure-app-service
            port:
              number: 80
```

## NetworkPolicy

Pod 간의 네트워크 트래픽을 제어하는 방화벽 규칙입니다.

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-app-netpol
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  - Egress
  
  # 인바운드 트래픽 규칙
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    - namespaceSelector:
        matchLabels:
          name: production
    - ipBlock:
        cidr: 10.0.0.0/8
        except:
        - 10.0.1.0/24
    ports:
    - protocol: TCP
      port: 8080
  
  # 아웃바운드 트래픽 규칙
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
  - to: []  # 모든 외부 트래픽 허용
    ports:
    - protocol: TCP
      port: 53   # DNS
    - protocol: UDP
      port: 53   # DNS
```

## 고급 Service 설정

### Headless Service

```yaml
# headless-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-service
spec:
  clusterIP: None  # Headless 서비스
  selector:
    app: stateful-app
  ports:
  - port: 80
    targetPort: 80
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: stateful-app
spec:
  serviceName: headless-service
  replicas: 3
  selector:
    matchLabels:
      app: stateful-app
  template:
    metadata:
      labels:
        app: stateful-app
    spec:
      containers:
      - name: app
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### 다중 포트 Service

```yaml
# multi-port-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: multi-port-service
spec:
  selector:
    app: multi-port-app
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  - name: https
    port: 443
    targetPort: 8443
    protocol: TCP
  - name: metrics
    port: 9090
    targetPort: 9090
    protocol: TCP
```

### Session Affinity

```yaml
# session-affinity-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: sticky-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800  # 3시간
```

## DNS와 Service Discovery

```yaml
# dns-example.yaml
apiVersion: v1
kind: Pod
metadata:
  name: dns-test
spec:
  containers:
  - name: test
    image: busybox:1.35
    command: ['sleep', '3600']
```

```bash
# DNS 테스트
kubectl exec -it dns-test -- nslookup kubernetes.default
kubectl exec -it dns-test -- nslookup my-app-service
kubectl exec -it dns-test -- nslookup my-app-service.default.svc.cluster.local

# 다른 네임스페이스의 서비스 접근
kubectl exec -it dns-test -- nslookup service-name.namespace-name.svc.cluster.local
```

## 실습 예제: 완전한 웹 애플리케이션

```yaml
# complete-web-app.yaml
# Frontend 서비스
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: nginx:1.21
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
---
# Backend API 서비스
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: node:16-alpine
        command: ['node', '-e']
        args:
        - |
          const http = require('http');
          const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Hello from backend!', pod: process.env.HOSTNAME }));
          });
          server.listen(3000, () => console.log('Server running on port 3000'));
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 3000
---
# Ingress 설정
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /()(.*)
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

## 유용한 네트워킹 명령어

```bash
# 서비스 확인
kubectl get services
kubectl get svc -o wide
kubectl describe service <service-name>

# 엔드포인트 확인
kubectl get endpoints
kubectl describe endpoints <service-name>

# Ingress 확인
kubectl get ingress
kubectl describe ingress <ingress-name>

# NetworkPolicy 확인
kubectl get networkpolicies
kubectl describe networkpolicy <policy-name>

# 포트 포워딩으로 서비스 테스트
kubectl port-forward service/<service-name> 8080:80

# 서비스 연결 테스트
kubectl run test-pod --image=curlimages/curl -it --rm -- sh
# 또는
kubectl exec -it <existing-pod> -- curl http://<service-name>:<port>

# DNS 레코드 확인
kubectl exec -it <pod-name> -- nslookup <service-name>
kubectl exec -it <pod-name> -- dig <service-name>

# 네트워크 트러블슈팅
kubectl logs -l app=<app-name>
kubectl get events --sort-by=.metadata.creationTimestamp
``` 