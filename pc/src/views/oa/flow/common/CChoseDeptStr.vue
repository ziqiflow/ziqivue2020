<template>
<div>

    <div v-if="!disabled">

        <el-select clearable filterable v-model="sync_value" :placeholder="placeholder">
            <el-option v-for="item in DeptTree" :key="item.id" :label="item.label" :value="item.label" />
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
                return '请选择部门'
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
            DeptTree: []
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

                this.DeptTree = this.getdeptList(this.userByDepts)
                this.DeptTree.unshift({
                    id: '1',
                    label: '全公司'
                })

            })
        } else {

            this.DeptTree = this.getdeptList(this.userByDepts)
            this.DeptTree.unshift({
                id: '1',
                label: '全公司'
            })

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
        getdeptList(list, titiles = []) {
            
            let arr = []
            for (let i = 0; i < list.length; i++) {
                const titileArr = this.copyobject(titiles)
                const ele = list[i]
                if (ele.deptname) {
                    const newobj = {
                        label:
                            // this.intend(titileArr.length)
                            // (titileArr.join('-') ? titileArr.join('-') + '-' : '') +
                            ele.deptname
                    }
                    titileArr.push(ele.deptname)
                    // if (type == 'multiple') {
                    newobj.id = ele._uuid
                    // } else {
                    //   newobj.id = null
                    // }

                    arr.push(newobj)

                    if (ele.children) {
                        if (ele.children.length > 0) {
                            const back = this.getdeptList(ele.children, titileArr)
                            if (back.length > 0) {
                                arr = arr.concat(back)
                                // newobj.children=back;
                            }
                        } else {
                            continue
                        }
                    }
                    // arr.push(newobj)
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
