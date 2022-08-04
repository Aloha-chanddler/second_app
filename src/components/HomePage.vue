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
            :default-active="activePath"
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
              <!-- 当点击二级菜单时，把点击对应的路径通过savaNavState函数保存到浏览器本地存储localstorage中 以达到二级菜单高亮保持的效果 -->
              <el-menu-item :index="'/' + subItem.path" 
              v-for="subItem in item.children" 
              :key="subItem.id"
              @click="savaNavState('/' + subItem.path)"
              >
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
        // 侧边栏一级菜单图标显示
        iconObj:{
          '125':'fa fa-user-plus',
          '103':'fa fa-balance-scale',
          '101':'fa fa-shopping-bag',
          '102':'fa fa-pencil-square-o',
          '145':'fa fa-bar-chart'
        },
        // 是否折叠的状态，默认为false
        isCollaps:false,
        // 在data中保存被激活的链接地址，默认为空字符串
        activePath:''
      }
    },
    created(){
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
      // 退出按钮
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 获取左侧导航菜单列表数据
      async getMenuList(){
        const {data} = await this.$http.get('menus')
        if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.menulist = data.data
        // console.log(this.menulist);
      },
      // 点击按钮，切换菜单的折叠与展开
      toggleCollaps(){
        this.isCollaps = !this.isCollaps
      },
      // 保存链接的激活状态
      savaNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        // 每次点击二级菜单时为activePath重新赋值
        this.activePath = activePath
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