<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="租户" prop="tenantId">
        <el-select v-model="formData.tenantId" placeholder="请选择租户" class="!w-full">
          <el-option label="默认租户" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="广告主名称" prop="advertiserName">
        <el-input v-model="formData.advertiserName" placeholder="请输入广告主名称" />
      </el-form-item>
      <el-form-item label="广告主ID" prop="advertiserId">
        <el-input v-model="formData.advertiserId" placeholder="请输入广告主ID" />
      </el-form-item>
      <el-form-item label="App ID" prop="appId">
        <el-input v-model="formData.appId" placeholder="请输入App ID" />
      </el-form-item>
      <el-form-item label="App Secret" prop="appSecret">
        <el-input v-model="formData.appSecret" placeholder="请输入App Secret" type="password" show-password />
      </el-form-item>
      <el-form-item label="回调地址" prop="callbackUrl">
        <el-input v-model="formData.callbackUrl" placeholder="请输入回调地址" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import * as PlatformConfigApi from '@/api/finance/platformConfig'

defineOptions({ name: 'QianchuanConfigForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  tenantId: undefined,
  advertiserName: '',
  advertiserId: '',
  appId: '',
  appSecret: '',
  callbackUrl: '',
  remark: ''
})
const formRules = reactive({
  tenantId: [{ required: true, message: '租户不能为空', trigger: 'change' }],
  advertiserName: [{ required: true, message: '广告主名称不能为空', trigger: 'blur' }],
  advertiserId: [{ required: true, message: '广告主ID不能为空', trigger: 'blur' }],
  appId: [{ required: true, message: 'App ID不能为空', trigger: 'blur' }],
  appSecret: [{ required: true, message: 'App Secret不能为空', trigger: 'blur' }]
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PlatformConfigApi.getQianchuanConfig(id)
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
      await PlatformConfigApi.createQianchuanConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlatformConfigApi.updateQianchuanConfig(data)
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
    advertiserName: '',
    advertiserId: '',
    appId: '',
    appSecret: '',
    callbackUrl: '',
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
