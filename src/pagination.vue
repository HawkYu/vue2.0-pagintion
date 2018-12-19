<template>
  <div class="el-pagination">
    <div style="display:inline-block;height:28px;line-height:28px;float:left;">
      <span class="el-pagination__total">共 {{this.totalPage}} 条</span>
    </div>
    <div style="display:inline-block;float:right;margin-right:16px;height:28px;line-height:28px;">
      <div class="pershow" style="display:inline-block">
        <span>每页显示</span>
        <select class="page-select" @change="SelectPageSize" v-model="pageSize">
          <option v-for="(size,index) in pageSizeArray" :value="size">{{ size }}</option>
        </select>
        <span>条</span>
      </div>
      <button type="button" @click="showPrevPage" :class="['btn-prev', { disabled: this.currentPage <= 1 }]"><</button><ul class="el-pager" @click="onPagerClick">
          <li class="number" :class="{ active: currentPage === 1 }">1</li>
          <li
            class="el-icon more btn-quickprev"
            :class="[quickprevIconClass]"
            v-if="showPrevMore"
            @mouseenter="quickprevIconClass = 'el-icon-d-arrow-left'"
            @mouseleave="quickprevIconClass = 'el-icon-more'">
          </li>
          <li v-for="item in pagers" class="number" :class="{ active: currentPage === item }">{{item}}</li>
          <li
            class="el-icon more btn-quicknext"
            :class="[quicknextIconClass]"
            v-if="showNextMore"
            @mouseenter="quicknextIconClass = 'el-icon-d-arrow-right'"
            @mouseleave="quicknextIconClass = 'el-icon-more'">
          </li>
          <li
            :class="{ active: currentPage === pageCount }"
            class="number"
            v-if="pageCount > 1">{{ pageCount }}
          </li>
      </ul><button type="button" @click="showNextPage" :class="['btn-next', { disabled: currentPage >= pageCount }]">></button>
      <div class="paginationJump">
        <input ref="jumppage" class="jumppage" />
        <input value="GO" type="button"  @click="showJumpPage" class="go" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showPrevMore: false,
      showNextMore: false,
      quicknextIconClass: 'el-icon-more',
      quickprevIconClass: 'el-icon-more',
      pageSize: this.pageSizeArray[0]
    }
  },
  props: {
    // table的配置,具体见README.md
    text: {
      type: String,
      default: ''
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pageSizeArray: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    totalPage: {
      type: Number,
      default: 0
    },
    selectPage: {
      type: Number,
      default: 0
    }
  },
  watch: {
    showPrevMore (val) {
      if (!val) {
        this.quickprevIconClass = 'el-icon-more'
      }
    },
    showNextMore (val) {
      if (!val) {
        this.quicknextIconClass = 'el-icon-more'
      }
    }
  },
  computed: {
    pageCount () {
      if (typeof this.totalPage === 'number') {
        return Math.ceil(this.totalPage / this.pageSize)
      } else if (typeof this.pageCount === 'number') {
        return this.pageCount
      }
      return null
    },
    pagers () {
      const pagerCount = 7
      const currentPage = Number(this.currentPage)
      const pageCount = Number(this.pageCount)
      
      let showPrevMore = false
      let showNextMore = false

      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - 2) {
          showPrevMore = true
        }
        if (currentPage < pageCount - 5) {
          showNextMore = true
        }
      }

      const array = []
      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2)
        for (let i = startPage; i < pageCount; i++) {
          array.push(i)
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i)
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i)
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i)
        }
      }

      this.showPrevMore = showPrevMore
      this.showNextMore = showNextMore

      return array
    }
  },
  mounted () {
  },
  methods: {
    onPagerClick: function (event) {
      this.$refs.jumppage.value = ''
      const target = event.target
      if (target.tagName == 'UL') {
        return
      }
      let newPage = Number(target.textContent)
      const pageCount = this.pageCount
      const currentPage = this.currentPage
      if(newPage == 0){
        if(target.getAttribute('class') == 'el-icon more btn-quicknext el-icon-d-arrow-right'){
          newPage = pageCount-5
          this.$emit('getdata', newPage)
        }
        if(target.getAttribute('class') == 'el-icon more btn-quickprev el-icon-d-arrow-left'){
          newPage = 2
          this.$emit('getdata', newPage)
        }
      }else{
        if (newPage != currentPage) {
          this.$emit('getdata', newPage)
        }
      }
    },
    showPrevPage: function () {
      this.$refs.jumppage.value = ''
      if (this.currentPage > 1) {
        this.$emit('getdata', this.currentPage-1)
      }
    },
    showNextPage: function () {
      this.$refs.jumppage.value = ''
      if (this.currentPage < this.pageCount) {
        this.$emit('getdata', this.currentPage + 1)
      }
    },
    showJumpPage: function () {
      const target = this.$refs.jumppage
      let newPage = Number(this.$refs.jumppage.value)
      if (newPage > 0) {
        if (newPage > this.pageCount) {
          newPage = this.pageCount
          target.value = this.pageCount
        }
        this.$emit('getdata', newPage)
      }
    },
    SelectPageSize: function () {
      this.$emit('getdata', 1, this.pageSize)
    }
  }
}
</script>
<style>
.el-pagination{
    white-space: nowrap;
    padding: 20px 0;
    color: #475669;
    margin: 0 auto;
    border-bottom: 1px solid #dedede;
    background-color: #f5f5f5;
    height: 68px;
    margin-top: -14px;
    vertical-align: middle;
}
.el-pagination__total{
    margin-left: 16px;
}
.pershow select{
  -webkit-appearance: menulist;
}
.page-select{
  width: 50px;
  padding: 0 0 0 8px;
  margin: 0 5px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 13px;
}
.el-pager{
    user-select: none;
    list-style: none;
    display: inline-block;
    vertical-align: top;
    padding: 0;
    margin: 0;
}
.el-pager li.active {
    border-color: #0094F2;
    background-color: #0094F2;
    color: #fff;
    cursor: default;
}
.el-pager li {
    padding: 0 4px;
    border: 1px solid #D3DCE6;
    border-right: 0;
    background: #fff;
    vertical-align: top;
    display: inline-block;
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    margin: 0;
}
.el-pagination button.disabled {
    color: #99a9bf;
    background-color: #fff;
    cursor: not-allowed;
}
.el-pagination .btn-next {
    border-radius: 0 2px 2px 0;
    border-left: 0;
}
.el-pagination .btn-prev, .el-pagination .btn-next {
    background: center center no-repeat;
    background-size: 16px;
    background-color: #fff;
    cursor: pointer;
    margin: 0;
    color: #99a9bf;
    border: 1px solid #D3DCE6;
}
.el-pagination .btn-prev {
    border-radius: 2px 0 0 2px;
    border-right: 0;
    color: #585A60;
}

.el-pagination button {
  border: 1px solid #D3DCE6;
  border: none;
  padding: 0 6px;
  background: transparent;
}
.el-pagination span, .el-pagination button {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
}
.paginationJump{
  display: inline-block;
  font-weight: 500;
}
.jumppage{
  border: 1px solid #D3DCE6;
  border-radius: 3px;
  width: 50px;
  text-align: center;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
}
.go{
  vertical-align: top;
  background: #0094F2;
  border-radius: 2px;
  color: #FFFFFF;
  width: 40px;
}
</style>