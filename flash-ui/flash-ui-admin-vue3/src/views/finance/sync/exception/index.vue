<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="租户" prop="tenantId">
        <el-select v-model="queryParams.tenantId" placeholder="请选择租户" clearable class="!w-200px">
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="平台类型" prop="platformType">
        <el-select v-model="queryParams.platformType" placeholder="请选择平台" clearable class="!w-200px">
          <el-option label="抖店" :value="1" />
          <el-option label="千川" :value="2" />
          <el-option label="聚水潭" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="异常类型" prop="exceptionType">
        <el-select v-model="queryParams.exceptionType" placeholder="请选择类型" clearable class="!w-200px">
          <el-option label="数据格式错误" :value="1" />
          <el-option label="网络超时" :value="2" />
          <el-option label="API限流" :value="3" />
          <el-option label="数据冲突" :value="4" />
          <el-option label="其他" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="handleStatus">
        <el-select v-model="queryParams.handleStatus" placeholder="请选择状态" clearable class="!w-200px">
          <el-option label="待处理" :value="0" />
          <el-option label="已重试" :value="1" />
          <el-option label="已忽略" :value="2" />
          <el-option label="已解决" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="handleBatchRetry" :disabled="selectedIds.length === 0" v-hasPermi="['finance:sync:update']">
          <Icon icon="ep:refresh-right" class="mr-5px" /> 批量重试
        </el-button>
        <el-button type="warning" plain @click="handleBatchIgnore" :disabled="selectedIds.length === 0" v-hasPermi="['finance:sync:update']">
          <Icon icon="ep:circle-close" class="mr-5px" /> 批量忽略
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="异常编号" align="center" prop="id" width="80" />
      <el-table-column label="任务名称" align="center" prop="taskName" width="150" />
      <el-table-column label="租户名称" align="center" prop="tenantName" width="120" />
      <el-table-column label="平台类型" align="center" prop="platformType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.platformType === 1" type="primary">抖店</el-tag>
          <el-tag v-else-if="scope.row.platformType === 2" type="warning">千川</el-tag>
          <el-tag v-else-if="scope.row.platformType === 3" type="success">聚水潭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="异常类型" align="center" prop="exceptionType" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.exceptionType === 1" type="danger">数据格式错误</el-tag>
          <el-tag v-else-if="scope.row.exceptionType === 2" type="warning">网络超时</el-tag>
          <el-tag v-else-if="scope.row.exceptionType === 3" type="info">API限流</el-tag>
          <el-tag v-else-if="scope.row.exceptionType === 4" type="primary">数据冲突</el-tag>
          <el-tag v-else>其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="异常信息" align="center" prop="exceptionMessage" width="200" />
      <el-table-column label="处理状态" align="center" prop="handleStatus" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.handleStatus === 0" type="danger">待处理</el-tag>
          <el-tag v-else-if="scope.row.handleStatus === 1" type="warning">已重试</el-tag>
          <el-tag v-else-if="scope.row.handleStatus === 2" type="info">已忽略</el-tag>
          <el-tag v-else-if="scope.row.handleStatus === 3" type="success">已解决</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="重试次数" align="center" prop="retryCount" width="80" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">详情</el-button>
          <el-button link type="primary" @click="handleRetry(scope.row.id)" v-if="scope.row.handleStatus === 0" v-hasPermi="['finance:sync:update']">重试</el-button>
          <el-button link type="warning" @click="handleIgnore(scope.row.id)" v-if="scope.row.handleStatus === 0" v-hasPermi="['finance:sync:update']">忽略</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <!-- 详情弹窗 -->
  <Dialog title="异常详情" v-model="detailVisible" width="700px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="异常编号">{{ currentException.id }}</el-descriptions-item>
      <el-descriptions-item label="任务名称">{{ currentException.taskName }}</el-descriptions-item>
      <el-descriptions-item label="租户名称">{{ currentException.tenantName }}</el-descriptions-item>
      <el-descriptions-item label="平台类型">
        <el-tag v-if="currentException.platformType === 1" type="primary">抖店</el-tag>
        <el-tag v-else-if="currentException.platformType === 2" type="warning">千川</el-tag>
        <el-tag v-else-if="currentException.platformType === 3" type="success">聚水潭</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="异常类型">
        <el-tag v-if="currentException.exceptionType === 1" type="danger">数据格式错误</el-tag>
        <el-tag v-else-if="currentException.exceptionType === 2" type="warning">网络超时</el-tag>
        <el-tag v-else-if="currentException.exceptionType === 3" type="info">API限流</el-tag>
        <el-tag v-else-if="currentException.exceptionType === 4" type="primary">数据冲突</el-tag>
        <el-tag v-else>其他</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="处理状态">
        <el-tag v-if="currentException.handleStatus === 0" type="danger">待处理</el-tag>
        <el-tag v-else-if="currentException.handleStatus === 1" type="warning">已重试</el-tag>
        <el-tag v-else-if="currentException.handleStatus === 2" type="info">已忽略</el-tag>
        <el-tag v-else-if="currentException.handleStatus === 3" type="success">已解决</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="重试次数">{{ currentException.retryCount }}</el-descriptions-item>
      <el-descriptions-item label="最后重试时间">{{ currentException.lastRetryTime || '-' }}</el-descriptions-item>
      <el-descriptions-item label="异常信息" :span="2">{{ currentException.exceptionMessage }}</el-descriptions-item>
      <el-descriptions-item label="异常数据" :span="2">
        <el-input type="textarea" :rows="5" :model-value="formatJson(currentException.exceptionData)" readonly />
      </el-descriptions-item>
      <el-descriptions-item label="处理备注" :span="2">{{ currentException.handleRemark || '-' }}</el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as SyncApi from '@/api/finance/sync'

defineOptions({ name: 'SyncException' })

const message = useMessage()

const loading = ref(true)
const list = ref([])
const total = ref(0)
const selectedIds = ref<number[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tenantId: undefined,
  platformType: undefined,
  exceptionType: undefined,
  handleStatus: undefined
})
const queryFormRef = ref()

const detailVisible = ref(false)
const currentException = ref<any>({})

const formatJson = (jsonStr: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch {
    return jsonStr
  }
}

const getList = async () => {
  loading.value = true
  try {
    const data = await SyncApi.getSyncExceptionPage(queryParams)
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

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleView = (row: any) => {
  currentException.value = row
  detailVisible.value = true
}

const handleRetry = async (id: number) => {
  try {
    await message.confirm('确认要重试该异常吗？')
    await SyncApi.retrySyncException(id)
    message.success('重试成功')
    await getList()
  } catch {}
}

const handleIgnore = async (id: number) => {
  try {
    await message.confirm('确认要忽略该异常吗？')
    await SyncApi.ignoreSyncException(id)
    message.success('已忽略')
    await getList()
  } catch {}
}

const handleBatchRetry = async () => {
  try {
    await message.confirm(`确认要批量重试选中的 ${selectedIds.value.length} 条异常吗？`)
    await SyncApi.batchRetrySyncException(selectedIds.value)
    message.success('批量重试成功')
    await getList()
  } catch {}
}

const handleBatchIgnore = async () => {
  try {
    await message.confirm(`确认要批量忽略选中的 ${selectedIds.value.length} 条异常吗？`)
    await SyncApi.batchIgnoreSyncException(selectedIds.value)
    message.success('批量忽略成功')
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
