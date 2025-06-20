import { h } from 'vue'
import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AsideSponsors from './components/AsideSponsors.vue'
import './styles/vars.css'
import VueSchoolLink from './components/VueSchoolLink.vue'
import VueMasteryLogoLink from './components/VueMasteryLogoLink.vue'

const theme: Theme = {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-ads-before': () => h(AsideSponsors),
    })
  },

  enhanceApp({ app }) {
    app.component('VueSchoolLink', VueSchoolLink)
    app.component('VueMasteryLogoLink', VueMasteryLogoLink)
  },
}

export default theme
