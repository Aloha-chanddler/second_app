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
        <!-- 搜索框 -->
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
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 姓名列 -->
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <!-- 邮箱列 -->
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <!-- 电话列 -->
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <!-- 角色列 -->
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态">
          <!-- 通过作用域插槽获取每一行数据 （数据存放在scope.row上面） -->
          <template slot-scope="scope">
            <!-- 开关按钮，用v-model绑定每一行的数据的mg_state的值（布尔值） -->
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="fa fa-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button 
            type="danger" 
            size="mini" 
            icon="fa fa-trash"
            @click="removeUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="fa fa-vcard"
                @click="allotRole(scope.row)"
              ></el-button>
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
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <!-- 主体内容区域 -->
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="用户名:">
            <el-input 
            v-model="editForm.username"
            disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input 
            v-model="editForm.email"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input 
            v-model="editForm.mobile"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button 
        type="primary" 
        @click="editUserInfo"
        >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotRoleDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select placeholder="请选择角色" v-model="selectedRoleId">
            <el-option 
            v-for="item in roleList" 
            :key="item.id" 
            :label="item.roleName"
            :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="allotRoleDialogVisible = false">取 消</el-button>
        <el-button 
        type="primary" 
        @click="saveRoleInfo"
        >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rules, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法的邮箱"));
      }
    };
    // 验证手机号的规则
    var checkMobile = (rules, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示数量
        pagesize: 5,
      },
      userList: [],
      // 数据数量
      total: 0,
      // 控制添加用户信息对话框的显示与隐藏,默认值为false
      addDialogVisible: false,
      // 添加用户表单数据对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        // 用户名验证
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3-10个字符之间",
            trigger: "blur",
          },
        ],
        // 密码验证
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在6-15个字符之间",
            trigger: "blur",
          },
        ],
        // 邮箱验证
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
          // {min:6,max:15,message:'密码长度在6-15个字符之间',trigger:'blur'}
        ],
        // 手机验证
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
          // {min:6,max:15,message:'密码长度在6-15个字符之间',trigger:'blur'}
        ],
      },
      // 修改用户对话框的显示与否，默认为false不显示
      editDialogVisible:false,
      // 查询到的用户信息对象
      editForm:{},
      // 修改表单的验证规则对象
      editFormRules:{
        // 邮箱校验规则
        email:[
          { required:true,message:'请输入邮箱',trigger:'blur' },
          { validator: checkEmail, trigger: "blur" }
        ],
        // 手机校验规则
        mobile:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      allotRoleDialogVisible:false,
      // 需要被分配角色的用户信息对象
      userInfo:{},
      // 角色列表列表
      roleList:[],
      // 选中的角色id
      selectedRoleId:''
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户数据列表
    async getUserList() {
      const { data } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      // console.log(data);
      if (data.meta.status !== 200) return this.$message.error(data.meta.smg);
      this.userList = data.data.users;
      this.total = data.data.total;
      console.log(this.userList);
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      // 把当前最新的pagesize赋值给data中的queryInfo里的pagesize
      this.queryInfo.pagesize = newSize;
      // 根据全新的pagesize重新发起数据请求获取本页的数据
      this.getUserList();
    },
    // 监听 页码数 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      // 把当前最新的pagenum赋值给data中的queryInfo里的pagenum
      this.queryInfo.pagenum = newPage;
      // 根据最新的pagenum重新发起数据请求获取本页数据
      this.getUserList();
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userInfo) {
      // console.log(userInfo);
      // 向服务器发起修改用户状态的请求
      const { data } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (data.meta.status !== 200) {
        // 如果请求失败了，数据库中的状态没来得及改变，但是页面的状态已经变了，所以需要把页面的状态重置回来
        userInfo.mg_state = !userInfo.mg_state;
        // 停止后续逻辑并提示信息
        return this.$message.error(data.meta.msg);
      }
      this.$message.success(data.meta.msg);
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      // 找到表单组件的引用对象，并调用其resetFields方法
      this.$refs.addFormRef.resetFields();
    },
    // 点击‘确定’按钮添加新用户
    addUser() {
      // 对表单进行预验证，获取表单的引用对象，调用其validate方法
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);  valid为布尔值，表单预验证通过为true,未通过为false
        // 判断预验证是否通过
        if (!valid) return;
        // 如果预验证通过，则发起添加用户的网络请求
        const { data } = await this.$http.post("users", this.addForm);
        // console.log(data);
        if (data.meta.status === 400) {
          return this.$message.error(data.meta.msg);
        } else if (data.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        } else {
          this.$message.success(data.meta.msg);
        }
        // 关闭对话框
        this.addDialogVisible = false;
        // 重新获取用户列表数据
        this.getUserList();
      });
    },
    // 修改用户对话框点击事件,通过作用域插槽传入当前行的数据的id
    async showEditDialog(id) {
      this.editDialogVisible = true
      const {data} = await this.$http.get(`users/${id}`)
      console.log(data);
      if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.editForm = data.data
    },
    // 监听修改用户关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        // 发起修改用户的数据请求
        const {data} = await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,mobile:this.editForm.mobile})
        console.log(data);
        if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
        // 重新获取服务器数据
        this.getUserList()
        // 关闭对话框
        // this.editDialogVisible = false
        // 提示成功信息
        this.$message.success(data.meta.msg)
      })
    },
    // 根据id删除对应的用户信息
    async removeUser(id){
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm('是否永久删除该用户？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>err)
      // 如果用户点击确认按钮，则返回字符串'confirm'，如果点击取消，则返回'cancel'
      console.log(confirmResult);
      // 判断用户点击的是确认按钮或者取消按钮，从而确定是否发起服务器请求
      if(confirmResult !== 'confirm') return this.$message.info('取消删除！')
      // 如果用户点击了确定，则进行服务器请求
      const {data} = await this.$http.delete('users/' + id)
      if(data.meta.status!==200) return this.$message.err(data.meta.msg)
      this.getUserList()
    },
    // 展示分配角色的对话框
    async allotRole(userInfo){
      this.userInfo = userInfo
      // 在展示对话框之前获取所有的角色列表
      const {data} = await this.$http.get('roles')
      if(data.meta.status !==200) return this.$message.error('获取角色列表失败')
      // 把获取到的角色列表保存到data
      this.roleList = data.data
      this.allotRoleDialogVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo(){
      // 判断用户是否选择了一个角色
      if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
      const {data} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(data.meta.status !== 200) return this.$message.error('分配角色失败')
      // 如果请求成功
      this.$message.success('分配角色成功')
      // 重新获取用户信息
      this.getUserList()
      // 关闭对话框
      this.allotRoleDialogVisible = false
    }
  },
};
</script>

<style lang="less" scoped>
</style>