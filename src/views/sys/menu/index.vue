<template>
  <div class="app-container">
    <div class = "custom-tree-container">
      <div class="block">
        <div class="filter-container">
          <el-input placeholder="输入关键字进行过滤"  class="filter-item" v-model="filterText"> </el-input>
        </div>
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
          >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(data)">
                新增子菜单
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="block">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('menu.parentId')" prop="parentId">
            <el-input v-model="temp.parentId" placeholder="Please input parent id" readonly/>
          </el-form-item>
          <el-form-item :label="$t('menu.label')" prop="label">
            <el-input v-model="temp.label" placeholder="Please input label" />
          </el-form-item>
          <el-form-item :label="$t('menu.path')" prop="path">
            <el-input v-model="temp.path" placeholder="Please input path" />
          </el-form-item>
          <el-form-item :label="$t('menu.sort')" prop="path">
            <el-input v-model="temp.sort" placeholder="Please input sort" />
          </el-form-item>
          <el-form-item :label="$t('entity.createTime')" prop="createTime">
            <el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?create():update()">{{ $t('table.confirm') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/sys/menu'
let id = 1000
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }]
      },
      temp: {},
      filterText: '',
      data: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList().then(response => {
        this.data = response
      })
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  name: 'MenuManager'
}
</script>

<style scoped>
  .custom-tree-container {
    display: flex;
    display: -webkit-flex;
  }
  .block {
    flex: 1;
    padding: 8px 24px 24px;
  }
  .block:first-child {
    flex-grow: 1;
    border-right: 1px solid #eff2f6;
  }
  .block:last-child {
    flex-grow: 2;
  }
  .custom-tree-node {
    flex: 1;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
