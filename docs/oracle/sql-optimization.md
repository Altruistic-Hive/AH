---
sidebar_position: 2
---

# Oracle SQL 최적화

Oracle 데이터베이스에서 SQL 쿼리의 성능을 최적화하는 방법을 학습합니다.

## 실행 계획 분석

### EXPLAIN PLAN 사용

```sql
-- 실행 계획 생성
EXPLAIN PLAN FOR
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.salary > 50000;

-- 실행 계획 조회
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

### 실행 계획 해석

```sql
-- 더 자세한 실행 계획
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY(NULL, NULL, 'BASIC +COST +BYTES'));

-- 실제 실행 통계 포함
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(NULL, NULL, 'ALLSTATS LAST'));
```

## 인덱스 최적화

### 인덱스 생성 전략

```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_emp_salary ON employees(salary);

-- 복합 인덱스 (선택도가 높은 컬럼을 앞에)
CREATE INDEX idx_emp_dept_salary ON employees(department_id, salary);

-- 함수 기반 인덱스
CREATE INDEX idx_emp_upper_name ON employees(UPPER(first_name));

-- 부분 인덱스
CREATE INDEX idx_active_emp ON employees(employee_id) 
WHERE status = 'ACTIVE';
```

### 인덱스 사용 확인

```sql
-- 인덱스 사용 여부 확인
SELECT /*+ INDEX(e idx_emp_salary) */ 
       employee_id, first_name, salary
FROM employees e
WHERE salary > 50000;

-- 인덱스 통계 확인
SELECT index_name, num_rows, distinct_keys, clustering_factor
FROM user_indexes
WHERE table_name = 'EMPLOYEES';
```

## 힌트 사용

### 조인 힌트

```sql
-- NESTED LOOP 조인 강제
SELECT /*+ USE_NL(e d) */ 
       e.first_name, d.department_name
FROM employees e, departments d
WHERE e.department_id = d.department_id;

-- HASH 조인 강제
SELECT /*+ USE_HASH(e d) */ 
       e.first_name, d.department_name
FROM employees e, departments d
WHERE e.department_id = d.department_id;

-- MERGE 조인 강제
SELECT /*+ USE_MERGE(e d) */ 
       e.first_name, d.department_name
FROM employees e, departments d
WHERE e.department_id = d.department_id
ORDER BY e.department_id;
```

### 인덱스 힌트

```sql
-- 특정 인덱스 사용 강제
SELECT /*+ INDEX(e idx_emp_salary) */ 
       employee_id, salary
FROM employees e
WHERE salary BETWEEN 30000 AND 80000;

-- 인덱스 스캔 방식 지정
SELECT /*+ INDEX_FFS(e idx_emp_dept_salary) */ 
       COUNT(*)
FROM employees e;

-- 병렬 처리 힌트
SELECT /*+ PARALLEL(e, 4) */ 
       department_id, COUNT(*)
FROM employees e
GROUP BY department_id;
```

## 쿼리 재작성

### EXISTS vs IN

```sql
-- 비효율적인 IN 사용
SELECT employee_id, first_name
FROM employees
WHERE department_id IN (
    SELECT department_id 
    FROM departments 
    WHERE location_id = 1700
);

-- 효율적인 EXISTS 사용
SELECT employee_id, first_name
FROM employees e
WHERE EXISTS (
    SELECT 1 
    FROM departments d 
    WHERE d.department_id = e.department_id 
    AND d.location_id = 1700
);
```

### 서브쿼리 최적화

```sql
-- 비효율적인 스칼라 서브쿼리
SELECT employee_id, first_name,
       (SELECT department_name 
        FROM departments d 
        WHERE d.department_id = e.department_id) as dept_name
FROM employees e;

-- 효율적인 조인 사용
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

## 통계 정보 관리

### 통계 수집

```sql
-- 테이블 통계 수집
EXEC DBMS_STATS.GATHER_TABLE_STATS('HR', 'EMPLOYEES');

-- 스키마 전체 통계 수집
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('HR');

-- 시스템 통계 수집
EXEC DBMS_STATS.GATHER_SYSTEM_STATS();

-- 자동 통계 수집 설정
EXEC DBMS_STATS.SET_GLOBAL_PREFS('AUTOSTATS_TARGET', 'AUTO');
```

### 통계 정보 확인

```sql
-- 테이블 통계 확인
SELECT table_name, num_rows, blocks, avg_row_len, last_analyzed
FROM user_tables
WHERE table_name = 'EMPLOYEES';

-- 컬럼 통계 확인
SELECT column_name, num_distinct, density, num_nulls, histogram
FROM user_tab_col_statistics
WHERE table_name = 'EMPLOYEES';

-- 인덱스 통계 확인
SELECT index_name, blevel, leaf_blocks, distinct_keys, clustering_factor
FROM user_indexes
WHERE table_name = 'EMPLOYEES';
```

