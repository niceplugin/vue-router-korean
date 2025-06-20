# 경로 매칭 문법 %{#routes-matching-syntax}%

<VueSchoolLink
  href="https://vueschool.io/lessons/vue-router-4-advanced-routes-matching-syntax"
  title="고급 라우트 매칭 문법 사용법 배우기"
/>

대부분의 애플리케이션은 `/about`과 같은 정적 경로나, [동적 경로 매칭](./dynamic-matching.md)에서 본 것처럼 `/users/:userId`와 같은 동적 경로를 사용합니다. 하지만 Vue Router는 이보다 훨씬 더 많은 기능을 제공합니다!

:::tip
간단함을 위해, 모든 라우트 레코드는 **`component` 속성을 생략**하고 `path` 값에만 집중합니다.
:::

## 파라미터에 커스텀 정규식 사용 %{#custom-regex-in-params}%

`:userId`와 같은 파라미터를 정의할 때, 내부적으로는 다음과 같은 정규식 `([^/]+)`(슬래시 `/`가 아닌 문자가 하나 이상)으로 URL에서 파라미터를 추출합니다. 이 방식은 대부분 잘 동작하지만, 파라미터의 내용에 따라 두 경로를 구분해야 할 때 문제가 됩니다. 예를 들어 `/:orderId`와 `/:productName` 두 경로가 있다면, 두 경로 모두 동일한 URL과 매칭됩니다. 따라서 이를 구분할 방법이 필요합니다. 가장 쉬운 방법은 경로에 구분되는 정적 섹션을 추가하는 것입니다:

```js
const routes = [
  // /o/3549와 매칭
  { path: '/o/:orderId' },
  // /p/books와 매칭
  { path: '/p/:productName' },
]
```

하지만 어떤 상황에서는 `/o`나 `/p`와 같은 정적 섹션을 추가하고 싶지 않을 수 있습니다. 그러나 `orderId`는 항상 숫자이고, `productName`은 무엇이든 될 수 있으므로, 괄호 안에 파라미터에 대한 커스텀 정규식을 지정할 수 있습니다:

```js
const routes = [
  // /:orderId -> 숫자만 매칭
  { path: '/:orderId(\\d+)' },
  // /:productName -> 그 외 모든 것과 매칭
  { path: '/:productName' },
]
```

이제 `/25`로 이동하면 `/:orderId`와 매칭되고, 그 외의 경로는 `/:productName`과 매칭됩니다. `routes` 배열의 순서는 중요하지 않습니다!

