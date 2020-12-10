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
                        <el-row :class="['row1',li===0?'rowtop':'']" v-for=" (data1,li) in scope.row.children"
                            :key="data1.id">
                            <!-- LEVEL 1 -->
                            <el-col :span="4">
                                <el-tag>{{data1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- LEVEL 2&3 -->
                            <el-col :span="20">
                                <el-row v-for="data2 in data1.children" :key="data2.id">
                                    <el-col :span="6">
                                        <el-row>
                                            <el-tag type="success">{{data2.authName}}</el-tag>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="data3 in data2.children" :key="data3.id">
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
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit">Edit</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">Delete</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">Assign</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
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
      rolesList: []
    }
  },
  methods: {
    getRolesList () {
      axios.get('/api/private/v1/roles').then(res => {
        console.log(res.data)
        this.rolesList = res.data.data
      })
    }
  }

}
</script>
<style lang="scss">
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

    /* .tag3 {
        margin: 0px 3px;
    } */
</style>
