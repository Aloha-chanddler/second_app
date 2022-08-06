<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table 
      :data="rightsList"
      border
      stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
            <el-tag v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        // 定义一个用于接收权限数据列表的空数组
        rightsList:[],
      }
    },
    created(){
      // 当页面创建的时候请求权限列表数据
      this.getRightsList()
    },
    methods:{
      // 定义获取权限列表数据的方法
      async getRightsList(){
        const {data} = await this.$http.get('rights/list')
        if(data.meta.status!==200) return this.$message.error(data.meta.msg)
        this.rightsList = data.data
        console.log(this.rightsList);
      }
    }
  }
</script>

<style lang="less" scope>

</style>