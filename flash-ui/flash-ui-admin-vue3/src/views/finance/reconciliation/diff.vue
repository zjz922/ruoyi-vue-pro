<template>
  <div class="reconciliation-diff">
    <ContentWrap>
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="差异类型">
          <el-select v-model="queryParams.diffType" placeholder="全部类型" clearable class="!w-150px">
            <el-option label="全部" value="" />
            <el-option label="订单差异" value="order" />
            <el-option label="资金差异" value="fund" />
            <el-option label="库存差异" value="inventory" />
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
        <el-form-item label="差异金额">
          <el-input-number v-model="queryParams.minAmount" placeholder="最小金额" class="!w-120px" :controls="false" />
          <span class="mx-5px">-</span>
          <el-input-number v-model="queryParams.maxAmount" placeholder="最大金额" class="!w-120px" :controls="false" />
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

    <ContentWrap>
      <div class="mb-10px">
        <el-button type="primary" @click="handleBatchHandle" :disabled="selectedIds.length === 0">
          <Icon icon="ep:check" class="mr-5px" /> 批量处理
        </el-button>
        <el-button @click="handleBatchIgnore" :disabled="selectedIds.length === 0">
          <Icon icon="ep:close" class="mr-5px" /> 批量忽略
        </el-button>
      </div>

      <el-table v-loading="loading" :data="list" :stripe="true" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="差异ID" align="center" prop="id" width="80" />
        <el-table-column label="差异类型" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.diffType === 'order'" type="primary">订单差异</el-tag>
            <el-tag v-else-if="scope.row.diffType === 'fund'" type="warning">资金差异</el-tag>
            <el-tag v-else type="success">库存差异</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="租户名称" align="center" prop="tenantName" width="150" />
        <el-table-column label="差异金额" align="right" width="120">
          <template #default="scope">
            <span :class="scope.row.diffAmount > 0 ? 'text-red-500' : 'text-green-500'">
              {{ scope.row.diffAmount > 0 ? '+' : '' }}¥{{ (scope.row.diffAmount / 100).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="差异原因" align="center" prop="diffReason" show-overflow-tooltip />
        <el-table-column label="处理状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.handleStatus === 0" type="danger">待处理</el-tag>
            <el-tag v-else-if="scope.row.handleStatus === 1" type="success">已处理</el-tag>
            <el-tag v-else type="info">已忽略</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleView(scope.row)">详情</el-button>
            <el-button v-if="scope.row.handleStatus === 0" link type="success" @click="handleProcess(scope.row)">处理</el-button>
            <el-button v-if="scope.row.handleStatus === 0" link type="warning" @click="handleIgnore(scope.row)">忽略</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </ContentWrap>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="差异详情" width="700px">
      <el-descriptions :column="2" border v-if="currentDiff">
        <el-descriptions-item label="差异ID">{{ currentDiff.id }}</el-descriptions-item>
        <el-descriptions-item label="差异类型">
          <el-tag v-if="currentDiff.diffType === 'order'" type="primary">订单差异</el-tag>
          <el-tag v-else-if="currentDiff.diffType === 'fund'" type="warning">资金差异</el-tag>
          <el-tag v-else type="success">库存差异</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="租户名称">{{ currentDiff.tenantName }}</el-descriptions-item>
        <el-descriptions-item label="差异金额">
          <span :class="currentDiff.diffAmount > 0 ? 'text-red-500' : 'text-green-500'">
            ¥{{ (currentDiff.diffAmount / 100).toFixed(2) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="差异原因" :span="2">{{ currentDiff.diffReason }}</el-descriptions-item>
        <el-descriptions-item label="源数据" :span="2">
          <pre class="text-xs">{{ currentDiff.sourceData }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="目标数据" :span="2">
          <pre class="text-xs">{{ currentDiff.targetData }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag v-if="currentDiff.handleStatus === 0" type="danger">待处理</el-tag>
          <el-tag v-else-if="currentDiff.handleStatus === 1" type="success">已处理</el-tag>
          <el-tag v-else type="info">已忽略</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ currentDiff.handleTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ currentDiff.handleBy || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理备注">{{ currentDiff.handleRemark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 处理弹窗 -->
    <el-dialog v-model="handleVisible" title="处理差异" width="500px">
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="handleForm.handleType">
            <el-radio label="adjust">创建调整单</el-radio>
            <el-radio label="confirm">确认无误</el-radio>
            <el-radio label="other">其他</el-radio>
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
  </div>
</template>

<script setup lang="ts">
import * as ReconciliationApi from '@/api/finance/reconciliation'

defineOptions({ name: 'ReconciliationDiff' })

const message = useMessage()
const loading = ref(false)
const submitting = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])
const detailVisible = ref(false)
const handleVisible = ref(false)
const currentDiff = ref<any>(null)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  diffType: undefined,
  handleStatus: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  dateRange: []
})

const handleForm = reactive({
  id: undefined as number | undefined,
  handleType: 'confirm',
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
    const data = await ReconciliationApi.getDiffPage(params)
    list.value = data?.list || []
    total.value = data?.total || 0
  } catch (error) {
    console.error('加载差异列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryParams.diffType = undefined
  queryParams.handleStatus = undefined
  queryParams.minAmount = undefined
  queryParams.maxAmount = undefined
  queryParams.dateRange = []
  handleQuery()
}

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleView = async (row: any) => {
  try {
    const data = await ReconciliationApi.getDiffDetail(row.id)
    currentDiff.value = data || row
    detailVisible.value = true
  } catch (error) {
    currentDiff.value = row
    detailVisible.value = true
  }
}

const handleProcess = (row: any) => {
  handleForm.id = row.id
  handleForm.handleType = 'confirm'
  handleForm.remark = ''
  handleVisible.value = true
}

const handleIgnore = async (row: any) => {
  try {
    await message.confirm('确认忽略该差异吗？')
    await ReconciliationApi.handleDiff({
      id: row.id,
      handleStatus: 2,
      remark: '忽略处理'
    })
    message.success('操作成功')
    await getList()
  } catch {}
}

const submitHandle = async () => {
  submitting.value = true
  try {
    await ReconciliationApi.handleDiff({
      id: handleForm.id,
      handleStatus: 1,
      handleType: handleForm.handleType,
      remark: handleForm.remark
    })
    message.success('处理成功')
    handleVisible.value = false
    await getList()
  } catch (error) {
    console.error('处理失败', error)
  } finally {
    submitting.value = false
  }
}

const handleBatchHandle = async () => {
  try {
    await message.confirm(`确认批量处理选中的 ${selectedIds.value.length} 条差异吗？`)
    await ReconciliationApi.batchHandleDiff({
      ids: selectedIds.value,
      handleStatus: 1
    })
    message.success('批量处理成功')
    await getList()
  } catch {}
}

const handleBatchIgnore = async () => {
  try {
    await message.confirm(`确认批量忽略选中的 ${selectedIds.value.length} 条差异吗？`)
    await ReconciliationApi.batchHandleDiff({
      ids: selectedIds.value,
      handleStatus: 2
    })
    message.success('批量忽略成功')
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
