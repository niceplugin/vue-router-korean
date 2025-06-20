# Vue Router와 Composition API %{#vue-router-and-the-composition-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/router-and-the-composition-api"
  title="Composition API와 함께 Vue Router를 사용하는 방법 배우기"
/>

Vue의 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)의 도입으로 새로운 가능성이 열렸지만, Vue Router의 모든 잠재력을 활용하려면 `this`에 대한 접근과 컴포넌트 내 네비게이션 가드를 대체할 몇 가지 새로운 함수를 사용해야 합니다.

## `setup` 내부에서 Router와 현재 Route에 접근하기 %{#accessing-the-router-and-current-route-inside-setup}%

`setup` 내부에서는 `this`에 접근할 수 없기 때문에, `this.$router`나 `this.$route`에 직접 접근할 수 없습니다. 대신, `useRouter`와 `useRoute` 컴포저블을 사용합니다:

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function pushWithQuery(query) {
  router.push({
    name: 'search',
    query: {
      ...route.query,
      ...query,
    },
  })
}
</script>
```

`route` 객체는 반응형 객체입니다. 대부분의 경우, **전체 `route` 객체를 감시하는 것은 피해야 합니다.** 대신, 변경될 것으로 예상되는 속성만 직접 감시할 수 있습니다:

```vue
<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const userData = ref()

// params가 변경될 때 사용자 정보를 가져옵니다
watch(
  () => route.params.id,
  async newId => {
    userData.value = await fetchUser(newId)
  }
)
</script>
```

템플릿에서는 여전히 `$router`와 `$route`에 접근할 수 있으므로, 해당 객체들이 템플릿에서만 필요하다면 `useRouter`나 `useRoute`를 사용할 필요가 없습니다.

## 네비게이션 가드 %{#navigation-guards}%

Vue Router는 Composition API 함수로 업데이트 및 이탈 가드를 제공합니다:

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

// beforeRouteLeave 옵션과 동일하지만 `this`에 접근할 수 없습니다
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm(
    '정말로 이 페이지를 떠나시겠습니까? 저장되지 않은 변경사항이 있습니다!'
  )
  // 네비게이션을 취소하고 같은 페이지에 머무릅니다
  if (!answer) return false
})

const userData = ref()

// beforeRouteUpdate 옵션과 동일하지만 `this`에 접근할 수 없습니다
onBeforeRouteUpdate(async (to, from) => {
  // id가 변경된 경우에만 사용자를 가져옵니다. 쿼리나 해시만 변경되었을 수도 있기 때문입니다
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})
</script>
```

Composition API 가드는 `<router-view>`에 의해 렌더링되는 모든 컴포넌트에서 사용할 수 있으며, 컴포넌트 내 가드처럼 반드시 라우트 컴포넌트에서 직접 사용할 필요는 없습니다.

## `useLink` %{#uselink}%

Vue Router는 RouterLink의 내부 동작을 컴포저블로 제공합니다. 이는 `RouterLink`의 props와 같은 반응형 객체를 받아, 나만의 `RouterLink` 컴포넌트를 만들거나 커스텀 링크를 생성할 수 있는 저수준 속성들을 노출합니다:

```vue
<script setup>
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  // TypeScript를 사용할 경우 @ts-ignore를 추가하세요
  ...RouterLink.props,
  inactiveClass: String,
})

const {
  // 해석된 라우트 객체
  route,
  // 링크에서 사용할 href
  href,
  // 링크가 활성 상태인지 나타내는 boolean ref
  isActive,
  // 링크가 정확히 활성 상태인지 나타내는 boolean ref
  isExactActive,
  // 링크로 네비게이션하는 함수
  navigate
} = useLink(props)

const isExternalLink = computed(
  () => typeof props.to === 'string' && props.to.startsWith('http')
)
</script>
```

RouterLink의 `v-slot`은 `useLink` 컴포저블과 동일한 속성에 접근할 수 있다는 점에 유의하세요.