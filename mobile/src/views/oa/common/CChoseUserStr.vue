<template>
<div>

    <div v-if="!disabled">
        <el-select  clearable filterable v-model="sync_value" :placeholder="placeholder">
            <el-option v-for="item in UserList" :key="item.id" :label="item.label" :value="item.label" />
        </el-select>

    </div>

    <div v-else>

        <span class="usertag">
             {{!!sync_value?sync_value:'无'}}
        </span>

    </div>
</div>
</template>

<script>
import {
    mapState,
    mapActions
} from 'vuex'

import propsync from 'vue-propsync'

export default {
    name: 'choseUsers',
    mixins: [propsync],
    components: {

    },
    computed: {
        ...mapState({
            userByDepts: state => state.contact.userByDepts
        })
    },
    props: {
        value: {
            type: String,
            default: () => {
                return ''
            },
            isSync: true
        },
        disabled: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
          placeholder:{
            type:String,
            default:()=>{
                return '请选择人员'
            }
        }

        

        // users: {
        //     type: Array,
        //     default: () => {
        //         return []
        //     }
        // }
    },
    data() {
        return {
            UserList: []
        }
    },

    watch: {
        sync_value: function () {
            this.$emit('input', this.sync_value);
        },
    },

    mounted() {

        if (this.disabled) return;

        
        if (this.userByDepts.length == 0) {
            this.getUserByDeptData().then(res => {

                this.UserList = this.getuserList(this.userByDepts)

            })
        } else {

            this.UserList = this.getuserList(this.userByDepts)

        }

    },
    methods: {
        ...mapActions([
            'getUserByDeptData',
            // 'ChangeUser'
        ]),

        copyobject(obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        getuserList(list) {
            
            let arr = []
            for (let i = 0; i < list.length; i++) {
                //const titileArr = this.copyobject(titiles)
                const ele = list[i]
                if (!!ele.username) {
                    //arr.push(ele.username);
                    const newobj = {
                        label:
                            // this.intend(titileArr.length)
                            // (titileArr.join('-') ? titileArr.join('-') + '-' : '') +
                            ele.username + (!!ele.userjobid ? '(' + ele.userjobid + ')' : '')
                    }
                    //titileArr.push(ele.deptname)
                    // if (type == 'multiple') {
                    newobj.id = ele._uuid
                    // } else {
                    //   newobj.id = null
                    // }
                    arr.push(newobj)

                    // arr.push(newobj)
                }

                if (!!ele.children) {
                    if (ele.children.length > 0) {
                        const back = this.getuserList(ele.children)
                        if (back.length > 0) {

                            back.forEach(ele => {

                                if (!arr.some(v => {
                                        return v.label == ele.label
                                    })) {
                                    arr.push(ele);
                                }

                            });
                            
                            // arr = arr.concat(back)
                            // newobj.children=back;
                        }
                    } else {
                        continue
                    }
                }
            }
            // console.log('arr', arr)
            return arr
        }
    }
}
</script>

<style>
.usertag {
    border: 1px solid #bbbbbb;
    padding: 3px;
    border-radius: 5px;
    margin: 5px;
    word-break: keep-all;
}
</style>
