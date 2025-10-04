# ADR-004: Git Hooks 관리 도구 선택 (lefthook)

## 상태 (Status)

승인됨 (Accepted)

## 맥락 (Context)

코드 품질 도구(Biome, markdownlint, commitlint)를 프로젝트에 도입하기로 결정했습니다.
이러한 도구들이 실제로 효과를 발휘하려면 개발자가 코드를 커밋하기 전에 자동으로
실행되도록 Git Hooks를 설정해야 합니다.

### Git Hooks의 필요성

**자동화 요구사항:**

- 커밋 전 코드 린팅 및 포매팅 (pre-commit)
- 커밋 메시지 검증 (commit-msg)
- 푸시 전 테스트 실행 (pre-push, 선택사항)

**문제점:**

- Git hooks는 `.git/hooks/` 디렉토리에 위치하여 버전 관리 불가
- 팀원마다 수동으로 설정해야 하는 번거로움
- 스크립트 유지보수 어려움

**프로젝트 제약:**

- 8-12시간의 제한된 개발 시간
- 설정이 간단하고 직관적이어야 함
- 크로스 플랫폼 지원 (macOS, Linux, Windows)
- 빠른 실행 속도

### 평가 대상 도구들

**Git Hooks 관리 도구:**

1. **husky**: Node.js 생태계에서 가장 인기 있는 도구
2. **lefthook**: Go로 작성된 빠르고 간단한 Git hooks 관리자
3. **simple-git-hooks**: 경량 대안
4. **pre-commit**: Python 기반 프레임워크

### 평가 기준

- **성능**: Hook 실행 속도
- **설정 용이성**: 초기 설정 및 유지보수
- **크로스 플랫폼**: Windows, macOS, Linux 지원
- **병렬 실행**: 여러 작업 동시 실행
- **유연성**: 조건부 실행, 파일 필터링
- **의존성**: 추가 런타임 요구사항

## 결정 (Decision)

**lefthook을 Git hooks 관리 도구로 선택합니다.**

### 선택 근거

#### 1. 뛰어난 성능

**Go 기반:**

- **빠른 시작**: husky 대비 10배 이상 빠른 초기화
- **낮은 오버헤드**: 네이티브 바이너리로 실행
- **효율적 리소스**: 메모리 사용량 최소화

**병렬 실행:**

```yaml
pre-commit:
  parallel: true  # 여러 명령어 동시 실행
  commands:
    lint:
      run: pnpm biome check --write {staged_files}
    markdown:
      run: pnpm markdownlint {staged_files}
```

#### 2. 간결한 설정

**단일 설정 파일:**

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: "*.{js,ts,jsx,tsx,json}"
      run: pnpm biome check --write --no-errors-on-unmatched {staged_files}
    markdown:
      glob: "*.md"
      run: pnpm markdownlint {staged_files}

commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit {1}
```

**자동 설치:**

- `pnpm install` 시 자동으로 hooks 설치
- `.git/hooks/` 자동 생성 및 관리
- 팀원별 수동 설정 불필요

#### 3. 강력한 기능

**파일 필터링:**

- `glob`: 파일 패턴 매칭
- `{staged_files}`: staged 파일만 처리
- `{all_files}`: 전체 파일 처리

**조건부 실행:**

```yaml
pre-commit:
  commands:
    tests:
      run: pnpm test
      skip:
        - merge
        - rebase
```

**커스텀 스크립트:**

```yaml
pre-push:
  commands:
    type-check:
      run: pnpm tsc --noEmit
    build:
      run: pnpm build
```

#### 4. 크로스 플랫폼 지원

**운영체제:**

- ✅ macOS (Intel, Apple Silicon)
- ✅ Linux (x64, ARM)
- ✅ Windows (WSL, Native)

**설치 방법:**

- npm/pnpm/yarn 통합
- 독립 실행형 바이너리
- Docker 이미지

#### 5. 개발자 경험

**Skip 옵션:**

```bash
# 긴급 상황 시 hooks 건너뛰기
LEFTHOOK=0 git commit -m "hotfix"
git commit --no-verify
```

**상세한 출력:**

- 각 hook의 실행 시간 표시
- 실패한 명령어 명확히 표시
- 색상 코딩으로 가독성 향상

**CI/CD 통합:**

```yaml
# CI에서는 자동으로 skip
pre-commit:
  commands:
    lint:
      run: pnpm biome check
      skip:
        - ref: main  # main 브랜치에서는 skip
```

#### 6. 낮은 의존성

- **Zero dependencies**: 단일 바이너리 실행
- **No Node.js overhead**: husky와 달리 Node.js 프로세스 불필요
- **작은 용량**: 바이너리 크기 ~10MB

### 프로젝트 적용 계획

**설정 파일 (`lefthook.yml`):**

```yaml
# Git hooks configuration for code quality
# https://github.com/evilmartians/lefthook

pre-commit:
  parallel: true
  commands:
    # Biome: Lint and format TypeScript/JavaScript files
    biome:
      glob: "*.{js,ts,jsx,tsx,json}"
      run: pnpm biome check --write --no-errors-on-unmatched {staged_files}
      stage_fixed: true

    # Markdownlint: Check Markdown files
    markdown:
      glob: "*.md"
      run: pnpm markdownlint --fix {staged_files}
      stage_fixed: true