## 파티셔닝 활용

### 범위 파티셔닝

```sql
-- 날짜 기준 파티셔닝
CREATE TABLE sales_data (
    sale_id NUMBER,
    sale_date DATE,
    amount NUMBER
)
PARTITION BY RANGE (sale_date) (
    PARTITION p2023q1 VALUES LESS THAN (DATE '2023-04-01'),
    PARTITION p2023q2 VALUES LESS THAN (DATE '2023-07-01'),
    PARTITION p2023q3 VALUES LESS THAN (DATE '2023-10-01'),
    PARTITION p2023q4 VALUES LESS THAN (DATE '2024-01-01')
);

-- 파티션 프루닝 활용
SELECT * FROM sales_data
WHERE sale_date BETWEEN DATE '2023-01-01' AND DATE '2023-03-31';
```

### 해시 파티셔닝

```sql
-- 균등 분산을 위한 해시 파티셔닝
CREATE TABLE customer_data (
    customer_id NUMBER,
    customer_name VARCHAR2(100),
    region VARCHAR2(50)
)
PARTITION BY HASH (customer_id)
PARTITIONS 4;
```

## SQL 성능 모니터링

### AWR 리포트 활용

```sql
-- AWR 스냅샷 생성
EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT();

-- AWR 리포트 생성
SELECT output FROM TABLE(DBMS_WORKLOAD_REPOSITORY.AWR_REPORT_TEXT(
    l_dbid => (SELECT dbid FROM v$database),
    l_inst_num => 1,
    l_bid => 100,  -- 시작 스냅샷 ID
    l_eid => 101   -- 종료 스냅샷 ID
));
```

### 실시간 성능 모니터링

```sql
-- 현재 실행 중인 느린 쿼리 확인
SELECT s.sid, s.serial#, s.username, s.program,
       q.sql_text, s.last_call_et
FROM v$session s, v$sql q
WHERE s.sql_hash_value = q.hash_value
AND s.last_call_et > 300  -- 5분 이상 실행
AND s.status = 'ACTIVE';

-- 대기 이벤트 확인
SELECT event, total_waits, time_waited, average_wait
FROM v$system_event
WHERE event NOT LIKE 'SQL*Net%'
ORDER BY time_waited DESC;
```

## 메모리 최적화

### SGA 튜닝

```sql
-- SGA 구성 요소 확인
SELECT component, current_size/1024/1024 as size_mb
FROM v$sga_dynamic_components;

-- 버퍼 캐시 히트율 확인
SELECT name, value
FROM v$sysstat
WHERE name IN ('db block gets', 'consistent gets', 'physical reads');

-- 공유 풀 사용률 확인
SELECT pool, name, bytes/1024/1024 as size_mb
FROM v$sgastat
WHERE pool = 'shared pool'
ORDER BY bytes DESC;
```

### PGA 튜닝

```sql
-- PGA 사용률 확인
SELECT name, value/1024/1024 as value_mb
FROM v$pgastat
WHERE name IN ('total PGA allocated', 'total PGA used for auto workareas');

-- 정렬 작업 모니터링
SELECT sql_id, operation_type, work_area_size/1024 as workarea_kb,
       max_tempseg_size/1024 as temp_kb
FROM v$sql_workarea_active;
```

## 실무 최적화 팁

### 대용량 데이터 처리

```sql
-- 배치 처리를 위한 BULK COLLECT
DECLARE
    CURSOR c_employees IS
        SELECT employee_id, salary FROM employees;
    TYPE t_emp_array IS TABLE OF c_employees%ROWTYPE;
    l_employees t_emp_array;
BEGIN
    OPEN c_employees;
    LOOP
        FETCH c_employees BULK COLLECT INTO l_employees LIMIT 1000;
        
        -- 배치 처리 로직
        FORALL i IN 1..l_employees.COUNT
            UPDATE employees 
            SET salary = l_employees(i).salary * 1.1
            WHERE employee_id = l_employees(i).employee_id;
            
        COMMIT;
        EXIT WHEN c_employees%NOTFOUND;
    END LOOP;
    CLOSE c_employees;
END;
/
```

### 효율적인 데이터 로딩

```sql
-- DIRECT PATH INSERT 사용
INSERT /*+ APPEND */ INTO target_table
SELECT * FROM source_table WHERE condition;

-- NOLOGGING 모드 활용 (백업 필요)
ALTER TABLE target_table NOLOGGING;
INSERT /*+ APPEND */ INTO target_table SELECT * FROM source_table;
ALTER TABLE target_table LOGGING;
```

이제 Oracle 디렉터리에도 2개의 문서가 생겼습니다! 