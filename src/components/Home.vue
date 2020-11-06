<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header
      ><div>
        <img src="../assets/admin.png" alt="" />
        <span>海绵宝宝后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">exit</el-button></el-header
    >
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="asideWidth + 'px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 左边栏 -->
        <el-menu
          :collapse="isColapse"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              @click="saveMavState('/' + subItem.path)"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu></el-aside
      >
      <!-- 右边主体 -->
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isColapse: false,
      asideWidth: 200,
      activePath: ''
    }
  },

  //用生命周期函数发起请求获取左侧菜单栏的数据
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear()
      //跳转登录页面
      this.$router.push('/login')
    },
    //接受后端返回的值并初始化
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      //如果获取数据成功便把数据保存到menulist数组中
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      //console.log(res)
    },
    toggleCollapse() {
      this.isColapse = !this.isColapse
      if (this.isColapse != false) {
        this.asideWidth = 60
      } else {
        this.asideWidth = 200
      }
    },
    saveMavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  //padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.elmain {
  background-color: #eaedf1;
}

//图标间距
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