commit-msg:
  commands:
    # Commitlint: Validate commit message format
    commitlint:
      run: pnpm commitlint --edit {1}

# Optional: Run tests before push
# pre-push:
#   commands:
#     type-check:
#       run: pnpm tsc --noEmit
#     test:
#       run: pnpm test
#     build:
#       run: pnpm build
```

**package.json 스크립트:**

```json
{
  "scripts": {
    "prepare": "lefthook install",
    "lint": "biome check --write .",
    "lint:check": "biome check .",
    "lint:md": "markdownlint '**/*.md'"
  }
}
```

## 결과 (Consequences)

### 긍정적 결과

#### 코드 품질 자동화

- ✅ **일관성 보장**: 모든 커밋이 자동으로 검증됨
- ✅ **에러 조기 발견**: 커밋 전에 문제 감지
- ✅ **자동 수정**: 가능한 이슈는 자동으로 수정 후 커밋

#### 개발 생산성

- ✅ **빠른 실행**: Go 기반의 빠른 성능
- ✅ **병렬 처리**: 여러 검사 동시 실행으로 시간 절약
- ✅ **선택적 스킵**: 필요시 hooks 우회 가능

#### 팀 협업

- ✅ **자동 설치**: `pnpm install`만으로 hooks 활성화
- ✅ **버전 관리**: `lefthook.yml`이 Git으로 관리됨
- ✅ **일관된 경험**: 모든 팀원이 동일한 hooks 실행

#### 유지보수

- ✅ **단일 파일**: YAML 파일 하나로 모든 hooks 관리
- ✅ **명확한 설정**: 직관적인 구조
- ✅ **확장 용이**: 새로운 hook 추가 간단

### 잠재적 이슈

#### 초기 설정

- ⚠️ **설치 필요**: lefthook 바이너리 설치 필요
- ⚠️ **학습 곡선**: YAML 설정 문법 이해 필요

#### 실행 시간

- ⚠️ **커밋 지연**: 린팅/포매팅으로 커밋 시간 증가 가능
- ⚠️ **대규모 변경**: 많은 파일 수정 시 실행 시간 증가

#### Windows 호환성

- ⚠️ **경로 이슈**: Windows 경로 구분자 처리
- ⚠️ **PowerShell**: 일부 명령어 호환성 문제 가능

### 완화 전략

#### 성능 최적화

```yaml
pre-commit:
  parallel: true  # 병렬 실행으로 시간 단축
  commands:
    biome:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm biome check --write {staged_files}  # staged 파일만 처리
      stage_fixed: true  # 수정된 파일 자동 stage
```

#### 선택적 실행

```yaml
# 머지, 리베이스 중에는 skip
pre-commit:
  commands:
    lint:
      run: pnpm biome check
      skip:
        - merge
        - rebase
```

#### 긴급 상황 대응

```bash
# 환경 변수로 skip
LEFTHOOK=0 git commit -m "hotfix: critical bug"

# Git 옵션으로 skip
git commit --no-verify -m "hotfix: critical bug"
```

#### 문서화

- README에 lefthook 사용법 명시
- 자주 발생하는 문제 해결법 정리
- 팀 온보딩 가이드 작성

## 대안 평가

### husky (거절됨)

**장점:**

- Node.js 생태계에서 가장 인기
- 방대한 문서와 커뮤니티
- npm/pnpm/yarn 완벽 통합

**단점:**

- Node.js 프로세스 오버헤드
- 설정 파일 여러 개 필요
- 병렬 실행 미지원 (직접 구현 필요)
- v8부터 유료 기능 추가

**거절 이유:**

- lefthook이 성능과 설정 간결성에서 우수
- 병렬 실행 기본 지원
- 단일 설정 파일로 관리 용이

### simple-git-hooks (거절됨)

**장점:**

- 매우 가볍고 단순
- 설정 최소화
- 빠른 실행

**단점:**

- 기능 제한적
- 파일 필터링 미지원
- 병렬 실행 없음
- 조건부 실행 불가

**거절 이유:**

- 프로젝트에 필요한 고급 기능 부족
- 파일별 처리 불가능
- 확장성 부족

### pre-commit (거절됨)

**장점:**

- 강력한 플러그인 시스템
- 다양한 언어 지원
- 광범위한 hook 라이브러리

**단점:**

- Python 런타임 필요
- 설정 복잡도 높음
- Node.js 프로젝트에는 과도

**거절 이유:**

- Python 의존성 추가 불필요
- Node.js 프로젝트에 적합하지 않음
- 설정이 복잡함

## 관련 자료 (References)

- [lefthook 공식 문서](https://github.com/evilmartians/lefthook)
- [lefthook vs husky 비교](https://github.com/evilmartians/lefthook/blob/master/docs/node.md)
- [lefthook 설정 예제](https://github.com/evilmartians/lefthook/blob/master/docs/configuration.md)
- [Git Hooks 공식 문서](https://git-scm.com/docs/githooks)
- [ADR-003: 코드 품질 도구 선택](./003-code-quality-tools.md)
