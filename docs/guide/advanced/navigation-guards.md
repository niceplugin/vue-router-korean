# 내비게이션 가드 %{#navigation-guards}%

<VueSchoolLink
  href="https://vueschool.io/lessons/route-guards"
  title="내비게이션 가드 추가하는 방법 배우기"
/>

이름에서 알 수 있듯이, Vue 라우터에서 제공하는 내비게이션 가드는 주로 내비게이션을 리디렉션하거나 취소하여 내비게이션을 보호하는 데 사용됩니다. 라우트 내비게이션 과정에 훅을 거는 방법에는 전역, 라우트별, 컴포넌트 내에서 등 여러 가지가 있습니다.

## 전역 Before 가드 %{#global-before-guards}%

`router.beforeEach`를 사용하여 전역 before 가드를 등록할 수 있습니다:

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 내비게이션을 취소하려면 명시적으로 false를 반환하세요
  return false
})
```

전역 before 가드는 생성 순서대로, 내비게이션이 트리거될 때마다 호출됩니다. 가드는 비동기적으로 해결될 수 있으며, 모든 훅이 해결되기 전까지 내비게이션은 **보류(pending)** 상태로 간주됩니다.

모든 가드 함수는 두 개의 인자를 받습니다:

- **`to`**: 이동하려는 대상 라우트 위치 [정규화된 형식](https://router.vuejs.org/api/#RouteLocationNormalized)
- **`from`**: 이동 전 현재 라우트 위치 [정규화된 형식](https://router.vuejs.org/api/#RouteLocationNormalized)

그리고 선택적으로 다음 값 중 하나를 반환할 수 있습니다:

- `false`: 현재 내비게이션을 취소합니다. 브라우저 URL이 변경된 경우(사용자가 수동으로 변경했거나 뒤로 가기 버튼을 사용한 경우), `from` 라우트의 URL로 재설정됩니다.
- [라우트 위치](https://router.vuejs.org/api/#RouteLocationRaw): 라우트 위치를 전달하여 다른 위치로 리디렉션합니다. 이는 `router.push()`를 호출하는 것과 같으며, `replace: true`나 `name: 'home'`과 같은 옵션을 전달할 수 있습니다. 현재 내비게이션은 중단되고 동일한 `from`을 가진 새로운 내비게이션이 생성됩니다.

  ```js
  router.beforeEach(async (to, from) => {
    if (
      // 사용자가 인증되었는지 확인
      !isAuthenticated &&
      // ❗️ 무한 리디렉션 방지
      to.name !== 'Login'
    ) {
      // 사용자를 로그인 페이지로 리디렉션
      return { name: 'Login' }
    }
  })
  ```

예상치 못한 상황이 발생한 경우 `Error`를 throw할 수도 있습니다. 이 경우에도 내비게이션이 취소되고 [`router.onError()`](https://router.vuejs.org/api/interfaces/Router.html#onError)를 통해 등록된 콜백이 호출됩니다.

아무것도 반환하지 않거나, `undefined` 또는 `true`를 반환하면 **내비게이션이 유효하다고 간주**되어 다음 내비게이션 가드가 호출됩니다.

위의 모든 내용은 **`async` 함수 및 Promise와 동일하게 동작**합니다:

```js
router.beforeEach(async (to, from) => {
  // canUserAccess()는 `true` 또는 `false`를 반환
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

### 선택적 세 번째 인자 `next` %{#optional-third-argument-next}%

이전 버전의 Vue Router에서는 _세 번째 인자_ `next`를 사용할 수 있었으며, 이는 흔히 실수의 원인이 되어 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md#motivation)를 통해 제거되었습니다. 하지만 여전히 지원되므로, 내비게이션 가드에 세 번째 인자를 전달할 수 있습니다. 이 경우, **내비게이션 가드를 통과할 때 반드시 한 번만 `next`를 호출해야 합니다**. 여러 번 등장할 수 있지만, 논리 경로가 겹치지 않는 경우에만 그렇고, 그렇지 않으면 훅이 해결되지 않거나 오류가 발생합니다. 다음은 인증되지 않은 사용자를 `/login`으로 리디렉션하는 **잘못된 예시**입니다:

```js
// 잘못된 예시
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // 사용자가 인증되지 않은 경우, `next`가 두 번 호출됨
  next()
})
```

올바른 버전은 다음과 같습니다:

```js
// 올바른 예시
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## 전역 Resolve 가드 %{#global-resolve-guards}%

`router.beforeResolve`를 사용하여 전역 가드를 등록할 수 있습니다. 이는 `router.beforeEach`와 유사하게 **모든 내비게이션**에서 트리거되지만, resolve 가드는 내비게이션이 확정되기 직전, **모든 컴포넌트 내 가드와 비동기 라우트 컴포넌트가 해결된 후**에 호출됩니다. 다음은 [커스텀 meta](./meta.md) 속성 `requiresCamera`가 정의된 라우트에서 사용자가 카메라 접근 권한을 부여했는지 확인하는 예시입니다:

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 오류를 처리한 후 내비게이션 취소
        return false
      } else {
        // 예기치 않은 오류, 내비게이션 취소 및 오류를 전역 핸들러로 전달
        throw error
      }
    }
  }
})
```

`router.beforeResolve`는 사용자가 페이지에 진입할 수 없는 경우 데이터를 가져오거나 기타 작업을 피하고 싶을 때 이상적인 위치입니다.

<!-- TODO: [`meta` 필드](./meta.md)와 결합하여 [일반적인 데이터 패칭 메커니즘](#TODO) 만드는 방법 추가 -->

## 전역 After 훅 %{#global-after-hooks}%

전역 after 훅도 등록할 수 있지만, 가드와 달리 이 훅들은 `next` 함수를 받지 않으며 내비게이션에 영향을 줄 수 없습니다:

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

<!-- TODO: 예시 링크 추가할지 검토 -->

이 훅들은 분석, 페이지 제목 변경, 페이지 알림과 같은 접근성 기능 등 다양한 용도로 유용합니다.

또한 [내비게이션 실패](./navigation-failures.md)를 세 번째 인자로 반영합니다:

```js
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

내비게이션 실패에 대한 자세한 내용은 [가이드](./navigation-failures.md)를 참고하세요.

## 가드 내에서의 전역 주입 %{#global-injections-within-guards}%

Vue 3.3부터는 내비게이션 가드 내에서 `inject()`를 사용할 수 있습니다. 이는 [pinia 스토어](https://pinia.vuejs.org)와 같은 전역 속성을 주입하는 데 유용합니다. `app.provide()`로 제공된 모든 것은 `router.beforeEach()`, `router.beforeResolve()`, `router.afterEach()` 내에서도 접근할 수 있습니다:

```ts
// main.ts
const app = createApp(App)
app.provide('global', 'hello injections')

// router.ts 또는 main.ts
router.beforeEach((to, from) => {
  const global = inject('global') // 'hello injections'
  // pinia 스토어
  const userStore = useAuthStore()
  // ...
})
```

## 라우트별 가드 %{#per-route-guard}%

라우트의 설정 객체에 `beforeEnter` 가드를 직접 정의할 수 있습니다:

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // 내비게이션 거부
      return false
    },
  },
]
```

`beforeEnter` 가드는 **해당 라우트에 진입할 때만 트리거**되며, `params`, `query` 또는 `hash`가 변경될 때(예: `/users/2`에서 `/users/3`으로 이동하거나 `/users/2#info`에서 `/users/2#projects`로 이동)에는 트리거되지 않습니다. 오직 **다른 라우트에서 진입할 때만** 트리거됩니다.

`beforeEnter`에 함수 배열을 전달할 수도 있습니다. 이는 여러 라우트에서 가드를 재사용할 때 유용합니다:

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

[중첩 라우트](../essentials/nested-routes)를 사용할 때, 부모와 자식 라우트 모두 `beforeEnter`를 사용할 수 있습니다. 부모 라우트에 배치하면, 동일한 부모를 가진 자식 간 이동 시에는 트리거되지 않습니다. 예를 들어:

```js
const routes = [
  {
    path: '/user',
    beforeEnter() {
      // ...
    },
    children: [
      { path: 'list', component: UserList },
      { path: 'details', component: UserDetails },
    ],
  },
]
```

위 예시의 `beforeEnter`는 `/user/list`와 `/user/details` 간 이동 시에는 호출되지 않습니다. 두 라우트가 동일한 부모를 공유하기 때문입니다. 만약 `beforeEnter` 가드를 `details` 라우트에 직접 배치하면, 두 라우트 간 이동 시 호출됩니다.

::: tip
[라우트 meta 필드](./meta)와 전역 내비게이션 가드를 사용하여 라우트별 가드와 유사한 동작을 구현할 수 있습니다.
:::

## 컴포넌트 내 가드 %{#in-component-guards}%

마지막으로, 라우트 컴포넌트(라우터 설정에 전달된 컴포넌트) 내부에 직접 라우트 내비게이션 가드를 정의할 수 있습니다.

### Options API 사용 %{#using-the-options-api}%

다음 옵션을 라우트 컴포넌트에 추가할 수 있습니다:

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```vue
<script>
export default {
  beforeRouteEnter(to, from) {
    // 이 컴포넌트를 렌더링하는 라우트가 확정되기 전에 호출됩니다.
    // `this` 컴포넌트 인스턴스에 접근할 수 없습니다.
    // 이 가드가 호출될 때 컴포넌트가 아직 생성되지 않았기 때문입니다!
  },
  beforeRouteUpdate(to, from) {
    // 이 컴포넌트를 렌더링하는 라우트가 변경되었지만, 이 컴포넌트가 새 라우트에서 재사용될 때 호출됩니다.
    // 예를 들어, `/users/:id`와 같은 라우트에서 `/users/1`과 `/users/2` 사이를 이동할 때,
    // 동일한 `UserDetails` 컴포넌트 인스턴스가 재사용되며, 이 훅이 호출됩니다.
    // 이때 컴포넌트가 마운트되어 있으므로, 내비게이션 가드는 `this` 컴포넌트 인스턴스에 접근할 수 있습니다.
  },
  beforeRouteLeave(to, from) {
    // 이 컴포넌트를 렌더링하는 라우트에서 벗어나기 직전에 호출됩니다.
    // `beforeRouteUpdate`와 마찬가지로, `this` 컴포넌트 인스턴스에 접근할 수 있습니다.
  },
}
</script>
```

`beforeRouteEnter` 가드는 **`this`에 접근할 수 없습니다**. 이 가드는 내비게이션이 확정되기 전에 호출되므로, 진입하는 새 컴포넌트가 아직 생성되지 않았기 때문입니다.

하지만, `next`에 콜백을 전달하여 인스턴스에 접근할 수 있습니다. 내비게이션이 확정되면 콜백이 호출되고, 컴포넌트 인스턴스가 인자로 전달됩니다:

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // `vm`을 통해 컴포넌트 공개 인스턴스에 접근
  })
}
```

`beforeRouteEnter`만이 `next`에 콜백을 전달하는 것을 지원합니다. `beforeRouteUpdate`와 `beforeRouteLeave`에서는 이미 `this`가 사용 가능하므로, 콜백 전달이 불필요하며 _지원되지 않습니다_:

```js
beforeRouteUpdate (to, from) {
  // 그냥 `this`를 사용하세요
  this.name = to.params.name
}
```

**leave 가드**는 주로 사용자가 저장하지 않은 편집 내용을 가진 채로 라우트를 떠나는 것을 방지하는 데 사용됩니다. `false`를 반환하여 내비게이션을 취소할 수 있습니다.

```js
beforeRouteLeave (to, from) {
  const answer = window.confirm('정말로 떠나시겠습니까? 저장되지 않은 변경사항이 있습니다!')
  if (!answer) return false
}
```

### Composition API 사용 %{#using-the-composition-api}%

Composition API로 컴포넌트를 작성하는 경우, `onBeforeRouteUpdate`와 `onBeforeRouteLeave`를 통해 업데이트 및 leave 가드를 추가할 수 있습니다. 자세한 내용은 [Composition API 섹션](./composition-api.md#navigation-guards)을 참고하세요.

## 전체 내비게이션 해결 흐름 %{#the-full-navigation-resolution-flow}%

1. 내비게이션 트리거.
2. 비활성화된 컴포넌트의 `beforeRouteLeave` 가드 호출.
3. 전역 `beforeEach` 가드 호출.
4. 재사용되는 컴포넌트의 `beforeRouteUpdate` 가드 호출.
5. 라우트 설정의 `beforeEnter` 호출.
6. 비동기 라우트 컴포넌트 해결.
7. 활성화된 컴포넌트의 `beforeRouteEnter` 호출.
8. 전역 `beforeResolve` 가드 호출.
9. 내비게이션 확정.
10. 전역 `afterEach` 훅 호출.
11. DOM 업데이트 트리거.
12. 인스턴스화된 인스턴스와 함께 `beforeRouteEnter` 가드에 전달된 콜백 호출.
