<template>
  <div class="analysis-dashboard">
    <!-- 核心指标 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon bg-blue-100">
            <Icon icon="ep:user" class="text-blue-500 text-3xl" />
          </div>
          <div class="stat-content">
            <div class="stat-title">租户总数</div>
            <div class="stat-value">{{ dashboard.totalTenants }}</div>
            <div class="stat-sub">活跃: {{ dashboard.activeTenants }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon bg-green-100">
            <Icon icon="ep:money" class="text-green-500 text-3xl" />
          </div>
          <div class="stat-content">
            <div class="stat-title">总收入</div>
            <div class="stat-value">¥{{ formatMoney(dashboard.totalRevenue) }}</div>
            <div class="stat-sub text-green-500">今日: ¥{{ formatMoney(dashboard.todayRevenue) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon bg-orange-100">
            <Icon icon="ep:shopping-cart" class="text-orange-500 text-3xl" />
          </div>
          <div class="stat-content">
            <div class="stat-title">总订单量</div>
            <div class="stat-value">{{ formatNumber(dashboard.totalOrders) }}</div>
            <div class="stat-sub">今日: {{ dashboard.todayOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card health-card" :class="healthClass">
          <div class="stat-icon" :class="healthBgClass">
            <Icon icon="ep:monitor" class="text-3xl" :class="healthIconClass" />
          </div>
          <div class="stat-content">
            <div class="stat-title">健康度评分</div>
            <div class="stat-value">{{ dashboard.healthScore }}</div>
            <div class="stat-sub">{{ healthStatusText }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时数据和预警 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="16">
        <ContentWrap title="今日实时数据">
          <div ref="realtimeChartRef" style="height: 300px"></div>
        </ContentWrap>
      </el-col>
      <el-col :span="8">
        <ContentWrap title="预警摘要">
          <div class="alert-summary">
            <div class="alert-item">
              <div class="alert-count text-red-500">{{ dashboard.alerts?.urgentCount || 0 }}</div>
              <div class="alert-label">紧急预警</div>
            </div>
            <div class="alert-item">
              <div class="alert-count text-orange-500">{{ dashboard.alerts?.unhandledCount || 0 }}</div>
              <div class="alert-label">待处理</div>
            </div>
          </div>
          <el-button type="primary" class="w-full mt-16px" @click="$router.push('/finance/alert')">
            查看全部预警
          </el-button>
        </ContentWrap>
      </el-col>
    </el-row>

    <!-- 快速入口 -->
    <ContentWrap title="快速入口">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card shadow="hover" class="quick-entry" @click="$router.push('/finance/analysis/tenant')">
            <Icon icon="ep:user" class="entry-icon text-blue-500" />
            <div class="entry-title">租户活跃度分析</div>
            <div class="entry-desc">DAU、MAU、留存率分析</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="quick-entry" @click="$router.push('/finance/analysis/revenue')">
            <Icon icon="ep:money" class="entry-icon text-green-500" />
            <div class="entry-title">收入分析</div>
            <div class="entry-desc">收入趋势、构成、ARPU</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="quick-entry" @click="$router.push('/finance/analysis/trend')">
            <Icon icon="ep:trend-charts" class="entry-icon text-orange-500" />
            <div class="entry-title">趋势分析</div>
            <div class="entry-desc">用户增长、数据量趋势</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="quick-entry" @click="$router.push('/finance/report')">
            <Icon icon="ep:document" class="entry-icon text-purple-500" />
            <div class="entry-title">财务报表</div>
            <div class="entry-desc">日报、月报、租户报表</div>
          </el-card>
        </el-col>
      </el-row>
    </ContentWrap>

    <!-- 趋势概览 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <ContentWrap title="租户增长趋势">
          <div ref="tenantTrendChartRef" style="height: 300px"></div>
        </ContentWrap>
      </el-col>
      <el-col :span="12">
        <ContentWrap title="收入趋势">
          <div ref="revenueTrendChartRef" style="height: 300px"></div>
        </ContentWrap>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import * as AnalysisApi from '@/api/finance/analysis'
import * as echarts from 'echarts'

defineOptions({ name: 'AnalysisDashboard' })

const realtimeChartRef = ref<HTMLElement>()
const tenantTrendChartRef = ref<HTMLElement>()
const revenueTrendChartRef = ref<HTMLElement>()
let realtimeChart: echarts.ECharts | null = null
let tenantTrendChart: echarts.ECharts | null = null
let revenueTrendChart: echarts.ECharts | null = null

const dashboard = ref({
  totalTenants: 0,
  activeTenants: 0,
  totalRevenue: 0,
  totalOrders: 0,
  todayNewTenants: 0,
  todayRevenue: 0,
  todayOrders: 0,
  healthScore: 0,
  healthStatus: 'good',
  alerts: { unhandledCount: 0, urgentCount: 0 }
})

const healthClass = computed(() => {
  const status = dashboard.value.healthStatus
  return {
    'health-excellent': status === 'excellent',
    'health-good': status === 'good',
    'health-warning': status === 'warning',
    'health-critical': status === 'critical'
  }
})

const healthBgClass = computed(() => {
  const status = dashboard.value.healthStatus
  if (status === 'excellent') return 'bg-green-100'
  if (status === 'good') return 'bg-blue-100'
  if (status === 'warning') return 'bg-orange-100'
  return 'bg-red-100'
})

const healthIconClass = computed(() => {
  const status = dashboard.value.healthStatus
  if (status === 'excellent') return 'text-green-500'
  if (status === 'good') return 'text-blue-500'
  if (status === 'warning') return 'text-orange-500'
  return 'text-red-500'
})

const healthStatusText = computed(() => {
  const status = dashboard.value.healthStatus
  if (status === 'excellent') return '优秀'
  if (status === 'good') return '良好'
  if (status === 'warning') return '警告'
  return '严重'
})

const formatMoney = (value: number) => {
  return (value / 100).toFixed(2)
}

const formatNumber = (value: number) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  }
  return value.toString()
}

const loadDashboard = async () => {
  try {
    const data = await AnalysisApi.getDashboard()
    if (data) {
      dashboard.value = data
    }
  } catch (error) {
    console.error('加载仪表盘数据失败', error)
  }
}

const initRealtimeChart = () => {
  if (!realtimeChartRef.value) return
  if (!realtimeChart) {
    realtimeChart = echarts.init(realtimeChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增租户', '订单量', '收入(万)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
    },
    yAxis: { type: 'value' },
    series: [
      { name: '新增租户', type: 'bar', data: [2, 1, 5, 8, 12, 6, 3] },
      { name: '订单量', type: 'line', data: [50, 30, 120, 280, 350, 200, 80] },
      { name: '收入(万)', type: 'line', data: [0.5, 0.3, 1.2, 2.8, 3.5, 2.0, 0.8] }
    ]
  }
  realtimeChart.setOption(option)
}

const initTenantTrendChart = () => {
  if (!tenantTrendChartRef.value) return
  if (!tenantTrendChart) {
    tenantTrendChart = echarts.init(tenantTrendChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增租户', '累计租户'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      { type: 'value', name: '新增' },
      { type: 'value', name: '累计' }
    ],
    series: [
      { name: '新增租户', type: 'bar', data: [20, 25, 30, 35, 40, 45] },
      { name: '累计租户', type: 'line', yAxisIndex: 1, data: [100, 125, 155, 190, 230, 275] }
    ]
  }
  tenantTrendChart.setOption(option)
}

const initRevenueTrendChart = () => {
  if (!revenueTrendChartRef.value) return
  if (!revenueTrendChart) {
    revenueTrendChart = echarts.init(revenueTrendChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['订阅收入', '增值服务', '其他'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', name: '收入(万)' },
    series: [
      { name: '订阅收入', type: 'bar', stack: 'total', data: [50, 55, 60, 65, 70, 75] },
      { name: '增值服务', type: 'bar', stack: 'total', data: [10, 12, 15, 18, 20, 22] },
      { name: '其他', type: 'bar', stack: 'total', data: [5, 6, 7, 8, 9, 10] }
    ]
  }
  revenueTrendChart.setOption(option)
}

onMounted(async () => {
  await loadDashboard()
  initRealtimeChart()
  initTenantTrendChart()
  initRevenueTrendChart()
})

onUnmounted(() => {
  realtimeChart?.dispose()
  tenantTrendChart?.dispose()
  revenueTrendChart?.dispose()
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 16px;
}
.stat-icon {
  width: 70px;
  height: 70px;
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
  margin-bottom: 4px;
}
.stat-sub {
  font-size: 12px;
  color: #999;
}
.alert-summary {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
.alert-item {
  text-align: center;
}
.alert-count {
  font-size: 36px;
  font-weight: bold;
}
.alert-label {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}
.quick-entry {
  text-align: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}
.quick-entry:hover {
  transform: translateY(-5px);
}
.entry-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.entry-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}
.entry-desc {
  font-size: 12px;
  color: #999;
}
</style>
