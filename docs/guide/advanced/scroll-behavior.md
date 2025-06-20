# 스크롤 동작 %{#scroll-behavior}%

<VueSchoolLink
  href="https://vueschool.io/lessons/scroll-behavior"
  title="스크롤 동작을 커스터마이즈하는 방법 배우기"
/>

클라이언트 사이드 라우팅을 사용할 때, 새로운 라우트로 이동할 때마다 맨 위로 스크롤하거나, 실제 페이지 리로드처럼 히스토리 항목의 스크롤 위치를 보존하고 싶을 수 있습니다. Vue Router는 이러한 기능을 제공할 뿐만 아니라, 라우트 네비게이션 시 스크롤 동작을 완전히 커스터마이즈할 수 있도록 해줍니다.

**참고: 이 기능은 브라우저가 `history.pushState`를 지원할 때만 동작합니다.**

라우터 인스턴스를 생성할 때, `scrollBehavior` 함수를 제공할 수 있습니다:

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // 원하는 위치를 반환
  }
})
```

`scrollBehavior` 함수는 [네비게이션 가드](./navigation-guards.md)와 같이 `to`와 `from` 라우트 객체를 받습니다. 세 번째 인자인 `savedPosition`은 `popstate` 네비게이션(브라우저의 뒤로/앞으로 버튼으로 트리거된 경우)에서만 사용할 수 있습니다.

이 함수는 [`ScrollToOptions`](https://developer.mozilla.org/ko/docs/Web/API/ScrollToOptions) 위치 객체를 반환할 수 있습니다:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 항상 맨 위로 스크롤
    return { top: 0 }
  },
})
```

또한 `el`을 통해 CSS 선택자나 DOM 요소를 전달할 수도 있습니다. 이 경우, `top`과 `left`는 해당 요소에 대한 상대 오프셋으로 처리됩니다.

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 항상 #main 요소 위에서 10px 위로 스크롤
    return {
      // 다음과 같이 쓸 수도 있음
      // el: document.getElementById('main'),
      el: '#main',
      // 요소 위에서 10px
      top: 10,
    }
  },
})
```

Falsy 값이나 빈 객체를 반환하면 스크롤이 발생하지 않습니다.

`savedPosition`을 반환하면 뒤로/앞으로 버튼으로 네비게이션할 때 네이티브와 유사한 동작을 하게 됩니다:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```

"앵커로 스크롤" 동작을 시뮬레이션하고 싶다면:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
      }
    }
  },
})
```

브라우저가 [scroll behavior](https://developer.mozilla.org/ko/docs/Web/API/ScrollToOptions/behavior)를 지원한다면, 부드럽게 스크롤할 수도 있습니다:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
  },
})
```

## 스크롤 지연시키기 %{#delaying-the-scroll}%

때로는 페이지에서 스크롤하기 전에 잠시 기다려야 할 때가 있습니다. 예를 들어, 트랜지션을 다룰 때 트랜지션이 끝난 후에 스크롤하고 싶을 수 있습니다. 이를 위해 원하는 위치 설명자를 반환하는 Promise를 반환할 수 있습니다. 다음은 스크롤하기 전에 500ms를 기다리는 예시입니다:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },
})
```

페이지 레벨 트랜지션 컴포넌트의 이벤트와 연결하여 스크롤 동작이 페이지 트랜지션과 잘 어울리도록 할 수도 있지만, 사용 사례의 다양성과 복잡성 때문에, 우리는 특정 사용자 구현을 가능하게 하는 이 프리미티브만 제공합니다.

## 고급 오프셋 %{#advanced-offsets}%

페이지에 고정된 네비게이션 바나 유사한 요소가 있다면, 대상 요소가 다른 콘텐츠에 가려지지 않도록 오프셋이 필요할 수 있습니다.
정적인 오프셋 값을 사용하는 것은 항상 잘 동작하지 않을 수 있습니다. `scroll-margin`이나 `scroll-padding`으로 오프셋을 추가하거나, `::before` 및 `::after` 가상 요소를 사용하는 등 CSS 기반 솔루션을 시도할 수 있습니다. 하지만 이러한 접근 방식은 예기치 않은 동작을 유발할 수 있습니다.

이런 경우에는 오프셋을 수동으로 계산하는 것이 더 좋습니다. 이를 간단하게 구현하는 방법은 CSS와 JavaScript의 `getComputedStyle()`을 결합하는 것입니다. 이렇게 하면 각 요소가 자신의 오프셋을 동적으로 정의할 수 있습니다. 예시는 다음과 같습니다:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    const mainElement = document.querySelector('#main')
    if (mainElement) {
      const marginTop = parseFloat(
        getComputedStyle(mainElement).scrollMarginTop
      )
      return {
        el: mainElement,
        top: marginTop,
      }
    } else {
      return { top: 0 }
    }
  },
})
```