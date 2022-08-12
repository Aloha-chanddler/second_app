<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
       <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
        class="el-alert">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" class="el-steps" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单包裹区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor
              v-model="addForm.goods_introduce"
            />
            <el-button @click="addGoods" class="btnAdd" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="70%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash
  import _ from 'lodash'
  export default {
    data(){
      return {
        // 步骤条的激活索引
        activeIndex:'0',
        // 标签显示位置
        tabPosition:'left',
        // 添加商品的表单数对象
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          // 商品所属的分类数组
          goods_cat:[],
          // 上传图片的临时路径
          pics:[],
          // 商品介绍内容
          goods_introduce:'',
          attrs:[]
        },
        // 添加商品的表单验证对象
        addFormRules:{
          goods_name:[
            {required:true,message:'请输入商品名称',trigger:'blur'},
          ],
          goods_price:[
            {required:true,message:'请输入商品价格',trigger:'blur'},
          ],
          goods_weight:[
            {required:true,message:'请输入商品重量',trigger:'blur'},
          ],
          goods_number:[
            {required:true,message:'请输入商品数量',trigger:'blur'},
          ],
          goods_cat:[
            {required:true,message:'请选择商品分类',trigger:'blur'},
          ],
        },
        // 商品分类列表
        cateList:[],
        // 级联选择器的分类参数配置项
        cateProps:{
          expandTrigger: 'hover',
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        // 向服务器获取到的动态参数数组
        manyTableData:[],
        // 静态属性列表数据
        onlyTableData:[],
        // 上传图片的URL地址
        uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
        // 图片上传组件的headers请求头对象
        headerObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        // 预览图片的地址
        previewPath:'',
        // 显示与隐藏图片预览对话框，默认为false
        previewVisible:false
      }
    },
    created(){
      this.getCateList()
    },
    computed:{
      cateId(){
        if(this.addForm.goods_cat.length === 3){
          return this.addForm.goods_cat[2]
        }
        return null
      }
    },
    methods:{
      // 获取商品分类数据列表
      async getCateList(){
        const {data} = await this.$http.get('categories')
        if(data.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
        this.cateList = data.data
        console.log(this.cateList);
      },
      // 级联选择器选择项发生改变时触发的函数
      handleChange(){
        // 判断所选中的是否为三级商品分类
        if(this.addForm.goods_cat.length !==3){
          // 如果选中的不是三级商品分类，则把数组清空
          this.addForm.goods_cat = [] 
        }
      },
      // 切换标签前的判断
      beforTabLeave(activeName,oldActiveName){
        // 如果要离开的标签页为第一页，且没有选中任何一个商品分类的三级分类，则return false，即不发生标签页跳转
        if(oldActiveName === '0' && this.addForm.goods_cat.length !==3){
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      // tab标签被点击时触发的函数
      async tabClicked(){
        // console.log(this.activeIndex);
        // 证明访问的是动态参数面板
        if(this.activeIndex === '1'){
          const {data} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params:{sel:'many'}
          })
          if(data.meta.status !== 200) return this.$message.error('获取商品参数失败！')
          // console.log(data.data);
          data.data.forEach(item => {
            item.attr_vals === 0 ? [] : item.attr_vals.split(' ')
          });
          this.manyTableData = data.data
        }else if(this.activeIndex === '2') {
          const {data} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params:{sel:'only'}
          })
          if(data.meta.status !== 200 ) return this.$message.error('获取静态属性失败！')
          // console.log(data.data);
          this.onlyTableData = data.data
        }
      },
      // 处理图片预览效果
      handlePreview(file){
        // console.log(file);
        this.previewPath = file.response.data.url
        this.previewVisible = true
      },
      // 处理移除图片的操作
      handleRemove(file){
        // console.log(file);
        // 1、获取将要被移除的图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2、从pics数组中找到对应的索引值
        const i = this.addForm.pics.findIndex(x =>{
          x.pic === filePath
        })
        // 3、调用数组的splice方法，把图片信息对象从pics中移除
        this.addForm.pics.splice(i,1)
        console.log(this.addForm);
      },
      // 监听图片上传成功时的函数
      handleSuccess(response){
        // console.log(response);
        // 拼接得到一个图片信息对象
        const picInfo = {pic:response.data.tmp_path}
        // 将图片上传成功时返回的临时路径对象保存到data中addForm里的pics属性上
        this.addForm.pics.push(picInfo)
        console.log(this.addForm);
      },
      // 点击按钮发送添加商品的请求
      addGoods(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return this.$message.error('请填写必要的表单项！')
          // 执行添加的业务逻辑
          // 先使用lodash对addForm做一下深拷贝
          const form = _.cloneDeep(this.addForm)
          // 对form下的goods_cat使用','拼接为一个数组，以便之后请求的时候携带
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数
          this.manyTableData.forEach(item=>{
            // newInfo将来需要push到attrs中作为参数发起添加商品请求
            const newInfo = {
              attr_id:item.attr_id,attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach(item=>{
            const newInfo = {
              attr_id:item.attr_id,attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          // 将data中的addForm里的attrs复制给深拷贝出来的form里的attrs
          form.attrs = this.addForm.attrs
          // 向服务器发起添加商品的请求
          const {data} = await this.$http.post(`goods`,form)
          if(data.meta.status !== 201) return this.$message.error('添加商品失败！')
          this.$message.success('添加商品成功！')
          // 通过编程式导航跳转到商品列表页面
          this.$router.push('/goods')
          console.log(form);
        })
      }
    }
  }
</script>

<style lang="less" scoped>
 .el-checkbox{
  margin: 0 5px 0 0 !important;
 }
 .previewImg{
  width: 100%;
 }
 .btnAdd{
  margin-top: 15px;
 }
</style>