<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.searchParams.search_like_name" :placeholder="$t('user.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.searchParams.search_like_phone" :placeholder="$t('user.phone')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      :key="key"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column v-for="header in tableHeader" :key="header.key" :label="header.label" :sortable="header.sortable" :prop="header.key">
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="scope">
          <el-button
            v-waves
            size="mini"
            @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button
            v-waves
            size="mini"
            @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-waves
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页页面 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- 添加或修改页面 -->
    <el-dialog :title=" $t(dialogStatus)" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('user.name')" prop="name">
          <el-input v-model="temp.name" placeholder="Please input name" />
        </el-form-item>
        <el-form-item :label="$t('user.phone')" prop="phone">
          <el-input v-model="temp.phone" placeholder="Please input phone" />
        </el-form-item>
        <el-form-item :label="$t('entity.createTime')" prop="createTime">
          <el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?create():update()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

const HEADER = [{
  label: '名称',
  key: 'name'
}, {
  label: '电话',
  key: 'phone'
}, {
  label: '创建日期',
  key: 'createTime',
  sortable: true
}]

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_NO = 1
const DEFAULT_TEMP = {
  id: undefined,
  name: '',
  phone: '',
  createTime: new Date()
}

import Pagination from '@/components/Pagination'
import { fetchList, del, create, update } from '@/api/sys/user'
import waves from '@/directive/waves' // 按钮效果
import { formatDate } from '@/utils/commonUtils'

export default {
  directives: { waves },
  name: 'UserManager',
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      currentRow: null, // 选中行
      key: 1, // table key
      total: 0,
      listQuery: {
        pageNumber: DEFAULT_PAGE_NO, // current pageno 当前页码
        pageSize: DEFAULT_PAGE_SIZE, // pageSize 页面大小
        searchParams: {
          search_like_phone: null,
          search_like_name: null
        },
        sorts: {
          createTime: 'desc' // default sort by createTime 默认根据创建时间排序
        }
      },
      tableHeader: HEADER,
      tableData: [],
      // 添加或修改时的数据
      dialogStatus: '',
      dialogFormVisible: false, // 表单默认不显示
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }]
      },
      temp: DEFAULT_TEMP
    }
  },

  /**
   * 页面创建完后调用
   * */
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow
    },
    /**
     * 获取数据
     */
    getList() {
      fetchList(this.listQuery).then(response => {
        this.tableData = response.items
        this.total = response.total
      })
    },

    /**
     * 重置表单
     */
    resetTemp() {
      this.temp = DEFAULT_TEMP
    },

    /**
     * 新增
     */
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    create() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime = formatDate(new Date())
          create(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },

    /**
     * 修改
     * @param index
     * @param row
     */
    handleUpdate(index, row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 修改
     * @param index
     * @param row
     */
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(this.temp).then(responses => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    /**
     * 删除
     * @param index
     * @param row
     */
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then(responses => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },

    /**
     * 查找
     */
    handleFilter() {
      this.listQuery.pageNumber = DEFAULT_PAGE_NO
      this.getList()
    }
  }
}
</script>

