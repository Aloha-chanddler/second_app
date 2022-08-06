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
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="fa fa-edit" @click="showEditRoleDialog(scope.row.id)">&nbsp;编辑</el-button>
              <el-button size="mini" type="danger" icon="fa fa-trash" @click="deleteRole(scope.row.id)">&nbsp;删除</el-button>
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

        <!-- 编辑角色对话框 -->
        <el-dialog
          title="添加角色"
          :visible.sync="editRoleDialogVisible"
          width="50%"
          >
          <!-- 添加角色表单区域 -->
          <span>
            <el-form 
            :model="editRoleForm" 
            :rules="editRoleRules" 
            ref="editRoleRef" 
            label-width="100px"
            >
            <!-- 添加角色表单项 -->
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRoleForm.roleName"></el-input>
              </el-form-item>
              <!-- 角色描述表单项 -->
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRoleForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer">
            <el-button @click="editRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole()">确 定</el-button>
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
        },
        // 根据id查询到的角色信息对象
        editRoleForm:{},
        // 编辑角色对话框的显示与隐藏
        editRoleDialogVisible:false,
        // 编辑角色的验证规则对象
        editRoleRules:{
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
      },
      // 通过id查询角色信息
      async showEditRoleDialog(id){
       const {data} = await this.$http.get('roles/' +id)
       if(data.meta.status !== 200) return this.$message.error('获取角色信息失败！')
       this.editRoleForm = data.data
       console.log(this.editRoleForm);
       this.editRoleDialogVisible =true
      },
      // 修改角色
      editRole(){
        this.$refs.editRoleRef.validate(async valid=>{
          if(!valid) return
          const {data} = await this.$http.put('roles/' +this.editRoleForm.roleId,{roleName:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc})
          console.log(data);
          // 关闭编辑角色对话框
          this.editRoleDialogVisible = false
          // 重新获取角色列表数据
          this.getRoleList()
        })
      },
      // 重置表单 由于在点击编辑的时候从服务器请求回了当前行的数据并展示在表单中，
      // 此处的重置表单意义不大
      // editRoleDialogClose(){
      //   this.$refs.editRoleRef.resetFields()
      // }
      
      // 删除角色
      async deleteRole(id){
        const confirmResult = await this.$confirm('是否永久删除该角色?', '删除角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm') return this.$message.info('取消删除！')
        const {data} = await this.$http.delete('roles/' + id)
        if(data.meta.status !==200) return this.$message.error('删除角色失败！')
        this.$message.success(data.meta.msg)
        this.getRoleList()
      }
    }
  }
</script>

<style>

</style>