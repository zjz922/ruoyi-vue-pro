<template>
  <div class="tenant-analysis">
    <!-- 活跃度指标 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">DAU (日活)</div>
            <div class="stat-value">{{ activeData.dau }}</div>
            <div class="stat-change" :class="activeData.dauGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ activeData.dauGrowth >= 0 ? '+' : '' }}{{ activeData.dauGrowth }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">WAU (周活)</div>
            <div class="stat-value">{{ activeData.wau }}</div>
            <div class="stat-change" :class="activeData.wauGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ activeData.wauGrowth >= 0 ? '+' : '' }}{{ activeData.wauGrowth }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">MAU (月活)</div>
            <div class="stat-value">{{ activeData.mau }}</div>
            <div class="stat-change" :class="activeData.mauGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ activeData.mauGrowth >= 0 ? '+' : '' }}{{ activeData.mauGrowth }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">活跃率</div>
            <div class="stat-value">{{ activeData.activeRate }}%</div>
            <div class="stat-sub">活跃/总租户</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 留存分析 -->
    <ContentWrap title="留存分析">
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="retention-card">
            <div class="retention-title">次日留存</div>
            <el-progress type="circle" :percentage="activeData.retention?.day1 || 0" :width="120" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="retention-card">
            <div class="retention-title">7日留存</div>
            <el-progress type="circle" :percentage="activeData.retention?.day7 || 0" :width="120" status="success" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="retention-card">
            <div class="retention-title">30日留存</div>
            <el-progress type="circle" :percentage="activeData.retention?.day30 || 0" :width="120" status="warning" />
          </div>
        </el-col>
      </el-row>
    </ContentWrap>

    <!-- 活跃趋势和租户分布 -->
    <el-row :gutter="16">
      <el-col :span="16">
        <ContentWrap title="活跃趋势">
          <div ref="trendChartRef" style="height: 350px"></div>
        </ContentWrap>
      </el-col>
      <el-col :span="8">
        <ContentWrap title="租户分布">
          <div ref="distributionChartRef" style="height: 350px"></div>
        </ContentWrap>
      </el-col>
    </el-row>

    <!-- 留存趋势表 -->
    <ContentWrap title="留存趋势明细">
      <el-table :data="retentionList" :stripe="true">
        <el-table-column label="日期" prop="date" width="120" />
        <el-table-column label="新增用户" prop="newUsers" align="center" />
        <el-table-column label="次日留存" align="center">
          <template #default="scope">
            {{ scope.row.day1 }}%
          </template>
        </el-table-column>
        <el-table-column label="3日留存" align="center">
          <template #default="scope">
            {{ scope.row.day3 }}%
          </template>
        </el-table-column>
        <el-table-column label="7日留存" align="center">
          <template #default="scope">
            {{ scope.row.day7 }}%
          </template>
        </el-table-column>
        <el-table-column label="14日留存" align="center">
          <template #default="scope">
            {{ scope.row.day14 }}%
          </template>
        </el-table-column>
        <el-table-column label="30日留存" align="center">
          <template #default="scope">
            {{ scope.row.day30 }}%
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import * as AnalysisApi from '@/api/finance/analysis'
import * as echarts from 'echarts'

defineOptions({ name: 'TenantAnalysis' })

const trendChartRef = ref<HTMLElement>()
const distributionChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let distributionChart: echarts.ECharts | null = null

const activeData = ref({
  dau: 0,
  dauGrowth: 0,
  wau: 0,
  wauGrowth: 0,
  mau: 0,
  mauGrowth: 0,
  activeRate: 0,
  retention: { day1: 0, day7: 0, day30: 0 },
  trend: { dates: [], values: [] }
})

const distribution = ref({
  activeCount: 0,
  silentCount: 0,
  churnCount: 0,
  newCount: 0
})

const retentionList = ref<any[]>([])

const loadActiveData = async () => {
  try {
    const data = await AnalysisApi.getTenantActive({})
    if (data) {
      activeData.value = data
    }
  } catch (error) {
    console.error('加载活跃度数据失败', error)
  }
}

const loadDistribution = async () => {
  try {
    const data = await AnalysisApi.getTenantDistribution({})
    if (data) {
      distribution.value = data
      initDistributionChart()
    }
  } catch (error) {
    console.error('加载租户分布数据失败', error)
  }
}

const loadRetention = async () => {
  try {
    const data = await AnalysisApi.getTenantRetention({})
    if (data?.list) {
      retentionList.value = data.list
    }
  } catch (error) {
    console.error('加载留存数据失败', error)
  }
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['DAU', 'WAU', 'MAU'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: activeData.value.trend?.dates || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      { name: 'DAU', type: 'line', smooth: true, data: [120, 132, 101, 134, 90, 230, 210] },
      { name: 'WAU', type: 'line', smooth: true, data: [220, 182, 191, 234, 290, 330, 310] },
      { name: 'MAU', type: 'line', smooth: true, data: [150, 232, 201, 154, 190, 330, 410] }
    ]
  }
  trendChart.setOption(option)
}

const initDistributionChart = () => {
  if (!distributionChartRef.value) return
  if (!distributionChart) {
    distributionChart = echarts.init(distributionChartRef.value)
  }
  const option = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '租户分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: distribution.value.activeCount || 180, name: '活跃租户', itemStyle: { color: '#22c55e' } },
          { value: distribution.value.silentCount || 50, name: '沉默租户', itemStyle: { color: '#f59e0b' } },
          { value: distribution.value.churnCount || 20, name: '流失租户', itemStyle: { color: '#ef4444' } },
          { value: distribution.value.newCount || 30, name: '新增租户', itemStyle: { color: '#3b82f6' } }
        ]
      }
    ]
  }
  distributionChart.setOption(option)
}

onMounted(async () => {
  await loadActiveData()
  await loadDistribution()
  await loadRetention()
  initTrendChart()
  
  // 模拟留存数据
  if (retentionList.value.length === 0) {
    retentionList.value = [
      { date: '2024-01-15', newUsers: 25, day1: 80, day3: 65, day7: 50, day14: 40, day30: 30 },
      { date: '2024-01-14', newUsers: 30, day1: 75, day3: 60, day7: 48, day14: 38, day30: 28 },
      { date: '2024-01-13', newUsers: 22, day1: 82, day3: 68, day7: 52, day14: 42, day30: 32 },
      { date: '2024-01-12', newUsers: 28, day1: 78, day3: 62, day7: 46, day14: 36, day30: 26 },
      { date: '2024-01-11', newUsers: 35, day1: 85, day3: 70, day7: 55, day14: 45, day30: 35 }
    ]
  }
})

onUnmounted(() => {
  trendChart?.dispose()
  distributionChart?.dispose()
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
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
}
.stat-change {
  font-size: 14px;
}
.stat-sub {
  font-size: 12px;
  color: #999;
}
.retention-card {
  text-align: center;
  padding: 20px 0;
}
.retention-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
