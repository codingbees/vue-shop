<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="addNewCart">添加分类</el-button>
      </el-row>

      <tree-table class="treetable" :data="cartList" :columns="columns" :selection-type="false" :show-index="true"
        index-text="#" border :expand-type="false">
        <template slot="isOK" slot-scope="scope">
          <el-icon v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:green"></el-icon>
          <el-icon v-else class="el-icon-error" style="color:orange"></el-icon>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini">1</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" size="mini" type="success">2</el-tag>
          <el-tag v-else size="mini" type="warning">3</el-tag>
        </template>
        <template slot="oper">
          <el-button type="primary" size="mini" icon="el-icon-edit">Edit</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">Delete</el-button>
        </template>
      </tree-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="totalcart">
      </el-pagination>

    </el-card>

    <!-- 添加分类弹出层 -->
    <el-dialog title="Add new Category" :visible.sync="dialogVisible" width="50%" @close="addCartClose">
      <el-form :model="addCartList" :rules="addCartRules" ref="addCartListRef" label-width="120px">
        <el-form-item label="Category" prop="cat_name">
          <el-input v-model="addCartList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="ParentCategory">
          <!-- <el-cascader v-model="selectParentCat" :options="parentCatList"></el-cascader> -->
          <el-cascader clearable :props="cascaderProps" v-model="selectParentCat" :options="parentCatList"
            @change="handleChange" change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCartConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  created () {
    this.getcartList()
  },
  data () {
    return {
      cartList: [],
      queryInfo: {
        type: '',
        pagesize: 5,
        pagenum: 2
      },
      totalcart: 0,
      columns: [{
        label: 'name',
        prop: 'cat_name',
        width: '160px'
      },
      {
        label: 'OK',
        type: 'template',
        template: 'isOK'
      },
      {
        label: 'Order',
        type: 'template',
        template: 'order'
      }, {
        label: 'Operation',
        type: 'template',
        template: 'oper'
      }],
      dialogVisible: false,
      addCartList: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCartRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2 ~ 10之间', trigger: 'blur' }
        ]

      },
      addCartListRef: {},
      parentCatList: [],
      selectParentCat: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }

    }
  },
  methods: {
    getcartList () {
      axios.get('/api/private/v1/categories', {
        params: this.queryInfo
      }).then(res => {
        console.log('queryinfo')
        console.log(res)
        if (res.data.meta.status !== 200) return this.$message.error('获取分类失败')
        this.cartList = res.data.data.result
        this.totalcart = res.data.data.total
      })
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getcartList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getcartList()
    },
    addNewCart () {
      this.getParentCatList()
      this.dialogVisible = true
    },
    addCartConfirm () {
      this.$refs.addCartListRef.validate(res => {
        if (!res) return

        axios.post('/api/private/v1/categories', this.addCartList).then(res => {
          if (res.data.meta.status !== 201) return this.$message.error('Add new category failed!')
          this.$message.success('Add new category success!')
          this.getcartList()
          this.addCartClose()
        })
      })
    },
    addCartClose () {
      this.$refs.addCartListRef.resetFields()
      this.dialogVisible = false
      this.addCartList.cat_pid = 0
      this.addCartList.cat_level = 0
      this.selectParentCat = []
    },
    getParentCatList () {
      axios.get('/api/private/v1/categories', {
        params: { type: 2 }
      }).then(res => {
        console.log('getParentCatList')
        console.log(res.data.data)
        if (res.data.meta.status !== 200) return this.$message.error('获取父级分类失败')
        this.parentCatList = res.data.data
        console.log(this.parentCatList)
      })
    },
    handleChange () {
      console.log(this.selectParentCat)
      if (this.selectParentCat.length > 0) {
        this.addCartList.cat_pid = this.selectParentCat[this.selectParentCat.length - 1]
        this.addCartList.cat_level = this.selectParentCat.length
      } else {
        this.addCartList.cat_pid = 0
        this.addCartList.cat_level = 0
      }
    }

  }
}
</script>
<style lang="scss">
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .treetable {
    margin-top: 15px;
  }
</style>
