/**
 * Created by zhuh on 2018/1/8.
 */
// 构造插件
import Pagination from './src/pagination'
const msgpagination = {
  install: (Vue) => {
    Vue.component('hxMsgpagination', Pagination)
  }
}

export default msgpagination
