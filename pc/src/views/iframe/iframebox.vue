<template>
<div ref="iframevue" :style="{ height: wrapperHeight + 'px' }" class="iframevue">
    <vue-friendly-iframe v-if="!!iframedata.src" style="height: 100%;" :src="iframedata.src" @load="onLoad" @document-load="onDocumentLoad"></vue-friendly-iframe>
</div>
</template>

<script>

import VueFriendlyIframe from 'vue-friendly-iframe';
import Lodash from 'lodash'

export default {
    name: 'Deptmanage',
    props: ['url'],
    components: {
        vueFriendlyIframe: VueFriendlyIframe
    },
    data() {
        return {
            wrapperHeight: null,
            iframedata: {
                src: null
            }
        }
    },

    methods: {
        onDocumentLoad() {
            console.log('onDocumentLoad');
        },
        onLoad() {
            console.log('onLoad');
        }
    },
    destroyed(){
        window.onresize=null;
    },
    mounted() {
        //   console.log('mounted')
        // console.log('url',this.url);

        if (!!this.url) this.iframedata.src = this.url;
        this.wrapperHeight = this.$refs.iframevue.parentElement.offsetHeight;

        const that = this
        window.onresize = _.debounce(() => {
            console.log("onresize:")
            that.wrapperHeight = that.$refs.iframevue.parentElement.offsetHeight;
        }, 400)

    }
}
</script>

<style>
.iframevue {
    height: 100%;
}

.iframevue iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
