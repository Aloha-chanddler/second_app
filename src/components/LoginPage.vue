<template>
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form">
        <!-- 用户名输入框 -->
        <el-form-item>
          <el-input placeholder="请输入用户名"
          prefix-icon="fa fa-user"
          >
          </el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item>
          <el-input placeholder="请输入密码"
          prefix-icon="fa fa-lock"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <!-- 登录按钮 -->
          <el-button type="primary">登录</el-button>
          <!-- 重置按钮 -->
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
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