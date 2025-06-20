# 트랜지션 %{#transitions}%

<VueSchoolLink
  href="https://vueschool.io/lessons/route-transitions"
  title="라우트 트랜지션에 대해 배우기"
/>

라우트 컴포넌트에서 트랜지션을 사용하고 내비게이션에 애니메이션을 적용하려면 [`<RouterView>` 슬롯](./router-view-slot)을 사용해야 합니다:

```vue-html
<router-view v-slot="{ Component }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

[모든 트랜지션 API](https://vuejs.org/guide/built-ins/transition.html)는 여기서도 동일하게 동작합니다.

## 라우트별 트랜지션 %{#per-route-transition}%

위의 사용법은 모든 라우트에 동일한 트랜지션을 적용합니다. 각 라우트의 컴포넌트마다 다른 트랜지션을 적용하고 싶다면, [meta 필드](./meta.md)와 `<transition>`의 동적 `name`을 조합할 수 있습니다:

```js
const routes = [
  {
    path: '/custom-transition',
    component: PanelLeft,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/other-transition',
    component: PanelRight,
    meta: { transition: 'slide-right' },
  },
]
```

```vue-html
<router-view v-slot="{ Component, route }">
  <!-- 커스텀 트랜지션을 사용하거나 `fade`로 대체 -->
  <transition :name="route.meta.transition || 'fade'">
    <component :is="Component" />
  </transition>
</router-view>
```

## 라우트 기반 동적 트랜지션 %{#route-based-dynamic-transition}%

타겟 라우트와 현재 라우트 간의 관계에 따라 사용할 트랜지션을 동적으로 결정할 수도 있습니다. 바로 앞의 예시와 매우 비슷한 코드를 사용합니다:

```vue-html
<!-- 동적 트랜지션 이름 사용 -->
<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transition">
    <component :is="Component" />
  </transition>
</router-view>
```

[내비게이션 후크](./navigation-guards.md#Global-After-Hooks)를 추가하여 라우트의 깊이에 따라 `meta` 필드에 동적으로 정보를 추가할 수 있습니다

```js
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

## 재사용되는 뷰 간 트랜지션 강제 적용 %{#forcing-a-transition-between-reused-views}%

Vue는 비슷해 보이는 컴포넌트를 자동으로 재사용하여 트랜지션을 생략할 수 있습니다. 다행히도, [`key` 속성 추가](https://vuejs.org/api/built-in-special-attributes.html#key)를 통해 트랜지션을 강제로 적용할 수 있습니다. 이를 통해 동일한 라우트에서 파라미터만 다를 때도 트랜지션을 트리거할 수 있습니다:

```vue-html
<router-view v-slot="{ Component, route }">
  <transition name="fade">
    <component :is="Component" :key="route.path" />
  </transition>
</router-view>
```

## 초기 내비게이션과 트랜지션 %{#initial-navigation-and-transitions}%

일반적으로 Vue의 `<Transition>`에서는 `appear` prop을 추가하지 않으면 enter 애니메이션이 무시됩니다. 하지만 `<RouterView>`와 함께 사용할 때는 `appear` prop이 설정되지 않아도 트랜지션이 **항상** 적용되는 것을 알 수 있습니다. 이는 Vue Router에서 내비게이션이 비동기적으로 처리되기 때문으로, Vue 애플리케이션이 초기 내비게이션이 끝나기 전에 한 번 렌더링되기 때문입니다. 이를 적응하는 방법에는 여러 가지가 있습니다. 가장 쉬운 방법은 [`isReady`](https://router.vuejs.org/api/interfaces/Router.html#isReady)를 사용해 초기 내비게이션이 완료된 후 앱을 마운트하는 것입니다:

```ts
const app = createApp(App)
app.use(router)

// 초기 내비게이션이 준비된 후 마운트
await router.isReady()
app.mount('#app')
```

<!-- 전체 예시는 [여기](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js)에서 확인할 수 있습니다. -->