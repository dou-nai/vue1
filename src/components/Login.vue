<template>
  <div class="login_container">
    <!-- 放置登录框的所有组件 -->
    <div class="login_box">
      <!-- 放置图片 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- element-ui表单组件 -->
      <el-form
        ref="loginFormRef"
        :rules="loginFormRules"
        :model="loginForm"
        label-width="0"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
            style="width: 100%;"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password" style="width: 100%;">
          <el-input
            prefix-icon="el-icon-ice-cream-round"
            type="password "
            v-model="loginForm.password"
            style="width: 100%;"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <!-- <el-button type="primary">登录</el-button>
                                    <el-button type="info">重置</el-button> -->
          <el-button type="primary" @click="login">提交</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  //定义数据
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },

      //验证规则
      loginFormRules: {
        //验证用户名.required:true表示不可为空，message是提示信息，trigger是鼠标离开焦点
        username: [
          { required: true, message: '用户名不可空', trigger: 'blur' },
          {
            max: 13,
            min: 4,
            message: '长度在4字符到13字符之间',
            trigger: 'blur'
          }
        ],

        //验证密码
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
          {
            max: 13,
            min: 4,
            message: '长度在4字符到13字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  //操作函数
  methods: {
    //校验函数
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    //表单登录处理函数
    login() {
      //console.log('fh')
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        //登陆成功后保存服务器返回的token值
        window.sessionStorage.setItem('token', res.data.token)
        //跳转后台首页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
//scoped表示单个组件样式生效
.login_container {
  background-color: #2b4b6b;
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
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
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

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
