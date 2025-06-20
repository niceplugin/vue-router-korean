# 라우트 지연 로딩 %{#lazy-loading-routes}%

<VueSchoolLink
  href="https://vueschool.io/lessons/lazy-loading-routes-vue-cli-only"
  title="라우트 지연 로딩에 대해 배우기"
/>

번들러로 앱을 빌드할 때, 자바스크립트 번들이 꽤 커질 수 있으며, 이는 페이지 로드 시간에 영향을 줄 수 있습니다. 각 라우트의 컴포넌트를 별도의 청크로 분할하고, 해당 라우트가 방문될 때만 로드한다면 더 효율적일 것입니다.

Vue Router는 [동적 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)를 기본적으로 지원하므로, 정적 import를 동적 import로 대체할 수 있습니다:

```js
// 다음을 대체
// import UserDetails from './views/UserDetails'
// 아래와 같이 사용
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails }
    // 또는 라우트 정의에서 직접 사용
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```

`component`(및 `components`) 옵션은 컴포넌트의 Promise를 반환하는 함수를 받을 수 있으며, Vue Router는 **해당 페이지에 처음 진입할 때만 이를 가져오고**, 이후에는 캐시된 버전을 사용합니다. 즉, Promise를 반환하는 한 더 복잡한 함수도 사용할 수 있습니다:

```js
const UserDetails = () =>
  Promise.resolve({
    /* 컴포넌트 정의 */
  })
```

일반적으로, **모든 라우트에 동적 import를 사용하는 것이 좋습니다**.

::: tip 참고
라우트에는 [비동기 컴포넌트](https://vuejs.org/guide/components/async.html)를 **사용하지 마세요**. 비동기 컴포넌트는 라우트 컴포넌트 내부에서는 사용할 수 있지만, 라우트 컴포넌트 자체는 동적 import만 사용해야 합니다.
:::

webpack과 같은 번들러를 사용할 때, 자동으로 [코드 분할](https://webpack.js.org/guides/code-splitting/)의 이점을 누릴 수 있습니다.

Babel을 사용할 경우, Babel이 해당 문법을 올바르게 파싱할 수 있도록 [syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) 플러그인을 추가해야 합니다.

## 동일 청크로 컴포넌트 그룹화 %{#grouping-components-in-the-same-chunk}%

### webpack에서 %{#with-webpack}%

때때로 동일한 라우트 아래에 중첩된 모든 컴포넌트를 동일한 비동기 청크로 그룹화하고 싶을 수 있습니다. 이를 위해서는 [이름이 지정된 청크](https://webpack.js.org/guides/code-splitting/#dynamic-imports)를 사용해야 하며, 특별한 주석 문법을 통해 청크 이름을 지정할 수 있습니다(webpack > 2.4 필요):

```js
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```

webpack은 동일한 청크 이름을 가진 모든 비동기 모듈을 동일한 비동기 청크로 그룹화합니다.

### Vite에서 %{#with-vite}%

Vite에서는 [`rollupOptions`](https://vite.dev/config/build-options.html#build-rollupoptions) 아래에서 청크를 정의할 수 있습니다:

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
  },
})
```
