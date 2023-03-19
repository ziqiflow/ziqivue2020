<template>
  <div class="login-container">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" :placeholder="$t('login.username')" name="username" type="text" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="passwordType" v-model="loginForm.password" :placeholder="$t('login.password')" name="password" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

  
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

<a v-if="thirdPlatform=='dingtalk'" href="/dingtalk/loginweb" target="_blank">
<el-button style="width:100%;margin-left:0px;"  type="success" plain @click="showDialog=true">
  <v-icon name="dingtalk"></v-icon>
  使用钉钉登录</el-button>
  </a>

  <a v-if="thirdPlatform=='wechatwork'" href="/wechatwork/loginweb" target="_blank">
<el-button style="width:100%;margin-left:0px;"  type="success" plain @click="showDialog=true">
  <v-icon name="dingtalk"></v-icon>
  使用企业微信登录</el-button>
  </a>
   
      
    </el-form>


  </div>
</template>

<script>
import {
  isvalidUsername
} from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
// import SocialSign from './socialsignin'

export default {
  name: 'Login',
  components: {
    LangSelect
    ,
    // SocialSign
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须大于6个字符'))
      } else {
        callback()
      }
    }
    return {
      thirdPlatform:window.conf.thirdPlatform,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  beforeCreate(){
  },
  created() {
    console.log('created')
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  mounted(){

    if(this.isDingTalk()&&this.thirdPlatform=='dingtalk'){

      //return;
      window.location.href='/dingtalk/login';
      return;
    }

    if(this.isWechatWork()&&this.thirdPlatform=='wechatwork'){

      //return;
      window.location.href='/wechatwork/login';
      return;
    }


  },
  methods: {
    isWechatWork(){
      let ua = window.navigator.userAgent.toLowerCase();
      //mozilla/5.0 (macintosh; intel mac os x 10_14_4) applewebkit/605.1.15 (khtml, like gecko) wxwork/2.8.2 (micromessenger/6.2) wechat/2.0.4
      return ua.indexOf('wxwork') != -1;
    },
    isDingTalk(){
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('dingtalk') != -1;
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }

    
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({
              path: this.redirect || '/'
            })
          }).catch((res) => {
            this.loading = false;
                this.$message.error(res);
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {

    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;

        &::first-line {
            color: $light_gray;
        }
    }
}


.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .set-language {
            color: #fff;
            position: absolute;
            top: 5px;
            right: 0px;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }

    .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
    }
}
</style>
