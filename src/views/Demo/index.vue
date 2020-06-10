<script>
import Pagination from '@/components/Pagination'
import Upload from '@/components/upload/index'
import { mapState } from 'vuex'
import { url } from '../../../config'

const UPLOASURL = `${url}/live/initiator/upload`
export default {
  name: 'MainTeacher',
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入老师姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        degreeId: [
          { required: true, message: '请输入最高学历', trigger: 'change' }
        ],
        university: [
          { required: true, message: '请输入毕业院校', trigger: 'blur' }
        ],
        universityTypeId: [
          { required: true, message: '请输入学校性质', trigger: 'change' }
        ],
        specialty: [
          { required: true, message: '请输入所学专业', trigger: 'blur' }
        ],
        certified: [
          { required: true, message: '请选择教师资格证', trigger: 'change' }
        ],
        certificateNo: [
          { required: true, message: '请输入教师资格证编号', trigger: 'blur' }
        ],
        teachingYears: [
          { required: true, message: '请输入教学经验', trigger: 'blur' }
        ],
        grades: [
          { required: true, message: '请选择教授年级', trigger: 'change' }
        ],
        selfIntro: [
          { required: true, message: '请输入个人介绍', trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '请选择账号状态', trigger: 'change' }
        ],
        testAccount: [
          { required: true, message: '请选择是否为测试数据', trigger: 'change' }
        ]
      },
      tableData: [],
      form: {
        name: '',
        phone: '',
        certified: '',
        degreeId: '',
        university: '',
        enable: '',
        grades: [],
        sortDirection: 'desc'
      },
      failListQuery: {
        pageNum: 1,
        pageSize: 20
      },
      failData: [],
      list: null,
      total: 0,
      failTotal: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '有'
        },
        {
          value: 0,
          label: '无'
        }
      ],
      optionsStatus: [
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
      mobileList: [],
      loading: false,
      finished: false,
      isProgress: false,
      percentage: 0,
      failList: [],
      visible: false,
      editVisible: false,
      editTitle: '',
      formModel: {
        name: '',
        photoUrl: '',
        phone: '',
        degreeId: '',
        university: '',
        universityTypeId: '',
        specialty: '',
        certified: '',
        certifiedNo: '',
        certificateNo: '',
        teachingYears: '',
        grades: [],
        selfIntro: '',
        enable: 1,
        testAccount: 0
      },
      classListData: [
        { code: 1, class: '一年级' },
        { code: 2, class: '二年级' },
        { code: 3, class: '三年级' },
        { code: 4, class: '四年级' },
        { code: 5, class: '五年级' },
        { code: 6, class: '六年级（预初）' },
        { code: 7, class: '初一' },
        { code: 8, class: '初二' },
        { code: 9, class: '初三' },
        { code: 10, class: '高一' },
        { code: 11, class: '高二' },
        { code: 12, class: '高三' }
      ],
      isEdit: '',
      universityType: {},
      showType: '',
      editId: '',
      showMore: false
    }
  },
  activated() {
    this.getList()
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  components: {
    Pagination,
    Upload
  },
  created() {},
  mounted() {
    this.getList()
    this.getDegreeAndUniversityType()
  },
  methods: {
    getList(v) {
      this.loading = true
      if (v === 1) {
        this.listQuery.pageNum = 1
      }
      this.$store
        .dispatch('TeacherManage/MainTeacher/getList', {
          ...this.listQuery,
          ...this.form
        })
        .then(res => {
          console.log(res, 'res')
          const { list, total, pageNum, pageSize } = res.data
          this.total = total
          this.listQuery = { pageNum, pageSize }
          list.map(v => {
            let grades = []
            v.grades.map((val, index) => {
              this.classListData.map((data, i) => {
                if (val === data.code) {
                  grades.push(data.class)
                }
              })
            })
            v.grades = grades
          })
          this.tableData = list
          this.loading = false
        })
    },
    onSubmit(v) {
      this.getList(v)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs['formOpen'].resetFields()
    },
    resetDialogForm() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    upload() {
      this.$refs.upload.click()
    },
    download() {
      window.location.href =
        'http://crmlive.yunshuxie.com/api/live/initiator/download'
    },
    async handleChange(ev) {
      const _this = this
      const files = ev.target.files
      if (!files) {
        return
      }
      _this.isProgress = true

      let formData = new FormData()
      formData.append('file', files[0])

      let xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('post', UPLOASURL, true)
      xhr.onload = function uploadComplete(evt) {
        if (JSON.parse(evt.target.response).code === 0) {
          _this.percentage = 100
          _this.isProgress = false
          _this.$message({
            message: '上传成功！',
            type: 'success'
          })
          _this.visible = false
          _this.getList()
        } else {
          _this.$message({
            message: JSON.parse(evt.target.response).message,
            type: 'warning'
          })
          _this.visible = true
          _this.isProgress = false
        }
        if (JSON.parse(evt.target.response).code === 105) {
          _this.failData = JSON.parse(evt.target.response).data
        }
        document.getElementById('upload-file').value = ''
      }
      xhr.onerror = function uploadFailed(evt) {
        _this.isProgress = false
        _this.$message({
          message: '上传失败！',
          type: 'warning'
        })
      }
      xhr.upload.onprogress = function progressFunction(evt) {
        if (evt.lengthComputable) {
          _this.percentage = Math.round((evt.loaded / evt.total) * 100) - 1
        }
      }
      xhr.upload.onloadstart = function() {
        _this.percentage = 0
      }
      xhr.send(formData)
    },
    failCancel() {
      this.visible = false
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#909399'
      } else if (percentage < 70) {
        return '#e6a23c'
      }
      return '#67c23a'
    },
    edit(type, v) {
      if (type === 'add') {
        this.editTitle = '新增主讲老师'
        this.isEdit = 'add'
        this.editId = ''
        this.formModel.certificateNo = ''
        this.resetDialogForm()
      }
      if (type === 'update') {
        this.editTitle = '编辑主讲老师'
        this.isEdit = 'update'
        this.getInfo(v.initiatorId)
        this.editId = v.initiatorId
      }
      if (type === 'view') {
        this.editTitle = `${v.name}老师工作资料`
        this.isEdit = 'view'
        this.getInfo(v.initiatorId)
        this.editId = ''
      }
      this.showType = type
      this.editVisible = true
    },
    editCancel() {
      this.editVisible = false
    },
    onSure() {
      let url = this.editId
        ? 'TeacherManage/MainTeacher/edit'
        : 'TeacherManage/MainTeacher/add'
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.formModel.phone.length !== 11) {
            this.$message({
              message: '请输入正确格式手机号',
              type: 'error'
            })
            return
          }
          if (this.formModel.certified === 1 && !this.formModel.certificateNo) {
            this.$message({
              message: '请输入教师资格证编号',
              type: 'error'
            })
            return
          }
          if (
            this.formModel.certified === 1 &&
            this.formModel.certificateNo.length !== 17
          ) {
            this.$message({
              message: '请输入17位教师资格证编号',
              type: 'error'
            })
            return
          }
          this.$store
            .dispatch(url, {
              ...this.formModel,
              editId: this.editId
            })
            .then(res => {
              if (res.code === 104) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.listQuery.pageNum = 1
                this.form.sortDirection = 'desc'
                this.getList()
                this.editVisible = false
              }
            })
        } else {
          return false
        }
      })
    },
    getInfo(id) {
      this.resetDialogForm()
      this.$store
        .dispatch('TeacherManage/MainTeacher/getInfo', id)
        .then(res => {
          if (this.isEdit === 'view') {
            let grades = []
            res.data.grades.map((val, index) => {
              this.classListData.map((data, i) => {
                if (val === data.code) {
                  grades.push(data.class)
                }
              })
            })
            res.data.grades = grades
          }
          let grades = []
          res.data.grades.map((val, index) => {
            grades.push(String(val))
          })
          res.data.grades = grades
          if (!res.data.photoUrl) {
            res.data.photoUrl = ''
          }
          this.formModel = res.data
        })
    },
    handleUploadShopPic(url) {
      this.formModel.photoUrl = url
    },
    handleShopPicDelete() {
      this.formModel.photoUrl = ''
    },
    getDegreeAndUniversityType() {
      this.$store
        .dispatch('TeacherManage/MainTeacher/getDegreeAndUniversityType')
        .then(res => {
          this.universityType = res.data
        })
    },
    toLesson(row) {
      this.$router.push({
        path: 'schedule',
        query: { id: row.initiatorId }
      })
    },
    sortChange(v) {
      if (v.order === 'ascending') {
        this.form.sortDirection = 'asc'
      } else {
        this.form.sortDirection = 'desc'
      }
      this.listQuery.pageNum = 1
      this.getList()
    },
    showSearhMore() {
      this.showMore = true
    },
    closeSearhMore() {
      this.showMore = false
    }
  }
}
</script>

<template src="./index.html"></template>
<style src="./index.scss" lang="scss"></style>
