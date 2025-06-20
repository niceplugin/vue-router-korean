---
sidebarDepth: 0
---

# 프로그래밍 방식 내비게이션 %{#programmatic-navigation}%

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-programmatic-navigation"
  title="프로그래밍 방식으로 내비게이션하는 방법 배우기"
/>

선언적으로 내비게이션을 하기 위해 `<router-link>`를 사용하여 앵커 태그를 만드는 것 외에도, 라우터의 인스턴스 메서드를 사용하여 프로그래밍 방식으로 내비게이션할 수 있습니다.

## 다른 위치로 이동하기 %{#navigate-to-a-different-location}%

**참고: 아래 예제에서는 라우터 인스턴스를 `router`로 지칭합니다. 컴포넌트 내부에서는 `$router` 속성을 사용하여 라우터에 접근할 수 있습니다. 예: `this.$router.push(...)`. Composition API를 사용하는 경우, [`useRouter()`](../advanced/composition-api)를 호출하여 라우터에 접근할 수 있습니다.**

다른 URL로 이동하려면 `router.push`를 사용하세요. 이 메서드는 히스토리 스택에 새 항목을 추가하므로, 사용자가 브라우저의 뒤로 가기 버튼을 클릭하면 이전 URL로 이동하게 됩니다.

이 메서드는 `<router-link>`를 클릭할 때 내부적으로 호출되므로, `<router-link :to="...">`를 클릭하는 것은 `router.push(...)`를 호출하는 것과 동일합니다.

| 선언적                         | 프로그래밍 방식         |
| ----------------------------- | ---------------------- |
| `<router-link :to="...">`     | `router.push(...)`     |

인수는 문자열 경로나 위치 설명 객체가 될 수 있습니다. 예시:

```js
// 리터럴 문자열 경로
router.push('/users/eduardo')

// 경로가 있는 객체
router.push({ path: '/users/eduardo' })

// 라우터가 URL을 생성할 수 있도록 파라미터가 있는 이름 있는 라우트
router.push({ name: 'user', params: { username: 'eduardo' } })

// 쿼리와 함께, 결과는 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 해시와 함께, 결과는 /about#team
router.push({ path: '/about', hash: '#team' })
```

**참고**: `path`가 제공되면 `params`는 무시되며, 위 예시에서 볼 수 있듯이 `query`는 그렇지 않습니다. 대신, 라우트의 `name`을 제공하거나 모든 파라미터를 포함한 전체 `path`를 수동으로 지정해야 합니다:

```js
const username = 'eduardo'
// URL을 수동으로 만들 수 있지만 인코딩을 직접 처리해야 합니다
router.push(`/user/${username}`) // -> /user/eduardo
// 동일
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 가능하다면 자동 URL 인코딩의 이점을 위해 `name`과 `params`를 사용하세요
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params`는 `path`와 함께 사용할 수 없습니다
router.push({ path: '/user', params: { username } }) // -> /user
```

`params`를 지정할 때는 반드시 `string` 또는 `number`(또는 [반복 가능한 파라미터](./route-matching-syntax.md#Repeatable-params)를 위한 이들의 배열)를 제공해야 합니다. **그 외의 타입(객체, 불리언 등)은 자동으로 문자열로 변환됩니다.** [선택적 파라미터](./route-matching-syntax.md#Optional-parameters)의 경우, 값을 빈 문자열(`""`)이나 `null`로 제공하여 제거할 수 있습니다.

`to` prop은 `router.push`와 동일한 종류의 객체를 허용하므로, 동일한 규칙이 모두 적용됩니다.

`router.push` 및 다른 모든 내비게이션 메서드는 _Promise_를 반환하므로, 내비게이션이 완료될 때까지 기다리거나 성공 또는 실패 여부를 알 수 있습니다. 이에 대해서는 [내비게이션 처리](../advanced/navigation-failures.md)에서 더 자세히 다룹니다.

## 현재 위치 대체하기 %{#replace-current-location}%

이 메서드는 `router.push`와 비슷하게 동작하지만, 이름에서 알 수 있듯이 새로운 히스토리 항목을 추가하지 않고 현재 항목을 대체합니다.

| 선언적                                 | 프로그래밍 방식         |
| ------------------------------------- | ---------------------- |
| `<router-link :to="..." replace>`     | `router.replace(...)`  |

`router.push`에 전달되는 `to` 인자에 `replace: true` 속성을 직접 추가하는 것도 가능합니다:

```js
router.push({ path: '/home', replace: true })
// 아래와 동일
router.replace({ path: '/home' })
```

## 히스토리 이동 %{#traverse-history}%

<VueSchoolLink
  href="https://vueschool.io/lessons/go-back"
  title="Vue Router로 뒤로 가는 방법 배우기"
/>

이 메서드는 하나의 정수형 파라미터를 받아, 히스토리 스택에서 앞으로 또는 뒤로 몇 단계 이동할지 지정합니다. 이는 `window.history.go(n)`과 유사합니다.

예시

```js
// 한 단계 앞으로 이동, router.forward()와 동일
router.go(1)

// 한 단계 뒤로 이동, router.back()과 동일
router.go(-1)

// 3단계 앞으로 이동
router.go(3)

// 해당 단계만큼 기록이 없으면 조용히 실패함
router.go(-100)
router.go(100)
```

## 히스토리 조작 %{#history-manipulation}%

`router.push`, `router.replace`, `router.go`가 [`window.history.pushState`, `window.history.replaceState`, `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History)의 대응 메서드라는 점을 눈치챘을 수 있습니다. 이들은 `window.history` API를 모방합니다.

따라서 [브라우저 히스토리 API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)에 이미 익숙하다면, Vue Router를 사용할 때 히스토리 조작이 익숙하게 느껴질 것입니다.

또한 Vue Router의 내비게이션 메서드(`push`, `replace`, `go`)는 라우터 인스턴스를 생성할 때 전달된 `history` 옵션과 상관없이 일관되게 동작한다는 점도 언급할 가치가 있습니다.