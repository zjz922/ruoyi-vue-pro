<template>
  <div class="finance-report-container">
    <!-- 页面头部 -->
    <el-card class="box-card header-card">
      <template #header>
        <div class="card-header">
          <span class="title">{{ $t('finance.report.title') }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>
              {{ $t('common.export') }}
            </el-button>
          </div>
        </div>
      </template>

      <!-- 报表类型选择 -->
      <el-row :gutter="20" class="report-selector">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="report-type-card" @click="selectedReportType = 'daily'">
            <el-icon class="icon" :class="{ active: selectedReportType === 'daily' }">
              <Calendar />
            </el-icon>
            <div class="label">{{ $t('finance.report.daily') }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="report-type-card" @click="selectedReportType = 'weekly'">
            <el-icon class="icon" :class="{ active: selectedReportType === 'weekly' }">
              <DocumentCopy />
            </el-icon>
            <div class="label">{{ $t('finance.report.weekly') }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="report-type-card" @click="selectedReportType = 'monthly'">
            <el-icon class="icon" :class="{ active: selectedReportType === 'monthly' }">
              <Document />
            </el-icon>
            <div class="label">{{ $t('finance.report.monthly') }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="report-type-card" @click="selectedReportType = 'profit'">
            <el-icon class="icon" :class="{ active: selectedReportType === 'profit' }">
              <TrendCharts />
            </el-icon>
            <div class="label">{{ $t('finance.report.profitAnalysis') }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 报表内容 -->
    <el-row :gutter="20" class="report-content">
      <!-- 关键指标卡片 -->
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-item">
            <div class="metric-label">{{ $t('finance.report.totalIncome') }}</div>
            <div class="metric-value">¥{{ formatAmount(reportData.totalIncome) }}</div>
            <div class="metric-trend" :class="reportData.incomeGrowth >= 0 ? 'positive' : 'negative'">
              <el-icon v-if="reportData.incomeGrowth >= 0"><CaretTop /></el-icon>
              <el-icon v-else><CaretBottom /></el-icon>
              {{ Math.abs(reportData.incomeGrowth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-item">
            <div class="metric-label">{{ $t('finance.report.totalExpense') }}</div>
            <div class="metric-value">¥{{ formatAmount(reportData.totalExpense) }}</div>
            <div class="metric-trend" :class="reportData.expenseGrowth >= 0 ? 'negative' : 'positive'">
              <el-icon v-if="reportData.expenseGrowth >= 0"><CaretTop /></el-icon>
              <el-icon v-else><CaretBottom /></el-icon>
              {{ Math.abs(reportData.expenseGrowth) }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-item">
            <div class="metric-label">{{ $t('finance.report.netIncome') }}</div>
            <div class="metric-value">¥{{ formatAmount(reportData.netIncome) }}</div>
            <div class="metric-trend" :class="reportData.netIncome >= 0 ? 'positive' : 'negative'">
              {{ ((reportData.netIncome / reportData.totalIncome) * 100).toFixed(2) }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="metric-card">
          <div class="metric-item">
            <div class="metric-label">{{ $t('finance.report.orderCount') }}</div>
            <div class="metric-value">{{ reportData.orderCount }}</div>
            <div class="metric-trend">
              {{ $t('finance.report.orders') }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('finance.report.incomeExpenseTrend') }}</span>
            </div>
          </template>
          <div id="incomeExpenseChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('finance.report.orderDistribution') }}</span>
            </div>
          </template>
          <div id="orderDistributionChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据表格 -->
    <el-card class="data-table-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('finance.report.detailedData') }}</span>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            />
          </div>
        </div>
      </template>

      <el-table :data="reportTableData" stripe border>
        <el-table-column prop="date" :label="$t('finance.report.date')" width="120" />
        <el-table-column prop="orderCount" :label="$t('finance.report.orderCount')" width="100" />
        <el-table-column prop="totalAmount" :label="$t('finance.report.totalAmount')" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.totalAmount) }}
          </template>
        </el-table-column>
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
        <el-table-column :label="$t('common.action')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">
              {{ $t('common.view') }}
            </el-button>
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

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      :title="$t('finance.report.detail')"
      size="50%"
    >
      <div v-if="selectedDetail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('finance.report.date')">
            {{ selectedDetail.date }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('finance.report.orderCount')">
            {{ selectedDetail.orderCount }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('finance.report.totalAmount')">
            ¥{{ formatAmount(selectedDetail.totalAmount) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('finance.report.income')">
            ¥{{ formatAmount(selectedDetail.income) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('finance.report.expense')">
            ¥{{ formatAmount(selectedDetail.expense) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('finance.report.netIncome')">
            ¥{{ formatAmount(selectedDetail.netIncome) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 详细图表 -->
        <div style="margin-top: 20px">
          <h4>{{ $t('finance.report.detailedChart') }}</h4>
          <div id="detailChart" style="height: 300px; margin-top: 10px"></div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Calendar,
  DocumentCopy,
  Document,
  TrendCharts,
  CaretTop,
  CaretBottom,
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ============ 数据定义 ============
const selectedReportType = ref<'daily' | 'weekly' | 'monthly' | 'profit'>('daily')
const dateRange = ref<[Date, Date]>([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDrawerVisible = ref(false)
const selectedDetail = ref(null)

// 报表数据
const reportData = reactive({
  totalIncome: 125000,
  totalExpense: 45000,
  netIncome: 80000,
  orderCount: 1250,
  incomeGrowth: 12.5,
  expenseGrowth: -8.3,
})

// 表格数据
const reportTableData = ref([
  {
    date: '2024-01-15',
    orderCount: 45,
    totalAmount: 8500,
    income: 8500,
    expense: 2000,
    netIncome: 6500,
  },
  {
    date: '2024-01-14',
    orderCount: 38,
    totalAmount: 7200,
    income: 7200,
    expense: 1800,
    netIncome: 5400,
  },
  {
    date: '2024-01-13',
    orderCount: 52,
    totalAmount: 9800,
    income: 9800,
    expense: 2500,
    netIncome: 7300,
  },
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
  // 收支趋势图
  const incomeExpenseChart = echarts.init(document.getElementById('incomeExpenseChart'))
  const incomeExpenseOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [t('finance.report.income'), t('finance.report.expense')],
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('finance.report.income'),
        data: [8500, 7200, 9800, 8200, 7600, 9200, 8800],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#67C23A' },
      },
      {
        name: t('finance.report.expense'),
        data: [2000, 1800, 2500, 2200, 1900, 2400, 2100],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#F56C6C' },
      },
    ],
  }
  incomeExpenseChart.setOption(incomeExpenseOption)

  // 订单分布图
  const orderDistributionChart = echarts.init(document.getElementById('orderDistributionChart'))
  const orderDistributionOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: t('finance.report.orderCount'),
        type: 'pie',
        radius: '50%',
        data: [
          { value: 450, name: '已完成' },
          { value: 200, name: '待发货' },
          { value: 100, name: '已退款' },
          { value: 50, name: '已取消' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  orderDistributionChart.setOption(orderDistributionOption)
}

/**
 * 处理日期变更
 */
const handleDateChange = () => {
  pageNo.value = 1
  loadReportData()
}

/**
 * 加载报表数据
 */
const loadReportData = () => {
  // TODO: 调用API获取数据
  console.log('加载报表数据', {
    reportType: selectedReportType.value,
    dateRange: dateRange.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  })
}

/**
 * 查看详情
 */
const handleViewDetail = (row: any) => {
  selectedDetail.value = row
  detailDrawerVisible.value = true

  // 初始化详情图表
  setTimeout(() => {
    const detailChart = echarts.init(document.getElementById('detailChart'))
    const detailOption = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: t('finance.report.income'),
          data: [1500, 800, 1200, 2500, 1800, 1200, 800],
          type: 'bar',
          itemStyle: { color: '#67C23A' },
        },
      ],
    }
    detailChart.setOption(detailOption)
  }, 100)
}

/**
 * 导出报表
 */
const handleExport = () => {
  ElMessageBox.confirm(
    t('finance.report.exportConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      // TODO: 调用API导出
      ElMessage.success(t('common.exportSuccess'))
    })
    .catch(() => {
      ElMessage.info(t('common.exportCanceled'))
    })
}

// ============ 生命周期 ============
onMounted(() => {
  initCharts()
  loadReportData()
})
</script>

<style scoped lang="scss">
.finance-report-container {
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
    }

    .report-selector {
      margin-top: 20px;

      .report-type-card {
        padding: 20px;
        border: 2px solid #dcdfe6;
        border-radius: 8px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
          background-color: #f0f9ff;
        }

        &.active {
          border-color: #409eff;
          background-color: #e6f7ff;
        }

        .icon {
          font-size: 32px;
          color: #909399;
          margin-bottom: 10px;

          &.active {
            color: #409eff;
          }
        }

        .label {
          font-size: 14px;
          color: #606266;
          margin-top: 10px;
        }
      }
    }
  }

  .report-content {
    margin-bottom: 20px;

    .metric-card {
      height: 100%;

      .metric-item {
        text-align: center;

        .metric-label {
          font-size: 12px;
          color: #909399;
          margin-bottom: 10px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 10px;
        }

        .metric-trend {
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;

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

  .chart-section {
    margin-bottom: 20px;

    .chart-card {
      height: 100%;
    }
  }

  .data-table-card {
    margin-bottom: 20px;

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

  .detail-content {
    padding: 20px;

    h4 {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

@media (max-width: 768px) {
  .finance-report-container {
    padding: 10px;

    .report-selector {
      .report-type-card {
        padding: 15px;
      }
    }
  }
}
</style>
