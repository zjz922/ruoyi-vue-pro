<template>
  <div class="reconciliation-exception">
    <!-- 异常统计 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">今日异常</div>
            <div class="stat-value">{{ statistics.todayCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">待处理</div>
            <div class="stat-value text-red-500">{{ statistics.pendingCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">已处理</div>
            <div class="stat-value text-green-500">{{ statistics.handledCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">处理率</div>
            <div class="stat-value">{{ statistics.handleRate }}%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <ContentWrap title="异常趋势">
      <div ref="trendChartRef" style="height: 300px"></div>
    </ContentWrap>

    <!-- 查询条件 -->
    <ContentWrap>
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="异常类型">
          <el-select v-model="queryParams.exceptionType" placeholder="全部类型" clearable class="!w-150px">
            <el-option label="全部" value="" />
            <el-option label="订单异常" value="order" />
            <el-option label="资金异常" value="fund" />
            <el-option label="库存异常" value="inventory" />
            <el-option label="同步异常" value="sync" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="queryParams.handleStatus" placeholder="全部状态" clearable class="!w-150px">
            <el-option label="全部" value="" />
            <el-option label="待处理" :value="0" />
            <el-option label="已处理" :value="1" />
            <el-option label="已忽略" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
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
          <el-button type="primary" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 异常列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="异常ID" align="center" prop="id" width="80" />
        <el-table-column label="异常类型" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.exceptionType === 'order'" type="primary">订单异常</el-tag>
            <el-tag v-else-if="scope.row.exceptionType === 'fund'" type="warning">资金异常</el-tag>
            <el-tag v-else-if="scope.row.exceptionType === 'inventory'" type="success">库存异常</el-tag>
            <el-tag v-else type="danger">同步异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="异常描述" align="center" prop="description" min-width="200" />
        <el-table-column label="影响范围" align="center" prop="affectedScope" width="120" />
        <el-table-column label="处理建议" align="center" prop="suggestion" min-width="150" />
        <el-table-column label="处理状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.handleStatus === 0" type="danger">待处理</el-tag>
            <el-tag v-else-if="scope.row.handleStatus === 1" type="success">已处理</el-tag>
            <el-tag v-else type="info">已忽略</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发生时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <el-button v-if="scope.row.handleStatus === 0" link type="success" @click="handleProcess(scope.row)">处理</el-button>
            <el-button v-if="scope.row.handleStatus === 0" link type="warning" @click="handleIgnore(scope.row)">忽略</el-button>
            <el-button link type="primary" @click="handleView(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </ContentWrap>

    <!-- 处理弹窗 -->
    <el-dialog v-model="handleVisible" title="处理异常" width="500px">
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="handleForm.handleType">
            <el-radio label="fix">修复数据</el-radio>
            <el-radio label="retry">重新同步</el-radio>
            <el-radio label="manual">手动处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="handleForm.remark" type="textarea" :rows="3" placeholder="请输入处理备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="异常详情" width="600px">
      <el-descriptions :column="2" border v-if="currentException">
        <el-descriptions-item label="异常ID">{{ currentException.id }}</el-descriptions-item>
        <el-descriptions-item label="异常类型">{{ currentException.exceptionType }}</el-descriptions-item>
        <el-descriptions-item label="异常描述" :span="2">{{ currentException.description }}</el-descriptions-item>
        <el-descriptions-item label="影响范围">{{ currentException.affectedScope }}</el-descriptions-item>
        <el-descriptions-item label="处理建议">{{ currentException.suggestion }}</el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag v-if="currentException.handleStatus === 0" type="danger">待处理</el-tag>
          <el-tag v-else-if="currentException.handleStatus === 1" type="success">已处理</el-tag>
          <el-tag v-else type="info">已忽略</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发生时间">{{ currentException.createTime }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ currentException.handleTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ currentException.handleBy || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理备注" :span="2">{{ currentException.handleRemark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import * as ReconciliationApi from '@/api/finance/reconciliation'
import * as echarts from 'echarts'

defineOptions({ name: 'ReconciliationException' })

const message = useMessage()
const loading = ref(false)
const submitting = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const handleVisible = ref(false)
const detailVisible = ref(false)
const currentException = ref<any>(null)
const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

const statistics = ref({
  todayCount: 0,
  pendingCount: 0,
  handledCount: 0,
  handleRate: 0
})

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  exceptionType: undefined,
  handleStatus: undefined,
  dateRange: []
})

const handleForm = reactive({
  id: undefined as number | undefined,
  handleType: 'fix',
  remark: ''
})

const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      startDate: queryParams.dateRange?.[0],
      endDate: queryParams.dateRange?.[1]
    }
    const data = await ReconciliationApi.getExceptionPage(params)
    list.value = data?.list || []
    total.value = data?.total || 0
  } catch (error) {
    console.error('加载异常列表失败', error)
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const data = await ReconciliationApi.getExceptionStatistics({})
    if (data) {
      statistics.value = data
    }
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryParams.exceptionType = undefined
  queryParams.handleStatus = undefined
  queryParams.dateRange = []
  handleQuery()
}

const handleProcess = (row: any) => {
  handleForm.id = row.id
  handleForm.handleType = 'fix'
  handleForm.remark = ''
  handleVisible.value = true
}

const handleIgnore = async (row: any) => {
  try {
    await message.confirm('确认忽略该异常吗？')
    await ReconciliationApi.handleException({
      id: row.id,
      handleStatus: 2,
      remark: '忽略处理'
    })
    message.success('操作成功')
    await getList()
    await loadStatistics()
  } catch {}
}

const handleView = (row: any) => {
  currentException.value = row
  detailVisible.value = true
}

const submitHandle = async () => {
  submitting.value = true
  try {
    await ReconciliationApi.handleException({
      id: handleForm.id,
      handleStatus: 1,
      handleType: handleForm.handleType,
      remark: handleForm.remark
    })
    message.success('处理成功')
    handleVisible.value = false
    await getList()
    await loadStatistics()
  } catch (error) {
    console.error('处理失败', error)
  } finally {
    submitting.value = false
  }
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['订单异常', '资金异常', '库存异常', '同步异常'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      { name: '订单异常', type: 'line', data: [5, 3, 4, 2, 6, 3, 4] },
      { name: '资金异常', type: 'line', data: [2, 1, 3, 1, 2, 1, 2] },
      { name: '库存异常', type: 'line', data: [1, 2, 1, 3, 1, 2, 1] },
      { name: '同步异常', type: 'line', data: [3, 2, 2, 1, 3, 2, 3] }
    ]
  }
  trendChart.setOption(option)
}

onMounted(async () => {
  await loadStatistics()
  await getList()
  initTrendChart()
})

onUnmounted(() => {
  trendChart?.dispose()
})
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 10px 0;
}
.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
}
</style>
