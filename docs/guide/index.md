# 시작하기 %{#getting-started}%

<VueSchoolLink
href="https://vueschool.io/courses/vue-router-4-for-everyone"
title="Learn how to build powerful Single Page Applications with the Vue Router on Vue School">Watch a Free Vue Router Video Course</VueSchoolLink>

Vue Router는 Vue의 공식 클라이언트 사이드 라우팅 솔루션입니다.

클라이언트 사이드 라우팅은 싱글 페이지 애플리케이션(SPA)에서 브라우저 URL을 사용자가 보는 콘텐츠와 연결하는 데 사용됩니다. 사용자가 애플리케이션을 탐색할 때 URL이 그에 맞게 업데이트되지만, 페이지를 서버에서 다시 로드할 필요는 없습니다.

Vue Router는 Vue의 컴포넌트 시스템 위에 구축되어 있습니다. **라우트**를 구성하여 각 URL 경로에 어떤 컴포넌트를 보여줄지 Vue Router에 알려줍니다.

::: tip 사전 준비 사항
이 가이드는 여러분이 이미 Vue 자체에 익숙하다고 가정합니다. Vue 전문가일 필요는 없지만, 특정 기능에 대해 더 많은 정보가 필요할 때 [Vue 공식 문서](https://vuejs.org/)를 참고해야 할 수도 있습니다.
:::

## 예시 %{#an-example}%

주요 개념을 소개하기 위해, 다음과 같은 예시를 살펴보겠습니다:

- [Vue Playground 예시](https://play.vuejs.org/#eNqFVVtv2zYU/itn6gArmC05btEHTXXTFcWyYZeiLfYy7UGWji02EsmRlOPA8H/fIambnaRD4Fg61++c7yN9DJqc8eirDpKANVIoA0coFOYG30kJJ9gq0cBs3+Is412AEq1B1Xmi2L+ObpvX+3IpI5+b8aFqSJ+rjANErcbQp/v3RrTchLMXlDa7CuZBl07YUoONrCl/bQPT6np9i3UtbLPv0phenVm6L3rQRgm+W79vlULeIQaZmypJ484HxyN87xzRtq3rj+SE08mViX2dlOf7vuAnh/I3xu/AiDdZEGfB+mdBz3ArGkzj0f9sRr4hy5D2zr49ykvjvmdqeTmv9RfDe4i7uM6dxsNiaF9+l0+y+Ts2Qj3cMm3oa94Zfd0py4uBzYFPO6Br3ZPaGzpme9rtQGdxg2WUgOC6Y0PDG/jbjnL0vMAsnhEsQcU4UZaMbU/z8zC3x/PYsbcN/ueilaJW03nDoy1Y+VUkT+0nvHI9PVB6PJE8M44HN2iJ27yt+9q09ek+rFR1oZg0RM5FgmvboKlEqRP/BrATX4SDH171JgBD4CIvThXJVldhP7Y7J9DtxP4nxZKk+470cnFQVuseHh2TlTduWmMEh5uiZsUdSXPAcKlOH/hIZmfEjhODRtPaozNKjyiiGcqn75Ej0Pl3lMyHp2fFeMHnEB/SRia+ict6ep/GXBWV1UGHyGtgh5O1K0KvuC8T/duieoi6tLdvYUYg+rXTmKH3jLmeKoW0owLDI7h8IrnvfAKrIargxfQ/lA0LHjmr8w3W3X3w2dVMIGWchoH9ohEl1pFRrCE2fccsgCY/1Mh3piLjaknc+pujr3TOqedk0eSSrg/BiVU3WtY5dBYMks2CkRtrzoLKGKmTOG65vNtFtON4jLh5Fb2MlnFJJ2tijVA3i40S99rdV1ngNmtr31BQXOLeCFHrRS7Zcy0eBd68jl5H13HNNjFVjxkv8eBq94unMY0mQWzZ7mJIKwtWo/pTGkaCORs2p9+Z+1+dzagWB6BFhcXdE/av+uAhf1RI0+1xMpzJFWnOuz98/gMP9Dw4icW2puhvOD+hFnVrMfqwn1peEuxJnEP7i+OM8d0X/eFgkOt+KAt0FLIj8v03Rh/hvoxeTbaozUONOiq0/aGhX6w5aY1xn7cRqkSVwEoegMCyEl4sl8sf3d1H5RhfbATdKk0C10t5cHaZlyWBHSzUJeNUFtaQww/08Tenz65xSzf+NLJaTTuP5UcARVFMACSwpL9VVyE4/QesCg/V)

우리는 먼저 루트 컴포넌트인 `App.vue`를 살펴보겠습니다.

### App.vue %{#appvue}%

```vue
<template>
  <h1>Hello App!</h1>
  <p>
    <strong>현재 라우트 경로:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/">홈으로 이동</RouterLink>
    <RouterLink to="/about">소개로 이동</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
```

이 템플릿은 Vue Router에서 제공하는 두 가지 컴포넌트인 `RouterLink`와 `RouterView`를 사용하고 있습니다.

일반적인 `<a>` 태그 대신, 링크를 만들기 위해 커스텀 컴포넌트인 `RouterLink`를 사용합니다. 이를 통해 Vue Router는 페이지를 새로 고치지 않고도 URL을 변경하고, URL 생성, 인코딩, 다양한 기능을 처리할 수 있습니다. `RouterLink`에 대해서는 가이드의 뒷부분에서 더 자세히 다룰 예정입니다.

`RouterView` 컴포넌트는 Vue Router에게 현재 **라우트 컴포넌트**를 어디에 렌더링할지 알려줍니다. 이는 현재 URL 경로에 해당하는 컴포넌트입니다. 반드시 `App.vue`에 있을 필요는 없으며, 레이아웃에 맞게 어디에나 둘 수 있지만, 반드시 어딘가에 포함되어야 Vue Router가 아무것도 렌더링하지 않는 상황을 방지할 수 있습니다.

위 예시에서는 <code v-pre>{{ $route.fullPath }}</code>도 사용하고 있습니다. 컴포넌트 템플릿에서 `$route`를 사용하여 현재 라우트를 나타내는 객체에 접근할 수 있습니다.

<VueMasteryLogoLink></VueMasteryLogoLink>

### 라우터 인스턴스 생성하기 %{#creating-the-router-instance}%

라우터 인스턴스는 `createRouter()` 함수를 호출하여 생성합니다:

```js
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
```

`routes` 옵션은 URL 경로를 컴포넌트에 매핑하여 라우트 자체를 정의합니다. `component` 옵션에 지정된 컴포넌트가 앞서 본 `App.vue`의 `<RouterView>`에 의해 렌더링됩니다. 이러한 라우트 컴포넌트는 _뷰(view)_라고도 불리지만, 사실 일반적인 Vue 컴포넌트입니다.

만약 _함수형 컴포넌트_를 라우트 컴포넌트로 사용하고 싶다면, [지연 로딩 라우트](./advanced/lazy-loading.md)와 구분할 수 있도록 반드시 `displayName`을 지정해야 합니다:

```ts
const AboutPage: FunctionalComponent = () => {
  return h('h1', {}, 'About')
}
AboutPage.displayName = 'AboutPage'
```

라우트는 이 외에도 다양한 옵션을 지원하지만, 지금은 `path`와 `component`만 필요합니다.

`history` 옵션은 라우트가 URL에 어떻게 매핑되는지, 그리고 그 반대의 경우를 제어합니다. Playground 예시에서는 브라우저 URL을 완전히 무시하고 자체 내부 URL을 사용하는 `createMemoryHistory()`를 사용하고 있습니다. 이는 Playground에는 적합하지만, 실제 애플리케이션에서는 일반적으로 원하는 방식이 아닙니다. 보통은 `createWebHistory()`나, 혹은 `createWebHashHistory()`를 사용하게 됩니다. 이에 대해서는 [히스토리 모드](./essentials/history-mode) 가이드에서 더 자세히 다룹니다.

### 라우터 플러그인 등록하기 %{#registering-the-router-plugin}%

라우터 인스턴스를 생성한 후에는, 애플리케이션에서 `use()`를 호출하여 플러그인으로 등록해야 합니다:

```js
createApp(App)
  .use(router)
  .mount('#app')
```

또는, 다음과 같이 쓸 수도 있습니다:

```js
const app = createApp(App)
app.use(router)
app.mount('#app')
```

대부분의 Vue 플러그인과 마찬가지로, `use()` 호출은 `mount()` 호출 전에 이루어져야 합니다.

이 플러그인이 무슨 일을 하는지 궁금하다면, 주요 역할은 다음과 같습니다:

1. `RouterView`와 `RouterLink` 컴포넌트를 [전역 등록](https://vuejs.org/guide/components/registration.html#global-registration)합니다.
2. 전역 `$router`와 `$route` 속성을 추가합니다.
3. `useRouter()`와 `useRoute()` 컴포저블을 사용할 수 있게 합니다.
4. 라우터가 초기 라우트를 해석하도록 트리거합니다.

### 라우터와 현재 라우트에 접근하기 %{#accessing-the-router-and-current-route}%

애플리케이션의 다른 곳에서 라우터에 접근하고 싶을 때가 많을 것입니다.

라우터 인스턴스를 ES 모듈에서 export하고 있다면, 필요한 곳에서 직접 import할 수도 있습니다. 경우에 따라 이 방법이 가장 좋을 수 있지만, 컴포넌트 내부라면 다른 방법도 있습니다.

컴포넌트 템플릿에서는 라우터 인스턴스가 `$router`로 노출됩니다. 이는 앞서 본 `$route` 속성과 비슷하지만, 끝에 `r`이 하나 더 붙어 있습니다.

Options API를 사용할 때는, JavaScript 코드에서 `this.$router`와 `this.$route`로 이 두 속성에 접근할 수 있습니다. Playground 예시의 `HomeView.vue` 컴포넌트는 다음과 같이 라우터에 접근합니다:

```js
export default {
  methods: {
    goToAbout() {
      this.$router.push('/about')
    },
  },
}
```

이 메서드는 [프로그래밍 방식의 네비게이션](./essentials/navigation)에 사용되는 `push()`를 호출하고 있습니다. 이에 대해서는 나중에 더 자세히 배웁니다.

Composition API에서는 `this`를 통해 컴포넌트 인스턴스에 접근할 수 없으므로, Vue Router는 대신 사용할 수 있는 몇 가지 컴포저블을 제공합니다. Playground 예시의 `AboutView.vue`는 이 방식을 사용합니다:

```vue
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const search = computed({
  get() {
    return route.query.search ?? ''
  },
  set(search) {
    router.replace({ query: { search } })
  },
})
</script>
```

지금 당장 이 코드 전체를 이해할 필요는 없습니다. 중요한 점은, `useRouter()`와 `useRoute()` 컴포저블을 사용하여 각각 라우터 인스턴스와 현재 라우트에 접근한다는 것입니다.

### 다음 단계 %{#next-steps}%

Vite를 사용한 전체 예시를 보고 싶다면, [create-vue](https://github.com/vuejs/create-vue) 스캐폴딩 도구를 사용할 수 있습니다. 이 도구는 예제 프로젝트에 Vue Router를 포함할 수 있는 옵션을 제공합니다:

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

:::

create-vue로 생성된 예제 프로젝트는 여기서 본 것과 유사한 기능을 사용합니다. 이 프로젝트는 이 가이드의 다음 페이지에서 소개할 기능들을 탐색하는 데 유용한 출발점이 될 수 있습니다.

## 이 가이드의 관례 %{#conventions-in-this-guide}%

### 싱글 파일 컴포넌트 %{#single-file-components}%

Vue Router는 번들러(예: Vite)와 [SFC](https://vuejs.org/guide/introduction.html#single-file-components)(즉, `.vue` 파일)를 사용하는 애플리케이션에서 가장 일반적으로 사용됩니다. 이 가이드의 대부분의 예시는 이러한 스타일로 작성되지만, Vue Router 자체는 빌드 도구나 SFC 사용을 요구하지 않습니다.

예를 들어, [Vue](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn)와 [Vue Router](../installation#Direct-Download-CDN)의 _글로벌 빌드_를 사용하는 경우, 라이브러리는 import가 아닌 전역 객체를 통해 노출됩니다:

```js
const { createApp } = Vue
const { createRouter, createWebHistory } = VueRouter
```

### 컴포넌트 API 스타일 %{#component-api-style}%

Vue Router는 Composition API와 Options API 모두에서 사용할 수 있습니다. 관련이 있을 때, 이 가이드의 예시는 두 가지 스타일로 작성된 컴포넌트를 보여줍니다. Composition API 예시는 일반적으로 명시적인 `setup` 함수 대신 `<script setup>`을 사용합니다.

두 가지 스타일에 대한 복습이 필요하다면 [Vue - API 스타일](https://vuejs.org/guide/introduction.html#api-styles)을 참고하세요.

### `router`와 `route` %{#router-and-route}%

가이드 전반에 걸쳐, 라우터 인스턴스를 `router`라고 부릅니다. 이는 `createRouter()`가 반환하는 객체입니다. 애플리케이션에서 이 객체에 접근하는 방법은 상황에 따라 다릅니다. 예를 들어, Composition API를 사용하는 컴포넌트에서는 `useRouter()`를 호출하여 접근할 수 있습니다. Options API에서는 `this.$router`를 사용합니다.

마찬가지로, 현재 라우트는 `route`라고 부릅니다. 컴포넌트에서는 사용하는 API에 따라 `useRoute()` 또는 `this.$route`로 접근할 수 있습니다.

### `RouterView`와 `RouterLink` %{#routerview-and-routerlink}%

`RouterView`와 `RouterLink` 컴포넌트는 모두 [전역 등록](https://vuejs.org/guide/components/registration.html#global-registration)되어 있으므로, 컴포넌트 템플릿에서 사용할 때 import할 필요가 없습니다. 하지만 원한다면, 예를 들어 `import { RouterLink } from 'vue-router'`와 같이 로컬로 import할 수도 있습니다.

템플릿에서는 컴포넌트 이름을 PascalCase 또는 케밥 케이스로 쓸 수 있습니다. Vue의 템플릿 컴파일러는 두 가지 형식을 모두 지원하므로, `<RouterView>`와 `<router-view>`는 보통 동일하게 동작합니다. 프로젝트 내에서 사용되는 관례를 따르면 됩니다.

in-DOM 템플릿을 사용하는 경우 [일반적인 주의사항](https://vuejs.org/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)이 적용됩니다: 컴포넌트 이름은 반드시 케밥 케이스로 작성해야 하며, 셀프 클로징 태그는 지원되지 않습니다. 따라서 `<RouterView />` 대신 `<router-view></router-view>`를 사용해야 합니다.