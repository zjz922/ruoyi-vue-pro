<template>
  <div class="reconciliation-overview">
    <!-- 状态卡片 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon bg-blue-100">
              <Icon icon="ep:clock" class="text-blue-500 text-2xl" />
            </div>
            <div class="stat-content">
              <div class="stat-title">待对账</div>
              <div class="stat-value">{{ overview.pendingCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon bg-orange-100">
              <Icon icon="ep:loading" class="text-orange-500 text-2xl" />
            </div>
            <div class="stat-content">
              <div class="stat-title">对账中</div>
              <div class="stat-value">{{ overview.processingCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon bg-green-100">
              <Icon icon="ep:circle-check" class="text-green-500 text-2xl" />
            </div>
            <div class="stat-content">
              <div class="stat-title">已完成</div>
              <div class="stat-value">{{ overview.completedCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon bg-red-100">
              <Icon icon="ep:warning" class="text-red-500 text-2xl" />
            </div>
            <div class="stat-content">
              <div class="stat-title">异常数量</div>
              <div class="stat-value text-red-500">{{ overview.exceptionCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <ContentWrap>
      <div class="flex justify-between items-center">
        <div>
          <el-button type="primary" @click="handleStartReconciliation" :loading="starting">
            <Icon icon="ep:refresh" class="mr-5px" /> 一键发起对账
          </el-button>
          <el-button @click="$router.push('/finance/reconciliation/diff')">
            <Icon icon="ep:document" class="mr-5px" /> 查看差异
          </el-button>
          <el-button @click="$router.push('/finance/reconciliation/exception')">
            <Icon icon="ep:warning" class="mr-5px" /> 查看异常
          </el-button>
        </div>
        <div>
          <el-button @click="loadOverview"><Icon icon="ep:refresh" class="mr-5px" /> 刷新</el-button>
        </div>
      </div>
    </ContentWrap>

    <!-- 对账进度 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="8">
        <ContentWrap title="订单对账">
          <div class="progress-card">
            <div class="progress-header">
              <span>总数: {{ overview.orderReconciliation?.total || 0 }}</span>
              <span>已匹配: {{ overview.orderReconciliation?.matched || 0 }}</span>
              <span class="text-red-500">未匹配: {{ overview.orderReconciliation?.unmatched || 0 }}</span>
            </div>
            <el-progress 
              :percentage="overview.orderReconciliation?.progress || 0" 
              :stroke-width="20"
              :text-inside="true"
            />
          </div>
        </ContentWrap>
      </el-col>
      <el-col :span="8">
        <ContentWrap title="资金对账">
          <div class="progress-card">
            <div class="progress-header">
              <span>总数: {{ overview.fundReconciliation?.total || 0 }}</span>
              <span>已匹配: {{ overview.fundReconciliation?.matched || 0 }}</span>
              <span class="text-red-500">未匹配: {{ overview.fundReconciliation?.unmatched || 0 }}</span>
            </div>
            <el-progress 
              :percentage="overview.fundReconciliation?.progress || 0" 
              :stroke-width="20"
              :text-inside="true"
              status="success"
            />
          </div>
        </ContentWrap>
      </el-col>
      <el-col :span="8">
        <ContentWrap title="库存对账">
          <div class="progress-card">
            <div class="progress-header">
              <span>总数: {{ overview.inventoryReconciliation?.total || 0 }}</span>
              <span>已匹配: {{ overview.inventoryReconciliation?.matched || 0 }}</span>
              <span class="text-red-500">未匹配: {{ overview.inventoryReconciliation?.unmatched || 0 }}</span>
            </div>
            <el-progress 
              :percentage="overview.inventoryReconciliation?.progress || 0" 
              :stroke-width="20"
              :text-inside="true"
              status="warning"
            />
          </div>
        </ContentWrap>
      </el-col>
    </el-row>

    <!-- 异常汇总 -->
    <ContentWrap title="异常汇总">
      <el-row :gutter="16">
        <el-col :span="12">
          <div ref="exceptionChartRef" style="height: 300px"></div>
        </el-col>
        <el-col :span="12">
          <el-table :data="recentExceptions" :stripe="true" max-height="300">
            <el-table-column label="异常类型" prop="exceptionType" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.exceptionType === 'order'" type="primary">订单异常</el-tag>
                <el-tag v-else-if="scope.row.exceptionType === 'fund'" type="warning">资金异常</el-tag>
                <el-tag v-else type="success">库存异常</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="异常描述" prop="description" show-overflow-tooltip />
            <el-table-column label="发生时间" prop="createTime" width="160" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.status === 0" type="danger">待处理</el-tag>
                <el-tag v-else type="success">已处理</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import * as ReconciliationApi from '@/api/finance/reconciliation'
import * as echarts from 'echarts'

defineOptions({ name: 'ReconciliationOverview' })

const message = useMessage()
const exceptionChartRef = ref<HTMLElement>()
let exceptionChart: echarts.ECharts | null = null
const starting = ref(false)

const overview = ref({
  pendingCount: 0,
  processingCount: 0,
  completedCount: 0,
  exceptionCount: 0,
  orderReconciliation: { total: 0, matched: 0, unmatched: 0, progress: 0 },
  fundReconciliation: { total: 0, matched: 0, unmatched: 0, progress: 0 },
  inventoryReconciliation: { total: 0, matched: 0, unmatched: 0, progress: 0 }
})

const recentExceptions = ref<any[]>([])

const loadOverview = async () => {
  try {
    const data = await ReconciliationApi.getReconciliationOverview()
    if (data) {
      overview.value = data
    }
  } catch (error) {
    console.error('加载对账总览失败', error)
  }
}

const handleStartReconciliation = async () => {
  try {
    await message.confirm('确认发起全平台对账任务吗？')
    starting.value = true
    await ReconciliationApi.startReconciliation({})
    message.success('对账任务已发起')
    await loadOverview()
  } catch (error) {
    console.error('发起对账失败', error)
  } finally {
    starting.value = false
  }
}

const initExceptionChart = () => {
  if (!exceptionChartRef.value) return
  if (!exceptionChart) {
    exceptionChart = echarts.init(exceptionChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '异常类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: [
          { value: overview.value.orderReconciliation?.unmatched || 5, name: '订单异常' },
          { value: overview.value.fundReconciliation?.unmatched || 3, name: '资金异常' },
          { value: overview.value.inventoryReconciliation?.unmatched || 2, name: '库存异常' }
        ]
      }
    ]
  }
  exceptionChart.setOption(option)
}

onMounted(async () => {
  await loadOverview()
  initExceptionChart()
  
  // 模拟最近异常数据
  recentExceptions.value = [
    { exceptionType: 'order', description: '订单金额不匹配', createTime: '2024-01-15 10:30:00', status: 0 },
    { exceptionType: 'fund', description: '资金流水缺失', createTime: '2024-01-15 09:20:00', status: 0 },
    { exceptionType: 'inventory', description: '库存数量差异', createTime: '2024-01-14 16:45:00', status: 1 }
  ]
})

onUnmounted(() => {
  exceptionChart?.dispose()
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-content {
  flex: 1;
}
.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
}
.progress-card {
  padding: 10px 0;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}
</style>
