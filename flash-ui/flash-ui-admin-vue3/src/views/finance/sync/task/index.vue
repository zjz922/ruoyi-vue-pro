<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="租户" prop="tenantId">
        <el-select v-model="queryParams.tenantId" placeholder="请选择租户" clearable class="!w-200px">
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable class="!w-200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="平台类型" prop="platformType">
        <el-select v-model="queryParams.platformType" placeholder="请选择平台" clearable class="!w-200px">
          <el-option label="抖店" :value="1" />
          <el-option label="千川" :value="2" />
          <el-option label="聚水潭" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-200px">
          <el-option label="停用" :value="0" />
          <el-option label="启用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['finance:sync:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="任务编号" align="center" prop="id" width="80" />
      <el-table-column label="租户名称" align="center" prop="tenantName" width="120" />
      <el-table-column label="任务名称" align="center" prop="taskName" width="180" />
      <el-table-column label="平台类型" align="center" prop="platformType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.platformType === 1" type="primary">抖店</el-tag>
          <el-tag v-else-if="scope.row.platformType === 2" type="warning">千川</el-tag>
          <el-tag v-else-if="scope.row.platformType === 3" type="success">聚水潭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" align="center" prop="taskType" width="120">
        <template #default="scope">
          <span v-if="scope.row.taskType === 1">抖店订单</span>
          <span v-else-if="scope.row.taskType === 2">抖店结算</span>
          <span v-else-if="scope.row.taskType === 3">千川消耗</span>
          <span v-else-if="scope.row.taskType === 4">聚水潭库存</span>
        </template>
      </el-table-column>
      <el-table-column label="Cron表达式" align="center" prop="cronExpression" width="150" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="info">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上次执行" align="center" prop="lastExecuteTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="执行结果" align="center" prop="lastExecuteResult" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.lastExecuteResult === 1" type="success">成功</el-tag>
          <el-tag v-else-if="scope.row.lastExecuteResult === 0" type="danger">失败</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template #default="scope">
          <el-button link type="primary" @click="handleExecute(scope.row.id)" v-hasPermi="['finance:sync:update']">立即执行</el-button>
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['finance:sync:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['finance:sync:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <SyncTaskForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as SyncApi from '@/api/finance/sync'
import SyncTaskForm from './SyncTaskForm.vue'

defineOptions({ name: 'SyncTask' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tenantId: undefined,
  taskName: undefined,
  platformType: undefined,
  status: undefined
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await SyncApi.getSyncTaskPage(queryParams)
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

const handleExecute = async (id: number) => {
  try {
    await message.confirm('确认要立即执行该同步任务吗？')
    await SyncApi.executeSyncTask(id)
    message.success('任务已开始执行')
  } catch {}
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await SyncApi.deleteSyncTask(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
