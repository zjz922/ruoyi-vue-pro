<template>
  <div class="trend-analysis">
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

    <!-- 用户增长趋势 -->
    <ContentWrap title="用户增长趋势">
      <div ref="userGrowthChartRef" style="height: 350px"></div>
    </ContentWrap>

    <!-- 数据量趋势 -->
    <ContentWrap title="数据量趋势">
      <div ref="dataVolumeChartRef" style="height: 350px"></div>
    </ContentWrap>

    <!-- 使用趋势 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <ContentWrap title="API调用量趋势">
          <div ref="apiUsageChartRef" style="height: 300px"></div>
        </ContentWrap>
      </el-col>
      <el-col :span="12">
        <ContentWrap title="功能使用频率">
          <div ref="featureUsageChartRef" style="height: 300px"></div>
        </ContentWrap>
      </el-col>
    </el-row>

    <!-- 趋势预测 -->
    <ContentWrap title="趋势预测">
      <el-alert type="info" :closable="false" class="mb-16px">
        基于历史数据的趋势预测，仅供参考。预测周期：未来30天
      </el-alert>
      <el-row :gutter="16">
        <el-col :span="16">
          <div ref="forecastChartRef" style="height: 300px"></div>
        </el-col>
        <el-col :span="8">
          <div class="forecast-summary">
            <div class="forecast-item">
              <div class="forecast-label">预计新增租户</div>
              <div class="forecast-value text-blue-600">+{{ forecast.newTenants }}</div>
            </div>
            <div class="forecast-item">
              <div class="forecast-label">预计订单增长</div>
              <div class="forecast-value text-green-600">+{{ forecast.orderGrowth }}%</div>
            </div>
            <div class="forecast-item">
              <div class="forecast-label">预计收入增长</div>
              <div class="forecast-value text-orange-600">+{{ forecast.revenueGrowth }}%</div>
            </div>
            <div class="forecast-item">
              <div class="forecast-label">预测置信度</div>
              <div class="forecast-value">{{ forecast.confidence }}%</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import * as AnalysisApi from '@/api/finance/analysis'
import * as echarts from 'echarts'

defineOptions({ name: 'TrendAnalysis' })

const userGrowthChartRef = ref<HTMLElement>()
const dataVolumeChartRef = ref<HTMLElement>()
const apiUsageChartRef = ref<HTMLElement>()
const featureUsageChartRef = ref<HTMLElement>()
const forecastChartRef = ref<HTMLElement>()

let userGrowthChart: echarts.ECharts | null = null
let dataVolumeChart: echarts.ECharts | null = null
let apiUsageChart: echarts.ECharts | null = null
let featureUsageChart: echarts.ECharts | null = null
let forecastChart: echarts.ECharts | null = null

const queryParams = reactive({
  dateRange: [],
  granularity: 'day'
})

const forecast = ref({
  newTenants: 45,
  orderGrowth: 12.5,
  revenueGrowth: 15.2,
  confidence: 85
})

const handleQuery = () => {
  loadAllData()
}

const loadAllData = async () => {
  try {
    await Promise.all([
      loadUserGrowth(),
      loadDataVolume(),
      loadUsage(),
      loadForecast()
    ])
  } catch (error) {
    console.error('加载数据失败', error)
  }
}

const loadUserGrowth = async () => {
  try {
    await AnalysisApi.getUserGrowthTrend({})
    initUserGrowthChart()
  } catch (error) {
    initUserGrowthChart()
  }
}

const loadDataVolume = async () => {
  try {
    await AnalysisApi.getDataVolumeTrend({})
    initDataVolumeChart()
  } catch (error) {
    initDataVolumeChart()
  }
}

const loadUsage = async () => {
  try {
    await AnalysisApi.getUsageTrend({})
    initApiUsageChart()
    initFeatureUsageChart()
  } catch (error) {
    initApiUsageChart()
    initFeatureUsageChart()
  }
}

