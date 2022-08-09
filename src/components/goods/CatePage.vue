<template>
  <div> 
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table 
      class="TreeTable"
      :data="catelist" 
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      >
      <!-- 在表格内部定义一个名为isOk的插槽，将来会被“是否有效”这一列所引用 -->
      <!-- 再通过作用域插槽的方式接收这一行的数据 -->
      <template slot="isOk" slot-scope="scope">
        <i 
        class="fa fa-check" 
        v-if="scope.row.cat_deleted === false"
        style="color:lightgreen"
        ></i>

        <i 
        class="fa fa-close" 
        v-else
        style="color:red"
        ></i>
      </template>
      <!-- 排序模板列 -->
      <template slot="sort" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
        <el-tag v-else type="warning">三级</el-tag>
      </template>
      <!-- 操作列 -->
      <template slot="handle" slot-scope="scope">
        <el-button 
        v-model="cateInfo.cat_name"
        type="primary" 
        size="small"
        @click="showEditCateDialog(scope.row.cat_id)"
        >编辑</el-button>
        <el-button 
        v-model="scope.row" 
        type="danger" 
        size="small"
        @click="removeCate(scope.row.cat_id)"
        >删除</el-button>
      </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <span>
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options用来指定数据源 -->
            <!-- props用来指定配置对象 -->
            <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            placeholder="请选择分类"
            clearable
            style="height:20px"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed">
      <span>
        <el-form :model="cateInfo" :rules="addCateRules" ref="editCateRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="cateInfo.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    return{
      // 查询商品分类的条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类的数据列表，默认为空
      catelist:[],
      // 查询到的商品分类总数据条数
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name',
          
        },
        {
          label:'是否有效',
          prop:'cat_deleted',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前列使用的模板名称isOk
          template:'isOk'
        },
        {
          label:'排序',
          prop:'cat_level',
          type:'template',
          template:'sort'
        },
        {
          label:'操作',
          prop:'',
          type:'template',
          template:'handle'
        }
      ],
      // 添加分类对话框的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加的分类名称
        cat_name:'',
        // 父级分类的id
        cat_pid:0,
        // 分类等级，默认要添加的是一级分类
        cat_level:0
      },
      // 添加分类的校验规则对象
      addCateRules:{
        cat_name:[
          {required:true,message:'请输入分类名称',trigger:'blur'},
          {min:3,max:10,message:'分类名称在3-10个字符之间',trigger:'blur'}
        ]
      },
      // 获取到的父级分类数据列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{ 
        expandTrigger:'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:'true'
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
      // 编辑分类对话框的显示与隐藏
      editCateDialogVisible:false,
      // 当前行的分类信息对象
      cateInfo:{
      }
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取商品分类数据
    async getCateList(){
      const {data} = await this.$http.get('/categories',{params: this.queryInfo})
      // console.log(data);
      if(data.meta.status !==200){
        return this.$message.error('获取商品分类失败')
      }
      // 把获取到的数据保存到data中的cateList数组中
      this.catelist = data.data.result
      this.total = data.data.total
      // console.log(this.total);
      // console.log(this.catelist);
    },
    // 监听pagesize改变
    handleSizeChange(newSize){
      // 当pagesize改变时 把data中qeryInfo里的pagesize重新赋值
      this.queryInfo.pagesize = newSize
      // 重新获取商品分类数据
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog(){
      // 先获取父级分类，再展示对话框
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    // 获取父级分类的数据列表方法
    async getParentCateList(){
      const {data} = await this.$http.get('categories',{params:{type:2}})
      if(data.meta.status !==200) return this.$message.error('获取分类失败')
      // 把获取到的分类数据保存到data中的parentCateList列表上
      this.parentCateList = data.data
      console.log(this.parentCateList);
    },
    // 当选择项发生变化触发此函数
    parentCateChanged(){
      // 更新data中添加分类的表单数据对象中的cat_pid和cat_level的值
      // 先判断是否选择了父级分类，判断data中selectedKeys数组的长度是否为0即可
      if(this.selectedKeys.length >0) {
        // 如果selectedKeys的长度大于0，则说明选择了父级分类
        // 永远把selectedKeys数组最后一个值作为父级分类的id
        // 再把选中的id赋值给data中的addCateForm对象中的 cat_pid即可
        this.addCateForm.cat_pid =  this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate(){
      // console.log(this.addCateForm);
      // 表单预验证
      this.$refs.addCateRef.validate(async valid =>{
        if(!valid) return
        const {data} = await this.$http.post('categories',this.addCateForm)
        if(data.meta.status!== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
      
    },
    // 监听添加分类对话框的关闭事件，重置表单数据
    addCateDialogClosed(){
      // 获取表单引用并重置
      this.$refs.addCateRef.resetFields()
      // 重置级联选择器所绑定的id数组并重置为空数组
      this.selectedKeys = []
      // 把data中addCateForm里的cat_pid和cat_level重置为0
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击编辑按钮显示对话框
    async showEditCateDialog(id){
      // 通过id查询分类
      const {data} = await this.$http.get('categories/' + id)
      if(data.meta.status !==200) return this.$message.error('查询分类失败')
      this.cateInfo = data.data
      console.log(this.cateInfo);
      this.editCateDialogVisible = true
    },
    // 点击确定按钮表单预验证并修改分类
    editCate(){
      this.$refs.editCateRef.validate(async valid=>{
        if(!valid) return
        const {data} = await this.$http.put(`categories/${this.cateInfo.cat_id}`,{cat_name:this.cateInfo.cat_name})
        if(data.meta.status !==200) return this.$message.error('分类修改失败')
        this.$message.success('修改分类成功！！')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 监听编辑分类对话框的关闭事件
    editCateDialogClosed(){
      this.$refs.editCateRef.resetFields()
    },
    // 删除分类
    async removeCate(id){
      console.log(id);
      const confirmResult = await this.$confirm('是否确认删除该分类？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err => err)
      // 判断用户是否点选的为‘删除’
      if(confirmResult !== 'confirm') return this.$message.info('dddd')
      // 点击确定按钮，向服务器发出请求删除该分类
      const {data} = await this.$http.delete(`categories/` + id)
      if(data.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success(data.meta.msg)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
  .TreeTable{
    margin-top: 15px;
  }
</style>