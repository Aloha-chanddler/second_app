<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
      <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
          <el-col>
            <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
          </el-col>
        </el-row>

        <!-- 角色列表主体区域 -->
        <el-table :data="roleList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand"></el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="">
              <el-button size="mini" type="primary" icon="fa fa-edit">&nbsp;编辑</el-button>
              <el-button size="mini" type="danger" icon="fa fa-trash">&nbsp;删除</el-button>
              <el-button size="mini" type="warning" icon="fa fa-cube">&nbsp;分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加角色对话框 -->
        <el-dialog
          title="添加角色"
          :visible.sync="addRoleDialogVisible"
          width="50%"
          @close="addRoleDialogClose"
          >
          <!-- 添加角色表单区域 -->
          <span>
            <el-form 
            :model="addRoleForm" 
            :rules="addRoleRules" 
            ref="addRoleRef" 
            label-width="100px"
            >
            <!-- 添加角色表单项 -->
              <el-form-item label="添加角色" prop="roleName">
                <el-input v-model="addRoleForm.roleName"></el-input>
              </el-form-item>
              <!-- 角色描述表单项 -->
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoleForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer">
            <el-button @click="addRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole()">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        roleList:[],
        addRoleDialogVisible:false,
        // 添加角色数据对象
        addRoleForm:{
          roleName:'',
          roleDesc:''
        },
        // 添加角色表单验证对象
        addRoleRules:{
          roleName:[
            {required:true,message:'请输入角色名称',trigger:'blur'},
            {
              min: 3,
              max: 10,
              message: "用户名长度在3-10个字符之间",
              trigger: "blur",
            },
          ],
          roleDesc:[
            {required:true,message:'请输入角色描述',trigger:'blur'},
            {
              min: 3,
              max: 15,
              message: "角色描述在3-15个字符之间",
              trigger: "blur",
            },
          ]
        }
      }
    },
    created(){
      this.getRoleList()
    },
    methods:{
      // 获取角色列表数据
      async getRoleList(){
        const {data} = await this.$http.get('roles')
        if(data.meta.status !== 200) return this.$message.error('获取角色列表失败！')
        this.roleList = data.data
        console.log(this.roleList);
      },
      // 添加角色对话框关闭事件
      addRoleDialogClose(){
        this.$refs.addRoleRef.resetFields()
      },
      // 添加角色
      addRole(){
        this.$refs.addRoleRef.validate(async valid=>{
          console.log(valid);
          if(!valid) return
          const {data} = await this.$http.post('roles',this.addRoleForm)
          if(data.meta.status !== 201) {
            return this.$message.error('添加角色失败！')
          }else {
            return this.$message.success(data.meta.msg)
          }
        })
        // 重新获取角色列表数据
        this.getRoleList()
        // 关闭添加角色对话框
        this.addRoleDialogVisible=false

      }
    }
  }
</script>

<style>

</style>