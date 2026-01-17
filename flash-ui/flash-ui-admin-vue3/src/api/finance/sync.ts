import request from '@/config/axios'

// ==================== 同步任务 ====================

export const getSyncTaskPage = (params: any) => {
  return request.get({ url: '/finance/sync/task/page', params })
}

export const getSyncTask = (id: number) => {
  return request.get({ url: '/finance/sync/task/get', params: { id } })
}

export const createSyncTask = (data: any) => {
  return request.post({ url: '/finance/sync/task/create', data })
}

export const updateSyncTask = (data: any) => {
  return request.put({ url: '/finance/sync/task/update', data })
}

export const deleteSyncTask = (id: number) => {
  return request.delete({ url: '/finance/sync/task/delete', params: { id } })
}

export const executeSyncTask = (id: number) => {
  return request.post({ url: '/finance/sync/task/execute', params: { id } })
}

// ==================== 同步日志 ====================

export const getSyncLogPage = (params: any) => {
  return request.get({ url: '/finance/sync/log/page', params })
}

export const getSyncLog = (id: number) => {
  return request.get({ url: '/finance/sync/log/get', params: { id } })
}

export const deleteSyncLog = (id: number) => {
  return request.delete({ url: '/finance/sync/log/delete', params: { id } })
}

// ==================== 同步异常 ====================

export const getSyncExceptionPage = (params: any) => {
  return request.get({ url: '/finance/sync/exception/page', params })
}

export const getSyncException = (id: number) => {
  return request.get({ url: '/finance/sync/exception/get', params: { id } })
}

export const retrySyncException = (id: number) => {
  return request.post({ url: '/finance/sync/exception/retry', params: { id } })
}

export const ignoreSyncException = (id: number) => {
  return request.post({ url: '/finance/sync/exception/ignore', params: { id } })
}

export const batchRetrySyncException = (ids: number[]) => {
  return request.post({ url: '/finance/sync/exception/batch-retry', data: ids })
}

export const batchIgnoreSyncException = (ids: number[]) => {
  return request.post({ url: '/finance/sync/exception/batch-ignore', data: ids })
}
