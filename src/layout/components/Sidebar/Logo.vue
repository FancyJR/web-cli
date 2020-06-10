<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="collapse-box hide">
        <span class="collapse-icon" @click="toggleSideBar" />
      </div>
      <div v-else key="expand" class="sidebar-header">
        <span class="sidebar-logo" v-if="logo" />
        <span class="collapse-icon" @click="toggleSideBar" />
      </div>
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" src="./icons/logo.png" class="sidebar-logo">
        <img  src="./icons/collapse.png" class="collapse-box">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
      <div>
        <img v-if="logo" src="./icons/logo.png" class="sidebar-logo">
      </div>
      <div>
        <img  src="./icons/collapse.png" class="collapse-box">
      </div>
      </router-link>-->
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  background: #304156;
  overflow: hidden;

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 53px;
    padding: 0 16px;

    .collapse-icon {
      background: url(./icons/collapse.png) no-repeat;
      height: 16px;
      width: 16px;
      background-size: 100%;
    }
    .sidebar-logo {
      width: 42.5%;
      height: 17px;
      background: url(./icons/logo.png) no-repeat;
      background-size: 100%;
    }
  }
  .collapse-box {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &.hide {
      .collapse-icon {
        transform: rotate(90deg);
        margin-top: 19px;
        height: 16px;
        width: 16px;
        background: url(./icons/collapse.png) no-repeat;
        background-size: 100%;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
