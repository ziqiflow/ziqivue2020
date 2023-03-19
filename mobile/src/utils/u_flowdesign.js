export const getrequireDataList = (widgetForm) => {
  let requireDataList = []
  if (widgetForm.list) {
    requireDataList = finddatalist(widgetForm.list)
  }
  return requireDataList
}


export const getFormItemByKey=(list,key)=>{

  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    // console.log('ele',ele);
    if (ele.type == 'grid' && !!ele.columns) {
      if(ele.columns.length){
        for (let k = 0; k < ele.columns.length; k++) {
          const elek = ele.columns[k];
          if(elek.list.length){
            let back= getFormItemByKey(elek.list,key)
            if(!!back)return back;
          }
        }
      }
    }else{
    //console.log({ name: ele.name, key: ele.key, model: ele.model, index: ele.keyindex})
      //ele.key==
      if(ele.key==key){
        return ele;
      }
 
    }
  }

  return null;
}


export const finddatalist = (list) => {
  let datalist = []
  // console.log('list',list);
  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    // console.log('ele',ele);
    if (ele.type == 'grid' && !!ele.columns) {
      if(ele.columns.length){
        for (let k = 0; k < ele.columns.length; k++) {
          const elek = ele.columns[k];
          if(elek.list.length){
            datalist = datalist.concat(finddatalist(elek.list))
          }
        }
      }
    }else{
    //console.log({ name: ele.name, key: ele.key, model: ele.model, index: ele.keyindex})
      
      
      let type=ele.type;

      //if(type=='placeholderhtml')continue;


      if(!!ele.options.componentName){
          type=ele.options.componentName;
      }

      // if(ele.type=='select'){
      // }

      datalist.push(
        { name: ele.name, 
          key: ele.key, 
          model: ele.model, 
          index: ele.keyindex ,
          type:type
        }
      )
    }
   
  }
  return datalist
}

export const tranResultData = (result, datalist) => {
}



export const initFormSetItem=(item)=>{

  if(!item.rules)item.rules=[];

  //item.options.defaultValue;
      
   if(Object.keys(item.options).indexOf('options')>=0&&item.options.remote==false){

       let vallist=item.options.options.map(v=>{
           return v.value;
       })

       
       console.log(item.name);
       if(!!item.options.defaultValue){
          if(item.options.defaultValue.constructor==Array){
              for (let k = item.options.defaultValue.length-1; k >=0; k--) {
                  const ele = item.options.defaultValue[k];
                  if(!vallist.some(v=>{
                      return v==ele
                  })){
                          item.options.defaultValue.splice(k,1);
                  }
              }
          }

            if(item.options.defaultValue.constructor==String){
                  if(!vallist.some(v=>{
                      return v==item.options.defaultValue
                  })){
                          item.options.defaultValue=null
                  }
            }
        }
   }

   console.log('调整后的表单设置',item);


}

export const tran_msgstatus=(status)=>{

  const statuslist = [{
    n: '待处理',
    v: 1
  },
  {
    n: '取消',
    v: 2
  },
  {
    n: '撤回',
    v: 8
  },
  {
    n: '处理结束',
    v: 3
  },
  {
    n: '或签结束',
    v: 4
  },
  {
    n: '消息模式',
    v: 5
  },
  {
    n: '抄送模式',
    v: 6
  },
  {
    n: '结束s',
    v: 7
  }
  ]
  for (let i = 0; i < statuslist.length; i++) {
    const element = statuslist[i]
    if (element.v == status) {
      return element.n
    }
  }
  return '无'

}

export const tran_dealtype = (dealtype) => {
  const dealtypelist = [{
    n: '通知',
    v: 'message'
  },
  {
    n: '会签',
    v: 'andsign'
  },
  {
    n: '或签',
    v: 'orsign'
  }
  ]
  for (let i = 0; i < dealtypelist.length; i++) {
    const element = dealtypelist[i]
    if (element.v == dealtype) {
      return element.n
    }
  }
  return '无'
}
export const creatDiagramData = (funlist,layoutset=[],nowfunid=null,
  
  ) => {

  const getloc=function(key){

    for (let l = 0; l < layoutset.length; l++) {
      const ele = layoutset[l];
      if(ele.key==key){
        console.log('ele.loc',ele.loc);
        // if(isVertical){
        //   let arr= ele.loc.split(' ');
        //   return arr[1]+' '+arr[0];
        // }
        return ele.loc;
      }
    }
    return '0 100'

  }
  console.log('nowfunid',nowfunid);

  const nodeDataArray = []
  const linkDataArray = []
  const hasInNodeData = function(nodeDataArray, key) {
    for (let k = 0; k < nodeDataArray.length; k++) {
      const arr = nodeDataArray[k]
      if (arr.key == key) {
        return true
      }
    }
    return false
  }

  const add_funid = function(funid, fun) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(id => {
        if (id) {
          linkDataArray.push({
            from: fun.id,
            to: id
          })
        }
      })
    }
  }

  const add_sonfunid = function(funid, fun) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(ele => {
        if (ele.v) {
          linkDataArray.push({
            from: fun.id,
            to: ele.v
          })

          if (!hasInNodeData(nodeDataArray, ele.v)) {
            nodeDataArray.push({
              loc:getloc(ele.v),
              key: ele.v,
              text: '【外部流程】' + ele.n,
              color: '#515a6e',
              stroke: 'white'
              // fill: "white"
            })
          }
        }
      })
    }
  }

  for (let i = 0; i < funlist.length; i++) {
    const fun = funlist[i]


    nodeDataArray.push({
      loc:getloc(fun.id),
      key: fun.id,
      stroke: (nowfunid==fun.id?'white':'black'),
      text: fun.name + (fun.is_start ? '' : '(' + tran_dealtype(fun.dealtype) + ')')+(nowfunid==fun.id?'[当前位置]':''),
      color: (nowfunid==fun.id?'#f704c2':(fun.is_start ? 'orange' : 'lightblue'))
    })
    
    if (!fun.is_start && fun.dealtype == 'message') {
      
      
      continue
    }

    for (let k = 0; k < fun.btnGroup.length; k++) {
      const btn = fun.btnGroup[k]

      if (fun.dealtype == 'andsign' && k != 0) {
        
        break
      }

      add_funid(btn.defaultFunId, fun)


      add_sonfunid(btn.defaultSonFlowId, fun)


      console.log(btn.handler)

      if (!!btn.handler && !!btn.handler.funId) {
        add_funid(btn.handler.funId, fun)

      }

      if (!!btn.handler && !!btn.handler.SonFlowId) {
        add_sonfunid(btn.handler.SonFlowId, fun)

      }

      btn.NextFun.forEach(NextFun => {
        if (NextFun.funId) {
          add_funid(NextFun.funId, fun)

        }

        if (NextFun.SonFlowId) {
          add_sonfunid(NextFun.SonFlowId, fun)

        }
      })
    }
  }

  return { linkDataArray, nodeDataArray }
}
export const creatDeptTree = (list, parent_id) => {
  const tree = []
  for (let i = 0; i < list.length; i++) {
    const ele = list[i]
    // ele.title=ele.name;
    ele.expand = true

    if (ele.parent_id == parent_id) {
      console.log(tree)
      ele.children = creatDeptTree(list, ele._uuid)
      tree.push(ele)
    }
  }
  return tree
}

