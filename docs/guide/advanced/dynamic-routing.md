# 동적 라우팅 %{#dynamic-routing}%

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-dynamic-routing"
  title="실행 중에 라우트를 추가하는 방법 배우기"
/>

라우터에 라우트를 추가하는 것은 보통 `routes` 옵션을 통해 이루어지지만, 어떤 상황에서는 애플리케이션이 이미 실행 중일 때 라우트를 추가하거나 제거하고 싶을 수 있습니다. [Vue CLI UI](https://cli.vuejs.org/dev-guide/ui-api.html)와 같은 확장 가능한 인터페이스를 가진 애플리케이션은 이를 사용하여 애플리케이션을 확장할 수 있습니다.

## 라우트 추가하기 %{#adding-routes}%

동적 라우팅은 주로 두 가지 함수인 `router.addRoute()`와 `router.removeRoute()`를 통해 이루어집니다. 이 함수들은 **오직** 새로운 라우트를 등록만 하며, 새로 추가된 라우트가 현재 위치와 일치하더라도 **수동으로** `router.push()`나 `router.replace()`를 사용해 해당 라우트를 표시해야 합니다. 예시를 살펴보겠습니다:

다음과 같이 하나의 라우트만 있는 라우터가 있다고 가정해봅시다:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:articleName', component: Article }],
})
```

`/about`, `/store`, `/3-tricks-to-improve-your-routing-code`와 같은 어떤 페이지로 이동해도 `Article` 컴포넌트가 렌더링됩니다. 만약 `/about`에 있을 때 새로운 라우트를 추가한다면:

```js
router.addRoute({ path: '/about', component: About })
```

페이지는 여전히 `Article` 컴포넌트를 보여줍니다. 현재 위치를 변경하고 우리가 있던 위치를 덮어쓰려면(새로운 항목을 추가하여 히스토리에 같은 위치가 두 번 생기는 것을 방지하기 위해) 수동으로 `router.replace()`를 호출해야 합니다:

```js
router.addRoute({ path: '/about', component: About })
// this.$route 또는 useRoute()도 사용할 수 있습니다
router.replace(router.currentRoute.value.fullPath)
```

새로운 라우트가 표시될 때까지 기다려야 한다면 `await router.replace()`를 사용할 수 있습니다.

## 내비게이션 가드 내에서 라우트 추가하기 %{#adding-routes-inside-navigation-guards}%

내비게이션 가드 내에서 라우트를 추가하거나 제거하기로 결정했다면, `router.replace()`를 호출하지 말고 새로운 위치를 반환하여 리디렉션을 트리거해야 합니다:

```js
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // 리디렉션을 트리거합니다
    return to.fullPath
  }
})
```

위 예시는 두 가지를 가정합니다: 첫째, 새로 추가된 라우트 레코드가 `to` 위치와 일치하여 우리가 접근하려던 위치와는 다른 위치가 된다는 점입니다. 둘째, `hasNecessaryRoute()`가 새로운 라우트를 추가한 후 `true`를 반환하여 무한 리디렉션을 방지한다는 점입니다.

리디렉션을 하고 있기 때문에 진행 중인 내비게이션을 대체하게 되며, 앞서 보여준 예시와 동일하게 동작합니다. 실제 상황에서는 라우트 추가가 내비게이션 가드 외부, 예를 들어 뷰 컴포넌트가 마운트될 때 새로운 라우트를 등록하는 경우가 더 많습니다.

## 라우트 제거하기 %{#removing-routes}%

기존 라우트를 제거하는 방법에는 몇 가지가 있습니다:

- 이름이 충돌하는 라우트를 추가하는 방법. 기존 라우트와 동일한 이름을 가진 라우트를 추가하면, 먼저 해당 라우트를 제거한 후 새 라우트를 추가합니다:

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // 이름이 같으므로 이전에 추가된 라우트가 제거됩니다.
  // 모든 라우트에서 이름은 고유해야 합니다.
  router.addRoute({ path: '/other', name: 'about', component: Other })
  ```

- `router.addRoute()`가 반환하는 콜백을 호출하는 방법:

  ```js
  const removeRoute = router.addRoute(routeRecord)
  removeRoute() // 라우트가 존재하면 제거합니다
  ```

  라우트에 이름이 없는 경우에 유용합니다.
- `router.removeRoute()`를 사용하여 이름으로 라우트를 제거하는 방법:

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // 라우트 제거
  router.removeRoute('about')
  ```

  이 함수를 사용하고 싶지만 이름 충돌을 피하고 싶다면 라우트의 이름에 `Symbol`을 사용할 수 있습니다.

라우트가 제거될 때마다 **해당 라우트의 모든 별칭과 자식 라우트**도 함께 제거됩니다.

## 중첩 라우트 추가하기 %{#adding-nested-routes}%

기존 라우트에 중첩 라우트를 추가하려면, `router.addRoute()`의 첫 번째 매개변수로 라우트의 _이름_ 을 전달하면 됩니다. 이렇게 하면 `children`을 통해 추가한 것과 동일하게 라우트가 추가됩니다:

```js
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })
```

이는 다음과 동일합니다:

```js
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

## 기존 라우트 확인하기 %{#looking-at-existing-routes}%

Vue Router는 기존 라우트를 확인할 수 있는 두 가지 함수를 제공합니다:

- [`router.hasRoute()`](https://router.vuejs.org/api/interfaces/Router.html#hasRoute): 라우트가 존재하는지 확인합니다.
- [`router.getRoutes()`](https://router.vuejs.org/api/interfaces/Router.html#getRoutes): 모든 라우트 레코드가 담긴 배열을 가져옵니다.