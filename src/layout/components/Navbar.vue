<template>
  <div class="navbar desktop" v-if="device !== 'mobile'">
    <div class="header-menu-container">
      <a
        v-for="item in headerMenuData"
        :key="item.id"
        :class="{ 'menu-item': true, active: item.appId === appId }"
        :href="item.url"
        target="_blank"
        >{{ item.name }}</a
      >
    </div>
    <!-- <div class="header-menu-container" @click="toggleSideBar" v-else>
      <div class="sidebar-menu-icon-mobile"></div>
      <a
        :key="currentMenu.id"
        class="menu-item-mobile"
        :href="currentMenu.url"
        v-if="currentMenu"
        >{{ currentMenu.name }}</a
      >
    </div> -->
    <div class="right-menu">
      <div class="line">|</div>
      <div class="current-env">当前登录环境:{{ env }}</div>
      <div class="line">|</div>
      <el-dropdown
        class="
          avatar-container
          right-menu-item
          hover-effect
        "
        trigger="click"
      >
        <div class="avatar-wrapper">
          <div>欢迎:</div>
          <div>{{ userName }}</div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
  <div v-else class="navbar mobile">
    <div class="sidebar-menu-icon-mobile" @click="toggleSideBar"></div>
    <div :key="currentMenu.id" class="menu-item-mobile" v-if="currentMenu">
      {{ currentMenu.name }}
    </div>
    <el-dropdown class="drop-down-mobile" trigger="click">
      <div class="avatar-wrapper-mobile">{{ userName }}</div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Hamburger from '@/components/Hamburger'
import { appId } from '../../../config'
import { getCookie } from '@/utils/auth'

export default {
  components: {
    // Hamburger
  },
  data() {
    return {
      appId
    }
  },
  computed: {
    ...mapGetters(['device', 'sidebar', 'avatar', 'headerMenuData']),
    userName() {
      let userInfo = getCookie('user_info')
      return JSON.parse(userInfo).username
    },
    currentMenu() {
      let current = null
      for (let index = 0; index < this.headerMenuData.length; index++) {
        const element = this.headerMenuData[index]
        if (element.appId === this.appId) {
          current = element
        }
      }
      return current
    },
    env() {
      let envFlag = getCookie('env_flag')
      let envNum = getCookie('env_num')
      return envFlag + envNum ? envFlag + envNum : ''
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      const params = {
        sso_app_id: appId,
        sessionId: ''
      }
      await this.$store.dispatch('app/loginOut', params)
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 54px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &.desktop {
    display: flex;
    align-items: center;

    .header-menu-container {
      height: 54px;
      line-height: 54px;
      font-size: 14px;
      width: 100%;
      display: flex;
      margin: 0 10px;
      overflow-x: auto;
      overflow-y: hidden;

      .menu-item {
        flex-shrink: 0;
        margin: 0 10px;
        color: #8091a5;

        &.active {
          color: #3582fb;
        }
      }
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 54px;
      display: flex;
      &:focus {
        outline: none;
      }

      .line {
        color: lightgray;
      }

      .current-env {
        color: #303133;
        padding: 0 24px 0 32px;
        font-size: 14px;
        width: 190px;
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 14px;
        color: #303133;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 11px;
        margin-left: 13px;

        &.mobile {
          margin-right: 0;
          margin-left: 0;
        }
        .avatar-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100px;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
  &.mobile {
    padding: 10px;

    .sidebar-menu-icon-mobile {
      background: url(./Sidebar/icons/icon_expend.png) no-repeat;
      height: 25px;
      width: 25px;
      background-size: 100%;
      cursor: pointer;
      position: absolute;
      margin-left: 10px;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .menu-item-mobile {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .drop-down-mobile {
      float: right;
      margin-top: 9px;

      .avatar-wrapper-mobile {
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
