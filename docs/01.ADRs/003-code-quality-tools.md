# ADR-003: 코드 품질 도구 선택 (Biome, markdownlint, commitlint)

## 상태 (Status)

승인됨 (Accepted)

## 맥락 (Context)

탄소 배출 대시보드 프로젝트의 코드 품질을 유지하고 일관된 개발 경험을 제공하기 위해 적절한 도구를 선택해야 했습니다.

### 프로젝트 요구사항

**평가 기준 (코드 품질 10%):**

- 가독성과 일관성
- 커밋 히스토리의 품질
- 문서화 품질
- 린팅 및 포매팅 적용

**시간 제약:**

- 8-12시간의 제한된 개발 시간
- 도구 설정에 많은 시간을 쓸 수 없음
- 즉시 생산성을 발휘할 수 있어야 함

**기술 스택:**

- TypeScript (strict mode)
- Next.js 14 (App Router)
- React 18
- Markdown 문서 (요구사항, ADR 등)

### 평가 대상 도구들

**JavaScript/TypeScript 린팅 및 포매팅:**

1. **ESLint + Prettier**: 전통적이고 널리 사용되는 조합
2. **Biome**: 올인원 도구체인 (린팅 + 포매팅)
3. **deno lint + deno fmt**: Deno 생태계 도구

**Markdown 린팅:**

1. **markdownlint**: Markdown 파일 일관성 검사
2. **remark-lint**: 플러그인 기반 Markdown 린터
3. **prettier**: Markdown 포매팅 지원

**커밋 메시지 린팅:**

1. **commitlint**: Conventional Commits 규칙 강제
2. **commitizen**: 대화형 커밋 메시지 작성 도구
3. **husky + commitlint**: Git hooks 통합

### 평가 기준

- **성능**: 린팅 및 포매팅 속도
- **설정 용이성**: 초기 설정 및 유지보수 시간
- **통합성**: 여러 도구 간 충돌 최소화
- **개발자 경험**: IDE 통합, 에러 메시지 명확성
- **커뮤니티**: 생태계 지원 및 문서화

## 결정 (Decision)

다음 도구 조합을 선택합니다:

### 1. Biome (JavaScript/TypeScript 린팅 + 포매팅)

**선택 근거:**

#### 성능

- **Rust 기반**: ESLint + Prettier 대비 10-100배 빠른 실행 속도
- **단일 패스**: 린팅과 포매팅을 한 번에 처리
- **병렬 처리**: 여러 파일 동시 처리로 속도 향상

#### 올인원 솔루션

- **통합 도구체인**: 린터와 포매터가 하나로 통합
- **설정 단순화**: ESLint + Prettier의 복잡한 설정 제거
- **충돌 없음**: 린터와 포매터 간 규칙 충돌 원천 차단

#### 현대적 기능

- **TypeScript 우선**: TypeScript를 1급 시민으로 지원
- **JSON 지원**: package.json, tsconfig.json 등 린팅
- **빠른 피드백**: 실시간에 가까운 에러 검출

#### 개발자 경험

- **명확한 에러**: 이해하기 쉬운 에러 메시지
- **자동 수정**: `--write` 옵션으로 대부분의 이슈 자동 수정
- **IDE 통합**: VS Code 확장 프로그램 제공

