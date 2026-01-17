<template>
  <div class="daily-report-container">
    <!-- 页面头部 -->
    <el-card class="box-card header-card">
      <template #header>
        <div class="card-header">
          <span class="title">{{ $t('finance.report.dailyReport') }}</span>
          <div class="header-actions">
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="选择日期"
              @change="handleDateChange"
            />
            <el-button type="primary" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>
              {{ $t('common.refresh') }}
            </el-button>
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>
              {{ $t('common.export') }}
            </el-button>
          </div>
        </div>
      </template>
    </el-card>

    <!-- 关键指标 -->
    <el-row :gutter="20" class="metrics-section">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: #e6f7ff">
              <el-icon style="color: #409eff; font-size: 24px"><Money /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">{{ $t('finance.report.totalIncome') }}</div>
              <div class="metric-value">¥{{ formatAmount(dailyData.totalIncome) }}</div>
              <div class="metric-change">
                <span :class="dailyData.incomeChange >= 0 ? 'positive' : 'negative'">
                  {{ dailyData.incomeChange >= 0 ? '+' : '' }}{{ dailyData.incomeChange }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: #fef0f0">
              <el-icon style="color: #f56c6c; font-size: 24px"><Delete /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">{{ $t('finance.report.totalExpense') }}</div>
              <div class="metric-value">¥{{ formatAmount(dailyData.totalExpense) }}</div>
              <div class="metric-change">
                <span :class="dailyData.expenseChange >= 0 ? 'negative' : 'positive'">
                  {{ dailyData.expenseChange >= 0 ? '+' : '' }}{{ dailyData.expenseChange }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: #f0f9ff">
              <el-icon style="color: #67c23a; font-size: 24px"><SuccessFilled /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">{{ $t('finance.report.netIncome') }}</div>
              <div class="metric-value">¥{{ formatAmount(dailyData.netIncome) }}</div>
              <div class="metric-change">
                <span :class="dailyData.netIncome >= 0 ? 'positive' : 'negative'">
                  {{ ((dailyData.netIncome / dailyData.totalIncome) * 100).toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: #faf3e6">
              <el-icon style="color: #e6a23c; font-size: 24px"><ShoppingCart /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">{{ $t('finance.report.orderCount') }}</div>
              <div class="metric-value">{{ dailyData.orderCount }}</div>
              <div class="metric-change">
                <span :class="dailyData.orderChange >= 0 ? 'positive' : 'negative'">
                  {{ dailyData.orderChange >= 0 ? '+' : '' }}{{ dailyData.orderChange }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收支趋势图 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('finance.report.hourlyTrend') }}</span>
              <div class="chart-controls">
                <el-radio-group v-model="chartType" @change="handleChartTypeChange">
                  <el-radio-button label="line">{{ $t('finance.report.line') }}</el-radio-button>
                  <el-radio-button label="bar">{{ $t('finance.report.bar') }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div id="trendChart" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收入来源分布 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('finance.report.incomeSource') }}</span>
            </div>
          </template>
          <div id="incomeSourceChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('finance.report.expenseCategory') }}</span>
            </div>
          </template>
          <div id="expenseCategoryChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据表格 -->
    <el-card class="data-table-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('finance.report.hourlyDetail') }}</span>
          <div class="header-actions">
            <el-input-number
              v-model="pageSize"
              :min="10"
              :max="100"
              @change="handlePageSizeChange"
            />
          </div>
        </div>
      </template>

      <el-table :data="hourlyData" stripe border>
        <el-table-column prop="hour" :label="$t('finance.report.hour')" width="80" />
        <el-table-column prop="orderCount" :label="$t('finance.report.orderCount')" width="100" />
        <el-table-column prop="income" :label="$t('finance.report.income')" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.income) }}
          </template>
        </el-table-column>
        <el-table-column prop="expense" :label="$t('finance.report.expense')" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.expense) }}
          </template>
        </el-table-column>
        <el-table-column prop="netIncome" :label="$t('finance.report.netIncome')" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.netIncome) }}
          </template>
        </el-table-column>
        <el-table-column prop="conversionRate" :label="$t('finance.report.conversionRate')" width="120">
          <template #default="{ row }">
            {{ (row.conversionRate * 100).toFixed(2) }}%
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  Download,
  Money,
  Delete,
  SuccessFilled,
  ShoppingCart,
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ============ 数据定义 ============
const selectedDate = ref(new Date())
const chartType = ref('line')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(24)

// 日报表数据
const dailyData = reactive({
  totalIncome: 45000,
  totalExpense: 15000,
  netIncome: 30000,
  orderCount: 250,
  incomeChange: 12.5,
  expenseChange: -8.3,
  orderChange: 5.2,
})

