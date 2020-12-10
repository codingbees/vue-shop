<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <slot></slot>
        </el-breadcrumb>
    </div>
</template>

<style lang="scss" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }
</style>
