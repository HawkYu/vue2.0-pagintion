### 分页组件

### 基本用法
<hx-msgpagination :currentPage="pageData.currentPage" :totalPage="pageData.totalPage" @getdata="getData"></hx-msgpagination>

### 参数说明
pageData: {totalPage: 0, currentPage: 0},

currentPage: 当前页
totalPage: 总条数
getdata: 跳转页码方法

可设置每页显示条数

  