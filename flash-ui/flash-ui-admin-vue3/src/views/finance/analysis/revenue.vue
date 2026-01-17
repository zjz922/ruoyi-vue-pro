<template>
  <div class="revenue-analysis">
    <!-- 时间筛选 -->
    <ContentWrap>
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="!w-280px"
          />
        </el-form-item>
        <el-form-item label="时间粒度">
          <el-radio-group v-model="queryParams.granularity">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 收入概览 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">总收入</div>
            <div class="stat-value text-green-600">¥{{ formatMoney(overview.totalRevenue) }}</div>
            <div class="stat-change" :class="overview.totalRevenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ overview.totalRevenueGrowth >= 0 ? '↑' : '↓' }}{{ Math.abs(overview.totalRevenueGrowth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">订阅收入</div>
            <div class="stat-value">¥{{ formatMoney(overview.subscriptionRevenue) }}</div>
            <div class="stat-change" :class="overview.subscriptionGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ overview.subscriptionGrowth >= 0 ? '↑' : '↓' }}{{ Math.abs(overview.subscriptionGrowth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">增值服务收入</div>
            <div class="stat-value">¥{{ formatMoney(overview.valueAddedRevenue) }}</div>
            <div class="stat-change" :class="overview.valueAddedGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ overview.valueAddedGrowth >= 0 ? '↑' : '↓' }}{{ Math.abs(overview.valueAddedGrowth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">ARPU</div>
            <div class="stat-value">¥{{ formatMoney(overview.arpu) }}</div>
            <div class="stat-change" :class="overview.arpuGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ overview.arpuGrowth >= 0 ? '↑' : '↓' }}{{ Math.abs(overview.arpuGrowth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收入趋势和构成 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="16">
        <ContentWrap title="收入趋势">
          <div ref="trendChartRef" style="height: 350px"></div>
        </ContentWrap>
      </el-col>
      <el-col :span="8">
        <ContentWrap title="收入构成">
          <div ref="compositionChartRef" style="height: 350px"></div>
        </ContentWrap>
      </el-col>
    </el-row>

    <!-- ARPU分析 -->
    <ContentWrap title="ARPU分析">
      <el-row :gutter="16">
        <el-col :span="12">
          <div ref="arpuTrendChartRef" style="height: 300px"></div>
        </el-col>
        <el-col :span="12">
          <el-table :data="arpuList" :stripe="true" max-height="300">
            <el-table-column label="时间段" prop="period" width="120" />
            <el-table-column label="活跃用户" prop="activeUsers" align="center" />
            <el-table-column label="总收入" align="right">
              <template #default="scope">
                ¥{{ formatMoney(scope.row.revenue) }}
              </template>
            </el-table-column>
            <el-table-column label="ARPU" align="right">
              <template #default="scope">
                ¥{{ formatMoney(scope.row.arpu) }}
              </template>
            </el-table-column>
            <el-table-column label="环比" align="center">
              <template #default="scope">
                <span :class="scope.row.growth >= 0 ? 'text-green-500' : 'text-red-500'">
                  {{ scope.row.growth >= 0 ? '+' : '' }}{{ scope.row.growth }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import * as AnalysisApi from '@/api/finance/analysis'
import * as echarts from 'echarts'

defineOptions({ name: 'RevenueAnalysis' })

const trendChartRef = ref<HTMLElement>()
const compositionChartRef = ref<HTMLElement>()
const arpuTrendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let compositionChart: echarts.ECharts | null = null
let arpuTrendChart: echarts.ECharts | null = null

const queryParams = reactive({
  dateRange: [],
  granularity: 'day'
})

const overview = ref({
  totalRevenue: 0,
  totalRevenueGrowth: 0,
  subscriptionRevenue: 0,
  subscriptionGrowth: 0,
  valueAddedRevenue: 0,
  valueAddedGrowth: 0,
  otherRevenue: 0,
  arpu: 0,
  arpuGrowth: 0
})

const arpuList = ref<any[]>([])

const formatMoney = (value: number) => {
  return (value / 100).toFixed(2)
}

const loadOverview = async () => {
  try {
    const params = {
      startDate: queryParams.dateRange?.[0],
      endDate: queryParams.dateRange?.[1],
      granularity: queryParams.granularity
    }
    const data = await AnalysisApi.getRevenueOverview(params)
    if (data) {
      overview.value = data
    }
  } catch (error) {
    console.error('加载收入概览失败', error)
  }
}

const loadArpuData = async () => {
  try {
    const data = await AnalysisApi.getArpuData({})
    if (data?.list) {
      arpuList.value = data.list
    }
  } catch (error) {
    console.error('加载ARPU数据失败', error)
  }
}

const handleQuery = async () => {
  await loadOverview()
  initTrendChart()
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['订阅收入', '增值服务', '其他收入'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', name: '收入(万)' },
    series: [
      { name: '订阅收入', type: 'line', stack: 'total', areaStyle: {}, data: [50, 55, 60, 65, 70, 75] },
      { name: '增值服务', type: 'line', stack: 'total', areaStyle: {}, data: [10, 12, 15, 18, 20, 22] },
      { name: '其他收入', type: 'line', stack: 'total', areaStyle: {}, data: [5, 6, 7, 8, 9, 10] }
    ]
  }
  trendChart.setOption(option)
}

const initCompositionChart = () => {
  if (!compositionChartRef.value) return
  if (!compositionChart) {
    compositionChart = echarts.init(compositionChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '收入构成',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: overview.value.subscriptionRevenue / 100 || 7500, name: '订阅收入' },
          { value: overview.value.valueAddedRevenue / 100 || 2200, name: '增值服务' },
          { value: overview.value.otherRevenue / 100 || 1000, name: '其他收入' }
        ]
      }
    ]
  }
  compositionChart.setOption(option)
}