const loadForecast = async () => {
  try {
    const data = await AnalysisApi.getTrendForecast({})
    if (data) {
      forecast.value = data
    }
    initForecastChart()
  } catch (error) {
    initForecastChart()
  }
}

const initUserGrowthChart = () => {
  if (!userGrowthChartRef.value) return
  if (!userGrowthChart) {
    userGrowthChart = echarts.init(userGrowthChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增租户', '累计租户'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: [
      { type: 'value', name: '新增' },
      { type: 'value', name: '累计' }
    ],
    series: [
      { name: '新增租户', type: 'bar', data: [20, 25, 30, 28, 35, 40, 38, 45, 50, 48, 55, 60] },
      { name: '累计租户', type: 'line', yAxisIndex: 1, data: [100, 125, 155, 183, 218, 258, 296, 341, 391, 439, 494, 554] }
    ]
  }
  userGrowthChart.setOption(option)
}

const initDataVolumeChart = () => {
  if (!dataVolumeChartRef.value) return
  if (!dataVolumeChart) {
    dataVolumeChart = echarts.init(dataVolumeChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['订单量', '同步数据量(万)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: { type: 'value' },
    series: [
      { name: '订单量', type: 'line', smooth: true, areaStyle: { opacity: 0.3 }, data: [5000, 5500, 6000, 6200, 7000, 7500, 7200, 8000, 8500, 8200, 9000, 9500] },
      { name: '同步数据量(万)', type: 'line', smooth: true, areaStyle: { opacity: 0.3 }, data: [50, 55, 60, 62, 70, 75, 72, 80, 85, 82, 90, 95] }
    ]
  }
  dataVolumeChart.setOption(option)
}

const initApiUsageChart = () => {
  if (!apiUsageChartRef.value) return
  if (!apiUsageChart) {
    apiUsageChart = echarts.init(apiUsageChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value', name: '调用次数(万)' },
    series: [
      { name: 'API调用量', type: 'line', smooth: true, areaStyle: {}, data: [120, 132, 101, 134, 90, 50, 60] }
    ]
  }
  apiUsageChart.setOption(option)
}

const initFeatureUsageChart = () => {
  if (!featureUsageChartRef.value) return
  if (!featureUsageChart) {
    featureUsageChart = echarts.init(featureUsageChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '功能使用',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 1048, name: '订单管理' },
          { value: 735, name: '财务报表' },
          { value: 580, name: '数据同步' },
          { value: 484, name: '对账管理' },
          { value: 300, name: '其他' }
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  }
  featureUsageChart.setOption(option)
}

const initForecastChart = () => {
  if (!forecastChartRef.value) return
  if (!forecastChart) {
    forecastChart = echarts.init(forecastChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['历史数据', '预测数据'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['10月', '11月', '12月', '1月(预测)', '2月(预测)', '3月(预测)']
    },
    yAxis: { type: 'value' },
    series: [
      { 
        name: '历史数据', 
        type: 'line', 
        data: [48, 55, 60, null, null, null],
        lineStyle: { type: 'solid' }
      },
      { 
        name: '预测数据', 
        type: 'line', 
        data: [null, null, 60, 65, 72, 80],
        lineStyle: { type: 'dashed' },
        itemStyle: { color: '#f59e0b' }
      }
    ]
  }
  forecastChart.setOption(option)
}

onMounted(async () => {
  // 设置默认时间范围
  const end = new Date()
  const start = new Date()
  start.setFullYear(start.getFullYear() - 1)
  queryParams.dateRange = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ] as any
  
  await loadAllData()
})

onUnmounted(() => {
  userGrowthChart?.dispose()
  dataVolumeChart?.dispose()
  apiUsageChart?.dispose()
  featureUsageChart?.dispose()
  forecastChart?.dispose()
})
</script>

<style scoped>
.forecast-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
.forecast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}
.forecast-label {
  font-size: 14px;
  color: #666;
}
.forecast-value {
  font-size: 24px;
  font-weight: bold;
}
</style>
