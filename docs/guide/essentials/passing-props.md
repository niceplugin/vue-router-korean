# 라우트 컴포넌트에 Props 전달하기 %{#passing-props-to-route-components}%

<VueSchoolLink
  href="https://vueschool.io/lessons/route-props"
  title="라우트 컴포넌트에 props를 전달하는 방법 배우기"
/>

컴포넌트에서 `$route` 또는 `useRoute()`를 사용하면 라우트와의 강한 결합이 생겨 해당 컴포넌트가 특정 URL에서만 사용될 수 있게 되어 유연성이 제한됩니다. 이것이 반드시 나쁜 것은 아니지만, `props` 옵션을 사용하여 이러한 동작을 분리할 수 있습니다.

이전 예제로 돌아가 봅시다:

```vue
<!-- User.vue -->
<template>
  <div>
    User {{ $route.params.id }}
  </div>
</template>
```

다음과 같이 사용합니다:

```js
import User from './User.vue'

// 이것들은 `createRouter`에 전달됩니다
const routes = [
  { path: '/users/:id', component: User },
]
```

`User.vue`에서 `$route`에 대한 직접적인 의존성을 props 선언으로 제거할 수 있습니다:

::: code-group

```vue [Composition API]
<!-- User.vue -->
<script setup>
defineProps({
  id: String
})
</script>

<template>
  <div>
    User {{ id }}
  </div>
</template>
```

```vue [Options API]
<!-- User.vue -->
<script>
export default {
  props: {
    id: String
  }
}
</script>

<template>
  <div>
    User {{ id }}
  </div>
</template>
```

:::

그런 다음 라우트에서 `props: true`로 설정하여 `id` 파라미터를 prop으로 전달할 수 있습니다:

```js
const routes = [
  { path: '/user/:id', component: User, props: true }
]
```

이렇게 하면 컴포넌트를 어디서든 사용할 수 있어 재사용성과 테스트가 쉬워집니다.

## 불리언 모드 %{#boolean-mode}%

`props`가 `true`로 설정되면, `route.params`가 컴포넌트의 props로 설정됩니다.

## 네임드 뷰 %{#named-views}%

네임드 뷰가 있는 라우트의 경우, 각 네임드 뷰에 대해 `props` 옵션을 정의해야 합니다:

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```

## 객체 모드 %{#object-mode}%

`props`가 객체일 때, 이 객체가 그대로 컴포넌트의 props로 설정됩니다. props가 고정값일 때 유용합니다.

```js
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }
  }
]
```

## 함수 모드 %{#function-mode}%

props를 반환하는 함수를 만들 수 있습니다. 이를 통해 파라미터를 다른 타입으로 변환하거나, 정적 값과 라우트 기반 값을 조합할 수 있습니다.

```js
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q })
  }
]
```

URL `/search?q=vue`는 `{query: 'vue'}`를 `SearchUser` 컴포넌트의 props로 전달합니다.

`props` 함수는 상태를 가지지 않도록 유지하는 것이 좋습니다. 이 함수는 라우트가 변경될 때만 평가됩니다. props를 정의하는 데 상태가 필요하다면 래퍼 컴포넌트를 사용하세요. 이렇게 하면 Vue가 상태 변화를 감지할 수 있습니다.

## RouterView를 통한 전달 %{#via-routerview}%

[`<RouterView>` 슬롯](../advanced/router-view-slot)을 통해서도 props를 전달할 수 있습니다:

```vue-html
<RouterView v-slot="{ Component }">
  <component
    :is="Component"
    view-prop="value"
   />
</RouterView>
```

::: warning
이 경우, **모든 뷰 컴포넌트**가 `view-prop`을 받게 됩니다. 이는 모든 뷰 컴포넌트가 `view-prop` prop을 선언했다고 가정하는 것이므로, 보통은 좋은 방법이 아닙니다. 가능하다면 위의 다른 옵션을 사용하세요.
:::