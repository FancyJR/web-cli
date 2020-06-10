<script>
import Upload from '@/components/upload/index.vue'
import Pagination from '@/components/Pagination'
export default {
  name: 'DialogTableCheckGroup',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    radio: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      total: 4,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      formModel: {
        dept_id: '',
        user_name: ''
      },
      tableData: [],
      haveSelection: [],
      isVisible: false,
      department: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '停用'
        }
      ],
      role: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '停用'
        }
      ],
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'dept_name'
      },
      mineStatusValue: [],
      name: ''
    }
  },
  components: {
    Upload,
    Pagination
  },
  mounted() {
    this.getList()
    this.getDepart()
  },
  watch: {
    visible(val) {
      this.centerDialog(val)
    }
  },
  methods: {
    onSubmit() {
      this.getList()
    },
    resetForm(formName) {
      this.formModel = {
        dept_id: '',
        user_name: ''
      }
    },
    getList() {
      this.loading = true
      this.$store
        .dispatch('TeacherManage/ServiceTeacher/getQuery', {
          page: this.listQuery,
          ...this.formModel
        })
        .then(res => {
          let data = res.data.list
          this.total = res.data.page.totalCount
          this.listQuery.pageNum = res.data.page.pageNum
          this.listQuery.pageSize = res.data.page.pageSize
          this.tableData = data
          this.$nextTick(() => {
            this.toggleSelection()
          })
          this.loading = false
        })
    },
    centerDialog(v) {
      this.haveSelection = this.multipleSelection
      this.isVisible = v
      this.$nextTick(() => {
        this.toggleSelection()
      })
    },
    toggleSelection() {
      if (this.multipleSelection.length > 0 && this.$refs.table) {
        this.multipleSelection.forEach(row => {
          this.tableData.forEach((rows, index) => {
            if (row.user_id === rows.user_id) {
              this.$refs.table.toggleRowSelection(
                this.$refs.table.data[index],
                true
              )
            }
          })
        })
      } else {
        this.$refs.table && this.$refs.table.clearSelection()
      }
    },
    handleSelect(selection, row) {
      let result = selection.some(item => {
        if (item.user_id === row.user_id) {
          return true
        }
      })
      if (result) {
        if (this.radio) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(row, true)
          this.haveSelection = [
            { user_id: row.user_id, user_real_name: row.user_real_name }
          ]
        } else {
          this.haveSelection.push(row.user_id)
        }
      } else {
        if (this.radio) {
          this.haveSelection = []
        } else {
          this.haveSelection.forEach((v, i) => {
            if (v === row.user_id) {
              this.haveSelection.splice(i, 1)
            }
          })
        }
      }
    },
    handleSelectAll(data) {
      if (data.length > 0) {
        if (this.haveSelection.length > 0) {
          data.forEach((items, index) => {
            this.haveSelection.forEach(item => {
              if (!item.includes(items.user_id)) {
                this.haveSelection.push(items.user_id)
              }
            })
          })
        } else {
          data.forEach((items, index) => {
            this.haveSelection.push(items.user_id)
          })
        }
      } else {
        this.tableData.forEach(item => {
          this.haveSelection.forEach((items, index) => {
            if (item.user_id === items) {
              this.haveSelection.splice(index, 1)
            }
          })
        })
      }
      this.toggleSelection()
    },
    cancel() {
      this.$emit('off', false)
    },
    handleSure() {
      this.$emit('callback', this.haveSelection)
      this.$emit('off', false)
    },
    getDepart() {
      this.$store
        .dispatch('TeacherManage/ServiceTeacher/getDepart')
        .then(res => {
          this.setDepartRes(res)
        })
    },
    // 部门树数据
    setDepartRes(data) {
      function toTree(v) { // eslint-disable-line
        let result = []
        if (!Array.isArray(v)) {
          return result
        }
        v.forEach(item => {
          delete item.children
        })
        let map = {}
        v.forEach(item => {
          map[item.dept_id] = item
        })
        v.forEach(item => {
          let parent = map[item.dept_pid]
          if (parent) {
            ;(parent.children || (parent.children = [])).push(item)
          } else {
            result.push(item)
          }
        })
        return result
      }
      let newData = data && toTree(data)
      this.data = newData
    },
    handleNodeClick(data) {
      this.formModel.dept_id = data.dept_id
      this.mineStatusValue = [data.dept_name]
      this.name = data.dept_name
      this.$refs.mySelect.handleClose()
    }
  }
}
</script>
<template src="./index.html"></template>
<style src="./index.scss" lang="scss"></style>