:::tip
자바스크립트 문자열에서 실제로 역슬래시 문자를 전달하려면, `\d`와 같이 **역슬래시(`\`)를 이스케이프**해야 합니다(즉, `\\d`로 작성).
:::

## 반복 가능한 파라미터 %{#repeatable-params}%

`/first/second/third`와 같이 여러 섹션이 있는 경로를 매칭해야 한다면, 파라미터에 `*`(0개 이상) 또는 `+`(1개 이상)를 사용하여 반복 가능하도록 표시할 수 있습니다:

```js
const routes = [
  // /:chapters -> /one, /one/two, /one/two/three 등과 매칭
  { path: '/:chapters+' },
  // /:chapters -> /, /one, /one/two, /one/two/three 등과 매칭
  { path: '/:chapters*' },
]
```

이렇게 하면 파라미터가 문자열이 아닌 배열로 제공되며, 네임드 라우트를 사용할 때도 배열을 전달해야 합니다:

```js
// { path: '/:chapters*', name: 'chapters' }가 주어졌을 때,
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 결과: /
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// 결과: /a/b

// { path: '/:chapters+', name: 'chapters' }가 주어졌을 때,
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// `chapters`가 비어 있으므로 에러 발생
```

이 기능은 커스텀 정규식과도 결합할 수 있으며, **닫는 괄호 뒤에** 반복 기호를 추가하면 됩니다:

```js
const routes = [
  // 숫자만 매칭
  // /1, /1/2 등과 매칭
  { path: '/:chapters(\\d+)+' },
  // /, /1, /1/2 등과 매칭
  { path: '/:chapters(\\d+)*' },
]
```

## 대소문자 구분 및 엄격한 경로 옵션 %{#sensitive-and-strict-route-options}%

기본적으로 모든 경로는 대소문자를 구분하지 않으며, 마지막에 슬래시가 있든 없든 매칭됩니다. 예를 들어, `/users` 경로는 `/users`, `/users/`, 심지어 `/Users/`와도 매칭됩니다. 이러한 동작은 `strict`와 `sensitive` 옵션으로 설정할 수 있으며, 라우터와 라우트 레벨 모두에서 지정할 수 있습니다:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // /users/posva와는 매칭되지만, 다음과는 매칭되지 않음:
    // - /users/posva/ (strict: true 때문)
    // - /Users/posva (sensitive: true 때문)
    { path: '/users/:id', sensitive: true },
    // /users, /Users, /users/42와는 매칭되지만 /users/ 또는 /users/42/와는 매칭되지 않음
    { path: '/users/:id?' },
  ],
  strict: true, // 모든 라우트에 적용
})
```

## 선택적 파라미터 %{#optional-parameters}%

파라미터에 `?`(0개 또는 1개) 수식어를 사용하여 선택적으로 표시할 수도 있습니다:

```js
const routes = [
  // /users와 /users/posva 모두 매칭
  { path: '/users/:userId?' },
  // /users와 /users/42 모두 매칭
  { path: '/users/:userId(\\d+)?' },
]
```

참고로 `*`도 기술적으로는 파라미터를 선택적으로 표시하지만, `?` 파라미터는 반복될 수 없습니다.

경로 세그먼트에 **선택적 파라미터 외에 다른 내용이 포함**되어 있다면, **마지막 슬래시가 없는 경로와는 매칭되지 않습니다**. 예를 들어:

- `/users/:uid?-:name?`는 `/users`와 매칭되지 않고, `/users/-` 또는 `/users/-/`와만 매칭됩니다
- `/users/:uid(\\d+)?:name?`는 `/users`와 매칭되지 않고, `/users/`, `/users/2`, `/users/2/` 등과만 매칭됩니다

매칭 문법을 [플레이그라운드](https://paths.esm.dev/?p=AAMsIPQg4AoKzidgQFoEXAmw-IEBBRYYOE0SkABTASiz1qgBpgQA1QTsFjAb3h2onsmlAmGIFsCXjXh4AIA.&t=/users/2/#)에서 직접 실험해볼 수 있습니다.

## 디버깅 %{#debugging}%

경로가 정규식으로 어떻게 변환되는지 파악하여 왜 특정 경로가 매칭되지 않는지 이해하거나, 버그를 보고하려면 [path ranker tool](https://paths.esm.dev/?p=AAMeJSyAwR4UbFDAFxAcAGAIJXMAAA..#)을 사용할 수 있습니다. 이 도구는 URL을 통해 경로를 공유하는 것도 지원합니다.

## 느린 정규식 피하기 %{#avoiding-slow-regex}%

커스텀 정규식을 사용할 때는 느린 정규식 패턴 사용을 피해야 합니다. 예를 들어, `.*`는 모든 문자를 매칭하며, 반복 수식어 `*` 또는 `+`와 결합되고 그 뒤에 다른 내용이 오면 **심각한 성능 문제**를 일으킬 수 있습니다:

```ts
const routes = [
  // 탐욕적인 `.*` 뒤에 `*`와 정적 문자열이 와서 매우 느린 정규식이 생성됨
  { path: '/:pathMatch(.*)*/something-at-the-end' },
]
```

실제로는 이러한 _모든 것 매칭_ 파라미터는 **URL의 맨 끝에서만** 사용하세요. 경로 중간에 필요하다면, **반복 가능하게 만들지 마세요**:

```ts
const routes = [
  // `.*`가 끝에 있으므로 괜찮음
  { path: '/:pathMatch(.*)/something-at-the-end' },
]
```

이렇게 하면 동일한 경로를 매칭하지만 파라미터 배열 없이 훨씬 빠르게 동작합니다.
