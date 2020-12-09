<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/'+'welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<style lang="scss" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }
</style>
