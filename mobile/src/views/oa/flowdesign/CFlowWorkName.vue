<template>
<div>

    <el-dialog title="测试数据" :visible.sync="dialogVisible" width="50%">
        <span>

            <div v-for="(item,index) in testWorkNameList" :key="index">
                {{item}}    
            </div>
  </span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>

    <el-form-item label="文号表达式：">

        <el-input ref="autoname" type="textarea" :rows="2" placeholder="输入文号表达式" v-model="sync_value.auto_name">
        </el-input>

        <el-tabs v-model="tabtype">

            <el-tab-pane label="可选符号" name="operator">

                <el-tooltip v-for="(item,index) in operatorList" :key="index" class="item" effect="dark" :content="'提示'+item.tips" placement="top">
                    <el-button style="margin-bottom:5px;" size="small" @click="addAt('{'+item.str+'}')">{{ item.str }}</el-button>
                </el-tooltip>

            </el-tab-pane>

            <el-tab-pane label="常用配置" name="coutoms">
                <el-tooltip v-for="(item,index) in customsList" :key="index" class="item" effect="dark" :content="item.tips" placement="top">
                    <el-button style="margin-bottom:5px;" size="small" @click="sync_value.auto_name=item.str">{{ item.str }}</el-button>
                </el-tooltip>
            </el-tab-pane>

            <el-tab-pane label="说明" name="telling" class='fz13'>
                {Y} ：表示年 {M} ：表示月 {D}：表示日<br>
                        {H} ：表示时 {I} ：表示分 {S}：表示秒<br>
                        {F} ：表示流程名 {U} ：表示用户姓名 {R}：表示角色<br>
                        {FS}：表示流程分类名称 {SD}：表示短部门<br>
                        {LD}：表示长部门 {RUN}：表示流水号<br>
                        {N} ：表示编号，通过编号计数器取值并自动增加计数值<br>
                        {NY} ：表示编号，每过一年编号重置一次<br>
                        {NM} ：表示编号，每过一月编号重置一次<br>
                 </el-tab-pane>

        </el-tabs>

    </el-form-item>

    <el-form-item label="编号计数步长：">

        <el-input min="1" style="width:150px;" placeholder="请输入编号计数步长" type="number" v-model="sync_value.auto_step">
        </el-input>

        <span style="color:red;" class="fz12">包含{N},{NY},{NM},{NW},{ND}时有效,{RUN}时无效</span>

    </el-form-item>

    <el-form-item label="编号位数：">

        <el-input-number size="mini" v-model="sync_value.auto_len" :min="0" :max="30"></el-input-number>

        <span style="color:red;" class="fz12">与{RUN},{N},{NY},{NM},{NW},{ND}时有效</span>

    </el-form-item>
    <el-form-item>

        <el-button size="mini" @click='test'>测试</el-button>

    </el-form-item>

</div>
</template>

<script>
import propsync from 'vue-propsync'
import moment from 'moment';

