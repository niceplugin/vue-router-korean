# 동적 라우트 매칭과 파라미터 %{#dynamic-route-matching-with-params}%

<VueSchoolLink
  href="https://vueschool.io/lessons/dynamic-routes"
  title="파라미터를 사용한 동적 라우트 매칭에 대해 배우기"
/>

종종 주어진 패턴의 라우트를 동일한 컴포넌트에 매핑해야 할 때가 있습니다. 예를 들어, 모든 사용자에 대해 렌더링되어야 하지만 서로 다른 사용자 ID를 가진 `User` 컴포넌트가 있을 수 있습니다. Vue Router에서는 경로에 동적 세그먼트를 사용하여 이를 달성할 수 있으며, 이를 _파라미터_라고 부릅니다:

```js
import User from './User.vue'

// 이들은 `createRouter`에 전달됩니다
const routes = [
  // 동적 세그먼트는 콜론으로 시작합니다
  { path: '/users/:id', component: User },
]
```

이제 `/users/johnny`와 `/users/jolyne`와 같은 URL이 모두 동일한 라우트에 매핑됩니다.

_파라미터_는 콜론 `:`으로 표시됩니다. 라우트가 매칭되면, 해당 _파라미터_의 값은 모든 컴포넌트에서 `route.params`로 노출됩니다. 따라서, `User`의 템플릿을 다음과 같이 업데이트하여 현재 사용자 ID를 렌더링할 수 있습니다:

```vue
<template>
  <div>
    <!-- 현재 라우트는 템플릿에서 $route로 접근할 수 있습니다 -->
    User {{ $route.params.id }}
  </div>
</template>
```

하나의 라우트에 여러 _파라미터_를 가질 수 있으며, 이들은 `route.params`의 해당 필드에 매핑됩니다. 예시:

| 패턴                            | 매칭된 경로                | route.params                             |
| ------------------------------ | ------------------------ | ---------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

`route.params` 외에도, `route` 객체는 `route.query`(URL에 쿼리가 있을 경우), `route.hash` 등과 같은 유용한 정보도 제공합니다. 전체 세부 정보는 [API Reference](https://router.vuejs.org/api/#RouteLocationNormalized)에서 확인할 수 있습니다.

이 예제의 동작하는 데모는 [여기](https://codesandbox.io/s/route-params-vue-router-examples-mlb14?from-embed&initialpath=%2Fusers%2Feduardo%2Fposts%2F1)에서 확인할 수 있습니다.

<!-- <iframe
  src="https://codesandbox.io/embed//route-params-vue-router-examples-mlb14?fontsize=14&theme=light&view=preview&initialpath=%2Fusers%2Feduardo%2Fposts%2F1"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Route Params example"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> -->

## 파라미터 변경에 반응하기 %{#reacting-to-params-changes}%

<VueSchoolLink
  href="https://vueschool.io/lessons/reacting-to-param-changes"
  title="파라미터 변경에 반응하는 방법 배우기"
/>

파라미터가 있는 라우트를 사용할 때 주의할 점은 사용자가 `/users/johnny`에서 `/users/jolyne`으로 이동할 때, **동일한 컴포넌트 인스턴스가 재사용된다는 것**입니다. 두 라우트 모두 동일한 컴포넌트를 렌더링하므로, 이전 인스턴스를 파괴하고 새로 생성하는 것보다 더 효율적입니다. **하지만, 이는 컴포넌트의 라이프사이클 훅이 호출되지 않는다는 의미이기도 합니다.**

동일한 컴포넌트에서 파라미터 변경에 반응하려면, 이 시나리오에서는 `route.params`와 같이 `route` 객체의 어떤 것이든 감시(watch)하면 됩니다:

::: code-group

```vue [Composition API]
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.params.id,
  (newId, oldId) => {
    // 라우트 변경에 반응...
  }
)
</script>
```

```vue [Options API]
<script>
export default {
  created() {
    this.$watch(
      () => this.$route.params.id,
      (newId, oldId) => {
        // 라우트 변경에 반응...
      }
    )
  },
}
</script>
```

:::

또는, `beforeRouteUpdate` [네비게이션 가드](../advanced/navigation-guards.md)를 사용할 수도 있으며, 이를 통해 네비게이션을 취소할 수도 있습니다:

::: code-group

```vue [Composition API]
<script setup>
import { onBeforeRouteUpdate } from 'vue-router'
// ...

onBeforeRouteUpdate(async (to, from) => {
  // 라우트 변경에 반응...
  userData.value = await fetchUser(to.params.id)
})
</script>
```

```vue [Options API]
<script>
export default {
  async beforeRouteUpdate(to, from) {
    // 라우트 변경에 반응...
    this.userData = await fetchUser(to.params.id)
  },
  // ...
}
</script>
```

:::

## 모든 경로/404 Not found 라우트 잡기 %{#catch-all-404-not-found-route}%

<VueSchoolLink
  href="https://vueschool.io/lessons/404-not-found-page"
  title="모든 경로/404 not found 라우트 만드는 방법 배우기"
/>

일반 파라미터는 `/`로 구분된 URL 조각 사이의 문자만 매칭합니다. **모든 것**을 매칭하고 싶다면, 파라미터 바로 뒤에 괄호 안에 정규식을 추가하여 커스텀 _파라미터_ 정규식을 사용할 수 있습니다:

```js
const routes = [
  // 모든 것을 매칭하고 `route.params.pathMatch`에 넣습니다
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // `/user-`로 시작하는 모든 것을 매칭하고 `route.params.afterUser`에 넣습니다
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```

이 특정 시나리오에서는 괄호 안에 [커스텀 정규식](./route-matching-syntax.md#custom-regexp-in-params)을 사용하고, `pathMatch` 파라미터를 [선택적으로 반복 가능](./route-matching-syntax.md#optional-parameters)하게 표시하고 있습니다. 이를 통해 필요하다면 `path`를 배열로 분할하여 해당 라우트로 직접 이동할 수 있습니다:

```js
router.push({
  name: 'NotFound',
  // 현재 경로를 유지하고, 대상 URL이 `//`로 시작하지 않도록 첫 글자를 제거
  params: { pathMatch: route.path.substring(1).split('/') },
  // 기존 쿼리와 해시가 있다면 유지
  query: route.query,
  hash: route.hash,
})
```

자세한 내용은 [반복 파라미터](./route-matching-syntax.md#Repeatable-params) 섹션을 참고하세요.

[History 모드](./history-mode.md)를 사용하는 경우, 서버를 올바르게 구성하기 위한 지침도 반드시 따라야 합니다.

## 고급 매칭 패턴 %{#advanced-matching-patterns}%

Vue Router는 `express`에서 영감을 받은 자체 경로 매칭 문법을 사용하므로, 선택적 파라미터, 0개 이상/1개 이상의 요구사항, 심지어 커스텀 정규식 패턴과 같은 다양한 고급 매칭 패턴을 지원합니다. 자세한 내용은 [고급 매칭](./route-matching-syntax.md) 문서를 참고하세요.