**설정 예시:**

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error"
      },
      "complexity": {
        "noForEach": "off"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  }
}
```

### 2. markdownlint (Markdown 린팅)

**선택 근거:**

#### 특화된 도구

- **Markdown 전용**: Markdown 문법 및 스타일 검사에 최적화
- **포괄적 규칙**: 50+ 개의 내장 규칙
- **일관성 보장**: 문서 전반의 일관된 스타일 유지

#### 유연한 설정

- **규칙 커스터마이징**: 프로젝트 요구사항에 맞게 조정 가능
- **파일별 예외**: 특정 파일/라인 규칙 비활성화
- **extends 지원**: 프리셋 규칙 재사용

#### 광범위한 지원

- **IDE 통합**: VS Code, Vim, Emacs 등 지원
- **CI/CD 통합**: GitHub Actions, GitLab CI 등과 쉽게 통합
- **CLI 도구**: 자동화 스크립트 작성 용이

**설정 예시:**

```json
// .markdownlint.json
{
  "default": true,
  "MD013": {
    "line_length": 100,
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
}
```

### 3. commitlint (커밋 메시지 린팅)

**선택 근거:**

#### 표준화

- **Conventional Commits**: 업계 표준 커밋 규칙 강제
- **명확한 히스토리**: 읽기 쉽고 의미 있는 Git 로그
- **자동화 가능**: 커밋 메시지로부터 changelog 자동 생성 가능

#### 팀 협업

- **일관성**: 모든 커밋이 동일한 형식 준수
- **리뷰 용이**: 커밋 목적이 명확하여 코드 리뷰 효율 향상
- **추적성**: 이슈/PR과 커밋 연결 추적 용이

#### 유연성

- **커스텀 규칙**: 팀 고유의 규칙 정의 가능
- **다국어 지원**: 한글 커밋 메시지 지원
- **경고/에러 레벨**: 규칙 위반 수준 조정 가능

**Conventional Commits 형식:**

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**타입 정의:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포매팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

**설정 예시:**

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'revert'
      ]
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'header-max-length': [2, 'always', 100]
  }
};
```

## 결과 (Consequences)

### 긍정적 결과

#### 개발 생산성

- ✅ **빠른 피드백**: Biome의 속도로 실시간 에러 검출
- ✅ **자동 수정**: 대부분의 스타일 이슈 자동 해결
- ✅ **설정 단순화**: 복잡한 도구 체인 대신 명확한 설정

#### 코드 품질

- ✅ **일관성**: 모든 코드/문서에 동일한 스타일 적용
- ✅ **에러 방지**: 린팅으로 잠재적 버그 사전 차단
- ✅ **타입 안전성**: TypeScript strict mode와 결합된 엄격한 검사

#### 협업 효율

- ✅ **명확한 히스토리**: Conventional Commits로 변경사항 추적 용이
- ✅ **리뷰 품질**: 스타일 논쟁 제거, 로직에 집중
- ✅ **문서 품질**: markdownlint로 일관된 문서 형식 유지

#### 프로젝트 평가

- ✅ **평가 기준 충족**: 코드 품질 10% 항목 만족
- ✅ **전문성**: 현대적 도구 사용으로 기술적 역량 입증
- ✅ **확장성**: 향후 팀 확장 시에도 품질 유지 가능

### 잠재적 이슈

#### Biome 관련

- ⚠️ **생태계**: ESLint에 비해 상대적으로 작은 커뮤니티
- ⚠️ **플러그인**: ESLint 플러그인과 호환 불가
- ⚠️ **마이그레이션**: 기존 ESLint 설정 변환 필요

#### 학습 비용

- ⚠️ **새로운 도구**: 팀원이 Biome에 익숙해져야 함
- ⚠️ **규칙 이해**: commitlint 규칙 학습 필요

#### 설정 시간

- ⚠️ **초기 구성**: Git hooks 설정 및 CI/CD 통합
- ⚠️ **규칙 조정**: 프로젝트에 맞는 최적의 규칙 찾기

### 완화 전략

#### Biome 도입

- **점진적 적용**: 기존 코드는 점진적으로 마이그레이션
- **문서화**: Biome 사용 가이드 작성
- **대안 준비**: 필요시 ESLint로 롤백 가능하도록 준비

#### 학습 지원

- **템플릿 제공**: 자주 쓰는 커밋 메시지 템플릿
- **에러 가이드**: 자주 나오는 린팅 에러 해결법 정리
- **CI 피드백**: PR에서 자동으로 린팅 결과 표시

#### 자동화

- **Git hooks**: lefthook으로 커밋 전 자동 검사
- **CI/CD**: PR 머지 전 자동 검증
- **IDE 통합**: 저장 시 자동 포매팅 설정

## 대안 평가

### ESLint + Prettier (거절됨)

**장점:**

- 가장 널리 사용되는 표준
- 방대한 플러그인 생태계
- 풍부한 문서와 커뮤니티

**단점:**

- 느린 실행 속도 (대규모 프로젝트)
- 복잡한 설정 (규칙 충돌 문제)
- 두 도구 간 설정 통합 필요

**거절 이유:**

- 제한된 시간 내에 복잡한 설정 작업 비효율적
- Biome의 속도가 개발 경험에 더 유리
- 단일 프로젝트에서 플러그인 확장성 불필요

### remark-lint (거절됨)

**장점:**

- JavaScript 생태계와 통합
- 플러그인 기반 확장성
- AST 기반 정교한 분석

**단점:**

- 설정 복잡도 높음
- markdownlint보다 느림
- 문서 상대적으로 부족

**거절 이유:**

- markdownlint가 더 직관적이고 빠름
- 복잡한 Markdown 변환 불필요
- 단순 스타일 검사가 목적

## 관련 자료 (References)

- [Biome 공식 문서](https://biomejs.dev/)
- [Biome vs ESLint/Prettier 벤치마크](https://biomejs.dev/blog/biome-wins-prettier-challenge/)
- [markdownlint GitHub](https://github.com/DavidAnson/markdownlint)
- [markdownlint 규칙 문서](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [commitlint 공식 문서](https://commitlint.js.org/)
- [Conventional Commits 명세](https://www.conventionalcommits.org/)
- [프로젝트 평가 기준](../00.requirements/01.evaluation-criteria.md)
