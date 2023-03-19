<template>
<div class="cFormLimit">

    <el-dialog title="编辑表单设置" :visible.sync="EditModalStatus" width="500px">
        <el-alert title="未设置的情况下会以只读的方式显示已填写的数据" :closable="false" type="warning">
        </el-alert>
        <div class="formtabe">
            <el-row class="row fz14" style="font-weight: bolder;" :gutter="10">
                <el-col :span="7">表单字段</el-col>
                <el-col :span="5" v-if="usetype!='read'">
                    <el-checkbox @change="(value)=>whencheckboxChange(value,'canedit')" v-model="allcanedit">可编辑</el-checkbox>
                </el-col>
                <el-col :span="4" v-if="usetype!='read'">是否必填</el-col>
                <el-col :span="4">
                    <el-checkbox @change="(value)=>whencheckboxChange(value,'readonly')" v-model="allreadonly">只读</el-checkbox>
                </el-col>
                <el-col :span="4">
                    <el-checkbox @change="(value)=>whencheckboxChange(value,'hidden')" v-model="allhidden">隐藏</el-checkbox>
                </el-col>
            </el-row>

            <div v-for="(item,index) in editlist" :key='index'>
                <el-radio-group style="font-size:13px;display: block;line-height: 18px;" v-model="item.type">
                    <el-row class="row" :gutter="10">
                        <el-col :span="7">
                            <span v-if="item.t=='table'">(表格)</span>
                              <span v-if="item.t=='placeholderhtml'">(文本)</span>
                            {{item.name}}</el-col>
                        <el-col :span="5" v-if="usetype!='read'">
                            <div v-if="item.t=='placeholderhtml'"><span style="color:white">p</span></div>
                            <el-radio v-else @change="whenRadioChange" label="canedit">{{''}}</el-radio>
                        </el-col>
                        <el-col :span="4" v-if="usetype!='read'">
                            <div v-if="item.type!='canedit'||item.t=='placeholderhtml'"><span style="color:white">p</span></div>
                            <el-checkbox title="显示" v-else v-model="item.required"></el-checkbox>
                        </el-col>
                        <el-col :span="4">
                            <el-radio @change="whenRadioChange" label="readonly">{{''}}</el-radio>
                        </el-col>
                        <el-col :span="4">
                            <el-radio @change="whenRadioChange" label="hidden">{{''}}</el-radio>
                        </el-col>
                    </el-row>
                </el-radio-group>
                <div v-if="item.t=='table'" style="font-size:12px;line-height:25px;background-color: rgb(239, 245, 186)">

                    <el-row class="row" style="padding-left: 20px;">
                        表单属性

                        <el-checkbox v-model="item.table_add">
                            <el-tooltip class="item" effect="dark" content="可在表单中添加行" placement="top-start"> <span class="fz12">可添加</span> </el-tooltip>
                        </el-checkbox>
                        <el-checkbox class="fz12" v-model="item.table_edit">
                            <el-tooltip class="item" effect="dark" content="可对表单中之前的数据编辑" placement="top-start">
                                <span class="fz12">可编辑</span></el-tooltip>
                        </el-checkbox>
                        <el-checkbox class="fz12" v-model="item.table_delete">
                            <el-tooltip class="item" effect="dark" content="可对表单中之前的数据进行删除" placement="top-start">
                                <span class="fz12">可删除</span></el-tooltip>
                        </el-checkbox>
                    </el-row>
                    <div v-for=" (item2,index2) in item.son" :key="index2">
                        <el-radio-group style="font-size:13px;display: block;line-height: 18px;" v-model="item2.type">
                            <el-row class="row" :gutter="10" style="margin-top: 0px;
    margin-bottom: 0px;">
                                <el-col :span="7"><span style="margin-left:20px;">{{item2.name}}</span></el-col>
                                <el-col :span="5" v-if="usetype!='read'">
                                    <el-radio @change="whenRadioChange" label="canedit">{{''}}</el-radio>
                                </el-col>
                                <el-col :span="4" v-if="usetype!='read'">
                                    <div v-if="item2.type!='canedit'"><span style="color:white">p</span></div>
                                    <el-checkbox title="显示" v-else v-model="item2.required"></el-checkbox>
                                </el-col>
                                <el-col :span="4">
                                    <el-radio @change="whenRadioChange" label="readonly">{{''}}</el-radio>
                                </el-col>
                                <el-col :span="4">
                                    <el-radio @change="whenRadioChange" label="hidden">{{''}}</el-radio>
                                </el-col>

                            </el-row>
                        </el-radio-group>
                    </div>
                </div>
            </div>

        </div>

        <span slot="footer" class="dialog-footer">
    <el-button @click="EditModalStatus = false">取 消</el-button>
    <el-button type="primary" @click="saveEdit">确 定</el-button>
  </span>
    </el-dialog>

    <el-form-item label="可编辑项目:">
        <span v-for="(item,index) in canEditList" :key="index">
             <span v-if="item.required" style="color:red">*</span>
        {{item.name}}
        <span v-if="item.t=='table'">
            <span v-if="item.table_add">
                 <el-tooltip class="item" effect="dark" content="可在表单中添加行" placement="top-start">
      <span>(可添加)</span>
        </el-tooltip>
        </span>
        <span v-if="item.table_edit"> <el-tooltip class="item" effect="dark" content="可对表单中之前的数据编辑" placement="top-start">
      <span>(可编辑)</span>
        </el-tooltip></span>
        <span v-if="item.table_delete">
                                         <el-tooltip class="item" effect="dark" content="可对表单中之前的数据进行删除" placement="top-start">
      <span>(可删除)</span>
        </el-tooltip></span>
        </span>
        <span v-if="item.t=='table'&&item.soncanedit.length">(
            <span v-for="(item2,index2) in item.soncanedit" :key="index2">
                <span v-if="item2.required" style="color:red">*</span> {{item2.name}}
        <span v-if="item.soncanedit.length-1!=index2">|</span>
        </span>)
        </span>
        <span v-if="canEditList.length-1!=index">|</span>
        </span>
        <span v-if="canEditList.length==0">无</span>
    </el-form-item>

    <el-form-item label="只读项目:">

        <span v-for="(item,index) in readonlyList" :key="index">
                {{item.name}} 
                <span v-if="readonlyList.length-1!=index">|</span>
        </span>
        <span v-if="readonlyList.length==0">无</span>
    </el-form-item>

    <el-form-item label="隐藏项目:">
        <span v-for="(item,index) in hiddenList" :key="index">
                {{item.name}} 
                <span v-if="hiddenList.length-1!=index">|</span>
        </span>
        <span v-if="hiddenList.length==0">无</span>
    </el-form-item>
    
    <el-form-item label="">
        <el-button size="mini" @click="editFormSet" type="primary">编辑表单设置</el-button>
    </el-form-item>

