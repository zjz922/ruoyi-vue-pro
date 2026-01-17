<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="租户" prop="tenantId">
        <el-select v-model="formData.tenantId" placeholder="请选择租户" class="!w-full">
          <el-option label="默认租户" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="formData.shopName" placeholder="请输入店铺名称" />
      </el-form-item>
      <el-form-item label="店铺ID" prop="shopId">
        <el-input v-model="formData.shopId" placeholder="请输入店铺ID" />
      </el-form-item>
      <el-form-item label="App Key" prop="appKey">
        <el-input v-model="formData.appKey" placeholder="请输入App Key" />
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

defineOptions({ name: 'DoudianConfigForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  tenantId: undefined,
  shopName: '',
  shopId: '',
  appKey: '',
  appSecret: '',
  callbackUrl: '',
  remark: ''
})
const formRules = reactive({
  tenantId: [{ required: true, message: '租户不能为空', trigger: 'change' }],
  shopName: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
  appKey: [{ required: true, message: 'App Key不能为空', trigger: 'blur' }],
  appSecret: [{ required: true, message: 'App Secret不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PlatformConfigApi.getDoudianConfig(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown
    if (formType.value === 'create') {
      await PlatformConfigApi.createDoudianConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlatformConfigApi.updateDoudianConfig(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    tenantId: undefined,
    shopName: '',
    shopId: '',
    appKey: '',
    appSecret: '',
    callbackUrl: '',
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
