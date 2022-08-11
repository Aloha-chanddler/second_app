<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input 
          placeholder="请输入内容" 
          v-model="queryInfo.query"
          clearable
          @clear="getGoodsList"
          >
            <el-button 
            slot="append" 
            icon="el-icon-search" 
            @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="upd_time" width="110px">
          <template slot-scope="scope">
            {{scope.row.upd_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button 
            type="danger" 
            icon="el-icon-delete" 
            size="mini"
            @click="removeById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
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
        // 查询参数对象
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        // 商品列表
        goodslist:[],
        // 总数据条数
        total:0
      }
    },
    created(){
      this.getGoodsList()
    },
    methods:{
      // 根据分页获取对应的商品列表函数
      async getGoodsList(){
        const {data} = await this.$http.get(`goods`,{params:this.queryInfo})
        if(data.meta.status!==200) {
          return this.$message.error('获取商品列表失败！')
        }else{
          this.$message.success('获取商品列表成功！')
          this.goodslist = data.data.goods
          this.total = data.data.total
          console.log(data.data);
        }
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      // 根据id删除商品
      async removeById(id){
        const confirmResult = await this.$confirm('是否永久删除该商品？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch( err => err)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除该商品！')
        }else{
          const {data} = await this.$http.delete(`goods/${id}`)
          console.log(data.meta.status);
          if(data.meta.status !== 200){
             return this.$message.error('删除失败！')
          }else{
            this.$message.success(data.meta.msg)
            this.getGoodsList()
          }
        }
      },
      // 添加商品路由跳转
      goAddPage(){
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style>

</style>