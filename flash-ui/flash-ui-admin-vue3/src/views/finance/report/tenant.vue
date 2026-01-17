<template>
  <div class="tenant-report">
    <ContentWrap>
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="租户">
          <el-select v-model="queryParams.tenantId" placeholder="请选择租户" class="!w-200px" @change="handleTenantChange">
            <el-option v-for="item in tenantList" :key="item.id" :label="item.name" :value="item.id" />
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
            class="!w-280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 租户基本信息 -->
    <ContentWrap v-if="tenantInfo.id">
      <el-descriptions :column="4" border>
        <el-descriptions-item label="租户名称">{{ tenantInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="店铺数量">{{ tenantInfo.shopCount }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ tenantInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="tenantInfo.status === 1 ? 'success' : 'info'">
            {{ tenantInfo.status === 1 ? '正常' : '停用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </ContentWrap>

    <!-- 核心指标 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">总收入</div>
            <div class="stat-value text-green-600">¥{{ formatMoney(reportData.totalRevenue) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">总支出</div>
            <div class="stat-value text-red-600">¥{{ formatMoney(reportData.totalExpense) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">净利润</div>
            <div class="stat-value text-blue-600">¥{{ formatMoney(reportData.netProfit) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-title">订单总量</div>
            <div class="stat-value">{{ reportData.totalOrders }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收入支出明细 -->
    <el-row :gutter="16" class="mb-16px">
      <el-col :span="12">
        <ContentWrap title="收入明细">
          <el-table :data="reportData.incomeDetails" :stripe="true" max-height="300">
            <el-table-column label="类型" prop="type" />
            <el-table-column label="金额" align="right">
              <template #default="scope">
                ¥{{ formatMoney(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column label="占比" align="center">
              <template #default="scope">
                {{ scope.row.percentage }}%
              </template>
            </el-table-column>
          </el-table>
        </ContentWrap>
      </el-col>
      <el-col :span="12">
        <ContentWrap title="支出明细">
          <el-table :data="reportData.expenseDetails" :stripe="true" max-height="300">
            <el-table-column label="类型" prop="type" />
            <el-table-column label="金额" align="right">
              <template #default="scope">
                ¥{{ formatMoney(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column label="占比" align="center">
              <template #default="scope">
                {{ scope.row.percentage }}%
              </template>
            </el-table-column>
          </el-table>
        </ContentWrap>
      </el-col>
    </el-row>

    <!-- 店铺对比 -->
    <ContentWrap title="店铺对比">
      <div ref="shopCompareChartRef" style="height: 350px"></div>
    </ContentWrap>

    <!-- 店铺明细表 -->
    <ContentWrap title="店铺明细">
      <el-table v-loading="loading" :data="shopList" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="店铺名称" align="center" prop="shopName" width="180" />
        <el-table-column label="平台" align="center" prop="platform" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.platform === 'doudian'" type="primary">抖店</el-tag>
            <el-tag v-else-if="scope.row.platform === 'qianchuan'" type="warning">千川</el-tag>
            <el-tag v-else type="success">聚水潭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="收入" align="right" width="120">
          <template #default="scope">
            <span class="text-green-600">¥{{ formatMoney(scope.row.revenue) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支出" align="right" width="120">
          <template #default="scope">
            <span class="text-red-600">¥{{ formatMoney(scope.row.expense) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="利润" align="right" width="120">
          <template #default="scope">
            <span :class="scope.row.profit >= 0 ? 'text-blue-600' : 'text-red-600'">
              ¥{{ formatMoney(scope.row.profit) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="订单量" align="center" prop="orderCount" width="100" />
        <el-table-column label="利润率" align="center" width="100">
          <template #default="scope">
            {{ scope.row.profitRate }}%
          </template>
        </el-table-column>
        <el-table-column label="贡献度" align="center" width="100">
          <template #default="scope">
            {{ scope.row.contribution }}%
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import * as ReportApi from '@/api/finance/report'
import * as echarts from 'echarts'

defineOptions({ name: 'TenantReport' })

const loading = ref(false)
const shopCompareChartRef = ref<HTMLElement>()
let shopCompareChart: echarts.ECharts | null = null

const queryParams = reactive({
  tenantId: undefined as number | undefined,
  dateRange: []
})

const tenantList = ref<any[]>([
  { id: 1, name: '默认租户' }
])

const tenantInfo = ref({
  id: undefined,
  name: '',
  shopCount: 0,
  createTime: '',
  status: 1
})

const reportData = ref({
  totalRevenue: 0,
  totalExpense: 0,
  netProfit: 0,
  totalOrders: 0,
  incomeDetails: [] as any[],
  expenseDetails: [] as any[]
})

const shopList = ref<any[]>([])

const formatMoney = (value: number) => {
  return (value / 100).toFixed(2)
}

const handleTenantChange = () => {
  if (queryParams.tenantId) {
    handleQuery()
  }
}

const handleQuery = async () => {
  if (!queryParams.tenantId) {
    return
  }
  loading.value = true
  try {
    const params = {
      startDate: queryParams.dateRange?.[0],
      endDate: queryParams.dateRange?.[1]
    }
    const data = await ReportApi.getTenantReport(queryParams.tenantId, params)
    if (data) {
      tenantInfo.value = data.tenantInfo || tenantInfo.value
      reportData.value = data.reportData || reportData.value
    }
    await loadShopComparison()
  } catch (error) {
    console.error('加载租户报表失败', error)
  } finally {
    loading.value = false
  }
}

const loadShopComparison = async () => {
  if (!queryParams.tenantId) return
  try {
    const params = {
      startDate: queryParams.dateRange?.[0],
      endDate: queryParams.dateRange?.[1]
    }
    const data = await ReportApi.getShopComparison(queryParams.tenantId, params)
    shopList.value = data?.list || []
    initShopCompareChart(data)
  } catch (error) {
    console.error('加载店铺对比数据失败', error)
    initShopCompareChart(null)
  }
}

const initShopCompareChart = (data: any) => {
  if (!shopCompareChartRef.value) return
  if (!shopCompareChart) {
    shopCompareChart = echarts.init(shopCompareChartRef.value)
  }
  const shops = data?.shops || ['店铺A', '店铺B', '店铺C']
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['收入', '支出', '利润'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: shops },
    yAxis: { type: 'value' },
    series: [
      { name: '收入', type: 'bar', data: data?.revenues || [120, 200, 150] },
      { name: '支出', type: 'bar', data: data?.expenses || [80, 120, 90] },
      { name: '利润', type: 'bar', data: data?.profits || [40, 80, 60] }
    ]
  }
  shopCompareChart.setOption(option)
}

onMounted(() => {
  // 设置默认时间范围
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  queryParams.dateRange = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ] as any
})

onUnmounted(() => {
  shopCompareChart?.dispose()
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
}
</style>
