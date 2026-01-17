<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="租户" prop="tenantId">
        <el-select v-model="formData.tenantId" placeholder="请选择租户" class="!w-full">
          <el-option label="默认租户" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="formData.taskName" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="平台类型" prop="platformType">
        <el-select v-model="formData.platformType" placeholder="请选择平台类型" class="!w-full" @change="handlePlatformChange">
          <el-option label="抖店" :value="1" />
          <el-option label="千川" :value="2" />
          <el-option label="聚水潭" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="formData.taskType" placeholder="请选择任务类型" class="!w-full">
          <el-option v-if="formData.platformType === 1" label="抖店订单同步" :value="1" />
          <el-option v-if="formData.platformType === 1" label="抖店结算同步" :value="2" />
          <el-option v-if="formData.platformType === 2" label="千川消耗同步" :value="3" />
          <el-option v-if="formData.platformType === 3" label="聚水潭库存同步" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="关联配置" prop="configId">
        <el-select v-model="formData.configId" placeholder="请选择关联配置" class="!w-full">
          <el-option label="配置1" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="Cron表达式" prop="cronExpression">
        <el-input v-model="formData.cronExpression" placeholder="请输入Cron表达式，如：0 0 * * * ?" />
        <div class="text-xs text-gray-400 mt-1">
          常用表达式：每小时(0 0 * * * ?) 每天8点(0 0 8 * * ?) 每5分钟(0 */5 * * * ?)
        </div>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import * as SyncApi from '@/api/finance/sync'

defineOptions({ name: 'SyncTaskForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  tenantId: undefined,
  taskName: '',
  platformType: undefined,
  taskType: undefined,
  configId: undefined,
  cronExpression: '',
  status: 1
})
const formRules = reactive({
  tenantId: [{ required: true, message: '租户不能为空', trigger: 'change' }],
  taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  platformType: [{ required: true, message: '平台类型不能为空', trigger: 'change' }],
  taskType: [{ required: true, message: '任务类型不能为空', trigger: 'change' }],
  configId: [{ required: true, message: '关联配置不能为空', trigger: 'change' }],
  cronExpression: [{ required: true, message: 'Cron表达式不能为空', trigger: 'blur' }]
})
const formRef = ref()

const handlePlatformChange = () => {
  formData.value.taskType = undefined
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SyncApi.getSyncTask(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value as unknown
    if (formType.value === 'create') {
      await SyncApi.createSyncTask(data)
      message.success(t('common.createSuccess'))
    } else {
      await SyncApi.updateSyncTask(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    tenantId: undefined,
    taskName: '',
    platformType: undefined,
    taskType: undefined,
    configId: undefined,
    cronExpression: '',
    status: 1
  }
  formRef.value?.resetFields()
}
</script>
