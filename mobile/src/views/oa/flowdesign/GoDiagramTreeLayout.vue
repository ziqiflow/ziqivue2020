<template>
  <div/>
</template>

<script>
import {loadJs} from '@/utils/index.js'
// import * as go from '@/vendor/go-debug.js'
//const $ = window.go.GraphObject.make

export default {
  name: '',
  props: ['modelData'],
  props: {
    
    modelData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    angle: {
      type: Number,
      default: () => {
        return 0
      }
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false
      }
    },

  },
  data() {
    return {
      diagram: null
    }
  },
  computed: {},
  watch: {
    modelData: function(val) {
      this.updateModel(val)
    }
  },
  mounted() {

    if(!window.go){
      //setTimeout(() => {
            loadJs(window.baseURL+'/dist/lib/go-js/go-debug.js').then(()=>{
      this.init();
    })
        
      //}, 4000);


    }else{
      this.init();
    }

  },
  methods: {

    init:function(){
    // loadJs('libs/go-debug.js');
    console.log('window.go')
    console.log(window.go)
    const $ = window.go.GraphObject.make
    const self = this
    const myDiagram =
            $(window.go.Diagram, this.$el,
              {
                initialContentAlignment: window.go.Spot.Center,
                allowZoom: true,
                
                isReadOnly: this.readonly,
                "toolManager.mouseWheelBehavior": window.go.ToolManager.WheelZoom,
                'undoManager.isEnabled': true,
                // Model ChangedEvents get passed up to component users
                'ModelChanged': function(e) {
                 // console.log('ModelChanged', myDiagram.model.toJson());
                  self.$emit('model-changed', e)
                  
                 
                },
                'ChangedSelection': function(e) {
                  self.$emit('changed-selection', e)
                }
              })
    myDiagram.nodeTemplate =
            $(window.go.Node, 'Auto',
                new window.go.Binding("location", "loc", window.go.Point.parse).makeTwoWay(window.go.Point.stringify),
                
              $(window.go.Shape, 'RoundedRectangle',
                {
                  fill: 'white',
                  strokeWidth: 0,
                  portId: '',
                  fromLinkable: false,
                  toLinkable: false,
                  cursor: 'pointer'
                },
                new window.go.Binding('fill', 'color')),
              $(window.go.TextBlock,
                { margin: 8, editable: true },
                new window.go.Binding('stroke', 'stroke'),
                new window.go.Binding('text').makeTwoWay())
            )
    myDiagram.linkTemplate =
            $(window.go.Link,
              {
              },
              $(window.go.Shape),
              $(window.go.Shape, { toArrow: 'OpenTriangle' })
            )
    this.diagram = myDiagram
    this.updateModel(this.modelData)
    },
    model: function() {
      return this.diagram.model
    },
    updateModel: function(val) {
      console.log('updateModel',val);

      if(!window.go)return;
      console.log(val instanceof window.go.Model);
            console.log(window.go);
      // No GoJS transaction permitted when replacing Diagram.model.
      if (val instanceof window.go.Model) {
        this.diagram.model = val
      } else {
        const m = new window.go.GraphLinksModel()
        if (val) {
          for (const p in val) {
            m[p] = val[p]
          }
        }
        this.diagram.model = m
      }
    },
    updateDiagramFromData: function() {
      this.diagram.startTransaction()
      // This is very general but very inefficient.
      // It would be better to modify the diagramData data by calling
      // Model.setDataProperty or Model.addNodeData, et al.
      this.diagram.updateAllRelationshipsFromData()
      this.diagram.updateAllTargetBindings()
      this.diagram.commitTransaction('updated')
    }
  }
}
</script>

<style>

</style>
