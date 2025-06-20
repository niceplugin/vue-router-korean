# 데이터 가져오기 %{#data-fetching}%

경로가 활성화될 때 서버에서 데이터를 가져와야 할 때가 있습니다. 예를 들어, 사용자 프로필을 렌더링하기 전에 서버에서 사용자의 데이터를 가져와야 합니다. 우리는 이를 두 가지 방법으로 달성할 수 있습니다:

- **이동 후 데이터 가져오기**: 먼저 이동을 수행하고, 들어오는 컴포넌트의 라이프사이클 훅에서 데이터를 가져옵니다. 데이터를 가져오는 동안 로딩 상태를 표시합니다.

- **이동 전 데이터 가져오기**: 경로 진입 가드에서 이동 전에 데이터를 가져오고, 데이터가 모두 준비된 후에 이동을 수행합니다.

기술적으로 두 방법 모두 유효한 선택이며, 궁극적으로는 여러분이 목표로 하는 사용자 경험에 달려 있습니다.

## 이동 후 데이터 가져오기 %{#fetching-after-navigation}%

이 방법을 사용할 때는, 즉시 이동하여 들어오는 컴포넌트를 렌더링하고, 컴포넌트 내에서 데이터를 가져옵니다. 네트워크를 통해 데이터를 가져오는 동안 로딩 상태를 표시할 수 있고, 각 뷰마다 로딩을 다르게 처리할 수도 있습니다.

`route.params.id`를 기반으로 게시글 데이터를 가져와야 하는 `Post` 컴포넌트가 있다고 가정해봅시다:

::: code-group

```vue [Composition API]
<template>
  <div class="post">
    <div v-if="loading" class="loading">로딩 중...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from './api.js'

const route = useRoute()

const loading = ref(false)
const post = ref(null)
const error = ref(null)

// 경로의 params를 감시하여 데이터를 다시 가져옵니다
watch(() => route.params.id, fetchData, { immediate: true })

async function fetchData(id) {
  error.value = post.value = null
  loading.value = true
  
  try {
    // `getPost`를 데이터 가져오기 유틸/ API 래퍼로 교체하세요
    post.value = await getPost(id)  
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>
```

```vue [Options API]
<template>
  <div class="post">
    <div v-if="loading" class="loading">로딩 중...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
import { getPost } from './api.js'

export default {
  data() {
    return {
      loading: false,
      post: null,
      error: null,
    }
  },
  created() {
    // 경로의 params를 감시하여 데이터를 다시 가져옵니다
    this.$watch(
      () => this.$route.params.id,
      this.fetchData,
      // 뷰가 생성될 때 데이터를 가져오고 데이터가
      // 이미 관찰되고 있습니다
      { immediate: true }
    )
  },
  methods: {
    async fetchData(id) {
      this.error = this.post = null
      this.loading = true

      try {
        // `getPost`를 데이터 가져오기 유틸/ API 래퍼로 교체하세요
        this.post = await getPost(id)
      } catch (err) {
        this.error = err.toString()
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
```

:::

## 이동 전 데이터 가져오기 %{#fetching-before-navigation}%

이 방법을 사용하면 실제로 새로운 경로로 이동하기 전에 데이터를 가져옵니다. 들어오는 컴포넌트의 `beforeRouteEnter` 가드에서 데이터 가져오기를 수행하고, 가져오기가 완료된 후에만 `next`를 호출할 수 있습니다. `next`에 전달된 콜백은 **컴포넌트가 마운트된 후에** 호출됩니다:

```js
export default {
  data() {
    return {
      post: null,
      error: null,
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const post = await getPost(to.params.id)
      // `setPost`는 아래에 정의된 메서드입니다
      next(vm => vm.setPost(post))
    } catch (err) {
      // `setError`는 아래에 정의된 메서드입니다
      next(vm => vm.setError(err))
    }
  },
  // 경로가 변경되고 이 컴포넌트가 이미 렌더링된 경우,
  // 로직이 약간 다릅니다.
  beforeRouteUpdate(to, from) {
    this.post = null
    getPost(to.params.id).then(this.setPost).catch(this.setError)
  },
  methods: {
    setPost(post) {
      this.post = post
    },
    setError(err) {
      this.error = err.toString()
    }
  }
}
```

사용자는 들어오는 뷰의 리소스를 가져오는 동안 이전 뷰에 머무르게 됩니다. 따라서 데이터를 가져오는 동안 진행 표시줄이나 어떤 형태의 인디케이터를 표시하는 것이 권장됩니다. 데이터 가져오기에 실패한 경우, 전역 경고 메시지와 같은 무언가를 표시하는 것도 필요합니다.

<!-- ### Composition API 사용하기 -->

<!-- TODO: -->