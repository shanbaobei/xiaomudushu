<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width:200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width:200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :tabel="item.label +'(' + item.num + ')'"
          :value="item.label"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @clear="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left:5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left:5px"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width:100%"
        @sort-change="sortChange"
      >
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          algin="center"
          width="80"
        />
        <el-table-column
          label="书名"
          width="150"
          align="center"
        >
          <template slot-scope="{row:{titleWrapper}}">
            <span v-html="titleWrapper" />
          </template>
        </el-table-column>
        <el-table-column
          label="作者"
          width="150"
          align="center"
        >
          <template slot-scope="{row:{authorWrapper}}">
            <span v-if="authorWrapper" />
          </template>
        </el-table-column>
        <el-table-column
          label="出版社"
          prop="publisher"
          width="150"
          align="center"
        />
        <el-table-column
          label="分类"
          prop="categoryText"
          width="100"
          align="center"
        />
        <el-table-column
          label="语言"
          prop="language"
          align="center"
        />
        <el-table-column
          v-if="showCover"
          label="封面"
          width="150"
          align="center"
        >
          <template slot-scope="{scope}">
            <a :href="scope.row.cover" target="_blank">
              <img
                :src="scope.row.cover"
                style="width:120px;height:180px"
              >
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-table />
    <pagination
      :total="0"
    />

  </div>
</template>
<script>
import Pagination from '../../components/Pagination/index'
import waves from '../../directive/waves/waves'
import { getCategory, listBook } from '../../api/book'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      listQuery: {},
      showCover: false,
      categoryList: [],
      list: []

    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    parseQuery() {
      const listQuery = {
        page: 1,
        pageSize: 20
      }
      this.listQuery = { ...listQuery, ...this.listQuery }
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      }
    },
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(response => {
        const { list } = response.data
        this.list = list
        this.listLoading = false
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      })
    },
    sortChange(data) {
      console.log('sortChange', data)
    },
    getCategoryList() {
      getCategory().then(response => {
        this.categoryList = response.data
      })
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleFilter() {
      console.log('handleFilter', this.listQuery)
      this.getList()
    },
    changeShowCover(value) {
      this.showCover = value
    }
  }
}
</script>
