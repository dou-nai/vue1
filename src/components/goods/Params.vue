<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部的警告区域 -->
      <el-alert
        show-icon
        title="警告：只允许修改第三级参数！"
        type="warning"
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs页签区域 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            @click="addDialogVisible = true"
            type="primary"
            :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  >{{ item }}</el-tag
                >

                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>

                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            @click="addDialogVisible = true"
            type="primary"
            :disabled="isBtnDisabled"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数或静态属性的对话框 -->

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的表单 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //1:保存所有商品分类列表
      catelist: [],

      //2:级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      //3:这是级联选择框双向绑定的数组
      selectedCateKeys: [],

      //4:被激活的页面标签名称
      activeName: 'many',

      //5:动态参数的数据
      manyTableData: [],

      //6:静态属性的数据
      onlyTableData: [],

      //7:控制添加属性/参数的属性
      addDialogVisible: false,

      //8:添加参数的表单数据对象
      addForm: { attr_name: '' },

      //9:添加属性表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

      //10:控制修改对话框的显示
      editDialogVisible: false,

      //11:修改参数的验证的规则
      editForm: { attr_anme: '' },

      //12:控制按钮与文本框的显示
      inputVisible: false,

      //13:文本框中输入的内容
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 1:获取所有商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.catelist = res.data
      //console.log(this.catelist)
    },

    //2:级联选择框选择项，选中触发函数
    handleChange() {
      this.getParamsData()
    },

    //3:tab页面标签点击的处理函数
    handleClick() {
      this.getParamsData()
    },

    //4:获取所有数据的函数
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败！')
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      //console.log(res.data)

      //数据判断
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    //5:监听添加对话框的关闭事件
    addDialogClosed() {
      //清除验证规则
      this.$refs.addFormRef.resetFields()
    },

    //5-2:监听添加对话框的关闭事件
    editDialogClosed() {
      //清除验证规则
      this.$refs.editFormRef.resetFields()
    },

    //6:添加属性/参数的处理函数
    addParams() {
      //console.log(this.addForm.attr_name)
      //1:先验证表单
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }

        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },

    //7:展示修改对话框
    async showEditDialog(attr_id) {
      //console.log('id=' + attr_id)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.erroe('当前参数失败！')
      }

      //获取数据成功保存到editForm对象
      this.editForm = res.data

      this.editDialogVisible = true
    },

    //8:修改对话框提交的处理
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('参数修改失败！')
        }

        this.$message.success('参数修改成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },

    //9:删除的业务逻辑
    async removeParams(attr_id) {
      //弹出确认框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      //用户取消删除后的处理
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除取消！')
      }

      //确认删除后的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('参数删除失败！')
      }

      this.$message.success('参数删除成功！')
      this.getParamsData()
    },

    //10:文本框失去焦点或者按下enter键触发
    handleInputConfirm() {
      console.log('ok')
    },

    //12:点击按钮展示文本输入框
    showInput() {
      this.inputVisible = true
    }
  },

  //计算属性
  computed: {
    //1:决定按钮的禁用和启用
    // eslint-disable-next-line vue/return-in-computed-property
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },

    //2:当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },

    //3:添加对话框对的计算属性
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }

      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}

.el-tag {
  margin: 8px;
}

.input-new-tag {
  width: 100px;
}
</style>
