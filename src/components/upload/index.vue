<script>
// import ossUpload from 'npm-js-web-oss';
import ossUpload from './demo.js'

export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      clickNum: 0
    }
  },
  mounted() {},
  components: {},
  props: {
    imgSrc: {
      type: Array,
      default() {
        return []
      }
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 0
    }
  },
  watch: {
    imgSrc(val) {
      console.log(val, 'val')
      this.imgSrc = val
    }
  },
  methods: {
    handleRemove(item, index) {
      // console.log(file, fileList);
      this.$emit('emit-delete', this.imgSrc, index)
    },

    handlePictureCardPreview(item, index) {
      // console.log('file====>', item,index);
      this.dialogImageUrl = item
      this.dialogVisible = true
    },

    handleChange() {
      let inputDom = this.$refs.uploadIpt
      let param = {
        resourceType: 'pic',
        platform: 'fe',
        purpose: 'test'
      }
      ossUpload.upload(inputDom.files[0], param).then(url => {
        this.$emit('emit-pic', url)
      })

      this.$refs.uploadIpt.value = ''
    },

    handleClose() {
      console.log('close')
      this.clickNum = 0
      this.$refs.dialogImg.style.transform = 'rotate(0)'
    },

    handleRotate() {
      this.clickNum = this.clickNum + 1
      let degs = this.clickNum * 90
      this.$refs.dialogImg.style.transform = `rotate(${degs}deg)`
      this.$refs.dialogImg.style.webkitTransform = `rotate(${degs}deg)`
    }
  }
}
</script>
<template src="./index.html"></template>
<style src="./index.scss" lang="scss" scoped></style>
