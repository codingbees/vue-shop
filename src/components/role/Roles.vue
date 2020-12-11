<template>
    <div>
        <Breadcrum>
            <div>
                <el-breadcrumb-item :to="{ path: '/'+'welcome' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </div>
        </Breadcrum>
        <el-card>

            <el-row>
                <el-column>
                    <el-button type="primary">添加角色</el-button>
                </el-column>
            </el-row>

            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand" name="1">
                    <template slot-scope="scope">
                        <el-row class="vcenter" :class="['row1',li===0?'rowtop':'']"
                            v-for=" (data1,li) in scope.row.children" :key="data1.id">
                            <!-- LEVEL 1 -->
                            <el-col :span="4">
                                <el-tag closable @close="closeTagById(scope.row,data1)">{{data1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- LEVEL 2&3 -->
                            <el-col :span="20">
                                <el-row class="vcenter" v-for="data2 in data1.children" :key="data2.id">
                                    <el-col :span="6">
                                        <el-row>
                                            <el-tag closable @close="closeTagById(scope.row,data2)" type="success">
                                                {{data2.authName}}
                                            </el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable @close="closeTagById(scope.row,data3)" type="warning"
                                            v-for="data3 in data2.children" :key="data3.id">
                                            {{data3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>

                        </el-row>

                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="Operation" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">Edit</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">Delete</el-button>
                        <el-button @click="assignRights(scope.row)" size="mini" type="warning" icon="el-icon-setting">
                            Assign
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限弹出框 -->
        <el-dialog title="修改用户信息" :visible.sync="assignRightsVisible" width="50%" @close="assignRightsDialogClose">
            <el-tree :data="rightsList" show-checkbox node-key="id" :props="treeProps" default-expand-all
                :default-checked-keys="defaultKeys" ref="treeRef">
            </el-tree>

            <div slot="footer" class="dialog-footer">
                <el-button @click="assignRightsVisible = false">取 消</el-button>
                <el-button @click="editAddUserConfirm" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Breadcrum from '../util/Breadcrum'
import axios from 'axios'
export default {
  components: {
    Breadcrum
  },
  created () {
    this.getRolesList()
  },
  data () {
    return {
      rolesList: [],
      rightsList: [],
      assignRightsVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKeys: [],
      roleId: []
    }
  },
  methods: {
    getRolesList () {
      axios.get('/api/private/v1/roles').then(res => {
        console.log(res.data)
        this.rolesList = res.data.data
      })
    },
    closeTagById (role, right) {
      this.$confirm('Confirm to delete right ? ', 'Notice', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(res => {
        axios.delete(`/api/private/v1/roles/${role.id}/rights/${right.id}`).then(res => {
          if (res.data.meta.status !== 200) { this.$message.error('Failed') } else {
            this.$message.success('Successed')
            role.children = res.data.data
          }
        })
      }).catch(() => {
        this.$message.info('Canceled')
      })
    },
    assignRights (roles) {
      this.roleId = roles.id
      axios.get('/api/private/v1/rights/tree').then(res => {
        if (res.data.meta.status !== 200) { return this.$message.error('Failed') } else {
          this.rightsList = res.data.data
          this.getLeafKeys(roles, this.defaultKeys)
          this.assignRightsVisible = true
        }
      })
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      })
    },
    assignRightsDialogClose () {
      this.defaultKeys = []
    },
    editAddUserConfirm () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys)
      const idStr = keys.join(',')
      axios.post(`/api/private/v1/roles/${this.roleId}/rights`, { rids: idStr }).then(res => {
        console.log(res)

        if (res.data.meta.status !== 200) { return this.$message.error('Assign failed') } else {
          this.getRolesList()
          this.assignRightsVisible = false
        }
      })
    }
  }

}
</script>
<style lang="scss">
    body {
        min-width: 1200px;
    }

    .el-row {
        margin: 5px;
    }

    .row1 {
        border-bottom: solid 1px #008;

    }

    .rowtop {
        border-top: solid 1px #008;
    }

    .el-tag--warning {
        margin: 0px 3px;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }

    /* .tag3 {
        margin: 0px 3px;
    } */
</style>
