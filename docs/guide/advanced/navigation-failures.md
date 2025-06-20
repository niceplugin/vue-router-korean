# 내비게이션 결과 대기 %{#waiting-for-the-result-of-a-navigation}%

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-detecting-navigation-failures"
  title="내비게이션 실패 감지 방법 배우기"
/>

`router-link`을 사용할 때, Vue Router는 내비게이션을 트리거하기 위해 `router.push`를 호출합니다. 대부분의 링크에서 기대되는 동작은 사용자를 새로운 페이지로 이동시키는 것이지만, 사용자가 동일한 페이지에 머무르게 되는 몇 가지 상황이 있습니다:

- 사용자가 이동하려는 페이지에 이미 있는 경우.
- [내비게이션 가드](./navigation-guards.md)가 `return false`로 내비게이션을 중단한 경우.
- 이전 내비게이션 가드가 끝나기 전에 새로운 내비게이션 가드가 발생한 경우.
- [내비게이션 가드](./navigation-guards.md)가 새로운 위치(예: `return '/login'`)를 반환하여 다른 곳으로 리디렉션한 경우.
- [내비게이션 가드](./navigation-guards.md)가 `Error`를 던진 경우.

내비게이션이 끝난 후에 무언가를 하고 싶다면, `router.push`를 호출한 후 대기할 방법이 필요합니다. 예를 들어, 모바일 메뉴가 있어 다른 페이지로 이동할 수 있고, 새로운 페이지로 이동한 후에만 메뉴를 숨기고 싶다면 다음과 같이 할 수 있습니다:

```js
router.push('/my-profile')
this.isMenuOpen = false
```

하지만 이렇게 하면 메뉴가 바로 닫히게 됩니다. 왜냐하면 **내비게이션은 비동기적**이기 때문입니다. `router.push`가 반환하는 프로미스를 `await`해야 합니다:

```js
await router.push('/my-profile')
this.isMenuOpen = false
```

이제 내비게이션이 끝난 후에 메뉴가 닫히지만, 내비게이션이 방지된 경우에도 메뉴가 닫힙니다. 실제로 페이지가 변경되었는지 아닌지 감지할 방법이 필요합니다.

## 내비게이션 실패 감지 %{#detecting-navigation-failures}%

내비게이션이 방지되어 사용자가 동일한 페이지에 머무르는 경우, `router.push`가 반환하는 `Promise`의 해결 값은 _내비게이션 실패_가 됩니다. 그렇지 않으면 _falsy_ 값(보통 `undefined`)이 반환됩니다. 이를 통해 실제로 다른 페이지로 이동했는지 아닌지 구분할 수 있습니다:

```js
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // 내비게이션이 방지됨
} else {
  // 내비게이션 성공(리디렉션의 경우도 포함)
  this.isMenuOpen = false
}
```

_내비게이션 실패_는 몇 가지 추가 속성이 있는 `Error` 인스턴스이며, 어떤 내비게이션이 왜 방지되었는지 알 수 있는 충분한 정보를 제공합니다. 내비게이션 결과의 성격을 확인하려면 `isNavigationFailure` 함수를 사용하세요:

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// 저장하지 않고 기사 편집 페이지를 떠나려고 시도
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 사용자에게 작은 알림 표시
  showToast('저장되지 않은 변경 사항이 있습니다. 그래도 나가시겠습니까?')
}
```

::: tip
두 번째 매개변수를 생략하면: `isNavigationFailure(failure)`, `failure`가 _내비게이션 실패_인지 여부만 확인합니다.
:::

## 전역 내비게이션 실패 감지 %{#global-navigation-failures}%

[`router.afterEach()` 내비게이션 가드](./navigation-guards.md#Global-After-Hooks)를 사용하여 전역적으로 내비게이션 실패를 감지할 수 있습니다:

```ts
router.afterEach((to, from, failure) => {
  if (failure) {
    sendToAnalytics(to, from, failure)
  }
})
```

## 내비게이션 실패 구분 %{#differentiating-navigation-failures}%

처음에 언급했듯이, 내비게이션을 중단시키는 다양한 상황이 있으며, 이들은 모두 서로 다른 _내비게이션 실패_로 이어집니다. 이들은 `isNavigationFailure`와 `NavigationFailureType`을 사용하여 구분할 수 있습니다. 세 가지 유형이 있습니다:

- `aborted`: 내비게이션 가드 내에서 `false`가 반환되어 내비게이션이 중단된 경우.
- `cancelled`: 현재 내비게이션이 끝나기 전에 새로운 내비게이션이 발생한 경우. 예: 내비게이션 가드 내에서 대기 중일 때 `router.push`가 호출된 경우.
- `duplicated`: 이미 대상 위치에 있기 때문에 내비게이션이 방지된 경우.

## _내비게이션 실패_의 속성 %{#navigation-failuress-properties}%

모든 내비게이션 실패는 현재 위치와 실패한 내비게이션의 대상 위치를 반영하는 `to`와 `from` 속성을 노출합니다:

```js
// 관리자 페이지에 접근 시도
router.push('/admin').then(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

모든 경우에 `to`와 `from`은 정규화된 라우트 위치입니다.

## 리디렉션 감지 %{#detecting-redirections}%

내비게이션 가드 내에서 새로운 위치를 반환하면, 진행 중인 내비게이션을 덮어쓰는 새로운 내비게이션이 트리거됩니다. 다른 반환 값과 달리, 리디렉션은 내비게이션을 방지하지 않고, **새로운 내비게이션을 생성합니다**. 따라서 내비게이션 가드의 `to`와 `from`처럼 Route Location의 `redirectedFrom` 속성을 읽어 다르게 확인해야 합니다:

```js
await router.push('/my-profile')
if (router.currentRoute.value.redirectedFrom) {
  // redirectedFrom은 내비게이션 가드의 to와 from처럼 정규화된 라우트 위치입니다
}
```
