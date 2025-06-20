# 설치 %{#installation}%

<VueMasteryLogoLink></VueMasteryLogoLink>

## 패키지 매니저 %{#package-managers}%

이미 JavaScript 패키지 매니저를 사용하는 기존 프로젝트가 있다면, npm 레지스트리에서 Vue Router를 설치할 수 있습니다:

::: code-group

```bash [npm]
npm install vue-router@4
```

```bash [yarn]
yarn add vue-router@4
```

```bash [pnpm]
pnpm add vue-router@4
```

```bash [bun]
bun add vue-router@4
```

:::

새 프로젝트를 시작하는 경우, [create-vue](https://github.com/vuejs/create-vue) 스캐폴딩 도구를 사용하는 것이 더 쉬울 수 있습니다. 이 도구는 Vite 기반 프로젝트를 생성하며, Vue Router를 포함할지 선택할 수 있습니다:

::: code-group

```bash [npm]
npm create vue@latest
```

```bash [yarn]
yarn create vue
```

```bash [pnpm]
pnpm create vue
```

```bash [bun]
bun create vue
```

:::

어떤 종류의 프로젝트를 만들지에 대한 몇 가지 질문이 표시됩니다. Vue Router 설치를 선택하면, 예제 애플리케이션에서 Vue Router의 핵심 기능 몇 가지도 함께 보여줍니다.

패키지 매니저를 사용하는 프로젝트는 일반적으로 ES 모듈을 통해 Vue Router에 접근합니다. 예: `import { createRouter } from 'vue-router'`.

## 직접 다운로드 / CDN %{#direct-download-cdn}%

[https://unpkg.com/vue-router@4](https://unpkg.com/vue-router@4)

<!--email_off-->

[Unpkg.com](https://unpkg.com)은 npm 기반 CDN 링크를 제공합니다. 위 링크는 항상 npm의 최신 릴리스를 가리킵니다. 또한 `https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js`와 같은 URL을 통해 특정 버전/태그를 사용할 수도 있습니다.

<!--/email_off-->

이 방법을 사용하면 전역 `VueRouter` 객체를 통해 Vue Router에 접근할 수 있습니다. 예: `VueRouter.createRouter(...)`.