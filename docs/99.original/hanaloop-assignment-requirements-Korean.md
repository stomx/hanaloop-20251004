# 프론트엔드 개발자 과제: 탄소 배출 대시보드

지원자님 안녕하세요!

HanaLoop에 관심을 가져주셔서 감사합니다. HanaLoop는 지속적으로 성장하고 있는 스타트업입니다.
귀하께서 저희 회사에 관심을 가져주셨다는 것은 기후 변화의 영향에 대해 인지하고 계시다는 뜻이기도 합니다.
HanaLoop는 조직들이 넷 제로(Net Zero) 여정을 갈 수 있도록 돕는 플랫폼을 구축하고 있습니다.

저희는 지속적인 학습이 필요한 문제 해결에 열정을 가진 새로운 팀원을 찾고 있습니다.

이번 과제를 통해 프론트엔드 개발에 대한 귀하의 역량과 지식을 보여주시길 바랍니다.

---

## **목적 (Purpose)**

이 과제의 목적은 모범 사례를 적용하고,
제품/디자인에 대한 건전한 판단을 보여주는 소규모이지만 프로덕션을 염두에 둔 **웹 애플리케이션**을 설계하고 구축하는 귀하의 능력을 평가하는 것입니다.
저희는 단순한 기능 개수보다 신중한 트레이드오프를 중시합니다.

이것은 귀하께서 실력을 보여주실 수 있는 기회입니다!

---

## **무엇을 만들게 되나요 (What you are building)**

귀하는 **기본적인 웹 기반 탄소(온실가스) 배출 대시보드**를 만들게 됩니다. 앱에는 내비게이션 드로어와 배출 데이터의 시각화를 포함한 메인 콘텐츠 영역이 있어야 합니다.

이 대시보드는 임원과 관리자들이 자신들의 회사와 계열사의 배출량을 이해할 수 있도록 하기 위한 것입니다. 따라서 향후 납부해야 할 탄소세를 미리 계획할 수 있습니다.

아래 데이터 모델 섹션에 명시된 데이터 모델(이에 한정되지는 않음)을 사용하여 콘텐츠 영역을 채우는 것이 기대됩니다. 매력적인 대시보드를 만들기 위해 가능한 한 창의력을 발휘해 주세요.

---

## **평가 기준 (What we’re assessing)**

1. **창의성과 비판적 사고**: 모호함을 식별하고, 질문을 던지며, 가정을 문서화하고, 합리적인 확장을 제안하며, 흥미로운 새로운 아이디어를 도출하는 능력.
2. **탄탄한 UI/UX 디자인과 심미성**: 현대적인 룩 앤 필, 직관적 인터페이스, 일관된 UI 컴포넌트 사용, 균형 잡힌 컬러 팔레트.
3. **UI 엔지니어링**: 반응형 레이아웃, 로딩/에러 상태. 레이아웃/UI 상태, 필터 상태, 데이터 상태의 명확한 분리.
4. **소프트웨어 엔지니어링**: 모듈성, 성능, .
5. **코드 품질**: 가독성과 테스트 용이성. 타입의 적절한 사용, 구조화, 분해, 네이밍, 중요한 부분의 테스트, 읽기 쉬운 커밋 히스토리.

기능을 구현하는 것뿐만 아니라, 창의성과 신중한 디자인 선택을 보여주는 것이 중요합니다.

---

## **과제를 진행하면서 (As you work on the assignment)**

적용한 가정과 핵심 설계 결정을(해당되는 경우) 문서화해 주세요. 저희는 귀하의 사고 과정을 중요하게 생각합니다. 또한 과제 완료에 소요된 시간도 기록해 주세요.

명확화를 위한 질문은 언제든지 자유롭게 보내 주세요.

---

## **시간 제한 (Timebox)**

**T**his 과제는 집중해서 8–12시간 내에 완료할 수 있도록 설계되었습니다. 인터넷의 리소스를 사용할 수 있습니다. 하지만 전체적인 설계는 물론 귀하의 고유한 창작물이어야 합니다.
총 **3일**을 초과하지 마세요.

---

## **기술 제약 (Technical Constraints)**

