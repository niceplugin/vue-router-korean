<template>
  <div class="vueschool">
    <a
      :href="`${href}?friend=vuerouter`"
      target="_blank"
      rel="sponsored noopener"
      :title="title"
      class="no-icon"
    >
      <slot>{{ translations[site.lang] }}</slot>
    </a>
  </div>
</template>
<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
const translations = {
  'ko-KR': 'Watch a free video lesson on Vue School',
}
defineProps<{ href: string; title: string }>()
</script>
<style scoped>
.vueschool {
  margin-top: 20px;
  background-color: var(--vp-c-bg-alt);
  padding: 1em 1.25em;
  border-radius: 2px;
  position: relative;
  display: flex;
}
.vueschool a {
  position: relative;
  padding-left: 36px;
}
.vueschool a:before {
  content: '';
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  top: calc(50% - 15px);
  left: -4px;
  border-radius: 50%;
  background-color: #73abfe;
}
.vueschool a:after {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  top: calc(50% - 5px);
  left: 8px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #fff;
}
</style>
