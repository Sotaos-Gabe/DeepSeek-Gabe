<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      if (this.$store.state.user.roles.includes('senior')) {
        console.log("====================senior===========================")
        return this.$router.options.routes
      }

      if (this.$store.state.user.roles.includes('intermediate')) {
        console.log("====================intermediate===========================")
        return this.$router.options.routes.filter(route => !route.meta || !route.meta.roles || !route.meta.roles.includes('senior'))
      }
      console.log("====================junior===========================")
      console.log(this.$router.options.routes)
      return this.$router.options.routes.filter(route => !route.meta || !route.meta.roles || (!route.meta.roles.includes('intermediate') && !route.meta.roles.includes('senior')))
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