export default {
    name: 'FlowWorkName',
    mixins: [propsync],
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    auto_len: 3,
                    auto_name:'{Y}{M}{D}{H}{I}{S}{RUN}',
                    auto_step: 1
                }
            },
            isSync: true
        },
    },
    data() {
        return {
            testWorkNameList: [],
            tabtype: 'operator',
            dialogVisible: false,
            customsList: [
                {
                str: '{Y}/{M}/{D} {H}:{I}:{S}',
                tips: '年月日时分秒',
            },
            {
                str: '{Y}{M}{D}{H}{I}{S}',
                tips: '年月日时分秒',
            },{
                str: '{Y}{M}{D}{H}{I}{S}{RUN}',
                tips: '年月日时分秒流水号',
            },
            
            {
                str: '{Y}-{M}-{D}',
                tips: '年月日',
            },
            {
                str: '{Y}-{M}-{D}-{RUN}',
                tips: '年月日流水号',
            },
            {
                str: '{Y}-{M}-{D}-{NY}',
                tips: '年月日按年顺序排',
            },
            {
                str: '{Y}-{M}-{D}-{NM}',
                tips: '年月日按月顺序排',
            }
            ],
            operatorList: [{
                    str: 'Y',
                    tips: '年'
                },
                {
                    str: 'M',
                    tips: '月'
                },
                {
                    str: 'D',
                    tips: '日'
                },
                {
                    str: 'H',
                    tips: '时'
                },
                {
                    str: 'I',
                    tips: '分'
                }, {
                    str: 'S',
                    tips: '秒'
                }, {
                    str: 'F',
                    tips: '流程名'
                }, {
                    str: 'U',
                    tips: '用户姓名'
                },

                {
                    str: 'SD',
                    tips: '短部门'
                }, {
                    str: 'LD',
                    tips: '长部门'
                }, {
                    str: 'RUN',
                    tips: '流水号'
                }, {
                    str: 'N',
                    tips: '编号，通过编号计数器取值并自动增加计数值'
                },
                {
                    str: 'NY',
                    tips: '编号，每过一年编号重置一次'
                },
                {
                    str: 'NM',
                    tips: '编号，每过一月编号重置一次'
                },
                 {
                    str: 'NW',
                    tips: '编号，每过一周编号重置一次'
                },
                {
                    str: 'ND',
                    tips: '编号，每过一天编号重置一次'
                }
            ]
        }
    },

    mounted() {

        console.log('workname', this.sync_value);

    },
    computed: {

    },
    methods: {

        replaceAll(str, from, to) {
            

            let len = str.split(from).length - 1;
            for (let i = 0; i < len; i++) {
                str = str.replace(from, to)
            }

            return str;
        },

        test() {

            this.dialogVisible = true;
            

            //alert(moment('2019-10-19').format("YYYYMMDDHHmmss"));
            this.testWorkNameList = [];

            // this.testWorkNameList=
            

            let RunNumber = 0;

            let NNumber = 0;
            let NYNumber = 0;
            let NMNumber = 0;
            let NDNumber = 0;
            let NWNumber = 0;

            let moment2 = moment();
            for (let k = 0; k < 200; k++) {


                RunNumber++;
                let auto_step=Number(this.sync_value.auto_step<=0||!this.sync_value.auto_step?1:this.sync_value.auto_step);
                NNumber=auto_step
                NYNumber+=auto_step
                NMNumber+=auto_step
                NWNumber+=auto_step
                NDNumber+=auto_step



                let thismonth = moment2.format('MM');
                let thisyear = moment2.format('YYYY');
                let thisweek= moment2.format('WW');
                let thisday= moment2.format('DDDD');

                let auto_name = this.sync_value.auto_name;
                console.log(auto_name);
                auto_name = this.replaceAll(auto_name, '{Y}', moment2.format('YYYY'));
                auto_name = this.replaceAll(auto_name, '{M}', moment2.format('MM'));
                auto_name = this.replaceAll(auto_name, '{D}', moment2.format('DD'));
                auto_name = this.replaceAll(auto_name, '{H}', moment2.format('HH'));
                auto_name = this.replaceAll(auto_name, '{I}', moment2.format('mm'));
                auto_name = this.replaceAll(auto_name, '{S}', moment2.format('ss'));

                auto_name = this.replaceAll(auto_name, '{F}', '流程名称');

                auto_name = this.replaceAll(auto_name, '{SD}', 'X部门');
                auto_name = this.replaceAll(auto_name, '{LD}', 'A公司-C部门-D部门');

                auto_name = this.replaceAll(auto_name, '{RUN}', this.filling(RunNumber, this.sync_value.auto_len));

                auto_name = this.replaceAll(auto_name, '{N}', this.filling(NNumber, this.sync_value.auto_len));

                auto_name = this.replaceAll(auto_name, '{NY}', this.filling(NYNumber, this.sync_value.auto_len));

                auto_name = this.replaceAll(auto_name, '{NM}', this.filling(NMNumber, this.sync_value.auto_len));


                auto_name = this.replaceAll(auto_name, '{NW}', this.filling(NWNumber, this.sync_value.auto_len));


                auto_name = this.replaceAll(auto_name, '{ND}', this.filling(NDNumber, this.sync_value.auto_len));


                this.testWorkNameList.push(auto_name);


                moment2 = moment2.add(Math.ceil(Math.random() *45*360)*k, 'seconds');


             

                if (moment2.format('MM') != thismonth) {
                    NMNumber = 0;
                }

                if (moment2.format('YYYY') != thisyear) {
                    NYNumber = 0;
                }


                if (moment2.format('WW') != thisweek) {
                    NWNumber = 0;
                }

                if (moment2.format('DDDD') != thisday) {
                    NDNumber = 0;
                }

                //console.log(auto_name);
            }

            console.log(this.testWorkNameList);

        },
        filling(value, len) {
            let difflen = len - (value + '').length;
            if (difflen > 0) {
                let str = '';
                for (let i = 0; i < difflen; i++) {
                    str += '0';
                }
                return str + value;
            }
            return value;
        },
        addAt(p) {
            const textarea = this.$refs.autoname.$el.getElementsByTagName('textarea')[0]
            // console.log(textarea);
            // window.textarea=textarea;
            textarea.focus()

            const startPos = textarea.selectionStart
            const endPos = textarea.selectionEnd
            let cursorPos = startPos
            const tmpStr = textarea.value
            // textarea.value = tmpStr.substring(0, startPos) + p + tmpStr.substring(endPos, tmpStr.length)
            this.sync_value.auto_name = tmpStr.substring(0, startPos) + p + tmpStr.substring(endPos, tmpStr.length)

            cursorPos += p.length

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = cursorPos
            }, 300)

            // this.updatePos(this.nowNextFun.if)
        },

    }
}
</script>

<style scoped>
</style>
