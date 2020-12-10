<template>
    <el-container class="home-container">
        <el-header>
            <div class="home-div">
                <img src="../assets/OIP.jpg" alt="">
                <span>电商管理系统</span>
            </div>
            <el-button @click="logout">退出登录</el-button>
        </el-header>
        <!-- 侧边栏 -->
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="togglebtn"><i class="el-icon-s-fold"></i></div>
                <el-menu active-text-color="#409bff" :collapse="isCollapse" :collapse-transition='false'
                    text-color="#fff" background-color="#373d41" default-active="1" class="el-menu-vertical-demo"
                    unique-opened router>
                    <el-submenu v-for="data in menuList" :index="data.id+''" :key="data.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span class="home-menu">{{data.authName}}</span>
                        </template>
                        <el-menu-item class="home-submenu" v-for="item in data.children" :index="'/'+item.path"
                            :key="item.id">
                            <i class="el-icon-menu"></i>
                            <span class="home-menu-item">{{item.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>
            <!-- 内容区 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.getmenu()
  },
  data () {
    return {
      isCollapse: false,
      menuList: []
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getmenu () {
      axios.get('/api/private/v1/menus').then(res => {
        if (res.data.meta.status !== 200) return
        this.menuList = res.data.data
      })
    },
    togglebtn () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss">
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: aliceblue;
        font-size: 20px;

    }

    .home-div {
        display: flex;
        align-items: center;
    }

    img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
    }

    .el-aside {
        background-color: #373d41;

    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.2rem;
    }

    .el-main {
        background-color: #bfa;
    }
</style>
