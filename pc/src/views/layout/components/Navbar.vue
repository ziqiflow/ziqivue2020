<template>
<div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
        <template v-if="device!=='mobile'">
            <error-log class="errLog-container right-menu-item" />

            <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
                <screenfull class="screenfull right-menu-item" />
            </el-tooltip>

            <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
                <size-select class="international right-menu-item" />
            </el-tooltip>

            <lang-select class="international right-menu-item" />

            <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
                <theme-picker class="theme-switch right-menu-item" />
            </el-tooltip>
        </template>

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
            <div class="avatar-wrapper">
                <!-- ?imageView2/1/w/80/h/80' -->
                <!-- <img :src="avatar" class="user-avatar"> -->
                <span class="fz12">{{name}}</span>
                <span v-if="isTest&&!!testUserName">测试员工【{{testUserName}}】</span>
                <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->

          

          <el-dropdown-item v-if="!isTest"  v-permission="['user.cantest']">
                        <span @click="goToTestEnv">前往测试环境</span>
            </el-dropdown-item>

            <el-dropdown-item v-if="isDingTalk()">
                        <span @click="openinchrome">在浏览器中打开</span>
            </el-dropdown-item>

            
            <!--  -->
               <el-dropdown-item v-if="isTest"  v-permission="['user.testlogin']">
          <!-- <el-dropdown-item v-if="isTest" v-permission="['user.testlogin']"> -->
                        <span @click="ChangeUserVisible=true">切换账号</span>
            </el-dropdown-item>

               <el-dropdown-item divided>
                        <span>版本信息{{version}}</span>
            </el-dropdown-item>


          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

 <el-dialog
  title="切换用户"
  :visible.sync="ChangeUserVisible"
  width="60%">
  <change-user v-if="ChangeUserVisible"></change-user>
</el-dialog>

  </div>
</template>

<script>
import {
    mapGetters
} from 'vuex'

import {
    GotoOaTest
} from '@/api/flowdesign'

import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ChangeUser from '@/views/contacts/CchangeUser'

import {
    setToken
} from '@/utils/auth'
import {
    GetTestUserInfo
} from '@/api/oa';

export default {
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog,
        Screenfull,
        SizeSelect,
        LangSelect,
        ThemePicker,
        ChangeUser
    },
    data() {
        return {
            ChangeUserVisible: false,
            isTest: window.envname == "test",
            testUserName: '',
            version:window.conf.version
            //testUrl: window.testUrl
        }
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'name',
            'avatar',
            'device'
        ])
    },
    mounted() {
         //this.$store.commit('setUserDepts',[{n: "后勤部", v: "25904352988234593"}])

        if (this.isTest) {

            GetTestUserInfo().then(({
                data: res
            }) => {
                //console.log('res',res);
                this.testUserName = res.data.name;
                //替换depts;测试的时候用的；
                this.$store.commit('setUserDepts',res.data.depts)
            })

        }
    },
    methods: {

       isDingTalk(){
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('dingtalk') != -1;
    },

        openinchrome(){
             window.open(window.location.href, '_blank')
        },



        goToTestEnv() {
            //前往测试环境中去
            GotoOaTest().then(({
                data: res
            }) => {
                console.log(res)
                if (!res.success) {
                    this.$message.error(res.msg);
                    return;
                }
                if (!!res.data.token) {
                    setToken(res.data.token, res.data.tokenkey);
                }

                //window.location.href=res.data.goto;
                //this.$message.success(res.msg);
                //设置
                window.open(res.data.gotourl, '_blank')
            })

        },
        toggleSideBar() {
            this.$store.dispatch('toggleSideBar')
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload() // In order to re-instantiate the vue-router object to avoid bugs
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            margin: 0 8px;
        }

        .screenfull {
            height: 20px;
        }

        .international {
            vertical-align: top;
        }

        .theme-switch {
            vertical-align: 15px;
        }

        .avatar-container {
            height: 50px;
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
