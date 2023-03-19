<template>
<div ref="iframevue" :style="{ height: wrapperHeight + 'px' }" class="iframevue">
    <vue-friendly-iframe style="height: 100%;" :src="iframedata.src" @load="onLoad" @document-load="onDocumentLoad"></vue-friendly-iframe>
</div>
</template>

<script>
import VueFriendlyIframe from 'vue-friendly-iframe';
import Lodash from 'lodash'

export default {
    name: 'Deptmanage',
    components: {
        vueFriendlyIframe: VueFriendlyIframe
    },
    data() {
        return {
            wrapperHeight: null,
            iframedata: {
                src: 'http://www.baidu.com'
            },
            error: null,
            columns: [{
                text: '部门名称',
                value: 'name',
                width: '400px'
            }]
        }
    },

    computed: {
    },

    methods: {

        onDocumentLoad() {
            console.log('onDocumentLoad');
        },
        onLoad() {
            console.log('onLoad');
        }

    },

    activated() {
        console.log('activated')
    },
    mounted() {
        console.log('mounted')
        this.wrapperHeight = this.$refs.iframevue.parentElement.offsetHeight;
        const that = this
        window.onresize = _.debounce(() => {
            //console.log("onresize:" + that.mainHeight)
            //that.mainHeight = document.body.clientHeight
            that.wrapperHeight = that.$refs.iframevue.parentElement.offsetHeight;
        }, 400)

        
        // setTimeout(() => {
        //     console.log(this.deptTree);
        // }, 1000);
    }
}
</script>

<style scoped>
.iframevue {
    height: 100%;
}

.iframevue iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
