# RouterView 슬롯 %{#routerview-slot}%

RouterView 컴포넌트는 슬롯을 노출하여 라우트 컴포넌트를 렌더링하는 데 사용할 수 있습니다:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component" />
</router-view>
```

위 코드는 슬롯 없이 `<router-view />`를 사용하는 것과 동일하지만, 슬롯을 사용하면 다른 기능과 함께 작업할 때 추가적인 유연성을 제공합니다.

## KeepAlive & Transition %{#keepalive-transition}%

[KeepAlive](https://vuejs.org/guide/built-ins/keep-alive.html) 컴포넌트와 함께 작업할 때, 일반적으로 RouterView 자체가 아니라 라우트 컴포넌트를 유지하고 싶을 것입니다. 슬롯 내부에 KeepAlive를 넣으면 이를 달성할 수 있습니다:

```vue-html
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

마찬가지로, 슬롯을 사용하면 [Transition](https://vuejs.org/guide/built-ins/transition.html) 컴포넌트를 사용하여 라우트 컴포넌트 간에 전환 효과를 줄 수 있습니다:

```vue-html
<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>
```

Transition 내부에 KeepAlive를 사용할 수도 있습니다:

```vue-html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

RouterView와 Transition 컴포넌트를 함께 사용하는 방법에 대한 자세한 내용은 [전환(Transitions)](./transitions) 가이드를 참고하세요.

## props와 slots 전달하기 %{#passing-props-and-slots}%

슬롯을 사용하여 라우트 컴포넌트에 props나 slots를 전달할 수 있습니다:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component" some-prop="a value">
    <p>Some slotted content</p>
  </component>
</router-view>
```

실제로는 라우트 컴포넌트들이 **모두 동일한 props와 slots를 사용해야 하므로** 이렇게 하는 경우는 드뭅니다. props를 전달하는 다른 방법에 대해서는 [라우트 컴포넌트에 Props 전달하기](../essentials/passing-props)를 참고하세요.

## 템플릿 ref %{#template-refs}%

슬롯을 사용하면 [템플릿 ref](https://vuejs.org/guide/essentials/template-refs.html)를 라우트 컴포넌트에 직접 지정할 수 있습니다:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</router-view>
```

만약 ref를 `<router-view>`에 지정하면, ref에는 라우트 컴포넌트가 아니라 RouterView 인스턴스가 할당됩니다.