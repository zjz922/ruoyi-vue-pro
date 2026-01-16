/**
 * 聚水潭ERP数据同步管理页面
 * 用于配置聚水潭API授权、同步入库数据和查看同步日志
 */
import { useState } from 'react';

// 类型定义
interface ConfigStatus {
  status?: number;
  configured?: boolean;
  message?: string;
  lastSyncTime?: string;
}

interface PurchaseStats {
  totalCount?: number;
  totalQty?: number;
  totalAmount?: number;
  bySupplier?: Array<{ name: string; count: number }>;
  byWarehouse?: Array<{ name: string; count: number }>;
}

interface PurchaseInItem {
  id: string;
  ioId: string;
  warehouse: string;
  supplierName: string;
  ioDate: string;
  totalQty: number;
  totalAmount: string;
  status: string;
}

interface PurchaseInData {
  data?: PurchaseInItem[];
  total?: number;
  page?: number;
  pageSize?: number;
}

interface SyncLogItem {
  id: string;
  syncType: string;
  syncDate: string;
  startTime: string;
  endTime?: string;
  status: string;
  totalCount: number;
  successCount: number;
  failCount: number;
}

interface SyncLogsData {
  data?: SyncLogItem[];
  total?: number;
}
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

export default function JstSync() {
  const [activeTab, setActiveTab] = useState<'config' | 'purchase' | 'logs'>('config');
  const [syncDateRange, setSyncDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [configForm, setConfigForm] = useState({
    partnerId: '',
    partnerKey: '',
    token: '',
    coId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // 查询配置状态
  const { data: configStatus, refetch: refetchConfig } = trpc.jst.checkConfig.useQuery() as {
    data: ConfigStatus | undefined;
    refetch: () => void;
  };

  // 查询入库单列表
  const { data: purchaseInData, refetch: refetchPurchaseIn } = trpc.jst.getPurchaseInList.useQuery({
    startDate: syncDateRange.startDate,
    endDate: syncDateRange.endDate,
    page: currentPage,
    pageSize: 20,
  }) as {
    data: PurchaseInData | undefined;
    refetch: () => void;
  };

  // 查询入库统计
  const { data: purchaseStats } = trpc.jst.getPurchaseInStats.useQuery({
    startDate: syncDateRange.startDate,
    endDate: syncDateRange.endDate,
  }) as {
    data: PurchaseStats | undefined;
  };

  // 查询同步日志
  const { data: syncLogs, refetch: refetchLogs } = trpc.jst.getSyncLogs.useQuery({
    page: 1,
    pageSize: 20,
  }) as {
    data: SyncLogsData | undefined;
    refetch: () => void;
  };

  // 保存配置
  const saveConfigMutation = trpc.jst.saveConfig.useMutation({
    onSuccess: () => {
      toast.success('配置保存成功');
      refetchConfig();
    },
    onError: (error) => {
      toast.error(`配置保存失败: ${error.message}`);
    },
  });

  // 同步入库数据
  const syncPurchaseInMutation = trpc.jst.syncPurchaseIn.useMutation({
    onSuccess: (result) => {
      toast.success(`同步完成: 成功${result.success}条, 失败${result.failed}条`);
      refetchPurchaseIn();
      refetchLogs();
      refetchConfig();
    },
    onError: (error) => {
      toast.error(`同步失败: ${error.message}`);
    },
  });

  // 测试连接
  const testConnectionMutation = trpc.jst.testConnection.useMutation({
    onSuccess: (result) => {
      if (result.valid) {
        toast.success('连接测试成功');
      } else {
        toast.error(`连接测试失败: ${result.message}`);
      }
    },
    onError: (error) => {
      toast.error(`连接测试失败: ${error.message}`);
    },
  });

  const handleSaveConfig = () => {
    if (!configForm.partnerId || !configForm.partnerKey) {
      toast.error('请填写合作方编号和密钥');
      return;
    }
    saveConfigMutation.mutate(configForm);
  };

  const handleTestConnection = () => {
    if (!configForm.partnerId || !configForm.partnerKey || !configForm.token) {
      toast.error('请填写完整的配置信息');
      return;
    }
    testConnectionMutation.mutate({
      partnerId: configForm.partnerId,
      partnerKey: configForm.partnerKey,
      token: configForm.token,
    });
  };

  const handleSyncPurchaseIn = () => {
    syncPurchaseInMutation.mutate({
      startDate: `${syncDateRange.startDate} 00:00:00`,
      endDate: `${syncDateRange.endDate} 23:59:59`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">聚水潭ERP数据同步</h1>
          <p className="text-gray-500 mt-1">管理聚水潭API配置，同步仓库入库数据和费用数据</p>
        </div>

        {/* 配置状态卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                configStatus?.status === 1 ? 'bg-green-500' : 
                configStatus?.status === 2 ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">
                  {configStatus?.configured ? '已配置' : '未配置'}
                </p>
                <p className="text-sm text-gray-500">{configStatus?.message}</p>
              </div>
            </div>
            {configStatus?.lastSyncTime && (
              <div className="text-sm text-gray-500">
                最后同步: {new Date(configStatus.lastSyncTime).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'config', label: 'API配置' },
                { id: 'purchase', label: '入库数据' },
                { id: 'logs', label: '同步日志' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* API配置 */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      合作方编号 (Partner ID)
                    </label>
                    <input
                      type="text"
                      value={configForm.partnerId}
                      onChange={(e) => setConfigForm({ ...configForm, partnerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入合作方编号"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      合作方密钥 (Partner Key)
                    </label>
                    <input
                      type="password"
                      value={configForm.partnerKey}
                      onChange={(e) => setConfigForm({ ...configForm, partnerKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入合作方密钥"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      授权Token
                    </label>
                    <input
                      type="text"
                      value={configForm.token}
                      onChange={(e) => setConfigForm({ ...configForm, token: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入授权Token"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      公司编号 (可选)
                    </label>
                    <input
                      type="text"
                      value={configForm.coId}
                      onChange={(e) => setConfigForm({ ...configForm, coId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入公司编号"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleTestConnection}
                    disabled={testConnectionMutation.isPending}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    {testConnectionMutation.isPending ? '测试中...' : '测试连接'}
                  </button>
                  <button
                    onClick={handleSaveConfig}
                    disabled={saveConfigMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saveConfigMutation.isPending ? '保存中...' : '保存配置'}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">配置说明</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 合作方编号和密钥：在聚水潭开放平台申请获取</li>
                    <li>• 授权Token：通过聚水潭授权流程获取，用于API调用认证</li>
                    <li>• 公司编号：多公司场景下指定数据所属公司</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 入库数据 */}
            {activeTab === 'purchase' && (
              <div className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600">入库单数</p>
                    <p className="text-2xl font-bold text-blue-700">{purchaseStats?.totalCount || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600">入库数量</p>
                    <p className="text-2xl font-bold text-green-700">{purchaseStats?.totalQty || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600">入库金额</p>
                    <p className="text-2xl font-bold text-purple-700">
                      ¥{(purchaseStats?.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-600">供应商数</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {purchaseStats?.bySupplier?.length || 0}
                    </p>
                  </div>
                </div>

                {/* 筛选和同步 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">开始日期</label>
                      <input
                        type="date"
                        value={syncDateRange.startDate}
                        onChange={(e) => setSyncDateRange({ ...syncDateRange, startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">结束日期</label>
                      <input
                        type="date"
                        value={syncDateRange.endDate}
                        onChange={(e) => setSyncDateRange({ ...syncDateRange, endDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSyncPurchaseIn}
                    disabled={syncPurchaseInMutation.isPending || !configStatus?.configured}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {syncPurchaseInMutation.isPending ? '同步中...' : '同步入库数据'}
                  </button>
                </div>

                {/* 入库单列表 */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">入库单号</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">仓库</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">供应商</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">入库日期</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">数量</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">金额</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {purchaseInData?.data?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.ioId}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.warehouse}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.supplierName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.ioDate ? new Date(item.ioDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.totalQty}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            ¥{parseFloat(String(item.totalAmount || 0)).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                              item.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!purchaseInData?.data || purchaseInData.data.length === 0) && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            暂无入库数据，请先同步
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 分页 */}
                {purchaseInData && (purchaseInData.total ?? 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      共 {purchaseInData.total} 条记录
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                      >
                        上一页
                      </button>
                      <span className="px-3 py-1 text-sm">第 {currentPage} 页</span>
                      <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={!purchaseInData.data || purchaseInData.data.length < 20}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                      >
                        下一页
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 同步日志 */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">同步类型</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">同步日期</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">开始时间</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">结束时间</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">总数</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">成功</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">失败</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {syncLogs?.data?.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {log.syncType === 'purchase_in' ? '入库同步' : log.syncType}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{log.syncDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(log.startTime).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {log.endTime ? new Date(log.endTime).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              log.status === 'success' ? 'bg-green-100 text-green-700' :
                              log.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {log.status === 'success' ? '成功' : 
                               log.status === 'failed' ? '失败' : '进行中'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{log.totalCount}</td>
                          <td className="px-4 py-3 text-sm text-green-600 text-right">{log.successCount}</td>
                          <td className="px-4 py-3 text-sm text-red-600 text-right">{log.failCount}</td>
                        </tr>
                      ))}
                      {(!syncLogs?.data || syncLogs.data.length === 0) && (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            暂无同步日志
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
