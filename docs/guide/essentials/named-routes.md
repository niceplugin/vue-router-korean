# 명명된 라우트 %{#named-routes}%

<VueSchoolLink
  href="https://vueschool.io/lessons/named-routes"
  title="명명된 라우트에 대해 배우기"
/>

라우트를 생성할 때, 선택적으로 해당 라우트에 `name`을 지정할 수 있습니다:

```js
const routes = [
  {
    path: '/user/:username',
    name: 'profile', // [!code highlight] // [!코드 하이라이트]
    component: User
  }
]
```

그런 다음 `<router-link>`의 `to` prop에 `path` 대신 `name`을 사용할 수 있습니다:

```vue-html
<router-link :to="{ name: 'profile', params: { username: 'erina' } }">
  User profile
</router-link>
```

위의 예시는 `/user/erina`로 이동하는 링크를 생성합니다.

- [Playground에서 확인하기](https://play.vuejs.org/#eNqtVVtP2zAU/itWNqlFauNNIB6iUMEQEps0NjH2tOzBtKY1JLZlO6VTlP++4+PcelnFwyRofe7fubaKCiZk/GyjJBKFVsaRiswNZ45faU1q8mRUQUbrko8yuaPwlRfK/LkV1sHXpGHeq9JxMzScGmT19t5xkMaUaR1vOb9VBe+kntgWXz2Cs06O1LbCTwvRW7knGnEm50paRwIYcrEFd1xlkpBVyCQ5lN74ZOJV0Nom5JcnCFRCM7dKyIiOJkSygsNzBZiBmivAI7l0SUipRvuhCfPge7uWHBiGZPctS0iLJv7T2/YutFFPIt+JjgUJPn7DZ32CtWg7PIZ/4BASg7txKE6gC1VKNx69gw6NTqJJ1HQK5iR1vNA52M+8Yrr6OLuD+AuCtbQpBQYK9Oy6NAZAhLI1KKuKvEc69jSp65Tqw/oh3V7f00P9MsdveOWiecE75DDNhXwhiVMXWVRttYbUWdRpE2xOZ0sHxq1v2jl/a5jQyZ042Mv/HKjvt2aGFTCXFWmnAsTcCMkAxw4SHIjG9E2AUtpUusWyFvyVUGCltBsFmJB2W/dHZCHWswdYLwJ/XiulnrNr323zcQeodthDuAHTgmm4aEqCH1zsrBHYLIISheyyqD9Nnp1FK+e0TSgtpX5ZxrBBtNe4PItP4w8Q07oBN+a2mD4a9erPzDN4bzY1iy5BiS742imV2ynT4l8h9hQvz+Pz+COU/pGCdyrkgm/Qt3ddw/5Cms7CLXsSy50k/dJDT8037QTcuq1kWZ6r1y/Ic6bkHdD5is9fDvCf7SZA/m44ZLfmg+QcM0vugvjmxx3fwLsTFmpRwlwdE95zq/LSYwxqn0q5ANgDPUT7GXsm5PLB3mwcl7ZNygPFaqA+NvL6SOo93NP4bFDF9sfh+LThtgxvkF80fyxxy/Ac7U9i/RcYNWrd).

`name`을 사용하는 것에는 다양한 장점이 있습니다:

- 하드코딩된 URL이 필요 없습니다.
- `params`가 자동으로 인코딩됩니다.
- URL 오타를 방지할 수 있습니다.
- 경로 랭킹을 우회할 수 있습니다. 예를 들어, 동일한 경로에 매칭되는 낮은 우선순위의 라우트를 표시할 때 유용합니다.

각 이름은 **모든 라우트에서 고유해야 합니다**. 동일한 이름을 여러 라우트에 추가하면, 라우터는 마지막에 추가된 것만 유지합니다. 이에 대해서는 [동적 라우팅](../advanced/dynamic-routing#Removing-routes) 섹션에서 더 자세히 읽을 수 있습니다.

Vue Router의 다양한 다른 부분에서도 location을 전달할 수 있습니다. 예를 들어, `router.push()`와 `router.replace()` 메서드가 있습니다. 이러한 메서드에 대해서는 [프로그래밍 방식 내비게이션](./navigation) 가이드에서 더 자세히 다룹니다. `to` prop과 마찬가지로, 이 메서드들 또한 `name`으로 location을 전달하는 것을 지원합니다:

```js
router.push({ name: 'profile', params: { username: 'erina' } })
```