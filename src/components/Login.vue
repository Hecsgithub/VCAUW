<template>
  <el-form :rules="rules" ref="loginForm" :model="loginForm" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h1 class="login_title">系统登录</h1>
    <el-form-item prop="name">
      <el-input type="text" v-model.number="loginForm.name" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input type="password" v-model="loginForm.pass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default{
    data(){
      const checkusername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('新生请输入身份证号，教职工请输入工号'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
              callback();
            }
        }, 1000);
      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新生请输入身份证号后六位'));
        } else {
          callback();
        }
      };
      return {
        checked: true,
        loginForm: {
          name: '',
          pass: ''
        },
        rules: {
          name: [
            { validator: checkusername, trigger: ['blur','change']}
          ],
          pass: [
            {validator: validatePass, trigger: ['blur','change']}
          ]
        },
        loading: false
      }
    },
    methods: {
      submitClick: function () {
        var _this = this;
        this.postRequest('/login', {
          username: this.loginForm.name,
          password: this.loginForm.pass
        }).then(resp=> {
          _this.loading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$store.commit('login', data.obj);
            var path = _this.$route.query.redirect;
            _this.$router
              .replace({path: path == '/' || path == undefined ? '/home' : path});
          }
        });
      }
    }
  }
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
