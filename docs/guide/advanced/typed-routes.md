# 타입이 지정된 라우트 <Badge type="tip" text="v4.4.0+" /> %{#typed-routes-badge-typetip-textv440}%

![RouterLink to autocomplete](https://user-images.githubusercontent.com/664177/176442066-c4e7fa31-4f06-4690-a49f-ed0fd880dfca.png)

라우터를 _타입이 지정된 라우트_의 맵으로 구성할 수 있습니다. 수동으로도 할 수 있지만, [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) 플러그인을 사용하여 라우트와 타입을 자동으로 생성하는 것이 권장됩니다.

## 수동 구성 %{#manual-configuration}%

타입이 지정된 라우트를 수동으로 구성하는 예시는 다음과 같습니다:

```ts
// 라우트에 타입을 지정하기 위해 vue-router에서 `RouteRecordInfo` 타입을 import합니다.
import type { RouteRecordInfo } from 'vue-router'

// 라우트 인터페이스를 정의합니다.
export interface RouteNamedMap {
  // 각 키는 이름입니다.
  home: RouteRecordInfo<
    // 여기에도 같은 이름을 사용합니다.
    'home',
    // 이 경로는 자동완성에 나타납니다.
    '/',
    // 이것은 raw params입니다 (router.push()와 RouterLink의 "to" prop에 전달할 수 있는 값)
    // 이 경우, 허용되는 params가 없습니다.
    Record<never, never>,
    // 이것은 정규화된 params입니다 (useRoute()에서 얻는 값)
    Record<never, never>,
    // 이것은 모든 자식 라우트 이름의 유니언입니다. 이 경우에는 없습니다.
    never
  >
  // 각 라우트마다 반복합니다...
  // 원하는 대로 이름을 지정할 수 있습니다.
  'named-param': RouteRecordInfo<
    'named-param',
    '/:name',
    { name: string | number }, // 문자열 또는 숫자 허용
    { name: string }, // 하지만 URL에서 항상 문자열로 반환됨
    'named-param-edit'
  >
  'named-param-edit': RouteRecordInfo<
    'named-param-edit',
    '/:name/edit',
    { name: string | number }, // 부모 params도 포함
    { name: string },
    never
  >
  'article-details': RouteRecordInfo<
    'article-details',
    '/articles/:id+',
    { id: Array<number | string> },
    { id: string[] },
    never
  >
  'not-found': RouteRecordInfo<
    'not-found',
    '/:path(.*)',
    { path: string },
    { path: string },
    never
  >
}

// 마지막으로, 이 라우트 맵으로 Vue Router 타입을 확장해야 합니다.
declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
```

::: tip

이 방식은 확실히 번거롭고 오류가 발생하기 쉽습니다. 그래서 [unplugin-vue-router](https://github.com/posva/unplugin-vue-router)를 사용하여 라우트와 타입을 자동으로 생성하는 것이 권장됩니다.

:::