// 按小时数据
const hourlyData = ref([
  { hour: '00:00-01:00', orderCount: 5, income: 1200, expense: 400, netIncome: 800, conversionRate: 0.08 },
  { hour: '01:00-02:00', orderCount: 3, income: 800, expense: 250, netIncome: 550, conversionRate: 0.05 },
  { hour: '02:00-03:00', orderCount: 2, income: 600, expense: 200, netIncome: 400, conversionRate: 0.03 },
  { hour: '03:00-04:00', orderCount: 1, income: 400, expense: 150, netIncome: 250, conversionRate: 0.02 },
  { hour: '04:00-05:00', orderCount: 2, income: 500, expense: 180, netIncome: 320, conversionRate: 0.02 },
  { hour: '05:00-06:00', orderCount: 4, income: 1000, expense: 350, netIncome: 650, conversionRate: 0.05 },
  { hour: '06:00-07:00', orderCount: 8, income: 2200, expense: 700, netIncome: 1500, conversionRate: 0.12 },
  { hour: '07:00-08:00', orderCount: 15, income: 4500, expense: 1500, netIncome: 3000, conversionRate: 0.22 },
  { hour: '08:00-09:00', orderCount: 20, income: 6000, expense: 2000, netIncome: 4000, conversionRate: 0.28 },
  { hour: '09:00-10:00', orderCount: 18, income: 5400, expense: 1800, netIncome: 3600, conversionRate: 0.25 },
])

// ============ 方法定义 ============

/**
 * 格式化金额
 */
const formatAmount = (value: number): string => {
  if (Math.abs(value) >= 10000) {
    return `${(value / 10000).toFixed(2)}万`
  }
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * 初始化图表
 */
const initCharts = () => {
  // 趋势图
  const trendChart = echarts.init(document.getElementById('trendChart'))
  const trendOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [t('finance.report.income'), t('finance.report.expense')],
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('finance.report.income'),
        data: [1200, 800, 600, 400, 500, 1000, 2200, 4500, 6000, 5400, 4800, 5200, 6500, 7200, 6800, 5500, 4200, 3800, 3200, 2800, 2200, 1800, 1500, 1200],
        type: chartType.value,
        smooth: true,
        itemStyle: { color: '#67C23A' },
      },
      {
        name: t('finance.report.expense'),
        data: [400, 250, 200, 150, 180, 350, 700, 1500, 2000, 1800, 1600, 1700, 2200, 2400, 2300, 1800, 1400, 1300, 1100, 1000, 800, 600, 500, 400],
        type: chartType.value,
        smooth: true,
        itemStyle: { color: '#F56C6C' },
      },
    ],
  }
  trendChart.setOption(trendOption)

  // 收入来源分布
  const incomeSourceChart = echarts.init(document.getElementById('incomeSourceChart'))
  const incomeSourceOption = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: t('finance.report.income'),
        type: 'pie',
        radius: '50%',
        data: [
          { value: 18000, name: '抖店直播' },
          { value: 15000, name: '短视频带货' },
          { value: 8000, name: '店铺商品' },
          { value: 4000, name: '其他' },
        ],
      },
    ],
  }
  incomeSourceChart.setOption(incomeSourceOption)

  // 支出分类分布
  const expenseCategoryChart = echarts.init(document.getElementById('expenseCategoryChart'))
  const expenseCategoryOption = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: t('finance.report.expense'),
        type: 'pie',
        radius: '50%',
        data: [
          { value: 6000, name: '平台扣款' },
          { value: 5000, name: '推广费用' },
          { value: 3000, name: '物流费用' },
          { value: 1000, name: '其他' },
        ],
      },
    ],
  }
  expenseCategoryChart.setOption(expenseCategoryOption)
}

/**
 * 处理日期变更
 */
const handleDateChange = () => {
  console.log('日期已变更:', selectedDate.value)
  loadReportData()
}

/**
 * 加载报表数据
 */
const loadReportData = () => {
  // TODO: 调用API获取数据
  console.log('加载日报表数据')
}

/**
 * 刷新数据
 */
const handleRefresh = () => {
  ElMessage.loading(t('common.loading'))
  setTimeout(() => {
    loadReportData()
    ElMessage.success(t('common.refreshSuccess'))
  }, 1000)
}

/**
 * 导出报表
 */
const handleExport = () => {
  // TODO: 调用API导出
  ElMessage.success(t('common.exportSuccess'))
}

/**
 * 图表类型变更
 */
const handleChartTypeChange = () => {
  initCharts()
}

/**
 * 分页大小变更
 */
const handlePageSizeChange = () => {
  pageNo.value = 1
}

// ============ 生命周期 ============
onMounted(() => {
  initCharts()
  loadReportData()
})
</script>

<style scoped lang="scss">
.daily-report-container {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 18px;
        font-weight: bold;
      }

      .header-actions {
        display: flex;
        gap: 10px;
      }
    }
  }

  .metrics-section {
    margin-bottom: 20px;

    .metric-card {
      height: 100%;

      .metric-content {
        display: flex;
        gap: 15px;

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .metric-info {
          flex: 1;

          .metric-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 5px;
          }

          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 5px;
          }

          .metric-change {
            font-size: 12px;

            span {
              &.positive {
                color: #67c23a;
              }

              &.negative {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }
  }

  .chart-section {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .chart-controls {
        display: flex;
        gap: 10px;
      }
    }
  }

  .data-table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}

@media (max-width: 768px) {
  .daily-report-container {
    padding: 10px;

    .header-card .card-header {
      flex-direction: column;
      gap: 10px;

      .header-actions {
        width: 100%;
        flex-direction: column;
      }
    }

    .metrics-section .metric-card .metric-content {
      flex-direction: column;
    }
  }
}
</style>
