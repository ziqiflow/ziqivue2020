<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App'
}
</script>

<style>
.pd5{
  padding: 5px
}
.pd10{
  padding: 10px
}
.mg10{
  margin: 10px;
}
.mg-t5{
  margin-top: 5px
}
.mg-b5{
  margin-bottom: 5px
}
.mg-r5{
  margin-right: 5px;
}

.pd-l{
  padding-left: 10px;
}
.pd-r{
  padding-right: 10px;
}
.pd-t{
  padding-top: 10px;
}
.pd-b{
  padding-bottom: 10px;
}
.width100{
  width: 100%;
}
.fz15{
  font-size: 15px;
}
.fz14{
  font-size: 14px;
}
.fz13{
  font-size: 13px;
}
.fz12{
  font-size: 12px;
}
.pointer{
  cursor: pointer;
}
.text-right{
  text-align: right;
}

.table { 
  border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    margin-bottom: 10px;
    font-size: 13px;
}

.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    padding: 4px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
}

.table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
    border: 1px solid #ddd;
}

.table-bordered {
    border: 1px solid #ddd;
}
.table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
    border: 1px solid #ddd;
}

hr{
     background-color: #c1c1c1;
    height: 1px !important;
    border: none;
}

.pointer{
  cursor: pointer;
}

.clear{
  clear: both;
}

.el-table .emergency_row,
.el-table .el-table__row--striped.emergency_row td {
    background: #ffe598 !important;
    color: #5a5a5a;
}


</style>
