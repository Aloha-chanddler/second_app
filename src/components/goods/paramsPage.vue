<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="注意，只能为三级分类设置相关参数！"
        type="warning"
        :closable='false'
        show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
          v-model="selectedCateKeys"
          :options="cateList"
          :props="cateProps"
          @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数页签 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button 
          type="primary" 
          :disabled="selectedCateKeys.length === 3 ? false:true"
          @click="addParamsDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag 
                class="attr-tags"
                v-for="(item,index) in scope.row.attr_vals" 
                :key="index"
                closable
                @close="handleClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页签 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button 
          type="primary" 
          :disabled='selectedCateKeys.length === 3 ? false:true'
          @click="addParamsDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag 
                class="attr-tags"
                v-for="(item,index) in scope.row.attr_vals" 
                :key="index"
                closable
                @close="handleClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addParamsDialogVisible"
        width="50%"
        @close="addParamsDialogClosed">
        <span>
          <!-- 添加参数的表单项 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText+':'" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
          </el-form>  
        </span>
        <span slot="footer">
          <el-button @click="addParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editParamsDialogVisible"
        width="50%"
        @close="editParamsDialogClosed">
        <span>
          <!-- 添加参数的表单项 -->
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item :label="titleText+':'" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
          </el-form>  
        </span>
        <span slot="footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // 定义商品分类的数据列表
        cateList:[],
        // 级联选择框的配置对象
        cateProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        // 级联选择框双向绑定到的数组
        selectedCateKeys:[],
        // 被激活的页签的名称,也可用作请求参数列表的sel参数
        activeName:'many',
        // 定义动态参数数据列表
        manyTableData:[],
        // 定义静态参数数据列表
        onlyTableData:[],
        // 添加动态参数对话框的显示与隐藏
        addParamsDialogVisible:false,
        // 添加参数的数据对象
        addForm:{
          attr_name:''
        },
        // 添加参数的验证规则对象
        addFormRules:{
          attr_name:[
            {required:true,message:`输入不能为空`,trigger:'blur'},
            {min:3,max:10,message:`输入的内容在3-10个字符之间`,trigger:'blur'}
          ]
        },
        // 编辑参数对话框的显示与隐藏，默认为隐藏
        editParamsDialogVisible:false,
        // 修改的表单数据对象
        editForm:{},
        // 修改参数的验证规则对象
        editFormRules:{
          attr_name:[
            {required:true,message:`输入不能为空`,trigger:'blur'},
            {min:3,max:10,message:`输入的内容在3-10个字符之间`,trigger:'blur'}
          ]
        },  
      }
    },
    computed:{
      // 获取用于发起请求参数列表的id(当前选中的三级分类的id)
      cateId(){
        return this.selectedCateKeys[2]
      },
      // 动态计算添加参数对话框的title
      titleText(){
        if(this.activeName==='many'){
          return '动态参数'
        }else{
          return '静态属性'
        }
      }
    },
    created(){
      this.getCateList()
    },
    methods:{
      // 获取所有的商品分类数据列表
      async getCateList(){
        const {data} = await this.$http.get('categories')
        if(data.meta.status !==200) return this.$message.error('获取商品分类数据失败！')
        this.cateList = data.data
        console.log(this.cateList);
      },
      // 级联选择框选中项变化会触发这个函数，发起获取参数列表的请求
      handleChange(){
        // 当级联选择框的选中项发生变化时向服务器发起请求
        this.getParamsData()
        if(this.selectedCateKeys.length !== 3){
          // 如果所选中的分类不是三级分类，则清空级联选择框对应数组
          this.selectedCateKeys = []
          // 把动态参数和静态数据进行清空（138）
          this.manyTableData = []
          this.onlyTableData = []
        }
      },
      // 发起获取参数的列表数据的请求
      async getParamsData(){
        // console.log(this.selectedCateKeys);
        // 根据所选择的分类的id，和当前所处的面板（动态属性面板或静态属性面板）获取对应的参数
        const {data} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        if(data.meta.status !== 200) return this.$message.error('获取参数列表失败！')
        console.log(data);
        // 在赋值之前，把data.data里的attr_vals都循环一次
        data.data.forEach(item => {
          // 由于该属性是以空格为分隔符的字符串形式，所以使用.split方法将其转为数组的形式，再次赋值给它自身
          // 还需判断该属性是否为空，如果为空，则返回一个空数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值，默认为空
          item.inputValue = ''
        });
        console.log(data.data);
        // 判断所选择的页签面板是动态的还是静态的，根据所选择的面板向各自的数据列表里面赋值
        if(this.activeName === 'many'){
          this.manyTableData = data.data
        }else{
          this.onlyTableData = data.data
        }
      },
      // tab页签点击事件的处理函数
      handleTabClick(){
        // 当页签面板发生变化时向服务器请求数据
        this.getParamsData()
        console.log(this.activeName);
      },
      // 监听添加参数对话框的关闭事件
      addParamsDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },
      // 点击确定按钮向服务器发起添加参数的数据请求
      addParams(){
        this.$refs.addFormRef.validate( async valid=>{
          if(!valid) return
          const {data} = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
          // console.log(data);
          if(data.meta.status !== 201) return this.$message.error('添加失败！')
          this.$message.success(data.meta.msg)
          this.getParamsData()
          this.addParamsDialogVisible = false
        })
      },
      // 修改参数对话框
      async showEditDialog(id){
        // 查询当前参数的信息
        const {data} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
        if(data.meta.status !== 200) return this.$message.error('获取参数信息失败')
        this.$message.success(data.meta.msg)
        this.editForm = data.data
        console.log(this.editForm);
        this.editParamsDialogVisible = true
      },
      // 监听修改对话框的关闭事件
      editParamsDialogClosed(){
        // 重置修改的表单
        this.$refs.editFormRef.resetFields()
      },
      // 点击按钮修改参数信息
      editParams(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          const {data} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
          if(data.meta.status !==200) return this.$message.error('修改参数失败！')
          this.$message.success('修改参数成功！')
          this.getParamsData()
          this.editParamsDialogVisible =false
        })
      },
      // 根据Id删除对应的参数项
      async deleteParams(id){
        const confirmResult = await this.$confirm('是否要删除该参数？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).catch( err => err)
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除！')
        const {data} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if(data.meta.status !== 200) return this.$message.error('删除失败！')
        this.$message.success('删除成功！')
        this.getParamsData()
      },
      // 文本框失去焦点或按下enter键都会触发
      handleInputConfirm(row){
        // 对输入的空格做处理
        if(row.inputValue.trim().length === 0){
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        // 如果没有return，则证明用户输入了内容，需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        // 重置输入框中的值为空
        row.inputValue = ''
        // 隐藏输入框
        row.inputVisible = false
        // 调用保存修改参数项的函数
        this.saveAttrVals(row)
      },
      // 将attr_vals的数据持久化保存
      async saveAttrVals(row){
        // 需要发起请求，保存此次操作
        const {data} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          // 使用join函数把数组形式的attr_vals用空格拼接成字符串
          attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')
        })
        if(data.meta.status !== 200) return this.$message.error('添加参数失败！')
      },
      // 点击按钮展示文本输入框
      showInput(row){
        row.inputVisible = true
        // 让文本框自动获得焦点
         this.$nextTick(()=> {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 删除参数项
      handleClose(id,row){
        row.attr_vals.splice(id,1)
        // 调用保存修改参数项的函数
        this.saveAttrVals(row)
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt{
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .input-new-tag{
    width: 120px;
  }
  .attr-tags{
    margin: 0 10px;
  }
</style>