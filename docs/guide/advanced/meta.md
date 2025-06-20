# 라우트 메타 필드 %{#route-meta-fields}%

<VueSchoolLink
  href="https://vueschool.io/lessons/route-meta-fields"
  title="라우트 메타 필드 사용법 배우기"
/>

때때로 라우트에 임의의 정보를 추가하고 싶을 때가 있습니다. 예를 들어 트랜지션 이름이나, 라우트에 접근할 수 있는 역할(roles) 등입니다. 이는 `meta` 속성을 통해 달성할 수 있으며, 이 속성은 여러 프로퍼티를 가진 객체를 받아 라우트 위치와 내비게이션 가드에서 접근할 수 있습니다. `meta` 속성은 다음과 같이 정의할 수 있습니다:

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // 인증된 사용자만 게시글을 작성할 수 있음
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail,
        // 누구나 게시글을 읽을 수 있음
        meta: { requiresAuth: false },
      },
    ],
  },
]
```

그렇다면 이 `meta` 필드는 어떻게 접근할 수 있을까요?

<!-- TODO: 라우트 레코드에 대한 설명이 먼저 나와야 하며, 내용이 이곳으로 이동되어야 함 -->

먼저, `routes` 설정에 있는 각 라우트 객체를 **라우트 레코드**라고 부릅니다. 라우트 레코드는 중첩될 수 있습니다. 따라서 라우트가 매칭될 때, 하나 이상의 라우트 레코드와 매칭될 수 있습니다.

예를 들어, 위의 라우트 설정에서 URL `/posts/new`는 부모 라우트 레코드(`path: '/posts'`)와 자식 라우트 레코드(`path: 'new'`) 모두와 매칭됩니다.

라우트에 의해 매칭된 모든 라우트 레코드는 `route` 객체(그리고 내비게이션 가드의 라우트 객체)에서 `route.matched` 배열로 노출됩니다. 이 배열을 순회하여 모든 `meta` 필드를 확인할 수도 있지만, Vue Router는 부모에서 자식까지 **모든 `meta`** 필드를 비재귀적으로 병합한 `route.meta`도 제공합니다. 즉, 다음과 같이 간단히 사용할 수 있습니다:

```js
router.beforeEach((to, from) => {
  // 모든 라우트 레코드를 확인하는 대신
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // 이 라우트는 인증이 필요하므로, 로그인 여부를 확인
    // 로그인하지 않았다면 로그인 페이지로 리다이렉트
    return {
      path: '/login',
      // 나중에 돌아올 수 있도록 현재 위치 저장
      query: { redirect: to.fullPath },
    }
  }
})
```

## 타입스크립트 %{#typescript}%

`vue-router`의 `RouteMeta` 인터페이스를 확장하여 meta 필드에 타입을 지정할 수 있습니다:

```ts
// 이 코드는 `router.ts`와 같은 어떤 `.ts` 파일에도 바로 추가할 수 있습니다.
// `.d.ts` 파일에 추가해도 됩니다. 해당 파일이
// 프로젝트의 tsconfig.json "files"에 포함되어 있는지 확인하세요.
import 'vue-router'

// 모듈로 인식되도록 최소한 하나의 `export` 문을 추가하세요.
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // 선택 사항
    isAdmin?: boolean
    // 모든 라우트에서 선언해야 함
    requiresAuth: boolean
  }
}
```