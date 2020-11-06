<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽的形式 -->
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5"
                ><el-tag>{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>

              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- for循环嵌套的方式显示二级和三级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限列表的弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //1:保存所有角色列表
      rolelist: [],

      //2:分配权限对话框
      setRightDialogVisible: false,

      //3:保存所有权限列表
      rightslist: [],

      //4:树形控件的数据绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //5:默认选中的角色拥有的权限
      defKeys: [],
      //6:即将分配角色的id
      roleId: ''
    }
  },
  created() {
    //2:调用方法获取所有权限列表的函数
    this.getrRolesList()
  },
  methods: {
    //1:获取所有权限列表的函数
    async getrRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.rolelist = res.data
      //console.log(this.rolelist)
    },
    //2:tag标签关闭删除处理函数
    async removeRightById(role, rightId) {
      //弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //删除取消操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除取消')
      }
      //删除确认操作
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败！')
      }
      //提示删除成功
      this.$message.success('删除权限成功！')
      //删除权限成功后刷新权限列表
      this.getrRolesList()
    },
    //3:点击展示权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

      //权限数据保存
      this.rightslist = res.data
      //console.log(this.rightslist)

      //获取当前角色拥有的三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //4:通过递归函数的形式，获取选中角色所拥有的权限
    getLeafKeys(node, arr) {
      //没有children属性便是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //5:关闭后清空权限数组
    setRightDialogClosed() {
      this.defKeys = []
    },
    //6:分配角色确认后的处理函数
    async allotRights(roleId) {
      console.log(roleId)
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      //console.log(keys)
      //拼接id
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败')
      }

      this.$message.success('分配权限成功')
      this.getrRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
