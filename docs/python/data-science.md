---
sidebar_position: 2
---

# Python 데이터 과학

Python을 사용한 데이터 과학의 핵심 라이브러리들과 기본 개념을 학습합니다.

## NumPy - 수치 계산

NumPy는 Python에서 수치 계산을 위한 기본 라이브러리입니다.

```python
import numpy as np

# 배열 생성
arr = np.array([1, 2, 3, 4, 5])
print(arr)  # [1 2 3 4 5]

# 2차원 배열
matrix = np.array([[1, 2, 3], [4, 5, 6]])
print(matrix)
# [[1 2 3]
#  [4 5 6]]

# 기본 통계
print(f"평균: {arr.mean()}")
print(f"표준편차: {arr.std()}")
print(f"최대값: {arr.max()}")
print(f"최소값: {arr.min()}")

# 배열 연산
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])
print(arr1 + arr2)  # [5 7 9]
print(arr1 * arr2)  # [4 10 18]
```

## Pandas - 데이터 분석

Pandas는 데이터 분석과 조작을 위한 강력한 라이브러리입니다.

```python
import pandas as pd

# DataFrame 생성
data = {
    '이름': ['홍길동', '김철수', '이영희', '박민수'],
    '나이': [25, 30, 28, 35],
    '직업': ['개발자', '디자이너', '마케터', '엔지니어'],
    '급여': [3000000, 2500000, 2800000, 3500000]
}

df = pd.DataFrame(data)
print(df)

# 기본 정보 확인
print(df.info())
print(df.describe())

# 데이터 선택
print(df['이름'])  # 특정 열 선택
print(df.iloc[0])  # 첫 번째 행 선택
print(df.loc[df['나이'] > 30])  # 조건에 맞는 행 선택

# 데이터 정렬
df_sorted = df.sort_values('급여', ascending=False)
print(df_sorted)

# 그룹화
job_salary = df.groupby('직업')['급여'].mean()
print(job_salary)
```

## Matplotlib - 데이터 시각화

Matplotlib은 데이터를 시각화하는 기본 라이브러리입니다.

```python
import matplotlib.pyplot as plt
import numpy as np

# 한글 폰트 설정 (Windows)
plt.rcParams['font.family'] = 'Malgun Gothic'

# 선 그래프
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', label='sin(x)')
plt.title('사인 함수 그래프')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.show()

# 막대 그래프
categories = ['개발자', '디자이너', '마케터', '엔지니어']
salaries = [3000000, 2500000, 2800000, 3500000]

plt.figure(figsize=(8, 6))
plt.bar(categories, salaries, color=['red', 'blue', 'green', 'orange'])
plt.title('직업별 평균 급여')
plt.xlabel('직업')
plt.ylabel('급여 (원)')
plt.xticks(rotation=45)
plt.show()

# 산점도
np.random.seed(42)
x = np.random.randn(100)
y = 2 * x + np.random.randn(100) * 0.5

plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6)
plt.title('산점도 예제')
plt.xlabel('x')
plt.ylabel('y')
plt.show()
```

## Scikit-learn - 머신러닝

Scikit-learn은 머신러닝을 위한 대표적인 라이브러리입니다.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# 샘플 데이터 생성
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 3 * X.flatten() + 2 + np.random.randn(100) * 0.5

# 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 모델 학습
model = LinearRegression()
model.fit(X_train, y_train)

# 예측
y_pred = model.predict(X_test)

# 모델 평가
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"평균 제곱 오차: {mse:.4f}")
print(f"R² 점수: {r2:.4f}")
print(f"계수: {model.coef_[0]:.4f}")
print(f"절편: {model.intercept_:.4f}")

# 시각화
plt.figure(figsize=(8, 6))
plt.scatter(X_test, y_test, color='blue', alpha=0.6, label='실제값')
plt.plot(X_test, y_pred, color='red', linewidth=2, label='예측값')
plt.title('선형 회귀 모델')
plt.xlabel('X')
plt.ylabel('y')
plt.legend()
plt.show()
```

## 데이터 전처리

```python
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# 결측값 처리
imputer = SimpleImputer(strategy='mean')
df['나이'] = imputer.fit_transform(df[['나이']])

# 범주형 데이터 인코딩
le = LabelEncoder()
df['직업_인코딩'] = le.fit_transform(df['직업'])

# 특성 스케일링
scaler = StandardScaler()
df[['나이', '급여']] = scaler.fit_transform(df[['나이', '급여']])

print(df)
```

## 실습 프로젝트: 주택 가격 예측

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import matplotlib.pyplot as plt

# 샘플 주택 데이터 생성
np.random.seed(42)
n_samples = 1000

data = {
    '면적': np.random.normal(100, 30, n_samples),
    '방개수': np.random.randint(1, 6, n_samples),
    '층수': np.random.randint(1, 21, n_samples),
    '건축년도': np.random.randint(1980, 2024, n_samples),
    '지하철거리': np.random.exponential(500, n_samples)
}

# 가격 계산 (실제로는 더 복잡한 공식)
data['가격'] = (
    data['면적'] * 10000 + 
    data['방개수'] * 5000000 + 
    data['층수'] * 100000 + 
    (data['건축년도'] - 1980) * 50000 - 
    data['지하철거리'] * 1000 + 
    np.random.normal(0, 5000000, n_samples)
)

df = pd.DataFrame(data)

# 모델 학습
X = df.drop('가격', axis=1)
y = df['가격']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 예측 및 평가
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)

print(f"평균 절대 오차: {mae:,.0f}원")
print(f"특성 중요도:")
for feature, importance in zip(X.columns, model.feature_importances_):
    print(f"  {feature}: {importance:.4f}")
``` 