1. **Next.js 14+ (App Router) + React 18 + TypeScript**.
2. 메인 UI에는 무거운 컴포넌트 라이브러리(e.g., MUI/Ant)를 사용하지 않습니다. 소형 유틸리티(headless UI/shadcn)는 허용됩니다.
3. 스타일링: 어떤 접근도 괜찮습니다(CSS Modules, Tailwind). 기본적인 디자인 시스템을 보여주세요.
4. 상태 관리는 상태 라이브러리(예: Zustand/Redux) 또는 React Context + 커스텀 훅을 사용해도 됩니다.

---

## **데이터 모델 (Data model)**

아래는 대시보드에 사용할 수 있는 데이터 모델입니다:

귀하가 다루게 될 데이터(국가, 회사, 배출량, 포스트)는 실제 애플리케이션에서 접할 수 있는 데이터와 유사합니다.

### **회사(월별 배출 포함) — Companies (with monthly emissions)**

```typescript
type Company = {
  id: string;
  name: string;
  country: string; // Country.code
  emissions: GhgEmission[];
};
```

### **배출(Emission)**

```typescript
type GhgEmission = {
  yearMonth: string;  // "2025-01", "2025-02", "2025-03"
  source: string; // gasoline, lpg, diesel, etc
  emissions: number; // tons of CO2 equivalent
};
```

### **포스트(회사+월 연결) — Posts (linked to company + month)**

```typescript
type Post = {
  id: string;
  title: string;
  resourceUid: string; // Company.id
  dateTime: string;    // e.g., "2024-02"
  content: string;
};
```

---

## **시드 데이터 예시 (Seed data example)**

```typescript
type Post = {
  id: string;
  title: string;
  resourceUid: string; // Company.id
  dateTime: string;    // e.g., "2024-02"
  content: string;
};
```

```typescript
export const companies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [{ "yearMonth": "2024-01",  "emissions": 120}, { "yearMonth": "2024-02": "emissions": 110}, {"yearMonth": "2024-03": "emissions": 95 }]
  },
  {
    id: "c2",
    name: "Globex",
    country: "DE",
    emissions: [{ "yearMonth": "2024-01",  "emissions": 80}, { "yearMonth": "2024-02": "emissions": 105}, {"yearMonth": "2024-03": "emissions": 120 }]
  }
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report",
    resourceUid: "c1",
    dateTime: "2024-02",
    content: "Quarterly CO2 update"
  }
];
```

---

## **가짜 백엔드(제공되는 스텁) — Fake backend (provided stub)**

네트워크 I/O, 지연(200–800ms), 쓰기 작업의 가끔 있는 실패(10–20%)를 시뮬레이션하는 모듈(예: `lib/api.ts`)을 생성하세요.

```typescript
// lib/api.ts
let _countries = [...countries];
let _companies = [...companies];
let _posts = [...posts];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

export async function fetchCountries() {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies() {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts() {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(p: Omit<Post, "id"> & { id?: string }) {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");
  if (p.id) {
    _posts = _posts.map(x => x.id === p.id ? (p as Post) : x);
    return p as Post;
  }
  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}
```

*이를 통해 로딩, 에러, 부분 실패 및 **롤백** 동작을 현실적으로 테스트할 수 있습니다.*

---

## **산출물 (Deliverables)**

현대적인 개발자라면 보통 Git 저장소에서 작업합니다. GitHub 또는 Gitlab을 사용하셔도 됩니다.

완료되면 저희에게 공유해 주세요.

최소한 저장소에는 다음이 포함되어야 합니다.

1. **실행 가능한** Next.js 앱.
2. 간단한 소개와 테스트/실행 방법을 담은 **README**:

추가 문서화를 할 수도 있습니다. 예를 들면,

* 귀하가 제기한 질문 또는 세운 가정(파일 상단)
* 아키텍처 개요(상태 경계, 데이터 흐름 다이어그램 또는 불릿)
* 렌더링 효율성 메모(무엇이 왜 리렌더링되는지)
* 시간 제약으로 인한 트레이드오프 또는 단축
* 디자인 근거: 핵심 UI 결정(레이아웃, 모션 등)에 대한 간단한 설명

---

## **평가 루브릭 (Evaluation rubric)**

1. **창의성과 비판적 사고**: 25 %
2. **탄탄한 UI/UX 디자인, 심미성**: 25%
3. **UI 엔지니어링**: 20%.
4. **소프트웨어 엔지니어링**: 20%
5. **코드 품질**: 10%
