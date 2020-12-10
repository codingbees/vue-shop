<template>
    <div>
        <Breadcrum>
            <div>
                <el-breadcrumb-item :to="{ path: '/'+'welcome' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </div>
        </Breadcrum>
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="AuthName" prop="authName"></el-table-column>
                <el-table-column label="Path" prop="path"></el-table-column>
                <el-table-column label="Level" prop="level">
                    <template slot-scope="scope">
                        <!-- {{scope.row.level===2?'2':scope.row.level===1?'1':'0'}} -->
                        <el-tag v-if="scope.row.level==='0'">等级一</el-tag>
                        <el-tag v-else-if="scope.row.level==='1'" type="success">等级二</el-tag>
                        <el-tag v-else type="warning">等级三</el-tag>
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
    this.getRightList()
  },
  data () {
    return {

      rightsList: []
    }
  },
  methods: {
    getRightList () {
      axios.get('/api/private/v1/rights/list').then(res => {
        console.log(res.data)
        this.rightsList = res.data.data
      })
    }
  }
}
</script>
<style lang="scss">

</style>
