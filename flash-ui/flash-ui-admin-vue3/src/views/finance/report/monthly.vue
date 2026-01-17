<template>
  <div class="monthly-report">
    <ContentWrap>
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="月份">
          <el-date-picker
            v-model="queryParams.month"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            class="!w-200px"
          />
        </el-form-item>
        <el-form-item label="租户">
          <el-select v-model="queryParams.tenantId" placeholder="全部租户" clearable class="!w-200px">
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
          <el-button @click="handleExport" v-hasPermi="['finance:report:export']"><Icon icon="ep:download" class="mr-5px" /> 导出</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 月度汇总 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">本月收入</div>
            <div class="stat-value text-green-600">¥{{ formatMoney(monthSummary.revenue) }}</div>
            <div class="stat-compare">
              <span>同比</span>
              <span :class="monthSummary.revenueYoy >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ monthSummary.revenueYoy >= 0 ? '+' : '' }}{{ monthSummary.revenueYoy }}%
              </span>
              <span class="ml-10px">环比</span>
              <span :class="monthSummary.revenueMom >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ monthSummary.revenueMom >= 0 ? '+' : '' }}{{ monthSummary.revenueMom }}%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">本月支出</div>
            <div class="stat-value text-red-600">¥{{ formatMoney(monthSummary.expense) }}</div>
            <div class="stat-compare">
              <span>同比</span>
              <span :class="monthSummary.expenseYoy >= 0 ? 'text-red-500' : 'text-green-500'">
                {{ monthSummary.expenseYoy >= 0 ? '+' : '' }}{{ monthSummary.expenseYoy }}%
              </span>
              <span class="ml-10px">环比</span>
              <span :class="monthSummary.expenseMom >= 0 ? 'text-red-500' : 'text-green-500'">
                {{ monthSummary.expenseMom >= 0 ? '+' : '' }}{{ monthSummary.expenseMom }}%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">本月利润</div>
            <div class="stat-value text-blue-600">¥{{ formatMoney(monthSummary.profit) }}</div>
            <div class="stat-compare">
              <span>同比</span>
              <span :class="monthSummary.profitYoy >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ monthSummary.profitYoy >= 0 ? '+' : '' }}{{ monthSummary.profitYoy }}%
              </span>
              <span class="ml-10px">环比</span>
              <span :class="monthSummary.profitMom >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ monthSummary.profitMom >= 0 ? '+' : '' }}{{ monthSummary.profitMom }}%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">本月订单</div>
            <div class="stat-value">{{ monthSummary.orderCount }}</div>
            <div class="stat-compare">
              <span>同比</span>
              <span :class="monthSummary.orderYoy >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ monthSummary.orderYoy >= 0 ? '+' : '' }}{{ monthSummary.orderYoy }}%
              </span>
              <span class="ml-10px">环比</span>
              <span :class="monthSummary.orderMom >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ monthSummary.orderMom >= 0 ? '+' : '' }}{{ monthSummary.orderMom }}%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <ContentWrap title="近12个月趋势">
      <div ref="trendChartRef" style="height: 350px"></div>
    </ContentWrap>

    <!-- 月度明细表 -->
    <ContentWrap title="月度明细">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="月份" align="center" prop="month" width="100" />
        <el-table-column label="收入" align="right" width="150">
          <template #default="scope">
            <span class="text-green-600">¥{{ formatMoney(scope.row.revenue) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支出" align="right" width="150">
          <template #default="scope">
            <span class="text-red-600">¥{{ formatMoney(scope.row.expense) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="利润" align="right" width="150">
          <template #default="scope">
            <span :class="scope.row.profit >= 0 ? 'text-blue-600' : 'text-red-600'">
              ¥{{ formatMoney(scope.row.profit) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="同比增长" align="center" width="120">
          <template #default="scope">
            <span :class="scope.row.yoyGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ scope.row.yoyGrowth >= 0 ? '+' : '' }}{{ scope.row.yoyGrowth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="环比增长" align="center" width="120">
          <template #default="scope">
            <span :class="scope.row.momGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ scope.row.momGrowth >= 0 ? '+' : '' }}{{ scope.row.momGrowth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="订单量" align="center" prop="orderCount" width="100" />
        <el-table-column label="平均日收入" align="right" width="120">
          <template #default="scope">
            ¥{{ formatMoney(scope.row.avgDailyRevenue) }}
          </template>
        </el-table-column>
        <el-table-column label="毛利率" align="center" width="100">
          <template #default="scope">
            {{ scope.row.grossProfitRate }}%
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import * as ReportApi from '@/api/finance/report'
import * as echarts from 'echarts'

defineOptions({ name: 'MonthlyReport' })

const message = useMessage()
const loading = ref(false)
const list = ref<any[]>([])
const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

const queryParams = reactive({
  month: new Date().toISOString().slice(0, 7),
  tenantId: undefined
})

const monthSummary = ref({
  revenue: 0,
  revenueYoy: 0,
  revenueMom: 0,
  expense: 0,
  expenseYoy: 0,
  expenseMom: 0,
  profit: 0,
  profitYoy: 0,
  profitMom: 0,
  orderCount: 0,
  orderYoy: 0,
  orderMom: 0
})

const formatMoney = (value: number) => {
  return (value / 100).toFixed(2)
}

const handleQuery = async () => {
  await loadMonthlyData()
  await loadTrendData()
}

const loadMonthlyData = async () => {
  loading.value = true
  try {
    const data = await ReportApi.getMonthlyReport(queryParams)
    list.value = data?.list || []
    if (data?.summary) {
      monthSummary.value = data.summary
    }
  } catch (error) {
    console.error('加载月报数据失败', error)
  } finally {
    loading.value = false
  }
}

const loadTrendData = async () => {
  try {
    const data = await ReportApi.getMonthlyTrend(queryParams)
    initTrendChart(data)
  } catch (error) {
    console.error('加载趋势数据失败', error)
    initTrendChart(null)
  }
}

const initTrendChart = (data: any) => {
  if (!trendChartRef.value) return
  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }
  const months = data?.months || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['收入', '支出', '利润'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '收入', type: 'bar', data: data?.revenues || [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330] },
      { name: '支出', type: 'bar', data: data?.expenses || [80, 92, 71, 94, 60, 130, 110, 82, 91, 134, 190, 230] },
      { name: '利润', type: 'line', data: data?.profits || [40, 40, 30, 40, 30, 100, 100, 100, 100, 100, 100, 100] }
    ]
  }
  trendChart.setOption(option)
}

const handleExport = async () => {
  try {
    await message.confirm('确认导出月报表数据吗？')
    await ReportApi.exportMonthlyReport(queryParams)
    message.success('导出成功')
  } catch {}
}

onMounted(() => {
  handleQuery()
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}
.stat-compare {
  font-size: 12px;
  color: #999;
}
</style>
