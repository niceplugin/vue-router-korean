# 활성 링크 %{#active-links}%

애플리케이션에서 RouterLink 컴포넌트 목록을 렌더링하는 내비게이션 컴포넌트를 갖는 것은 일반적입니다. 이 목록 내에서 현재 활성화된 라우트로의 링크를 다른 링크들과 다르게 스타일링하고 싶을 수 있습니다.

RouterLink 컴포넌트는 활성 링크에 두 개의 CSS 클래스, `router-link-active`와 `router-link-exact-active`를 추가합니다. 이 둘의 차이를 이해하려면, 먼저 Vue Router가 링크가 _활성_ 상태인지 어떻게 판단하는지 알아야 합니다.

## 링크가 언제 활성화되나요? %{#when-are-links-active}%

RouterLink는 다음과 같은 경우 **_활성_** 으로 간주됩니다:

1. 현재 위치와 동일한 라우트 레코드(즉, 설정된 라우트)와 일치할 때.
2. 현재 위치와 동일한 `params` 값을 가질 때.

[중첩 라우트](./nested-routes)를 사용하는 경우, 관련된 `params`가 일치한다면 상위 라우트로의 모든 링크도 활성화된 것으로 간주됩니다.

[`query`](https://router.vuejs.org/api/interfaces/RouteLocationBase.html#query)와 같은 다른 라우트 속성들은 고려되지 않습니다.

경로가 반드시 완벽하게 일치할 필요는 없습니다. 예를 들어, [`alias`](./redirect-and-alias#Alias)를 사용하는 경우에도 동일한 라우트 레코드와 `params`로 해석된다면 일치하는 것으로 간주됩니다.

라우트에 [`redirect`](./redirect-and-alias#Redirect)가 있는 경우, 링크가 활성화되어 있는지 확인할 때 리디렉션은 따르지 않습니다.

## 정확히 활성화된 링크 %{#exact-active-links}%

**_정확한_** 일치는 상위 라우트를 포함하지 않습니다.

다음과 같은 라우트가 있다고 가정해봅시다:

```js
const routes = [
  {
    path: '/user/:username',
    component: User,
    children: [
      {
        path: 'role/:roleId',
        component: Role,
      },
    ],
  },
]
```

그리고 다음 두 링크를 생각해봅시다:

```vue-html
<RouterLink to="/user/erina">
  User
</RouterLink>
<RouterLink to="/user/erina/role/admin">
  Role
</RouterLink>
```

현재 위치 경로가 `/user/erina/role/admin`이라면, 이 두 링크 모두 _활성_ 상태로 간주되어 `router-link-active` 클래스가 두 링크 모두에 적용됩니다. 하지만 두 번째 링크만 _정확히_ 일치하므로, 두 번째 링크에만 `router-link-exact-active` 클래스가 적용됩니다.

## 클래스 설정하기 %{#configuring-the-classes}%

RouterLink 컴포넌트에는 적용되는 클래스의 이름을 변경할 수 있는 `activeClass`와 `exactActiveClass`라는 두 개의 prop이 있습니다:

```vue-html
<RouterLink
  activeClass="border-indigo-500"
  exactActiveClass="border-indigo-700"
  ...
>
```

기본 클래스 이름은 `createRouter()`에 `linkActiveClass`와 `linkExactActiveClass` 옵션을 전달하여 전역적으로도 변경할 수 있습니다:

```js
const router = createRouter({
  linkActiveClass: 'border-indigo-500',
  linkExactActiveClass: 'border-indigo-700',
  // ...
})
```

`v-slot` API를 사용한 더 고급 커스터마이징 기법은 [RouterLink 확장하기](../advanced/extending-router-link)를 참고하세요.