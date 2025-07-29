---
sidebar_position: 2
---

# Spring Boot

Spring Boot는 Spring Framework를 기반으로 한 자동 설정과 내장 서버를 제공하는 프레임워크입니다.

## Spring Boot란?

Spring Boot는 Spring Framework의 복잡한 설정을 자동화하고, 독립 실행형 애플리케이션을 쉽게 만들 수 있게 해주는 도구입니다.

### 주요 특징

- **자동 설정 (Auto Configuration)**: 클래스패스에 있는 라이브러리를 기반으로 자동으로 설정
- **내장 서버**: Tomcat, Jetty, Undertow 등이 내장되어 별도 서버 설치 불필요
- **Starter 의존성**: 필요한 라이브러리들을 그룹으로 묶어서 제공
- **Actuator**: 애플리케이션 모니터링 및 관리 기능 제공

## 프로젝트 생성

### Spring Initializr 사용

```xml
<!-- Maven pom.xml -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

### Gradle 사용

```gradle
plugins {
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'java'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

## 기본 애플리케이션 구조

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

## REST API 컨트롤러

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

## 데이터베이스 설정

### application.properties

```properties
# H2 데이터베이스 설정
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA 설정
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 콘솔 활성화
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  
  h2:
    console:
      enabled: true
      path: /h2-console
```

## 엔티티 클래스

```java
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // 생성자, Getter, Setter
    public User() {}
    
    public User(String email, String name) {
        this.email = email;
        this.name = name;
    }
    
    // Getter와 Setter 메서드들...
}
```

## 서비스 레이어

```java
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElse(null);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public User update(Long id, User userDetails) {
        User user = findById(id);
        if (user != null) {
            user.setEmail(userDetails.getEmail());
            user.setName(userDetails.getName());
            return userRepository.save(user);
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
```

## 리포지토리 인터페이스

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 이름으로 사용자 찾기
    List<User> findByNameContaining(String name);
    
    // 생성일 기준으로 정렬된 사용자 목록
    List<User> findAllByOrderByCreatedAtDesc();
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
}
```

## 예외 처리

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "서버 내부 오류가 발생했습니다.",
            e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "요청한 리소스를 찾을 수 없습니다.",
            e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}

class ErrorResponse {
    private int status;
    private String message;
    private String detail;
    
    // 생성자, Getter, Setter...
}
```

## 테스트

```java
@SpringBootTest
@AutoConfigureTestDatabase
class UserControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testCreateUser() {
        User user = new User("test@example.com", "테스트 사용자");
        
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users", user, User.class);
        
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test@example.com", response.getBody().getEmail());
    }
    
    @Test
    void testGetUserById() {
        // 먼저 사용자 생성
        User user = new User("test@example.com", "테스트 사용자");
        ResponseEntity<User> createResponse = restTemplate.postForEntity(
            "/api/users", user, User.class);
        
        // 생성된 사용자 조회
        ResponseEntity<User> response = restTemplate.getForEntity(
            "/api/users/" + createResponse.getBody().getId(), User.class);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

## 프로파일 설정

```java
@Configuration
@Profile("dev")
public class DevConfig {
    
    @Bean
    public CommandLineRunner dataLoader(UserRepository userRepository) {
        return args -> {
            userRepository.save(new User("dev@example.com", "개발자"));
            userRepository.save(new User("test@example.com", "테스터"));
        };
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authz -> authz
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
``` 