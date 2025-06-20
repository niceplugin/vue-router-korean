# Vue 2에서 마이그레이션 %{#migrating-from-vue-2}%

Vue Router의 대부분의 API는 v3( Vue 2용)에서 v4( Vue 3용)로 다시 작성되는 동안 변경되지 않았지만, 애플리케이션을 마이그레이션할 때 마주칠 수 있는 몇 가지 파괴적인 변경 사항이 있습니다. 이 가이드는 이러한 변경 사항이 왜 발생했는지, 그리고 Vue Router 4에서 애플리케이션이 동작하도록 어떻게 적응해야 하는지 이해하는 데 도움을 주기 위해 작성되었습니다.

## 파괴적인 변경 사항 %{#breaking-changes}%

변경 사항은 사용 빈도순으로 정렬되어 있습니다. 따라서 이 목록을 순서대로 따라가는 것이 좋습니다.

### new Router가 createRouter로 변경됨 %{#new-router-becomes-createrouter}%

Vue Router는 더 이상 클래스가 아니며 함수들의 집합입니다. `new Router()`를 작성하는 대신, 이제 `createRouter`를 호출해야 합니다:

```js
// 이전에는
// import Router from 'vue-router'
import { createRouter } from 'vue-router'

const router = createRouter({
  // ...
})
```

### `mode`를 대체하는 새로운 `history` 옵션 %{#new-history-option-to-replace-mode}%

`mode: 'history'` 옵션은 더 유연한 `history`라는 이름의 옵션으로 대체되었습니다. 사용하던 모드에 따라 적절한 함수를 사용해야 합니다:

- `"history"`: `createWebHistory()`
- `"hash"`: `createWebHashHistory()`
- `"abstract"`: `createMemoryHistory()`

전체 예시는 다음과 같습니다:

```js
import { createRouter, createWebHistory } from 'vue-router'
// createWebHashHistory와 createMemoryHistory도 있습니다

createRouter({
  history: createWebHistory(),
  routes: [],
})
```

SSR에서는 적절한 history를 수동으로 전달해야 합니다:

```js
// router.js
let history = isServer ? createMemoryHistory() : createWebHistory()
let router = createRouter({ routes, history })
// server-entry.js 등에서
router.push(req.url) // 요청 url
router.isReady().then(() => {
  // 요청 처리
})
```

**이유**: 사용하지 않는 history의 트리 셰이킹을 가능하게 하고, 네이티브 솔루션과 같은 고급 사용 사례를 위한 커스텀 history 구현을 지원하기 위함입니다.

### `base` 옵션 위치 변경 %{#moved-the-base-option}%

`base` 옵션은 이제 `createWebHistory`(및 다른 history) 함수의 첫 번째 인자로 전달됩니다:

```js
import { createRouter, createWebHistory } from 'vue-router'
createRouter({
  history: createWebHistory('/base-directory/'),
  routes: [],
})
```

### `fallback` 옵션 제거 %{#removal-of-the-fallback-option}%

라우터를 생성할 때 `fallback` 옵션은 더 이상 지원되지 않습니다:

```diff
-new VueRouter({
+createRouter({
-  fallback: false,
// 기타 옵션...
})
```

**이유**: Vue가 지원하는 모든 브라우저는 [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)를 지원하므로, `location.hash`를 수정하는 해킹 없이 직접 `history.pushState()`를 사용할 수 있습니다.

### `*`(별표 또는 캐치올) 라우트 제거 %{#removed-star-or-catch-all-routes}%

캐치올 라우트(`*`, `/*`)는 이제 커스텀 정규식을 사용하는 파라미터로 정의해야 합니다:

```js
const routes = [
  // pathMatch는 파라미터의 이름입니다. 예를 들어 /not/found로 이동하면
  // { params: { pathMatch: ['not', 'found'] }}
  // 마지막 * 덕분에 반복 파라미터가 되고, 이름으로 not-found 라우트로 직접 이동할 계획이라면 필요합니다
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // 마지막 `*`를 생략하면, params 내의 `/` 문자가 resolve 또는 push 시 인코딩됩니다
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]
// 이름 있는 라우트 사용 시 잘못된 예:
router.resolve({
  name: 'bad-not-found',
  params: { pathMatch: 'not/found' },
}).href // '/not%2Ffound'
// 올바른 예:
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'
```

