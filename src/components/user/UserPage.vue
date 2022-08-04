<template>
  <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框与添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input 
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
          >
            <el-button 
            slot="append" 
            icon="fa fa-search"
            @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
        >
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 姓名列 -->
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <!-- 邮箱列 -->
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <!-- 电话列 -->
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <!-- 角色列 -->
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <!-- 状态列 -->
        <el-table-column
          label="状态">
          <!-- 通过作用域插槽获取每一行数据 （数据存放在scope.row上面） -->
          <template scope="scope">
            <!-- 开关按钮，用v-model绑定每一行的数据的mg_state的值（布尔值） -->
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="180px"
          >
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" icon="fa fa-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" icon="fa fa-trash"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip 
              effect="dark" 
              content="分配角色" 
              placement="top"
              :enterable="false"
              >
              <el-button type="warning" size="mini" icon="fa fa-vcard"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        // 获取用户列表的参数对象
        queryInfo:{
          query:'',
          // 当前的页数
          pagenum:1,
          // 当前每页显示数量
          pagesize:2
        },
        userList:[],
        total:0
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
      // 获取用户数据列表
      async getUserList(){
        const {data} = await this.$http.get('/users',{params:this.queryInfo})
        // console.log(data);
        if(data.meta.status !== 200) return this.$message.error(data.meta.smg)
        this.userList = data.data.users
        this.total = data.data.total
        console.log(this.userList);
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize){
        // console.log(newSize);
        // 把当前最新的pagesize赋值给data中的queryInfo里的pagesize
        this.queryInfo.pagesize = newSize
        // 根据全新的pagesize重新发起数据请求获取本页的数据
        this.getUserList()
      },
      // 监听 页码数 改变的事件
      handleCurrentChange(newPage){
        // console.log(newPage);
        // 把当前最新的pagenum赋值给data中的queryInfo里的pagenum
        this.queryInfo.pagenum = newPage
        // 根据最新的pagenum重新发起数据请求获取本页数据
        this.getUserList()
      },
      // 监听 switch 开关状态的改变
      async userStateChanged(userInfo){
        // console.log(userInfo);
        // 向服务器发起修改用户状态的请求
        const {data} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if(data.meta.status !== 200){
          // 如果请求失败了，数据库中的状态没来得及改变，但是页面的状态已经变了，所以需要把页面的状态重置回来
          userInfo.mg_state = !userInfo.mg_state
          // 停止后续逻辑并提示信息
          return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg)
      }
    }
  }
</script>

<style lang="less" scoped>
</style>