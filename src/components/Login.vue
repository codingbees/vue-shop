<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <el-form ref="loginformref" :model="loginForm" class="login_form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item prop="userpwd">
          <el-input v-model="loginForm.userpwd" prefix-icon="el-icon-s-goods" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btnclass">
          <el-button @click="submit" type="primary">登录</el-button>
          <el-button @click="reset" type="info">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        userpwd: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        userpwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, message: '长度大于 2 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.loginformref.validate(async v => {
        if (!v) return
        const { data: res } = await axios.post('/api/private/v1/login?username=' + this.loginForm.username + '&password=' + this.loginForm.userpwd + '')
        // axios.get('/api/private/v1/menus').then(res1 => {
        //   console.log("res1")
        //   console.log(res1)
        //   console.log("res1")
        // })
        // const { data: res } = await axios.post('login', this.loginForm)
        console.log(res)

        if (res.meta.status !== 200) return this.$message.error('Failed')

        this.$message.success('Success')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    reset () {
      // console.log(this)
      this.$refs.loginformref.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .login_container {
    background-color: #bfa;
    height: 100%;

  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .avatar_box img {
    background-color: #eee;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .btnclass {
    display: flex;
    justify-content: flex-end;
  }
</style>
