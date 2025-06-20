# RouterLink 확장하기 %{#extending-routerlink}%

<VueSchoolLink
  href="https://vueschool.io/lessons/extending-router-link-for-external-urls"
  title="router-link 확장하는 방법 배우기"
/>

RouterLink 컴포넌트는 대부분의 기본 애플리케이션에 충분한 `props`를 제공하지만, 모든 가능한 사용 사례를 다루려고 하지는 않으므로 고급 케이스에서는 `v-slot`을 사용하게 될 것입니다. 대부분의 중대형 애플리케이션에서는 하나 이상의 커스텀 RouterLink 컴포넌트를 만들어 애플리케이션 전반에서 재사용하는 것이 좋습니다. 예를 들어 내비게이션 메뉴의 링크, 외부 링크 처리, `inactive-class` 추가 등이 있습니다.

이제 RouterLink를 확장하여 외부 링크도 처리하고, `AppLink.vue` 파일에서 커스텀 `inactive-class`를 추가해보겠습니다:

::: code-group

```vue [Composition API]
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  // TypeScript를 사용하는 경우 @ts-ignore를 추가하세요
  ...RouterLink.props,
  inactiveClass: String,
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>
```

```vue [Options API]
<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'AppLink',
  inheritAttrs: false,

  props: {
    // TypeScript를 사용하는 경우 @ts-ignore를 추가하세요
    ...RouterLink.props,
    inactiveClass: String,
  },

  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http')
    },
  },
}
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>
```

:::

렌더 함수나 `computed` 속성을 사용하고 싶다면, [Composition API](./composition-api.md)의 `useLink`를 사용할 수 있습니다:

```js
import { RouterLink, useLink } from 'vue-router'

export default {
  name: 'AppLink',

  props: {
    // TypeScript를 사용하는 경우 @ts-ignore를 추가하세요
    ...RouterLink.props,
    inactiveClass: String,
  },

  setup(props) {
    // `props`에는 `to`와 <router-link>에 전달할 수 있는 모든 prop이 포함됩니다
    const { navigate, href, route, isActive, isExactActive } = useLink(props)

    // 이득!

    return { isExternalLink }
  },
}
```

실제로는, 애플리케이션의 다양한 부분에서 `AppLink` 컴포넌트를 사용하고 싶을 수 있습니다. 예를 들어 [Tailwind CSS](https://tailwindcss.com)를 사용할 때, 모든 클래스를 포함한 `NavLink.vue` 컴포넌트를 만들 수 있습니다:

```vue
<template>
  <AppLink
    v-bind="$attrs"
    class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
    active-class="border-indigo-500 text-gray-900 focus:border-indigo-700"
    inactive-class="text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
  >
    <slot />
  </AppLink>
</template>
```