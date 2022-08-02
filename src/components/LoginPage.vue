<template>
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form 
      class="login_form" 
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginFormRules"
      label-width="0px"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input 
          placeholder="请输入用户名"
          prefix-icon="fa fa-user"
          v-model="loginForm.username"
          >
          </el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input 
          placeholder="请输入密码"
          prefix-icon="fa fa-lock"
          type="password"
          v-model="loginForm.password"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <!-- 登录按钮 -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 重置按钮 -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data(){
    return{
      // 这是登录表单的数据绑定对象
      loginForm:{
        username:'admin',
        password:'123456'
      },
      // 表单验证规则对象
      loginFormRules:{
        // 验证用户名是否合法
        username:[
          { required: true, message:"请输入登录用户名", triggle:"blur" },
          { min:3, max:10, message:"用户名长度在3-10字符之间" }
        ],
        // 验证密码是否合法
        password:[
          { required: true, message:"请输入登录密码", triggle:"blur" },
          { min:6, max:15, message:"登录密码长度在6-15字符之间" }
        ]
      }
    }
  },
  methods:{
    // 点击重置登录表单
    resetLoginForm(){
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    // 登录表单预验证
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        // 判断valid是否为true,为false则表示验证不通过，不发起请求
        if(!valid) return
        // 通过绑定在Vue原型对象上的axios发起post请求
        const {data} = await this.$http.post('login',this.loginForm)
        // 通过服务器返回的数据中的meta属性里的status判断是否请求成功
        if(data.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功！')
        /*
        登录成功后的行为：
        1、将登录成功之后的token保存到客户端的sessionStorage中
          1.1 项目中除了登录之外的其他API接口必须在登录之后才能访问
          1.2 token只应在当前网站打开期间生效，所以将token保存到session storage中
        2、通过编程式导航跳转到后台主页，路由地址是'/home'
        */
       window.sessionStorage.setItem('token',data.data.token)
       this.$router.push('/home')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #008c8c;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>