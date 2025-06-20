# 리다이렉트와 별칭 %{#redirect-and-alias}%

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-redirect-and-alias"
  title="리다이렉트와 별칭 사용법 배우기"
/>

## 리다이렉트 %{#redirect}%

리다이렉트는 `routes` 설정에서 수행됩니다. `/home`에서 `/`로 리다이렉트하려면 다음과 같이 합니다:

```js
const routes = [{ path: '/home', redirect: '/' }]
```

리다이렉트는 이름이 지정된 라우트로도 지정할 수 있습니다:

```js
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
```

또는 동적 리다이렉트를 위해 함수를 사용할 수도 있습니다:

```js
const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // 함수는 대상 라우트를 인자로 받습니다
      // 여기서 리다이렉트 경로/위치를 반환합니다.
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
  {
    path: '/search',
    // ...
  },
]
```

**[네비게이션 가드](../advanced/navigation-guards.md)는 리다이렉트하는 라우트에는 적용되지 않고, 오직 그 대상에만 적용**된다는 점에 유의하세요. 예를 들어 위의 예시에서 `/home` 라우트에 `beforeEnter` 가드를 추가해도 아무런 효과가 없습니다.

`redirect`를 작성할 때는 `component` 옵션을 생략할 수 있습니다. 왜냐하면 해당 라우트는 직접적으로 접근되지 않으므로 렌더링할 컴포넌트가 없기 때문입니다. 단, [중첩 라우트](./nested-routes.md)는 예외입니다: 라우트 레코드에 `children`과 `redirect` 속성이 모두 있다면, 반드시 `component` 속성도 있어야 합니다.

### 상대 리다이렉트 %{#relative-redirecting}%

상대 위치로 리다이렉트하는 것도 가능합니다:

```js
const routes = [
  {
    // 항상 /users/123/posts를 /users/123/profile로 리다이렉트합니다
    path: '/users/:id/posts',
    redirect: to => {
      // 함수는 대상 라우트를 인자로 받습니다
      return to.path.replace(/posts$/, 'profile')
    },
  },
]
```

## 별칭 %{#alias}%

리다이렉트란 사용자가 `/home`에 방문하면 URL이 `/`로 대체되고, `/`로 매칭된다는 의미입니다. 그렇다면 별칭(alias)이란 무엇일까요?

**`/`의 별칭이 `/home`이라면, 사용자가 `/home`에 방문해도 URL은 `/home`으로 남아있지만, 마치 사용자가 `/`에 방문한 것처럼 매칭됩니다.**

위의 내용은 라우트 설정에서 다음과 같이 표현할 수 있습니다:

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

별칭을 사용하면 UI 구조를 설정의 중첩 구조에 얽매이지 않고 임의의 URL에 매핑할 수 있습니다. 중첩 라우트에서 경로를 절대 경로로 만들려면 별칭을 `/`로 시작하게 하세요. 둘을 조합하여 배열로 여러 개의 별칭을 제공할 수도 있습니다:

```js
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      // 이 3개의 URL에서 UserList가 렌더링됩니다
      // - /users
      // - /users/list
      // - /people
      { path: '', component: UserList, alias: ['/people', 'list'] },
    ],
  },
]
```

라우트에 파라미터가 있다면, 모든 절대 별칭에도 반드시 포함시켜야 합니다:

```js
const routes = [
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      // 이 3개의 URL에서 UserDetails가 렌더링됩니다
      // - /users/24
      // - /users/24/profile
      // - /24
      { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
    ],
  },
]
```

**SEO 관련 참고사항**: 별칭을 사용할 때는 반드시 [정규 링크(canonical link)](https://support.google.com/webmasters/answer/139066?hl=ko)를 정의하세요.