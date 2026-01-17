<template>
  <div class="report-export">
    <el-row :gutter="16">
      <!-- 导出配置 -->
      <el-col :span="8">
        <ContentWrap title="导出配置">
          <el-form :model="exportForm" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="报表类型" prop="reportType">
              <el-select v-model="exportForm.reportType" placeholder="请选择报表类型" class="!w-full">
                <el-option label="日报表" value="daily" />
                <el-option label="周报表" value="weekly" />
                <el-option label="月报表" value="monthly" />
                <el-option label="年报表" value="yearly" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围" prop="dateRange">
              <el-date-picker
                v-model="exportForm.dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                class="!w-full"
              />
            </el-form-item>
            <el-form-item label="导出维度" prop="dimension">
              <el-select v-model="exportForm.dimension" placeholder="请选择维度" class="!w-full">
                <el-option label="按租户" value="tenant" />
                <el-option label="按店铺" value="shop" />
                <el-option label="按平台" value="platform" />
              </el-select>
            </el-form-item>
            <el-form-item label="租户筛选">
              <el-select v-model="exportForm.tenantIds" multiple placeholder="全部租户" class="!w-full">
                <el-option v-for="item in tenantList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="导出格式" prop="format">
              <el-radio-group v-model="exportForm.format">
                <el-radio-button label="xlsx">Excel</el-radio-button>
                <el-radio-button label="pdf">PDF</el-radio-button>
                <el-radio-button label="csv">CSV</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="包含图表">
              <el-switch v-model="exportForm.includeCharts" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleExport" :loading="exporting">
                <Icon icon="ep:download" class="mr-5px" /> 创建导出任务
              </el-button>
            </el-form-item>
          </el-form>
        </ContentWrap>
      </el-col>

      <!-- 导出历史 -->
      <el-col :span="16">
        <ContentWrap title="导出历史">
          <el-table v-loading="loading" :data="historyList" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="任务ID" align="center" prop="id" width="80" />
            <el-table-column label="报表类型" align="center" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.reportType === 'daily'" type="primary">日报表</el-tag>
                <el-tag v-else-if="scope.row.reportType === 'weekly'" type="success">周报表</el-tag>
                <el-tag v-else-if="scope.row.reportType === 'monthly'" type="warning">月报表</el-tag>
                <el-tag v-else-if="scope.row.reportType === 'yearly'" type="danger">年报表</el-tag>
                <el-tag v-else type="info">自定义</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="时间范围" align="center" width="180">
              <template #default="scope">
                {{ scope.row.startDate }} ~ {{ scope.row.endDate }}
              </template>
            </el-table-column>
            <el-table-column label="格式" align="center" prop="format" width="80">
              <template #default="scope">
                <el-tag size="small">{{ scope.row.format?.toUpperCase() }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.status === 0" type="info">待处理</el-tag>
                <el-tag v-else-if="scope.row.status === 1" type="warning">生成中</el-tag>
                <el-tag v-else-if="scope.row.status === 2" type="success">已完成</el-tag>
                <el-tag v-else type="danger">失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="文件大小" align="center" prop="fileSize" width="100">
              <template #default="scope">
                {{ scope.row.fileSize ? formatFileSize(scope.row.fileSize) : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
            <el-table-column label="操作" align="center" width="120" fixed="right">
              <template #default="scope">
                <el-button
                  v-if="scope.row.status === 2"
                  link
                  type="primary"
                  @click="handleDownload(scope.row)"
                >
                  下载
                </el-button>
                <el-button
                  v-if="scope.row.status === 1"
                  link
                  type="warning"
                  @click="handleRefresh"
                >
                  刷新
                </el-button>
                <el-button
                  v-if="scope.row.status === 3"
                  link
                  type="danger"
                  @click="handleRetry(scope.row)"
                >
                  重试
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getHistoryList" />
        </ContentWrap>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import * as ReportApi from '@/api/finance/report'

defineOptions({ name: 'ReportExport' })

const message = useMessage()
const formRef = ref()
const loading = ref(false)
const exporting = ref(false)
const historyList = ref<any[]>([])
const total = ref(0)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

const exportForm = reactive({
  reportType: 'daily',
  dateRange: [],
  dimension: 'tenant',
  tenantIds: [],
  format: 'xlsx',
  includeCharts: false
})

const rules = {
  reportType: [{ required: true, message: '请选择报表类型', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择时间范围', trigger: 'change' }],
  dimension: [{ required: true, message: '请选择导出维度', trigger: 'change' }],
  format: [{ required: true, message: '请选择导出格式', trigger: 'change' }]
}

const tenantList = ref<any[]>([
  { id: 1, name: '默认租户' }
])

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const getHistoryList = async () => {
  loading.value = true
  try {
    const data = await ReportApi.getExportHistory(queryParams)
    historyList.value = data?.list || []
    total.value = data?.total || 0
  } catch (error) {
    console.error('加载导出历史失败', error)
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  await formRef.value?.validate()
  exporting.value = true
  try {
    const data = {
      reportType: exportForm.reportType,
      startDate: exportForm.dateRange?.[0],
      endDate: exportForm.dateRange?.[1],
      dimension: exportForm.dimension,
      tenantIds: exportForm.tenantIds,
      format: exportForm.format,
      includeCharts: exportForm.includeCharts
    }
    await ReportApi.createExportTask(data)
    message.success('导出任务已创建')
    await getHistoryList()
  } catch (error) {
    console.error('创建导出任务失败', error)
    message.error('创建导出任务失败')
  } finally {
    exporting.value = false
  }
}

const handleDownload = async (row: any) => {
  try {
    await ReportApi.downloadExportFile(row.id)
    message.success('下载成功')
  } catch (error) {
    console.error('下载失败', error)
    message.error('下载失败')
  }
}

const handleRefresh = () => {
  getHistoryList()
}

const handleRetry = async (row: any) => {
  try {
    // 重新创建相同配置的导出任务
    await ReportApi.createExportTask({
      reportType: row.reportType,
      startDate: row.startDate,
      endDate: row.endDate,
      dimension: row.dimension,
      format: row.format
    })
    message.success('重试任务已创建')
    await getHistoryList()
  } catch (error) {
    console.error('重试失败', error)
    message.error('重试失败')
  }
}

onMounted(() => {
  // 设置默认时间范围
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  exportForm.dateRange = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ] as any
  getHistoryList()
})
</script>
