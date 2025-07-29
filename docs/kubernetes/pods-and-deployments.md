---
sidebar_position: 2
---

# Pods와 Deployments

Kubernetes의 핵심 개념인 Pod와 Deployment의 사용법을 학습합니다.

## Pod란?

Pod는 Kubernetes에서 배포 가능한 가장 작은 단위입니다. 하나 이상의 컨테이너를 포함하며, 같은 Pod 내의 컨테이너들은 네트워크와 스토리지를 공유합니다.

### 기본 Pod 생성

```yaml
# simple-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
  labels:
    app: my-app
spec:
  containers:
  - name: my-app-container
    image: nginx:1.21
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

```bash
# Pod 생성
kubectl apply -f simple-pod.yaml

# Pod 상태 확인
kubectl get pods

# Pod 세부 정보 확인
kubectl describe pod my-app-pod

# Pod 로그 확인
kubectl logs my-app-pod

# Pod 삭제
kubectl delete pod my-app-pod
```

### 다중 컨테이너 Pod

```yaml
# multi-container-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
  - name: web-server
    image: nginx:1.21
    ports:
    - containerPort: 80
    volumeMounts:
    - name: shared-data
      mountPath: /usr/share/nginx/html
  
  - name: content-puller
    image: alpine/git
    command: ['sh', '-c']
    args:
    - |
      while true; do
        git clone https://github.com/example/website.git /tmp/repo
        cp -r /tmp/repo/* /shared/
        rm -rf /tmp/repo
        sleep 3600
      done
    volumeMounts:
    - name: shared-data
      mountPath: /shared
  
  volumes:
  - name: shared-data
    emptyDir: {}
```

## Deployment란?

Deployment는 Pod의 복제본을 관리하고, 롤링 업데이트를 제공하는 컨트롤러입니다.

### 기본 Deployment 생성

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

```bash
# Deployment 생성
kubectl apply -f nginx-deployment.yaml

# Deployment 상태 확인
kubectl get deployments

# Pod 확인 (Deployment가 생성한 Pod들)
kubectl get pods -l app=nginx

# Deployment 세부 정보
kubectl describe deployment nginx-deployment
```

### Deployment 관리 명령어

```bash
# 레플리카 수 변경 (스케일링)
kubectl scale deployment nginx-deployment --replicas=5

# 이미지 업데이트 (롤링 업데이트)
kubectl set image deployment/nginx-deployment nginx=nginx:1.22

# 롤아웃 상태 확인
kubectl rollout status deployment/nginx-deployment

# 롤아웃 히스토리 확인
kubectl rollout history deployment/nginx-deployment

# 이전 버전으로 롤백
kubectl rollout undo deployment/nginx-deployment

# 특정 리비전으로 롤백
kubectl rollout undo deployment/nginx-deployment --to-revision=2
```

## 환경 변수와 ConfigMap

### 환경 변수 설정

```yaml
# app-with-env.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-env
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: node:16-alpine
        command: ['node', '-e']
        args:
        - |
          console.log('Environment:', process.env.NODE_ENV);
          console.log('Database URL:', process.env.DATABASE_URL);
          console.log('API Key:', process.env.API_KEY);
          setInterval(() => console.log('App running...'), 5000);
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          value: "postgresql://user:pass@db:5432/mydb"
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secret
              key: api-key
```

### ConfigMap 사용

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database.properties: |
    host=db.example.com
    port=5432
    name=myapp
  app.properties: |
    debug=true
    log.level=info
  config.json: |
    {
      "server": {
        "port": 8080,
        "host": "0.0.0.0"
      },
      "features": {
        "cache": true,
        "metrics": true
      }
    }
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-configmap
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: nginx:1.21
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
        env:
        - name: DATABASE_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database.properties
      volumes:
      - name: config-volume
        configMap:
          name: app-config
```

## Secret 관리

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=  # base64로 인코딩된 'admin'
  password: cGFzc3dvcmQ=  # base64로 인코딩된 'password'
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-secret
spec:
  replicas: 1
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      containers:
      - name: app
        image: postgres:13
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
```

```bash
# Secret 생성 (명령어로)
kubectl create secret generic my-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123

# Secret 확인
kubectl get secrets
kubectl describe secret my-secret
```

## 헬스체크 (Liveness & Readiness Probes)

```yaml
# app-with-probes.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-probes
spec:
  replicas: 2
  selector:
    matchLabels:
      app: healthy-app
  template:
    metadata:
      labels:
        app: healthy-app
    spec:
      containers:
      - name: web-app
        image: nginx:1.21
        ports:
        - containerPort: 80
        
        # Readiness Probe - 트래픽을 받을 준비가 되었는지 확인
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
        
        # Liveness Probe - 컨테이너가 살아있는지 확인
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 20
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
        
        # Startup Probe - 컨테이너가 시작되었는지 확인
        startupProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 30
```

## 리소스 관리와 노드 선택

```yaml
# resource-management.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resource-managed-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: resource-app
  template:
    metadata:
      labels:
        app: resource-app
    spec:
      # 노드 선택자
      nodeSelector:
        disk: ssd
        
      # 노드 어피니티
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: kubernetes.io/arch
                operator: In
                values:
                - amd64
        
        # Pod 어피니티 (같은 노드에 배치)
        podAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - cache
              topologyKey: kubernetes.io/hostname
      
      containers:
      - name: app
        image: nginx:1.21
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        
        # 보안 컨텍스트
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
```

## 유용한 kubectl 명령어

```bash
# Pod 실행 중인 컨테이너에 접속
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -c <container-name> -- /bin/sh

# 포트 포워딩
kubectl port-forward pod/<pod-name> 8080:80
kubectl port-forward deployment/<deployment-name> 8080:80

# 리소스 사용량 확인
kubectl top pods
kubectl top nodes

# 이벤트 확인
kubectl get events --sort-by=.metadata.creationTimestamp

# 라벨 관리
kubectl label pod <pod-name> environment=production
kubectl get pods -l environment=production

# 어노테이션 추가
kubectl annotate pod <pod-name> description="My application pod"

# YAML 출력
kubectl get pod <pod-name> -o yaml
kubectl get deployment <deployment-name> -o yaml

# 리소스 삭제
kubectl delete pod <pod-name>
kubectl delete deployment <deployment-name>
kubectl delete -f deployment.yaml
``` 