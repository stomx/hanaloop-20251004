# ADR-001: 패키지 매니저로 pnpm 선택

## 상태 (Status)

승인됨 (Accepted)

## 맥락 (Context)

Node.js 프로젝트의 패키지 매니저를 선택해야 했습니다. 현재 JavaScript 생태계에서 주요 옵션들은 다음과 같습니다:

- **npm**: Node.js 기본 패키지 매니저, 가장 널리 사용됨
- **yarn**: Facebook에서 개발, npm의 성능 문제 개선을 목표
- **pnpm**: 디스크 효율성과 속도에 중점을 둔 차세대 패키지 매니저

### 패키지 관리 요구사항

- 개발 의존성과 프로덕션 의존성의 명확한 분리
- 여러 라이브러리 의존성의 안정적이고 재현 가능한 설치
- 의존성 충돌 및 버전 불일치 최소화
- 개발팀 간 일관된 개발 환경 보장

### 평가 기준

- **성능**: 설치 및 업데이트 속도
- **효율성**: 디스크 사용량 및 네트워크 사용량
- **안정성**: lock 파일의 신뢰성 및 재현성
- **보안**: phantom dependencies 방지
- **호환성**: 기존 npm 생태계와의 호환성
- **생산성**: CLI 사용 편의성

## 결정 (Decision)

**pnpm을 패키지 매니저로 선택합니다.**

### 선택 근거

#### 1. 뛰어난 성능
- **설치 속도**: npm/yarn 대비 2-3배 빠른 설치 속도
- **전역 저장소**: 중복 패키지 제거로 네트워크 요청 최소화
- **병렬 처리**: 효율적인 의존성 해결 알고리즘

#### 2. 디스크 효율성
- **하드링크 기반**: 동일 패키지의 물리적 중복 저장 방지
- **공간 절약**: 프로젝트당 node_modules 크기 최대 50% 절약
- **전역 캐시**: 시스템 전체에서 패키지 재사용

#### 3. 엄격한 의존성 관리
- **Phantom Dependencies 방지**: package.json에 명시되지 않은 의존성 접근 차단
- **정확한 의존성 트리**: hoisting으로 인한 의존성 오류 방지
- **Node.js 모듈 해결 규칙 준수**: 예측 가능한 의존성 동작

#### 4. 안정성과 재현성
- **Deterministic 설치**: 동일한 lock 파일로 언제나 같은 결과
- **pnpm-lock.yaml**: 간결하고 읽기 쉬운 lock 파일 형식
- **무결성 검증**: 패키지 변조 및 손상 감지

#### 5. 생태계 호환성
- **npm CLI 호환**: 기존 npm 명령어와 동일한 인터페이스
- **registry 호환**: npm registry 및 private registry 완전 지원
- **도구 지원**: 주요 CI/CD 플랫폼 및 개발 도구 지원

## 결과 (Consequences)

### 긍정적 결과

- ✅ **개발 생산성 향상**: 빠른 설치 속도로 개발 흐름 중단 최소화
- ✅ **시스템 효율성**: 디스크 공간 절약으로 스토리지 비용 절감
- ✅ **코드 품질**: phantom dependencies 방지로 런타임 오류 사전 차단
- ✅ **팀 협업**: 일관된 의존성 관리로 환경 차이 문제 해결
- ✅ **확장성**: 모노레포 지원으로 향후 프로젝트 확장 용이

### 잠재적 이슈

- ⚠️ **학습 비용**: 팀원이 pnpm 특성에 익숙해져야 함
- ⚠️ **환경 구성**: CI/CD 파이프라인에서 pnpm 별도 설치 필요
- ⚠️ **도구 호환성**: 일부 레거시 빌드 도구에서 pnpm 미지원 가능성
- ⚠️ **디버깅**: node_modules 구조가 달라 의존성 문제 디버깅 시 주의 필요

### 완화 전략

- **교육**: pnpm CLI는 npm과 95% 동일하여 러닝 커브 최소
- **자동화**: CI/CD 템플릿에서 pnpm 설치 자동화
- **모니터링**: 프로젝트 초기 단계에서 도구 호환성 사전 검증
- **문서화**: 팀 내 pnpm 사용 가이드 및 트러블슈팅 문서 작성

## 관련 자료 (References)

- [pnpm 공식 문서](https://pnpm.io/)
- [pnpm vs npm vs yarn 벤치마크](https://pnpm.io/benchmarks)  
- [Phantom dependencies 문제 설명](https://blog.nrwl.io/phantom-dependencies-b4dd6dcfdc4d)
- [Node.js 패키지 매니저 비교 연구](https://medium.com/@vinodlalchandani/npm-vs-yarn-vs-pnpm-a-comparative-study-25c22c3ac5b8)
- [프로젝트 기술적 요구사항](../00.requirements/04.technical-requirements.md)
