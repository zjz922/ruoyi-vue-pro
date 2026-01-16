import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

export default function QianchuanSync() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  });
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [advertiserId, setAdvertiserId] = useState('');
  const [showConfigForm, setShowConfigForm] = useState(false);

  // 获取配置状态
  const { data: configStatus, refetch: refetchConfig } = trpc.qianchuan.getConfigStatus.useQuery();
  
  // 获取同步日志
  const { data: syncLogs, refetch: refetchLogs } = trpc.qianchuan.getSyncLogs.useQuery({ limit: 10 });
  
  // 获取费用数据
  const { data: costData } = trpc.qianchuan.getCostData.useQuery(
    { startDate, endDate },
    { enabled: !!configStatus?.authorized }
  );
  
  // 获取费用汇总
  const { data: costSummary } = trpc.qianchuan.getCostSummary.useQuery(
    { startDate, endDate },
    { enabled: !!configStatus?.authorized }
  );

  // 保存配置
  const saveConfigMutation = trpc.qianchuan.saveConfig.useMutation({
    onSuccess: () => {
      toast.success('配置保存成功');
      setShowConfigForm(false);
      refetchConfig();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 同步数据
  const syncDataMutation = trpc.qianchuan.syncData.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        refetchLogs();
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 执行每日同步
  const runDailySyncMutation = trpc.qianchuan.runDailySync.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        refetchLogs();
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSaveConfig = () => {
    if (!appId || !appSecret) {
      toast.error('请填写App ID和App Secret');
      return;
    }
    saveConfigMutation.mutate({ appId, appSecret, advertiserId });
  };

  const handleSync = () => {
    if (!startDate || !endDate) {
      toast.error('请选择日期范围');
      return;
    }
    syncDataMutation.mutate({ startDate, endDate });
  };

  const formatCurrency = (value: number | string | null | undefined) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === null || num === undefined || isNaN(num)) return '¥0.00';
    return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0';
    return value.toLocaleString('zh-CN');
  };

  const formatPercent = (value: number | string | null | undefined) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === null || num === undefined || isNaN(num)) return '0.00%';
    return `${(num * 100).toFixed(2)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">千川推广费用同步</h1>
          <p className="text-gray-500 mt-1">自动同步巨量千川推广费用数据，与订单数据关联计算ROI</p>
        </div>
        <button
          onClick={() => setShowConfigForm(!showConfigForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showConfigForm ? '关闭配置' : '配置千川'}
        </button>
      </div>

      {/* 配置状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">配置状态</div>
          <div className={`text-lg font-semibold mt-1 ${configStatus?.configured ? 'text-green-600' : 'text-gray-400'}`}>
            {configStatus?.configured ? '已配置' : '未配置'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">授权状态</div>
          <div className={`text-lg font-semibold mt-1 ${configStatus?.authorized ? 'text-green-600' : 'text-orange-500'}`}>
            {configStatus?.authorized ? '已授权' : configStatus?.configured ? '待授权' : '未授权'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">广告主ID</div>
          <div className="text-lg font-semibold mt-1 text-gray-900">
            {configStatus?.advertiserId || '-'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">定时任务</div>
          <div className="text-lg font-semibold mt-1 text-blue-600">
            每日凌晨2点
          </div>
        </div>
      </div>

      {/* 配置表单 */}
      {showConfigForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">千川API配置</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="请输入App ID"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App Secret</label>
              <input
                type="password"
                value={appSecret}
                onChange={(e) => setAppSecret(e.target.value)}
                placeholder="请输入App Secret"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">广告主ID（可选）</label>
              <input
                type="text"
                value={advertiserId}
                onChange={(e) => setAdvertiserId(e.target.value)}
                placeholder="请输入广告主ID"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSaveConfig}
              disabled={saveConfigMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saveConfigMutation.isPending ? '保存中...' : '保存配置'}
            </button>
            <button
              onClick={() => setShowConfigForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            提示：保存配置后，需要完成OAuth授权才能同步数据。请参考
            <a href="/docs/qianchuan-api-integration-guide.md" className="text-blue-600 hover:underline ml-1">
              千川API集成指南
            </a>
          </p>
        </div>
      )}

      {/* 同步操作 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">数据同步</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSync}
            disabled={syncDataMutation.isPending || !configStatus?.authorized}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {syncDataMutation.isPending ? '同步中...' : '手动同步'}
          </button>
          <button
            onClick={() => runDailySyncMutation.mutate()}
            disabled={runDailySyncMutation.isPending || !configStatus?.authorized}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {runDailySyncMutation.isPending ? '执行中...' : '执行每日任务'}
          </button>
        </div>
      </div>

      {/* 费用汇总 */}
      {costSummary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">总推广费用</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(costSummary.totalCost)}</div>
            <div className="text-xs opacity-70 mt-1">{costSummary.dayCount}天</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">总展示次数</div>
            <div className="text-2xl font-bold mt-1">{formatNumber(costSummary.totalShowCnt)}</div>
            <div className="text-xs opacity-70 mt-1">CPM: {formatCurrency(costSummary.avgCpm)}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">总点击次数</div>
            <div className="text-2xl font-bold mt-1">{formatNumber(costSummary.totalClickCnt)}</div>
            <div className="text-xs opacity-70 mt-1">CTR: {formatPercent(costSummary.avgCtr)}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">成交订单数</div>
            <div className="text-2xl font-bold mt-1">{formatNumber(costSummary.totalPayOrderCount)}</div>
            <div className="text-xs opacity-70 mt-1">成本: {formatCurrency(costSummary.avgCostPerOrder)}/单</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">成交金额</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(costSummary.totalPayOrderAmount)}</div>
            <div className="text-xs opacity-70 mt-1">ROI: {costSummary.avgRoi?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      )}

      {/* 费用明细表格 */}
      {costData && costData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">每日推广费用明细</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日期</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">消耗</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">展示</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">点击</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">CTR</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">成交单数</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">成交金额</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {costData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.statDate}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                      {formatCurrency(item.statCost)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {formatNumber(item.showCnt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {formatNumber(item.clickCnt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {formatPercent(item.ctr)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {formatNumber(item.payOrderCount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                      {formatCurrency(item.payOrderAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">
                      {item.roi ? parseFloat(String(item.roi)).toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 同步日志 */}
      {syncLogs && syncLogs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">同步日志</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日期范围</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">记录数</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">耗时</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(log.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.syncType === 'daily' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {log.syncType === 'daily' ? '每日同步' : '手动同步'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.startDate} ~ {log.endDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'success' ? 'bg-green-100 text-green-700' :
                        log.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '进行中'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {log.recordCount || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {log.duration ? `${log.duration}ms` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!configStatus?.configured && (
        <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未配置千川API</h3>
          <p className="text-gray-500 mb-4">请先配置千川API密钥并完成授权，即可自动同步推广费用数据</p>
          <button
            onClick={() => setShowConfigForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            开始配置
          </button>
        </div>
      )}
    </div>
  );
}