const initArpuTrendChart = () => {
  if (!arpuTrendChartRef.value) return
  if (!arpuTrendChart) {
    arpuTrendChart = echarts.init(arpuTrendChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['ARPU', '活跃用户'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      { type: 'value', name: 'ARPU(元)' },
      { type: 'value', name: '活跃用户' }
    ],
    series: [
      { name: 'ARPU', type: 'bar', data: [280, 290, 300, 310, 320, 330] },
      { name: '活跃用户', type: 'line', yAxisIndex: 1, data: [180, 190, 200, 210, 220, 230] }
    ]
  }
  arpuTrendChart.setOption(option)
}

onMounted(async () => {
  // 设置默认时间范围
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 6)
  queryParams.dateRange = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ] as any
  
  await loadOverview()
  await loadArpuData()
  initTrendChart()
  initCompositionChart()
  initArpuTrendChart()
  
  // 模拟ARPU数据
  if (arpuList.value.length === 0) {
    arpuList.value = [
      { period: '2024-01', activeUsers: 180, revenue: 5040000, arpu: 28000, growth: 5.2 },
      { period: '2024-02', activeUsers: 190, revenue: 5510000, arpu: 29000, growth: 3.6 },
      { period: '2024-03', activeUsers: 200, revenue: 6000000, arpu: 30000, growth: 3.4 },
      { period: '2024-04', activeUsers: 210, revenue: 6510000, arpu: 31000, growth: 3.3 },
      { period: '2024-05', activeUsers: 220, revenue: 7040000, arpu: 32000, growth: 3.2 },
      { period: '2024-06', activeUsers: 230, revenue: 7590000, arpu: 33000, growth: 3.1 }
    ]
  }
})

onUnmounted(() => {
  trendChart?.dispose()
  compositionChart?.dispose()
  arpuTrendChart?.dispose()
})
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 15px 0;
}
.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}
.stat-change {
  font-size: 14px;
}
</style>
