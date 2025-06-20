# 네임드 뷰 %{#named-views}%

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-named-views"
  title="네임드 뷰 사용법 배우기"
/>

때때로 뷰를 중첩하는 대신 여러 뷰를 동시에 표시해야 할 때가 있습니다. 예를 들어, `sidebar` 뷰와 `main` 뷰가 있는 레이아웃을 만들 때 그렇습니다. 이럴 때 네임드 뷰가 유용합니다. 뷰에 하나의 아웃렛만 두는 대신 여러 개를 두고 각각에 이름을 지정할 수 있습니다. 이름이 없는 `router-view`는 `default`라는 이름이 자동으로 부여됩니다.

```vue-html
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```

뷰는 컴포넌트를 사용하여 렌더링되므로, 여러 뷰에는 동일한 라우트에 대해 여러 컴포넌트가 필요합니다. 반드시 `components`(**s**가 붙음) 옵션을 사용해야 합니다:

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar의 축약형
        LeftSidebar,
        // 이들은 `<router-view>`의 `name` 속성과 매칭됩니다
        RightSidebar,
      },
    },
  ],
})
```

이 예제의 동작하는 데모는 [여기](https://codesandbox.io/s/named-views-vue-router-4-examples-rd20l)에서 확인할 수 있습니다.

## 중첩 네임드 뷰 %{#nested-named-views}%

네임드 뷰와 중첩 뷰를 사용하여 복잡한 레이아웃을 만들 수 있습니다. 이때, 중첩된 `router-view`에도 이름을 지정해야 합니다. 설정 패널 예시를 살펴보겠습니다:

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav`는 일반 컴포넌트입니다
- `UserSettings`는 부모 뷰 컴포넌트입니다
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview`는 중첩 뷰 컴포넌트입니다

**참고**: _이러한 레이아웃을 표현하기 위한 HTML/CSS가 어떻게 생겼는지는 잠시 잊고, 사용된 컴포넌트에 집중합시다._

위 레이아웃에서 `UserSettings` 컴포넌트의 `<template>` 섹션은 다음과 비슷할 것입니다:

```vue-html
<!-- UserSettings.vue -->
<div>
  <h1>사용자 설정</h1>
  <NavBar />
  <router-view />
  <router-view name="helper" />
</div>
```

그런 다음 아래와 같은 라우트 설정으로 위 레이아웃을 구현할 수 있습니다:

```js
{
  path: '/settings',
  // 상위에서도 네임드 뷰를 사용할 수 있습니다
  component: UserSettings,
  children: [
    {
      path: 'emails',
      component: UserEmailsSubscriptions
    },
    {
      path: 'profile',
      components: {
        default: UserProfile,
        helper: UserProfilePreview
      }
    }
  ]
}
```

이 예제의 동작하는 데모는 [여기](https://codesandbox.io/s/nested-named-views-vue-router-4-examples-re9yl?&initialpath=%2Fsettings%2Femails)에서 확인할 수 있습니다.