</div>
</template>

<script>
import propsync from 'vue-propsync'

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

import {
    FlowIfStrTest
} from '@/api/flowdesign'
import {
    getFormItemByKey
} from '@/utils/u_flowdesign.js'
import contact from '../../../store/modules/contact';

export default {
    name: 'FormLimit',
    mixins: [propsync],
    components: {},
    props: {
        value: {
            type: Array,
            default: () => {
                return []
            },
            isSync: true
        },
        usetype: {
            type: String,
            default: 'edit'
            //read
        }


    },
    data() {
        return {
            editlist: [],
            EditModalStatus: false,
            canEditList: [],
            readonlyList: [],
            hiddenList: [],

            allcanedit: false,
            allreadonly: false,
            allhidden: false

        }
    },
    watch: {

        sync_value() {
            this.init();
        }

    },
    mounted() {

        this.init();

    },
    computed: {
        ...mapGetters([
            'requireDataList'
        ]),
        ...mapState({
            formSet: state => state.flowdesign.formSet,
        })



    },
    methods: {

        inittable(oldItem, item) {

            if (!oldItem) oldItem = [];

            // item
            console.log('tableItem', getFormItemByKey(this.formSet.list, item.key));

            let tableItem = getFormItemByKey(this.formSet.list, item.key);

            if (!tableItem) {
                return [];
            }
            let tableset = tableItem.options.tableset;

            //    tableItem.options.tableset[].code
            //    tableItem.options.tableset[].name
            //return;

            for (let i = oldItem.length - 1; i >= 0; i--) {
                let ele = oldItem[i];
                let hasfind = false;
                for (let k = 0; k < tableset.length; k++) {
                    const item = tableset[k];

                    if (item.code == ele.key) {
                        hasfind = true;
                        ele.name = item.name;
                        //ele.t = item.code;

                        break;
                    }

                }
                if (!hasfind) {
                    oldItem.splice(i, 1);
                }
            }

            
            

            tableset.forEach(ele => {

                let hasfind = false;

                oldItem.forEach(ele1 => {
                    if (ele1.key == ele.code) {
                        hasfind = true
                    }
                })

                if (!hasfind) {
                    oldItem.push({
                        name: ele.name,
                        key: ele.code,
                        type: null,
                        required: false,
                        t: 'tableItem'
                    })
                }
            })

            return oldItem;

        },

        init() {
            console.log('console.log(this.requireDataList);', this.requireDataList);
            console.log('sync_value1', this.sync_value)

            if (!this.sync_value) {
                this.sync_value = [];
            }

            for (let i = this.sync_value.length - 1; i >= 0; i--) {
                let ele = this.sync_value[i];
                let hasfind = false;
                for (let k = 0; k < this.requireDataList.length; k++) {
                    const item = this.requireDataList[k];
                    // console.log(item.key);
                    // console.log(ele.key);

                    if (item.key == ele.key) {
                        hasfind = true;
                        ele.name = item.name;
                        ele.t = item.type;

                        if (ele.t == 'table') {
                            //if(!ele.son)ele.son=[];
                            ele.son = this.inittable(ele.son, item);
                            console.log('ele.son', ele.son)
                        }

                        break;
                    }

                }
                if (!hasfind) {
                    this.sync_value.splice(i, 1);
                }
            }

            
            

            this.requireDataList.forEach(ele => {

                let hasfind = false;

                this.sync_value.forEach(ele1 => {
                    if (ele1.key == ele.key) {
                        hasfind = true
                    }
                })

                if (!hasfind) {
                    let insert = {
                        name: ele.name,
                        key: ele.key,
                        type: null,
                        required: false,
                        t: ele.type,

                    };
                    if (ele.type == 'table') {
                        insert.son = this.inittable([], ele);
                        insert.table_add = false;
                        insert.table_edit = false;
                        insert.table_delete = false;
                    }
                    this.sync_value.push(insert)
                }
            })
            console.log('sync_value2', this.sync_value);

            this.initdisplaydata();

        },
        whenRadioChange() {

            let caneditnum = 0;
            let readonlynum = 0;
            let hiddennum = 0;
            let listlen = this.editlist.length;
            this.editlist.forEach(ele => {

                switch (ele.type) {
                    case 'canedit':
                        caneditnum++;
                        break;
                    case 'readonly':
                        readonlynum++;
                        break;
                    case 'hidden':
                        hiddennum++;
                        break;
                    default:
                        break;
                }
                if (ele.t == 'table') {
                    if (!!ele.son) {
                        listlen += ele.son.length;
                        ele.son.forEach(ele2 => {
                            switch (ele2.type) {
                                case 'canedit':
                                    caneditnum++;
                                    break;
                                case 'readonly':
                                    readonlynum++;
                                    break;
                                case 'hidden':
                                    hiddennum++;
                                    break;
                                default:
                                    break;
                            }

                        })
                    }
                }

            })
            if (listlen == caneditnum) {
                this.allcanedit = true
            } else {
                this.allcanedit = false
            }

            if (listlen == readonlynum) {
                this.allreadonly = true
            } else {
                this.allreadonly = false
            }

            if (listlen == hiddennum) {
                this.allhidden = true
            } else {
                this.allhidden = false
            }

        },
        whencheckboxChange(value, type) {
            this.editlist.forEach(ele => {
                if (value) {
                    ele.type = type
                    if (ele.t == 'table') {
                        if (!!ele.son) {
                            ele.son.forEach(ele2 => {

                                if (value) {
                                    ele2.type = type;
                                } else {
                                    ele2.type = null;
                                }

                            })
                        }

                    }
                } else {
                    ele.type = null;
                }
            })
            setTimeout(() => {
                this.whenRadioChange();
            }, 100);

            // switch (type) {
            //     case 'canedit':

            //         this.editlist.forEach(ele=>{
            //             ele.type='canedit'
            //         })

            //         break;

            //     default:
            //         break;
            // }

        },
        copyobject(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        initdisplaydata() {

            let canEditList = [];
            let hiddenList = [];
            let readonlyList = [];

            if (!!this.sync_value) {
                this.sync_value.forEach(ele => {

                    let item = this.copyobject(ele);
                    if (item.t == 'table') {
                        item.sonhidden = [];
                        item.soncanedit = [];
                        item.sonreadonly = [];
                        item.son.forEach(ele2 => {

                            if (ele2.type == 'hidden') {

                                item.sonhidden.push(ele2);

                            }

                            if (item.type == 'canedit') {

                                item.soncanedit.push(ele2);

                            }

                            if (item.type == 'readonly') {

                                item.sonreadonly.push(ele2);

                            }

                        })

                    }

                    if (item.type == 'hidden') {

                        hiddenList.push(item);

                    }

                    if (item.type == 'canedit') {

                        canEditList.push(item);

                    }

                    if (item.type == 'readonly') {

                        readonlyList.push(item);

                    }

                })
            }

            this.canEditList = canEditList;
            this.hiddenList = hiddenList;
            this.readonlyList = readonlyList;

        },

        tranname(
            key
        ) {
            for (let i = 0; i < this.requireDataList.length; i++) {
                const ele = this.requireDataList[i];
                if (ele.key == key) {
                    return ele.name;
                }
            }
            return null

        },
        saveEdit() {
            //this.list=JSON.stringify
            this.sync_value = JSON.parse(JSON.stringify(this.editlist));
            this.initdisplaydata();
            this.EditModalStatus = false;

        },

        editFormSet() {

            
            //form-id(key)  :1552049797000_28708; type:canedit/readonly/hidden required;
            

            if (!this.sync_value) {
                this.editlist = [];
            } else {
                this.editlist = JSON.parse(JSON.stringify(this.sync_value));
            }

            this.EditModalStatus = true;
            

        }
    }
}
</script>

<style scoped>
.formtabe {
    line-height: 32px;
}

.row {
    margin-top: 10px;
    margin-bottom: 12px;
    padding-bottom: 6px;
    font-weight: 600;
    border-bottom: 1px solid #e2e1e1;
}
</style>
