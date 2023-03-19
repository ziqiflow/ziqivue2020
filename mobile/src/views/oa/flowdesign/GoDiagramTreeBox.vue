<template>
  <div/>
</template>

<script>
// import {} from '@/libs/util.js'


import {loadJs} from '@/utils/index.js'

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
    }
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
    loadJs(window.baseURL+'/dist/lib/go-js/go-debug.js').then(()=>{
      this.init();
    })
    }else{
      this.init();
    }
  
  },
  methods: {
    init:function(){

      const $ = window.go.GraphObject.make

        console.log(window.go)
    const self = this
    const myDiagram =
            $(window.go.Diagram, this.$el,
              {
                initialContentAlignment: window.go.Spot.Center,
                allowZoom: true,
                
                isReadOnly: true,
                layout: $(window.go.TreeLayout, { angle: this.angle, arrangement:
                window.go.TreeLayout.ArrangementHorizontal
                }),
                'undoManager.isEnabled': true,
                 "toolManager.mouseWheelBehavior": window.go.ToolManager.WheelZoom,
                // Model ChangedEvents get passed up to component users
                'ModelChanged': function(e) {
                  self.$emit('model-changed', e)
                },
                'ChangedSelection': function(e) {
                  self.$emit('changed-selection', e)
                }
              })
    myDiagram.nodeTemplate =
            $(window.go.Node, 'Auto',
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
                   $(window.go.Panel, "Table",
          {
             maxSize: new window.go.Size(230, 999),
            margin: new window.go.Margin(3, 3, 0, 3),
            defaultAlignment: window.go.Spot.Left
          },
                $(window.go.RowColumnDefinition, { column: 5, width: 4 }),
              $(window.go.TextBlock,
                { margin: new window.go.Margin(3, 0, 0, 6) ,row: 0, column: 0,stroke:'#ff6600', font: "bold 10pt sans-serif"},
                new window.go.Binding('stroke', 'stroke'),
                new window.go.Binding('text','title').makeTwoWay()),
                 $(window.go.TextBlock,
                { margin:new window.go.Margin(3, 0, 0, 6), editable: true ,row: 1, column: 0},
                new window.go.Binding('stroke', 'stroke'),
                new window.go.Binding('text','to')),
         
                $(window.go.TextBlock,
                { margin:new window.go.Margin(3, 0, 0, 6), editable: true ,row: 2, column: 0},
                new window.go.Binding('stroke', 'stroke'),
                new window.go.Binding('text','dealtype').makeTwoWay()),

                                $(window.go.TextBlock,
                { margin:new window.go.Margin(3, 0, 0, 6), editable: true ,row: 3, column: 0},
                new window.go.Binding('stroke', 'stroke'),
                new window.go.Binding('text','PreFunName').makeTwoWay()),

                
                $(window.go.TextBlock,
                { margin: new window.go.Margin(3, 0, 0, 6), editable: true ,row: 4, column: 0},
                new window.go.Binding('stroke', 'stroke'),
                new window.go.Binding('text','content').makeTwoWay())
                )
            )
    myDiagram.linkTemplate =
            $(window.go.Link,
              {
                // relinkableFrom: true, relinkableTo: true
                
                curve: window.go.Link.Bezier,
                adjusting: window.go.Link.Stretch,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true
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
       if(!window.go)return;
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
