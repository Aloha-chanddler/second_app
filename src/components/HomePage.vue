<template>
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="">
          <span> 后台管理系统 </span>
        </div>
        <el-button type="info" @click="logout"> 退出 </el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <!-- 动态绑定侧边栏折叠与打开的宽度 -->
        <el-aside :width="isCollaps? '64px' : '180px'">
          <!-- 菜单栏折叠 -->
          <div class="toggle-button" @click="toggleCollaps">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollaps"
            :collapse-transition="false"
            :router="true"
            >
            <!-- 一级菜单 -->
            <!-- 每个菜单应该有一个唯一的index值，否则菜单项展开的时候所有的菜单都会跟着展开 -->
            <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 通过循环渲染菜单生成同的图标-->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- 菜单的路由链接默认为index所对应的值，应改造为其对应的path属性的值 -->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <!-- 二级菜单图标 -->
                <i class="fa fa-th-list"></i>
                <!-- 二级菜单文本 -->
                <span>{{subItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <!-- 路由重定向到welcomePage页面 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  export default {
    // 通过getMenuList函数获取到的左侧菜单数据立即添加到data里面
    data(){
      return{
        //左侧菜单数据
        menulist:[],
        iconObj:{
          '125':'fa fa-user-plus',
          '103':'fa fa-balance-scale',
          '101':'fa fa-shopping-bag',
          '102':'fa fa-pencil-square-o',
          '145':'fa fa-bar-chart'
        },
        isCollaps:false
      }
    },
    created(){
      this.getMenuList()
    },
    methods:{
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 获取左侧导航菜单列表数据
      async getMenuList(){
        const {data} = await this.$http.get('menus')
        if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.menulist = data.data
        console.log(this.menulist);
      },
      // 点击按钮，切换菜单的折叠与展开
      toggleCollaps(){
        this.isCollaps = !this.isCollaps
      }
    }
  }
</script>

<style lang="less" scoped>

  .home-container{
    height: 100%;
  }

  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 5px;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div{
      display: flex;
      align-items: center;
      > img{
        width: 45px;
        height: 45px;
        background-color: #eaedf1;
        border: 1px solid #373d41;
        border-radius: 50%;
        }
      > span{
        margin-left: 10px;
      }
      }
  }

  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
  }
  }

  .el-main{
    background-color: #eaedf1;
  }

  .fa{
    margin-right: 10px;
  }

  .toggle-button{
    width: 100%;
    line-height: 24px;
    font-size: 12px;
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
</style>