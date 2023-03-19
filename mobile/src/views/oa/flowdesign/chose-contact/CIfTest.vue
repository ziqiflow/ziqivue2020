<template>
<div>
    <el-dialog :visible.sync="modaltestIfstr" title="测试表达式" append-to-body width="50%">
                <el-card class="box-card">
                    测试表达式：
                    {{ matchtestifstr }}
                </el-card>
                <div v-if="matchtestarr.length">
                    <el-alert :closable="false" title="请填写如下测试数据" type="success" class="mg10" />
                    <el-form label-position="right" label-width="120px">
                        <el-form-item v-for="match in matchtestarr" :label="match.name" :key="match.key">
                            <el-input v-model="match.value" placeholder="输入测试数据" size="mini" />
                        </el-form-item>

                        <span class="fz12" style="color:red">*如果测试的数据是多选情况，请用,隔开；比如宁波公司,杭州公司</span>
                        
                    </el-form>
                </div>
                <div v-else>
                    <el-alert :closable="false" title="此条件表达式不包含任何测试数据，可直接运行测试" type="warning" />
                </div>

                <el-alert v-if="matchbackmsg" :title="matchbackmsg" :closable="false" type="error" class="mg10" />

                <el-alert title="计算结果说明">
                    1代表是通过，会执行下一个步骤<br>
            0代表是未通过，不会执行下一步骤；<br>
            计算报错：说明表达式不合法；请检查表达式；
          </el-alert>

                    <div slot="footer">

                        <el-button type="primary" @click="okTestIfstr">测试</el-button>
                    </div>

            </el-dialog>
 <el-input ref="nextfunif" v-model="sync_value" type="textarea" placeholder="输入条件表达式" />
                    <div style="line-height: 18px;font-size: 12px;margin-top:2px">
                        <el-button size="mini" @click="readyTestifstr(sync_value)">测试</el-button>
                        <span class="fz12" style="color:red;">*提示：表单变量不可自行修改「格式:@[表单名_表单标示]」，字符串表示需加”“；注意是英文”；比如
              @[资产分类_1545714598000_9330]=="购买配送"</span>
                        <div class="fz12" style="color:red;">如果是多组判断，请输入()中括号确定优先级,比如(@[变量1]=="是")&&(@[变量2]=="是")</div>

                    </div>

                    <el-tabs v-model="iffuntabtype">
                      
                        <el-tab-pane label="可选参数" name="props">
                            <el-button style="margin-bottom:5px;" v-for="item in requireDataList" :key="item.key" size="small" @click="addAt(`@[${item.name}_${item.key}]`)">{{ item.name }}</el-button>
                        </el-tab-pane>

                        <el-tab-pane label="可选符号" name="operator">
                            <el-button style="margin-bottom:5px;" v-for="(item,index) in operatorList" :key="index" size="small" @click="addAt(`${item}`)">{{ item }}</el-button>
                        </el-tab-pane>

                        <el-tab-pane label="可选函数" name="fun">
<el-tooltip v-for="(item,index) in funList" :key="index"  :content="item.desc" placement="top" effect="light">
  <el-button style="margin-bottom:5px;" size="small" @click="addAt(`#[${item.name}]()`)">{{ item.name }}</el-button>
</el-tooltip>


                        </el-tab-pane>

                    </el-tabs>
</div>
</template>

<script>

import {
    mapState,mapActions,mapGetters
} from 'vuex'

import {
    FlowIfStrTest
} from '@/api/flowdesign'

import propsync from 'vue-propsync'

export default {
    name: 'IfTest',
    mixins: [propsync],
    components: {
    
    },
    computed: {
         ...mapGetters([
            'requireDataList'
        ])
    },
    props: {
         value: {
            type: String,
            default: () => {
                return ''
            },
            isSync: true
        },
        disabled:{
            type:Boolean,
            default:()=>{
                return false;
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
              iffuntabtype: 'props',
                          modaltestIfstr: false,
            matchbackmsg: null,
            matchtestarr: [], 
            matchtestifstr: null, 
            
            funList:[
                {name:'包含inAarray','desc':'使用说明：#[包含inAarray](多选元素（比如多选框）,字符串)；比如#[包含inAarray](@[多选框组_1559000_689],"台州公司")'}
                ,
                {name:'包含strpos','desc':'使用说明：#[包含strpos](文本内容(比如输入框),字符串)；比如#[包含strpos](@[文本框_1559000_689],"台州公司")'}
            ],
            operatorList: [
                '==',
                '<',
                '>',
                '/',
                '*',
                '-',
                '+',
                '<=',
                '>=',
                '&&',
                '||',
                '!=',
                '(',
                ')'
            ]
        }
    },
    mounted() {

    

    },
    methods:{
 unique(arr) {
            var n = []
            for (var i = 0; i < arr.length; i++) {
                if (n.indexOf(arr[i]) == -1) {
                    n.push(arr[i])
                }
            }
            return n
        },
 
        okTestIfstr() {
            FlowIfStrTest({
                ifstr: this.matchtestifstr,
                formdatalist: this.matchtestarr
            }).then(({
                data: req
            }) => {
                this.matchbackmsg = req.msg
                if (req.success) {
                    this.$message.info(req.msg)
                } else {
                    this.$message.error(req.msg)
                }
                console.log(req)
            })
        },
         //
        readyTestifstr(ifstr) {
            this.matchbackmsg = null

            

            if (!ifstr) {
                this.$message.error('测试字符串不可为空')
                return
            }

            let match = ifstr.match(/@\[.+?\]/g)
            const matcharr = []
            if (match) {
                match = this.unique(match)
                match.forEach(mt => {
                    const keymatch = mt.match(/\d{13}_\d{1,}/g)
                    if (keymatch) {
                        this.requireDataList.forEach(ele => {
                            if (keymatch[0] == ele.key) {
                                const newele = this.copyobject(ele)
                                newele.value = 1
                                this.matchtestarr.forEach(test => {
                                    if (test.key == newele.key) {
                                        newele.value = test.value
                                    }
                                })

                                matcharr.push(newele)
                            }
                        })
                    }
                })
            }

            this.matchtestarr = matcharr
            this.matchtestifstr = ifstr
            this.modaltestIfstr = true
        },
         addAt(p) {
            const textarea = this.$refs.nextfunif.$el.getElementsByTagName('textarea')[0]
            // console.log(textarea);
            // window.textarea=textarea;
            textarea.focus()

            const startPos = textarea.selectionStart
            const endPos = textarea.selectionEnd
            let cursorPos = startPos
            const tmpStr = textarea.value
            // textarea.value = tmpStr.substring(0, startPos) + p + tmpStr.substring(endPos, tmpStr.length)
            this.sync_value = tmpStr.substring(0, startPos) + p + tmpStr.substring(endPos, tmpStr.length)

            cursorPos += p.length

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = cursorPos
            }, 300)

            // this.updatePos(this.nowNextFun.if)
        },


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
                            ele.username+(!!ele.userjobid?'('+ele.userjobid+')':'')
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

                                    if(!arr.some(v=>{return v.label==ele.label})){
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

<style scope>


.usertag{
    border: 1px solid #bbbbbb;
    padding: 3px;
    border-radius: 5px;
    margin: 5px;    word-break: keep-all;
}

</style>
