<template>
  <div class="doudian-auth-container">
    <!-- 页面标题 -->
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <div class="header-left">
          <img src="@/assets/imgs/doudian-logo.png" alt="抖店" class="platform-logo" />
          <div class="header-info">
            <h2>抖店授权管理</h2>
            <p>授权后可同步抖店订单、资金流水等数据</p>
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="handleAuthorize" :loading="authorizing">
            <el-icon><Plus /></el-icon>
            添加店铺授权
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 授权状态卡片 -->
    <el-card class="status-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>授权状态</span>
          <el-button text type="primary" @click="loadAuthStatus" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <!-- 加载中 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <!-- 未授权状态 -->
      <div v-else-if="!authStatus.authorized" class="empty-state">
        <el-empty description="暂无授权店铺">
          <el-button type="primary" @click="handleAuthorize">立即授权</el-button>
        </el-empty>
      </div>

      <!-- 已授权店铺列表 -->
      <div v-else class="shop-list">
        <el-table :data="authStatus.shops" style="width: 100%">
          <el-table-column prop="shopId" label="店铺ID" width="180" />
          <el-table-column prop="shopName" label="店铺名称" min-width="200" />
          <el-table-column prop="status" label="授权状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="authorizeTime" label="授权时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.authorizeTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="expireTime" label="过期时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.expireTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'expired'" 
                type="primary" 
                link 
                @click="handleRefreshToken(row)"
                :loading="refreshing"
              >
                刷新Token
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="handleSyncData(row)"
              >
                同步数据
              </el-button>
              <el-popconfirm
                title="确定要撤销该店铺的授权吗？"
                @confirm="handleRevokeAuth(row)"
              >
                <template #reference>
                  <el-button type="danger" link>撤销授权</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 授权说明卡片 -->
    <el-card class="guide-card" shadow="never">
      <template #header>
        <span>授权说明</span>
      </template>
      <div class="guide-content">
        <el-steps :active="0" direction="vertical">
          <el-step title="点击添加店铺授权" description="点击上方按钮，跳转到抖店授权页面" />
          <el-step title="登录抖店账号" description="使用您的抖店账号登录并确认授权" />
          <el-step title="授权成功" description="授权成功后，系统将自动同步您的店铺数据" />
        </el-steps>
        <el-divider />
        <div class="guide-tips">
          <h4>注意事项：</h4>
          <ul>
            <li>授权后，系统将获取您的订单、资金流水等数据用于财务分析</li>
            <li>授权有效期为30天，过期后需要重新授权或刷新Token</li>
            <li>您可以随时撤销授权，撤销后系统将停止同步数据</li>
            <li>数据同步可能需要几分钟时间，请耐心等待</li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 授权回调处理对话框 -->
    <el-dialog
      v-model="callbackDialogVisible"
      title="授权处理中"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="callback-dialog-content">
        <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
        <p>正在处理授权信息，请稍候...</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, Loading } from '@element-plus/icons-vue'
import { 
  getAuthUrl, 
  getAuthStatus, 
  exchangeToken, 
  refreshToken, 
  revokeAuth 
} from '@/api/finance/doudian-oauth'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'DoudianAuth' })

// 状态
const loading = ref(false)
const authorizing = ref(false)
const refreshing = ref(false)
const callbackDialogVisible = ref(false)

// 授权状态
const authStatus = ref({
  authorized: false,
  shops: [] as any[]
})

// 加载授权状态
const loadAuthStatus = async () => {
  loading.value = true
  try {
    const res = await getAuthStatus()
    authStatus.value = res.data || { authorized: false, shops: [] }
  } catch (error) {
    console.error('获取授权状态失败:', error)
    ElMessage.error('获取授权状态失败')
  } finally {
    loading.value = false
  }
}

// 发起授权
const handleAuthorize = async () => {
  authorizing.value = true
  try {
    const res = await getAuthUrl()
    const authUrl = res.data
    if (authUrl) {
      // 打开新窗口进行授权
      window.open(authUrl, '_blank', 'width=800,height=600')
      ElMessage.info('请在新窗口中完成授权')
    }
  } catch (error) {
    console.error('获取授权URL失败:', error)
    ElMessage.error('获取授权URL失败')
  } finally {
    authorizing.value = false
  }
}

// 刷新Token
const handleRefreshToken = async (row: any) => {
  refreshing.value = true
  try {
    await refreshToken({ shopId: row.shopId })
    ElMessage.success('Token刷新成功')
    await loadAuthStatus()
  } catch (error) {
    console.error('刷新Token失败:', error)
    ElMessage.error('刷新Token失败')
  } finally {
    refreshing.value = false
  }
}

// 同步数据
const handleSyncData = (row: any) => {
  ElMessage.info('数据同步功能开发中...')
}

// 撤销授权
const handleRevokeAuth = async (row: any) => {
  try {
    await revokeAuth({ shopId: row.shopId })
    ElMessage.success('授权已撤销')
    await loadAuthStatus()
  } catch (error) {
    console.error('撤销授权失败:', error)
    ElMessage.error('撤销授权失败')
  }
}

// 处理授权回调
const handleAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (code && state) {
    callbackDialogVisible.value = true
    try {
      await exchangeToken({ code, state })
      ElMessage.success('授权成功')
      // 清除URL参数
      window.history.replaceState({}, document.title, window.location.pathname)
      await loadAuthStatus()
    } catch (error) {
      console.error('授权失败:', error)
      ElMessage.error('授权失败，请重试')
    } finally {
      callbackDialogVisible.value = false
    }
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'valid':
      return 'success'
    case 'expired':
      return 'warning'
    case 'invalid':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'valid':
      return '正常'
    case 'expired':
      return '已过期'
    case 'invalid':
      return '已失效'
    default:
      return '未知'
  }
}

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm:ss')
}

// 页面加载
onMounted(() => {
  loadAuthStatus()
  handleAuthCallback()
})
</script>

<style scoped lang="scss">
.doudian-auth-container {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .platform-logo {
    width: 48px;
    height: 48px;
    border-radius: 8px;
  }
  
  .header-info {
    h2 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }
}

.status-card {
  margin-bottom: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.loading-container {
  padding: 20px;
}

.empty-state {
  padding: 40px 0;
}

.shop-list {
  // 表格样式
}

.guide-card {
  .guide-content {
    padding: 10px 0;
  }
  
  .guide-tips {
    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 8px;
        color: #606266;
        font-size: 14px;
      }
    }
  }
}

.callback-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  
  .loading-icon {
    animation: rotate 1s linear infinite;
    color: #409eff;
    margin-bottom: 16px;
  }
  
  p {
    margin: 0;
    color: #606266;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
