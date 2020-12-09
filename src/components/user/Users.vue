<template>
    <div>
        <Breadcrum></Breadcrum>
        <el-card shadow="hover">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList"
                class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
            <el-button type='primary' class="adduserbutton" @click="addUser">添加用户</el-button>
            <!-- 数据表格 -->
            <el-table :data="userlist" style="width: 100%" stripe border>
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column label="id" prop="id">
                </el-table-column>
                <el-table-column label="create_time" prop="create_time">
                </el-table-column>
                <el-table-column label="email" prop="email">

                </el-table-column>
                <el-table-column label="mobile" prop="mobile">
                </el-table-column>
                <el-table-column label="role_name" prop="role_name">
                </el-table-column>
                <el-table-column label="username" prop="username">
                </el-table-column>
                <el-table-column label="switch" prop="mg_state">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="right" label="Operations">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)"
                            icon="el-icon-edit">
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
                            icon="el-icon-delete">
                        </el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" @click="handleAssign(scope.$index, scope.row)"
                                icon="el-icon-setting">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="totaluser">
            </el-pagination>
        </el-card>
        <!-- 弹出层 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
                <el-form-item label="username" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="password" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="email" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="mobile" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户数据 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogFormVisible" width="50%" @close="editAddDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
                <el-form-item label="username" prop="username">
                    <el-input disabled v-model="addForm.username"></el-input>
                </el-form-item>
                <!-- <el-form-item label="password" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item> -->
                <el-form-item label="email" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="mobile" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAddUserConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import Breadcrum from '../util/Breadcrum'
export default {
  components: {
    Breadcrum
  },
  created () {
    this.getUserList()
  },
  data () {
    var checkmobile = (rule, value, cb) => {
      const regNumber = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (regNumber.test(value)) {
        return cb()
      }
      cb(new Error('非法电话号码'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 2,
        pagesize: 10
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在2 ~ 5之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在2 ~ 5之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]

      },
      userlist: [],
      totaluser: 0,
      searchValue: '',
      search: '',
      dialogFormVisible: false,
      editDialogFormVisible: false,
      editId: ''
    }
  },
  methods: {
    getUserList () {
      axios.get('/api/private/v1/users', {
        params: this.queryInfo
      }).then(res => {
        console.log('queryinfo')
        console.log(res)
        this.userlist = res.data.data.users
        this.totaluser = res.data.data.total
      })
    },
    addUser () {
      this.dialogFormVisible = true
    },
    userStateChange (userinfo) {
      // console.log(userinfo)
      axios.put(`/api/private/v1/users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
        if (res.data.meta.status !== 200) {
          this.mg_state = !this.mg_state
          return this.$message.error('状态更新失败！')
        }
        this.$message.success('更新成功！')

        // console.log(res)
      })
    },
    handleEdit (index, oldData) {
      this.editDialogFormVisible = true
      console.log(index)
      console.log(oldData)
      this.addForm.username = oldData.username
      this.addForm.email = oldData.email
      this.addForm.password = 'a22'
      this.addForm.mobile = oldData.mobile
      this.editId = oldData.id
    },
    handleDelete (index, data) {
      this.$confirm('Confirm to delete user : ' + data.username + ' ? ', 'Notice', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/private/v1/users/${data.id}`).then(res => {
        // if (res.data.meta.status !== 200) return
          this.$message.success('delete user success')
          this.getUserList()
        })
      }).catch(() => {
        this.$message.error('Cancel delete ')
      })
    },
    handleAssign (index, data) {
      console.log(index)
      console.log(data)
    },
    handleSizeChange (e) {
      this.queryInfo.pagesize = e
      this.getUserList()
    },
    handleCurrentChange (e) {
      this.queryInfo.pagenum = e
      this.getUserList()
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    editAddDialogClose () {
      this.$refs.addFormRef.resetFields()
      // this.addForm.username = ''
      // this.addForm.email = ''
      // this.addForm.password = ''
      // this.addForm.mobile = ''
      // this.editId = ''
    },
    addUserConfirm () {
      this.$refs.addFormRef.validate(res => {
        if (!res) return
        axios.post('/api/private/v1/users', this.addForm).then(res => {
          console.log('addForm')
          console.log(res)
          if (res.data.meta.status !== 201) this.$message.error('add user failed')
          this.$message.success('add user success')

          this.dialogFormVisible = false
          this.getUserList()
        })
      })
    },
    editAddUserConfirm () {
      this.$refs.addFormRef.validate(res => {
        if (!res) return
        axios.put(`/api/private/v1/users/${this.editId}`, {
          id: this.editId,
          email: this.addForm.email,
          mobile: this.addForm.mobile
        }).then(res => {
          console.log('edit')
          console.log(res)
          if (res.data.meta.status !== 200) this.$message.error('edit user failed')
          this.$message.success('edit user success')
          this.editDialogFormVisible = false
          this.getUserList()
        })
      })
    }

  }
}

</script>

<style lang="scss" scoped>
    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
    }

    .input-with-select {
        width: 300px;
    }

    .adduserbutton {
        margin-left: 15px;
    }

    .el-table,
    .el-pagination {
        margin-top: 15px;
    }
</style>