:::tip
이름으로 not found 라우트로 직접 push할 계획이 없다면 반복 파라미터에 `*`를 추가할 필요가 없습니다. `router.push('/not/found/url')`을 호출하면 올바른 `pathMatch` 파라미터가 제공됩니다.
:::

**이유**: Vue Router는 더 이상 `path-to-regexp`를 사용하지 않고, 라우트 랭킹과 동적 라우팅을 가능하게 하는 자체 파싱 시스템을 구현합니다. 일반적으로 프로젝트당 하나의 캐치올 라우트만 추가하므로 `*`에 대한 특별한 문법을 지원하는 이점이 크지 않습니다. 파라미터의 인코딩은 예외 없이 모든 라우트에서 동일하게 적용되어 예측하기 쉽습니다.

### `currentRoute` 속성이 이제 `ref()`임 %{#the-currentroute-property-is-now-a-ref}%

이전에는 라우터 인스턴스의 [`currentRoute`](https://v3.router.vuejs.org/api/#router-currentroute) 객체의 속성에 직접 접근할 수 있었습니다.

vue-router v4 도입과 함께, 라우터 인스턴스의 `currentRoute` 객체의 내부 타입이 Vue 3에서 도입된 [반응성 기초](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)에서 가져온 `Ref<RouteLocationNormalizedLoaded>`로 변경되었습니다.

`useRoute()`나 `this.$route`로 라우트를 읽는 경우에는 변화가 없지만, 라우터 인스턴스에서 직접 접근하는 경우에는 실제 라우트 객체에 `currentRoute.value`로 접근해야 합니다:

```ts
const { page } = router.currentRoute.query // [!code --]
const { page } = router.currentRoute.value.query // [!code ++]
```

### `onReady`가 `isReady`로 대체됨 %{#replaced-onready-with-isready}%

기존의 `router.onReady()` 함수는 인자를 받지 않고 Promise를 반환하는 `router.isReady()`로 대체되었습니다:

```js
// 대체
router.onReady(onSuccess, onError)
// 아래로 변경
router.isReady().then(onSuccess).catch(onError)
// 또는 await 사용:
try {
  await router.isReady()
  // onSuccess
} catch (err) {
  // onError
}
```

### `scrollBehavior` 변경 사항 %{#scrollbehavior-changes}%

`scrollBehavior`에서 반환되는 객체는 이제 [`ScrollToOptions`](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions)와 유사합니다: `x`는 `left`로, `y`는 `top`으로 이름이 변경되었습니다. [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0035-router-scroll-position.md)를 참고하세요.

**이유**: 객체를 `ScrollToOptions`와 유사하게 만들어 네이티브 JS API와 더 친숙하게 느끼도록 하고, 향후 새로운 옵션을 추가할 수 있도록 하기 위함입니다.

### `<router-view>`, `<keep-alive>`, `<transition>` %{#router-view-keep-alive-and-transition}%

`transition`과 `keep-alive`는 이제 `RouterView` 내부에서 `v-slot` API를 통해 사용해야 합니다:

```vue-html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

**이유**: 필수적인 변경이었습니다. [관련 RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0034-router-view-keep-alive-transitions.md)를 참고하세요.

### `<router-link>`의 `append` prop 제거 %{#removal-of-append-prop-in-router-link}%

`<router-link>`의 `append` prop이 제거되었습니다. 대신 기존 `path`에 값을 수동으로 연결할 수 있습니다:

```vue-html
대체
<router-link to="child-route" append>to relative child</router-link>
아래로 변경
<router-link :to="append($route.path, 'child-route')">
  to relative child
</router-link>
```

_App_ 인스턴스에 전역 `append` 함수를 정의해야 합니다:

```js
app.config.globalProperties.append = (path, pathToAppend) =>
  path + (path.endsWith('/') ? '' : '/') + pathToAppend
```

**이유**: `append`는 자주 사용되지 않았고, 사용자 레벨에서 쉽게 구현할 수 있습니다.

### `<router-link>`의 `event` 및 `tag` prop 제거 %{#removal-of-event-and-tag-props-in-router-link}%

`<router-link>`의 `event`와 `tag` prop이 모두 제거되었습니다. [`v-slot` API](/guide/advanced/composition-api#uselink)를 사용하여 `<router-link>`를 완전히 커스터마이즈할 수 있습니다:

```vue-html
대체
<router-link to="/about" tag="span" event="dblclick">About Us</router-link>
아래로 변경
<router-link to="/about" custom v-slot="{ navigate }">
  <span @click="navigate" @keypress.enter="navigate" role="link">About Us</span>
</router-link>
```

**이유**: 이 prop들은 `<a>` 태그가 아닌 다른 것을 사용하기 위해 자주 함께 사용되었으나, `v-slot` API 도입 이전에 추가되었고, 모두에게 번들 크기를 늘릴 만큼 충분히 사용되지 않았습니다.

### `<router-link>`의 `exact` prop 제거 %{#removal-of-the-exact-prop-in-router-link}%

`exact` prop은 더 이상 존재하지 않습니다. 이 prop이 해결하던 문제점이 더 이상 존재하지 않으므로 안전하게 제거할 수 있습니다. 다만 두 가지를 유의해야 합니다:

- 라우트는 이제 생성된 라우트 위치 객체의 `path`, `query`, `hash` 속성이 아니라, 그들이 나타내는 라우트 레코드를 기준으로 활성화됩니다
- 이제 `path` 부분만 일치하며, `query`와 `hash`는 더 이상 고려되지 않습니다

이 동작을 커스터마이즈하고 싶다면, 예를 들어 `hash` 부분까지 고려하고 싶다면, [`v-slot` API](/guide/advanced/composition-api#useLink)를 사용하여 `<router-link>`를 확장해야 합니다.

**이유**: 자세한 내용은 [활성 매칭에 대한 RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0028-router-active-link.md#summary)를 참고하세요.

### 믹스인 내 내비게이션 가드는 무시됨 %{#navigation-guards-in-mixins-are-ignored}%

현재 믹스인 내 내비게이션 가드는 지원되지 않습니다. [vue-router#454](https://github.com/vuejs/router/issues/454)에서 지원 현황을 확인할 수 있습니다.

### `router.match` 제거 및 `router.resolve` 변경 %{#removal-of-routermatch-and-changes-to-routerresolve}%

`router.match`와 `router.resolve`는 `router.resolve`로 통합되었으며, 시그니처가 약간 변경되었습니다. 자세한 내용은 [API](https://router.vuejs.org/api/interfaces/Router.html#resolve)를 참고하세요.

**이유**: 동일한 목적의 여러 메서드를 통합하기 위함입니다.

### `router.getMatchedComponents()` 제거 %{#removal-of-routergetmatchedcomponents}%

`router.getMatchedComponents` 메서드는 제거되었으며, 매칭된 컴포넌트는 `router.currentRoute.value.matched`에서 가져올 수 있습니다:

```js
router.currentRoute.value.matched.flatMap(record =>
  Object.values(record.components)
)
```

**이유**: 이 메서드는 SSR에서만 사용되었으며, 사용자가 한 줄로 직접 구현할 수 있습니다.

### 리다이렉트 레코드는 특수 경로를 사용할 수 없음 %{#redirect-records-cannot-use-special-paths}%

이전에는 문서화되지 않은 기능으로, 리다이렉트 레코드를 `/events/:id`와 같은 특수 경로로 설정하면 기존의 `id` 파라미터를 재사용할 수 있었습니다. 이제는 불가능하며, 두 가지 방법이 있습니다:

- 파라미터 없이 라우트의 이름을 사용: `redirect: { name: 'events' }`. 단, 파라미터 `:id`가 선택적인 경우에는 동작하지 않습니다
- 함수로 대상에 따라 새 위치를 재생성: `redirect: to => ({ name: 'events', params: to.params })`

**이유**: 이 문법은 거의 사용되지 않았고, 위의 방법들에 비해 충분히 짧지 않으면서 복잡성을 추가하고 라우터를 무겁게 만들었습니다.

### **모든** 내비게이션이 항상 비동기적으로 동작 %{#all-navigations-are-now-always-asynchronous}%

첫 번째 내비게이션을 포함한 모든 내비게이션이 이제 비동기적으로 동작합니다. 즉, `transition`을 사용하는 경우, 앱을 마운트하기 전에 라우터가 _ready_ 상태가 될 때까지 기다려야 할 수 있습니다:

```js
app.use(router)
// 참고: 서버 사이드에서는 초기 위치를 수동으로 push해야 합니다
router.isReady().then(() => app.mount('#app'))
```

그렇지 않으면, 라우터가 초기 위치(아무것도 없음)를 표시한 후 첫 번째 위치를 표시하므로, `transition`에 `appear` prop을 제공한 것처럼 초기 트랜지션이 발생합니다.

**초기 내비게이션에 내비게이션 가드가 있는 경우**, SSR을 하지 않는 한, 가드가 해결될 때까지 앱 렌더링을 차단하지 않는 것이 좋습니다. 이 경우, 라우터가 준비될 때까지 기다리지 않고 앱을 마운트하면 Vue 2와 동일한 결과가 나옵니다.

### `router.app` 제거 %{#removal-of-routerapp}%

`router.app`은 라우터를 주입한 마지막 루트 컴포넌트(Vue 인스턴스)를 나타냈습니다. 이제 Vue Router는 여러 Vue 애플리케이션에서 동시에 안전하게 사용할 수 있습니다. 여전히 라우터를 사용할 때 추가할 수 있습니다:

```js
app.use(router)
router.app = app
```

`Router` 인터페이스의 타입스크립트 정의를 확장하여 `app` 속성을 추가할 수도 있습니다.

**이유**: Vue 3 애플리케이션은 Vue 2와 달리 존재하지 않으며, 이제 동일한 Router 인스턴스를 여러 애플리케이션에서 사용할 수 있으므로, `app` 속성이 있으면 루트 인스턴스가 아닌 애플리케이션을 의미하게 되어 혼란을 줄 수 있습니다.

### 라우트 컴포넌트의 `<slot>`에 콘텐츠 전달 %{#passing-content-to-route-components-slot}%

이전에는 `<router-view>` 컴포넌트 아래에 템플릿을 중첩하여 라우트 컴포넌트의 `<slot>`에 직접 전달할 수 있었습니다:

```vue-html
<router-view>
  <p>Vue Router 3에서는 라우트 컴포넌트 내부에 렌더링됩니다</p>
</router-view>
```

`<router-view>`의 `v-slot` api 도입으로 인해, `<component>`에 `v-slot` API를 사용하여 전달해야 합니다:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component">
    <p>Vue Router 3에서는 라우트 컴포넌트 내부에 렌더링됩니다</p>
  </component>
</router-view>
```

### 라우트 위치에서 `parent` 제거 %{#removal-of-parent-from-route-locations}%

정규화된 라우트 위치(`this.$route` 및 `router.resolve`가 반환하는 객체)에서 `parent` 속성이 제거되었습니다. 여전히 `matched` 배열을 통해 접근할 수 있습니다:

```js
const parent = this.$route.matched[this.$route.matched.length - 2]
```

**이유**: `parent`와 `children`이 있으면 불필요한 순환 참조가 생기며, 이미 `matched`를 통해 속성을 가져올 수 있습니다.

### `pathToRegexpOptions` 제거 %{#removal-of-pathtoregexpoptions}%

라우트 레코드의 `pathToRegexpOptions`와 `caseSensitive` 속성은 `createRouter()`의 `sensitive`와 `strict` 옵션으로 대체되었습니다. 이제 라우터를 생성할 때 직접 전달할 수 있습니다. `path-to-regexp`에 특화된 다른 옵션은 모두 제거되었습니다. 경로 파싱에 더 이상 `path-to-regexp`를 사용하지 않기 때문입니다.

### 이름 없는 파라미터 제거 %{#removal-of-unnamed-parameters}%

`path-to-regexp` 제거로 인해 이름 없는 파라미터는 더 이상 지원되지 않습니다:

- `/foo(/foo)?/suffix`는 `/foo/:_(foo)?/suffix`로 변경
- `/foo(foo)?`는 `/foo:_(foo)?`로 변경
- `/foo/(.*)`는 `/foo/:_(.*)`로 변경

:::tip
파라미터 이름으로 `_` 대신 아무 이름이나 사용할 수 있습니다. 중요한 것은 이름을 제공하는 것입니다.
:::

### `history.state` 사용 %{#usage-of-historystate}%

Vue Router는 `history.state`에 정보를 저장합니다. 직접 `history.pushState()`를 호출하는 코드가 있다면, 이를 피하거나 일반적인 `router.push()`와 `history.replaceState()`로 리팩터링해야 합니다:

```js
// 대체
history.pushState(myState, '', url)
// 아래로 변경
await router.push(url)
history.replaceState({ ...history.state, ...myState }, '')
```

마찬가지로, 현재 상태를 보존하지 않고 `history.replaceState()`를 호출했다면, 현재 `history.state`를 전달해야 합니다:

```js
// 대체
history.replaceState({}, '', url)
// 아래로 변경
history.replaceState(history.state, '', url)
```

**이유**: 내비게이션에 대한 스크롤 위치, 이전 위치 등 정보를 저장하기 위해 history state를 사용합니다.

### `options`에 `routes` 옵션 필수 %{#routes-option-is-required-in-options}%

이제 `options`에 `routes` 속성이 필수입니다.

```js
createRouter({ routes: [] })
```

**이유**: 라우터는 라우트와 함께 생성되도록 설계되었습니다. 나중에 라우트를 추가할 수 있지만, 대부분의 시나리오에서 최소 한 개의 라우트가 필요하며, 일반적으로 앱당 한 번만 작성됩니다.

### 존재하지 않는 이름 라우트 %{#non-existent-named-routes}%

존재하지 않는 이름 라우트로 push 또는 resolve하면 에러가 발생합니다:

```js
// 오타로 인해 name이 잘못됨
router.push({ name: 'homee' }) // 에러 발생
router.resolve({ name: 'homee' }) // 에러 발생
```

**이유**: 이전에는 라우터가 `/`로 이동했지만 아무것도 표시하지 않았습니다(홈 페이지 대신). 유효한 URL을 생성할 수 없으므로 에러를 발생시키는 것이 더 합리적입니다.

### 이름 라우트에서 필수 `params` 누락 %{#missing-required-params-on-named-routes}%

필수 params 없이 이름 라우트로 push 또는 resolve하면 에러가 발생합니다:

```js
// 다음과 같은 라우트가 있을 때:
const routes = [{ path: '/users/:id', name: 'user', component: UserDetails }]

// `id` 파라미터가 없으면 실패
router.push({ name: 'user' })
router.resolve({ name: 'user' })
```

**이유**: 위와 동일합니다.

### 빈 `path`를 가진 이름 자식 라우트는 더 이상 슬래시를 추가하지 않음 %{#named-children-routes-with-an-empty-path-no-longer-appends-a-slash}%

빈 `path`를 가진 중첩 이름 라우트가 있을 때:

```js
const routes = [
  {
    path: '/dashboard',
    name: 'dashboard-parent',
    component: DashboardParent,
    children: [
      { path: '', name: 'dashboard', component: DashboardDefault },
      {
        path: 'settings',
        name: 'dashboard-settings',
        component: DashboardSettings,
      },
    ],
  },
]
```

이제 `dashboard`라는 이름 라우트로 내비게이션 또는 resolve하면 **끝에 슬래시가 없는** URL이 생성됩니다:

```js
router.resolve({ name: 'dashboard' }).href // '/dashboard'
```

이는 다음과 같은 자식 `redirect` 레코드에 중요한 영향을 미칩니다:

```js
const routes = [
  {
    path: '/parent',
    component: Parent,
    children: [
      // 이제 `/parent/home`이 아닌 `/home`으로 리다이렉트됩니다
      { path: '', redirect: 'home' },
      { path: 'home', component: Home },
    ],
  },
]
```

`path`가 `/parent/`였다면, `/parent/`에 대한 상대 위치 `home`은 실제로 `/parent/home`이지만, `/parent`에 대한 상대 위치 `home`은 `/home`입니다.

<!-- 자세한 내용은 [요리책의 상대 링크](../../cookbook/relative-links.md)에서 확인하세요. -->

**이유**: 트레일링 슬래시 동작을 일관되게 만들기 위함입니다. 기본적으로 모든 라우트는 트레일링 슬래시를 허용합니다. `strict` 옵션을 사용하고 라우트에 슬래시를 수동으로 추가(또는 생략)하여 비활성화할 수 있습니다.

<!-- TODO: 요리책 항목 추가 예정 -->

### `$route` 속성 인코딩 %{#route-properties-encoding}%

`params`, `query`, `hash`의 디코딩된 값은 내비게이션이 어디서 시작되었는지에 상관없이 이제 일관적입니다(이전 브라우저는 여전히 인코딩되지 않은 `path`와 `fullPath`를 생성할 수 있습니다). 초기 내비게이션은 인앱 내비게이션과 동일한 결과를 가져야 합니다.

[정규화된 라우트 위치](https://router.vuejs.org/api/#RouteLocationNormalized)에서:

- `path`, `fullPath`의 값은 더 이상 디코딩되지 않습니다. 브라우저가 제공하는 대로(대부분 인코딩된 상태) 표시됩니다. 예: 주소창에 직접 `https://example.com/hello world`를 입력하면 인코딩된 버전인 `https://example.com/hello%20world`가 되고, `path`와 `fullPath` 모두 `/hello%20world`가 됩니다.
- `hash`는 이제 디코딩되어, `router.push({ hash: $route.hash })`로 복사하거나 [scrollBehavior](https://router.vuejs.org/api/interfaces/RouterOptions.html#scrollBehavior)의 `el` 옵션에서 바로 사용할 수 있습니다.
- `push`, `resolve`, `replace`를 사용할 때 문자열 위치나 객체의 `path` 속성을 제공하면 **반드시 인코딩되어야** 합니다(이전 버전과 동일). 반면, `params`, `query`, `hash`는 디코딩된 상태로 제공해야 합니다.
- 슬래시 문자(`/`)는 이제 `params` 내에서 올바르게 디코딩되며, URL에서는 여전히 인코딩된 버전(`%2F`)이 생성됩니다.

**이유**: `router.push()`와 `router.resolve()`를 호출할 때 기존 위치의 속성을 쉽게 복사할 수 있도록 하고, 브라우저 간에 결과 라우트 위치를 일관되게 만듭니다. `router.push()`는 이제 멱등성을 가지므로, `router.push(route.fullPath)`, `router.push({ hash: route.hash })`, `router.push({ query: route.query })`, `router.push({ params: route.params })`를 호출해도 추가 인코딩이 발생하지 않습니다.

### `$router.push()` 및 `$router.replace()` - `onComplete` 및 `onAbort` 콜백 %{#routerpush-and-routerreplace---oncomplete-and-onabort-callbacks}%

이전에는 `$router.push()`와 `$router.replace()`가 두 번째와 세 번째 인자로 `onComplete`와 `onAbort` 콜백을 받았습니다. 내비게이션 결과에 따라 호출되었습니다. Promise 기반 API 도입으로 이 콜백들은 중복되어 제거되었습니다. 성공 및 실패 내비게이션 감지 방법은 [내비게이션 실패](/guide/advanced/navigation-failures.md)를 참고하세요.

**이유**: JS 표준(Promise)에 맞추어 라이브러리 크기를 줄이기 위함입니다.

### 타입스크립트 변경 사항 %{#typescript-changes}%

타입을 더 일관되고 표현력 있게 만들기 위해 일부 타입의 이름이 변경되었습니다:

| `vue-router@3` | `vue-router@4`          |
| -------------- | ----------------------- |
| RouteConfig    | RouteRecordRaw          |
| Location       | RouteLocation           |
| Route          | RouteLocationNormalized |

## 새로운 기능 %{#new-features}%

Vue Router 4에서 주목할 만한 새로운 기능은 다음과 같습니다:

- [동적 라우팅](../advanced/dynamic-routing.md)
- [컴포지션 API](../advanced/composition-api.md)
<!-- - 커스텀 History 구현 -->