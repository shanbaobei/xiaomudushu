<template>
  <div>
    <el-form ref="postForm" :model="postForm" :rules="rules">
      <sticky :class-name="' sub-navbar '">
        <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
        <el-button
          v-loading="loading"
          type="success"
          style="marin-left:10px"
          @click="submitForm"
        >
          {{ isEdit ? '编辑电子书':'新增电子书' }}</el-button>
      </sticky>
      <div class="detail-container">
        <el-row>
          <warning />
          <el-col :span="24">
            <ebook-upload
              v-model="postForm.image_uri"
              :file-list="fileList"
              :disable="isEdit"
              @onSuccess="onUploadSuccess"
              @onRemove="onUploadRemove"
            />
          <!-- 上传控件的具体样式 -->
          </el-col>

          <el-col :span="24">
            <el-form-item prop="title">
              <MdInput
                v-model="postForm.title"
                :max-length="100"
                name="name"
                required
              >
                书名
              </MdInput>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="author" label="作者：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.author"
                    placeholder="作者"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="publisher" label="出版社：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.publisher"
                    placeholder="出版社"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="language" label="语言：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.language"
                    placeholder="语言"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="rootFile" label="根文件：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.rootFile"
                    placeholder="根文件"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="filePath" label="文件路径：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.filePath"
                    placeholder="文件路径"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="unzipPath" label="解压路径：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.unzipPath"
                    placeholder="解压路径"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="coverPath" label="封面路径：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.coverPath"
                    placeholder="封面路径"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="originalName" label="文件名称：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.originalName"
                    placeholder="文件名称"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="cover" label="封面：" :label-width="labelWidth">
                  <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                    <img :src="postForm.cover" class="preview-img">
                  </a>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="目录：" :label-width="labelWidth">
                  <div v-if="postForm.contentsTree && postForm.contentsTree.length > 0" class="contents-wrapper">
                    <!-- <el-tree :data="contentsTree" @node-click="onContentClick"/> -->
                    <el-tree :data="contentsTree" @node-click="onContentClick" />
                  </div>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </div>
    </el-form>
  </div>
</template>
<script>
import Sticky from '../../../components/Sticky'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload'
import MdInput from '../../../components/MDinput'
import { createBook, getBook, updateBook } from '../../../api/book'

// const defaultForm = {
//   title: '',
//   author: '',
//   publisher: '',
//   language: '',
//   footFile: '',
//   cover: '',
//   url: '',
//   originalName: '',
//   fileName: '',
//   coverPath: '',
//   filePath: '',
//   unzipPath: ''

// }
const fields = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语言'

}
export default {
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      // console.log(rule,value)
      if (value === '') {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {

      },
      fileList: [],
      contentsTree: [],
      labelWidth: '120px',
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }]

      }
    }
  },
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params && this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      getBook(fileName).then(response => {
        this.setData(response.data)
      })
    },
    onContentClick(data) {
      // console.log(Data)
      if (data.text) {
        window.open(data.text)
      }
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        rootFile,
        unzipPath,
        contentsTree
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        language,
        publisher,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath,
        rootFile,
        contentsTree
      }
      this.fileList = [{ name: originalName || fileName, url }]
      this.contentsTree = contentsTree
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.fileList = []
      this.contentsTree = []
      this.$refs.postForm.resetFields()
    },
    onUploadSuccess(data) {
      console.log('onUploadSuccess', { data })

      this.setData(data)
    },
    onUploadRemove() {
      this.setDefault()
    },
    submitForm() {
      const onSuccess = (response) => {
        const { msg } = response
        this.$notify({
          title: '操作成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          console.log(valid, fields)
          if (valid) {
            const book = Object.assign({}, this.postForm) // 把postForm的内容浅拷贝到book
            // delete book.contents
            delete book.contentsTree // 删除book里面多于内容
            // console.log(book)
            if (!this.isEdit) {
              createBook(book).then(response => {
              // console.log(response)
                onSuccess(response)
                this.setDefault()
              }).catch(() => {
                this.loading = false
              })
            } else {
              updateBook(book).then(response => {
                onSuccess(response)
              }).catch(() => {
                this.loading = false
              })
            }

          //  console.log(this.postForm)
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    showGuide() {
      console.log('show guide...')
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container {
    padding: 40px 50px 20px;
  }
</style>
