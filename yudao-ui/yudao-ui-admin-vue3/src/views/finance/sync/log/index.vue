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
      <el-form-item label="执行结果" prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择结果" clearable class="!w-200px">
          <el-option label="成功" :value="1" />
          <el-option label="失败" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间" prop="dateRange">
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="日志编号" align="center" prop="id" width="80" />
      <el-table-column label="任务名称" align="center" prop="taskName" width="180" />
      <el-table-column label="租户名称" align="center" prop="tenantName" width="120" />
      <el-table-column label="平台类型" align="center" prop="platformType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.platformType === 1" type="primary">抖店</el-tag>
          <el-tag v-else-if="scope.row.platformType === 2" type="warning">千川</el-tag>
          <el-tag v-else-if="scope.row.platformType === 3" type="success">聚水潭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="结束时间" align="center" prop="endTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="耗时(ms)" align="center" prop="duration" width="100" />
      <el-table-column label="执行结果" align="center" prop="result" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.result === 1" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="同步/成功/失败" align="center" width="150">
        <template #default="scope">
          <span>{{ scope.row.syncCount || 0 }}/{{ scope.row.successCount || 0 }}/{{ scope.row.failCount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="错误信息" align="center" prop="errorMessage" width="200" />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">详情</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['finance:sync:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <!-- 详情弹窗 -->
  <Dialog title="日志详情" v-model="detailVisible" width="600px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="日志编号">{{ currentLog.id }}</el-descriptions-item>
      <el-descriptions-item label="任务名称">{{ currentLog.taskName }}</el-descriptions-item>
      <el-descriptions-item label="租户名称">{{ currentLog.tenantName }}</el-descriptions-item>
      <el-descriptions-item label="平台类型">
        <el-tag v-if="currentLog.platformType === 1" type="primary">抖店</el-tag>
        <el-tag v-else-if="currentLog.platformType === 2" type="warning">千川</el-tag>
        <el-tag v-else-if="currentLog.platformType === 3" type="success">聚水潭</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ currentLog.startTime }}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{ currentLog.endTime }}</el-descriptions-item>
      <el-descriptions-item label="执行耗时">{{ currentLog.duration }} ms</el-descriptions-item>
      <el-descriptions-item label="执行结果">
        <el-tag v-if="currentLog.result === 1" type="success">成功</el-tag>
        <el-tag v-else type="danger">失败</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="同步条数">{{ currentLog.syncCount }}</el-descriptions-item>
      <el-descriptions-item label="成功条数">{{ currentLog.successCount }}</el-descriptions-item>
      <el-descriptions-item label="失败条数">{{ currentLog.failCount }}</el-descriptions-item>
      <el-descriptions-item label="错误信息" :span="2">{{ currentLog.errorMessage || '-' }}</el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as SyncApi from '@/api/finance/sync'

defineOptions({ name: 'SyncLog' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tenantId: undefined,
  platformType: undefined,
  result: undefined,
  dateRange: []
})
const queryFormRef = ref()

const detailVisible = ref(false)
const currentLog = ref<any>({})

const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      startTime: queryParams.dateRange?.[0],
      endTime: queryParams.dateRange?.[1]
    }
    const data = await SyncApi.getSyncLogPage(params)
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

const handleView = (row: any) => {
  currentLog.value = row
  detailVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await SyncApi.deleteSyncLog(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
