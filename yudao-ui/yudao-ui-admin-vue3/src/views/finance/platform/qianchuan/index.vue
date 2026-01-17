<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="租户" prop="tenantId">
        <el-select v-model="queryParams.tenantId" placeholder="请选择租户" clearable class="!w-240px">
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="广告主名称" prop="advertiserName">
        <el-input v-model="queryParams.advertiserName" placeholder="请输入广告主名称" clearable class="!w-240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="授权状态" prop="authStatus">
        <el-select v-model="queryParams.authStatus" placeholder="请选择授权状态" clearable class="!w-240px">
          <el-option label="未授权" :value="0" />
          <el-option label="已授权" :value="1" />
          <el-option label="授权过期" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['finance:platform-config:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="配置编号" align="center" prop="id" width="80" />
      <el-table-column label="租户名称" align="center" prop="tenantName" width="150" />
      <el-table-column label="广告主名称" align="center" prop="advertiserName" width="180" />
      <el-table-column label="广告主ID" align="center" prop="advertiserId" width="150" />
      <el-table-column label="今日消耗" align="center" prop="todayCost" width="120">
        <template #default="scope">
          <span>¥{{ scope.row.todayCost?.toFixed(2) || '0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" align="center" prop="accountBalance" width="120">
        <template #default="scope">
          <span>¥{{ scope.row.accountBalance?.toFixed(2) || '0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权状态" align="center" prop="authStatus" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.authStatus === 0" type="info">未授权</el-tag>
          <el-tag v-else-if="scope.row.authStatus === 1" type="success">已授权</el-tag>
          <el-tag v-else-if="scope.row.authStatus === 2" type="danger">授权过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后同步时间" align="center" prop="lastSyncTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" fixed="right" width="280">
        <template #default="scope">
          <el-button link type="primary" @click="handleTestConnection(scope.row.id)" v-hasPermi="['finance:platform-config:query']">测试连接</el-button>
          <el-button link type="primary" @click="handleRefreshToken(scope.row.id)" v-hasPermi="['finance:platform-config:update']">刷新Token</el-button>
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['finance:platform-config:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['finance:platform-config:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <QianchuanConfigForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as PlatformConfigApi from '@/api/finance/platformConfig'
import QianchuanConfigForm from './QianchuanConfigForm.vue'

defineOptions({ name: 'QianchuanConfig' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tenantId: undefined,
  advertiserName: undefined,
  authStatus: undefined
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await PlatformConfigApi.getQianchuanConfigPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleTestConnection = async (id: number) => {
  try {
    const result = await PlatformConfigApi.testQianchuanConnection(id)
    if (result) {
      message.success('连接成功')
    } else {
      message.error('连接失败')
    }
  } catch (e) {
    message.error('连接测试失败')
  }
}

const handleRefreshToken = async (id: number) => {
  try {
    await PlatformConfigApi.refreshQianchuanToken(id)
    message.success('Token刷新成功')
    await getList()
  } catch (e) {
    message.error('Token刷新失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await PlatformConfigApi.deleteQianchuanConfig(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
