<template>
<div class="workbench">

    <div style="padding: 6px 10px;text-align: right;">{{username}},{{hello}}

 <el-dropdown class="avatar-container right-menu-item" trigger="click">
 <i class="el-icon-caret-bottom"/>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu></el-dropdown>

    </div>

    <div style="margin:10px 15px;">

        <div class="title red">流程</div>

        <el-row :gutter="20" class="row">
            <el-col :span="8">
                <el-badge class="badge">
                    <router-link to="/flowchose">
                        <div class="box blue" style="line-height: 66px;">
                            <i class="el-icon-plus" style="font-size: 25px;    color: white;"></i>
                        </div>
                    </router-link>
                </el-badge>

                <div>
                    发起流程
                </div>

            </el-col>
        </el-row>

        <div class="title red">代办</div>

        <el-row :gutter="20" class="row">
            <el-col :span="8">
                <el-badge :value="flowBadge.waiting" class="badge">

                    <router-link to="/flowwaiting">
                        <div class="box waiting">
                            <v-icon name="time" style="font-size: 25px;    color: white;"></v-icon>
                        </div>
                    </router-link>
                </el-badge>

                <div>
                    待我处理
                </div>

            </el-col>
            <el-col :span="8">

                <el-badge :value="flowBadge.message" class="badge">
                    <router-link to="/flowmessage">
                        <div class="box message">
                            <v-icon name="message" style="font-size: 25px;    color: white;"></v-icon>
                        </div>
                    </router-link>

                </el-badge>

                <div>
                    通知我
                </div>

            </el-col>
            <el-col :span="8">

                <el-badge :value="flowBadge.cc" class="badge">
                    <router-link to="/flowcc">
                        <div class="box cc">
                            <v-icon name="chaosongwode" style="font-size: 25px;    color: white;"></v-icon>
                        </div>
                    </router-link>
                </el-badge>

                <div>
                    抄送我
                </div>
            </el-col>
        </el-row>

        <el-row v-if="flowBadge.needcreat" :gutter="20" class="row">
            <el-col :span="8">
                <el-badge :value="flowBadge.needcreat" class="badge">

                    <router-link to="/flowneedcreat">
                        <div class="box needcreat">
                            <v-icon name="time" style="font-size: 25px;    color: white;"></v-icon>
                        </div>
                    </router-link>
                </el-badge>

                <div>
                    待我创建
                </div>

            </el-col>
        </el-row>

        <div class="title black">历史</div>

        <el-row :gutter="20" class="row">
            <el-col :span="8">
                <el-badge class="badge">
                    <router-link to="/flowfinish">
                        <div class="box finish">
                            <v-icon name="dengluzhucechenggong" style="font-size: 25px;    color: white;"></v-icon>
                        </div>
                    </router-link>
                </el-badge>

                <div>
                    我已处理
                </div>

            </el-col>
            <el-col :span="8">

                <el-badge class="badge">
                    <router-link to="/flowicreat">
                        <div class="box icreat">
                            <v-icon name="createicon" style="font-size: 25px;    color: white;"></v-icon>
                        </div>
                    </router-link>
                </el-badge>

                <div>
                    我发起的
                </div>
            </el-col>
        </el-row>

    </div>

    <div class="version">version:{{version}}</div>
</div>
</template>

<script>
import {
    mapActions,
    mapState
} from 'vuex'

export default {

    computed: {
        ...mapState({
            flowBadge: state => state.user.flowBadge,
            username: state => state.user.name,
            //  messageReadedList: state => state.employee.messageReadedList,
        })
    },
    data() {
        return {
            hello:null,
            version:window.conf.version
        }
    },

    mounted() {

        this.hello=this.getHello();

        this.getFlowBadgeNumber().then(res => {

        })
    },
    methods: {
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload() // In order to re-instantiate the vue-router object to avoid bugs
            })
        },
        ...mapActions([
            'getFlowBadgeNumber'
        ]),
        getHello() {
            let now = new Date();
            let hour = now.getHours();
                if (hour < 6) {
                   return '凌晨好！';
                }
                else if (hour < 9) {
                    return "早上好！"
                } else if (hour < 12) {
                    return "上午好！"
                } else if (hour < 14) {
                    return "中午好！"
                } else if (hour < 17) {
                    return "下午好！"
                } else if (hour < 19) {
                    return "傍晚好！"
                } else if (hour < 22) {
                    return "晚上好！"
                } else {
                    return "夜里好！"
                }

            },
            onClickLeft() {
                    
                },
                onClickRight() {
                    
                }
        }

    }
</script>

<style scoped>
.workbench {
    text-align: center;
}

.row {
    margin: 10px 10px 25px;
    font-size: 14px;
    padding-bottom: 10px;
    border-bottom: #cecece 1px solid;
}

.badge {
    margin: auto;
    margin-bottom: 10px;
}

.box {
    height: 60px;
    width: 60px;
    text-align: center;
    line-height: 60px;
    background-color: black;
    border-radius: 10px;
    margin: auto;
    box-shadow: 2px 2px 1px 0px #cccccc;
}

.box.blue {
    background-color: #409eff;
}

.box.waiting {
    background-color: #FFC107;
}

.box.message {
    background-color: #8bc34a
}

.box.icreat {
    background-color: #858990;
}

.box.cc {
    background-color: #00BCD4;
}

.box.finish {
    background-color: #607D8B;
}

.box.needcreat {
    background-color: #E91E63;
}

.title {
    text-align: left;
    margin: 10px 0 15px;
    padding-left: 4px;
}

.title.red {
    border-left: red 2px solid;
}

.title.black {
    border-left: black 2px solid;
}

.title.red {
    border-left: red 2px solid;
}
.version{
    position: fixed;
    bottom: 10px;
    width: 100%;
    text-align:center;
    color:#858990;
}
</style>
