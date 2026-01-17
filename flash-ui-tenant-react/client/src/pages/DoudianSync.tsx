/**
 * 抖店数据同步页面
 * 用于管理抖店API授权和数据同步
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Settings,
  ShoppingCart,
  Package,
  FileText,
  Users,
  Shield,
  DollarSign,
  ExternalLink,
  Info
} from 'lucide-react';
import { trpc } from '../lib/trpc';

// API模块配置
const API_MODULES = [
  { key: 'order', name: '订单数据', icon: ShoppingCart, color: 'blue', description: '订单列表和详情' },
  { key: 'product', name: '商品数据', icon: Package, color: 'green', description: '商品列表和详情' },
  { key: 'settlement', name: '结算账单', icon: FileText, color: 'orange', description: '结算账单和资金流水' },
  { key: 'commission', name: '达人佣金', icon: Users, color: 'purple', description: '抖客结算账单' },
  { key: 'insurance', name: '保险费', icon: Shield, color: 'cyan', description: '运费险保单' },
  { key: 'afterSale', name: '售后赔付', icon: DollarSign, color: 'red', description: '售后列表和详情' },
  { key: 'qianchuan', name: '千川推广', icon: ExternalLink, color: 'gray', description: '需要单独对接巨量千川API' },
] as const;

type ModuleKey = typeof API_MODULES[number]['key'];

export default function DoudianSync() {
  const [accessToken, setAccessToken] = useState('');
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, 'idle' | 'syncing' | 'success' | 'error'>>({});
  const [syncResults, setSyncResults] = useState<Record<string, any>>({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // 获取API配置状态
  const { data: configData, isLoading: configLoading } = trpc.doudian.checkConfig.useQuery();

  // 同步订单
  const syncOrdersMutation = trpc.doudian.syncOrders.useMutation({
    onSuccess: (data: any) => {
      setSyncStatus(prev => ({ ...prev, order: data.success ? 'success' : 'error' }));
      setSyncResults(prev => ({ ...prev, order: data }));
    },
    onError: () => {
      setSyncStatus(prev => ({ ...prev, order: 'error' }));
    },
  });

  // 同步商品
  const syncProductsMutation = trpc.doudian.syncProducts.useMutation({
    onSuccess: (data: any) => {
      setSyncStatus(prev => ({ ...prev, product: data.success ? 'success' : 'error' }));
      setSyncResults(prev => ({ ...prev, product: data }));
    },
    onError: () => {
      setSyncStatus(prev => ({ ...prev, product: 'error' }));
    },
  });

  const handleSync = async (moduleKey: string) => {
    if (!accessToken) {
      setShowTokenDialog(true);
      return;
    }

    setSyncStatus(prev => ({ ...prev, [moduleKey]: 'syncing' }));

    try {
      switch (moduleKey) {
        case 'order':
          await syncOrdersMutation.mutateAsync({
            accessToken,
            startTime: dateRange.startDate,
            endTime: dateRange.endDate,
          });
          break;
        case 'product':
          await syncProductsMutation.mutateAsync({
            accessToken,
          });
          break;
        default:
          // 其他模块暂未实现
          setSyncStatus(prev => ({ ...prev, [moduleKey]: 'error' }));
          setSyncResults(prev => ({ ...prev, [moduleKey]: { error: '该功能暂未实现完整同步' } }));
      }
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, [moduleKey]: 'error' }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'syncing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700"><RefreshCw className="w-3 h-3 animate-spin mr-1" />同步中</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />成功</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />失败</Badge>;
      default:
        return <Badge variant="outline">待同步</Badge>;
    }
  };

  const availability = (configData?.availability || {}) as Record<string, { available: boolean; apis: string[]; description: string }>;

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">抖店数据同步</h1>
          <p className="text-gray-500 mt-1">
            连接抖店开放平台，自动同步订单、商品、财务等数据
          </p>
        </div>
        <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              配置Access Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>配置Access Token</DialogTitle>
              <DialogDescription>
                Access Token用于调用抖店API，需要通过OAuth授权流程获取。
              </DialogDescription>
            </DialogHeader>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>获取Access Token步骤</AlertTitle>
              <AlertDescription>
                <ol className="mt-2 ml-4 list-decimal text-sm">
                  <li>登录抖店开放平台</li>
                  <li>进入应用管理 → 选择您的应用</li>
                  <li>点击"获取授权"按钮</li>
                  <li>完成店铺授权后获取Access Token</li>
                </ol>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="token">Access Token</Label>
              <Input
                id="token"
                placeholder="请输入Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTokenDialog(false)}>取消</Button>
              <Button onClick={() => setShowTokenDialog(false)}>确认</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API配置状态 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {configLoading ? (
              <p className="text-gray-500">检查配置中...</p>
            ) : configData?.configured ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">API密钥已配置</p>
                  <p className="text-sm text-gray-500">
                    App Key和App Secret已正确设置
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-700">API密钥未配置</p>
                  <p className="text-sm text-gray-500">
                    请在环境变量中设置DOUDIAN_APP_KEY和DOUDIAN_APP_SECRET
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 千川API提示 */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>关于千川推广费</AlertTitle>
        <AlertDescription>
          千川（巨量千川）是独立于抖店的广告投放平台，需要单独对接巨量千川API。
          请访问 <a href="https://ad.oceanengine.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">巨量千川开放平台</a> 获取API密钥。
        </AlertDescription>
      </Alert>

      {/* 同步时间范围 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">同步时间范围</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">结束日期</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <Button variant="outline" onClick={() => {
              setDateRange({
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
              });
            }}>
              最近30天
            </Button>
            <Button variant="outline" onClick={() => {
              setDateRange({
                startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
              });
            }}>
              最近90天
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API模块列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">数据模块</CardTitle>
          <CardDescription>选择需要同步的数据模块</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>数据模块</TableHead>
                <TableHead>可用接口</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>同步结果</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {API_MODULES.map((module) => {
                const Icon = module.icon;
                const moduleAvailability = availability[module.key];
                const isAvailable = moduleAvailability?.available ?? false;
                const apis = moduleAvailability?.apis || [];
                const status = syncStatus[module.key] || 'idle';
                const result = syncResults[module.key];

                return (
                  <TableRow key={module.key}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{module.name}</span>
                        {!isAvailable && (
                          <Badge variant="outline" className="text-xs">不可用</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-gray-500">
                        {apis.length > 0 ? apis.join(', ') : '无可用接口'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(status)}
                    </TableCell>
                    <TableCell>
                      {result && (
                        <p className={`text-xs ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.success 
                            ? `成功获取 ${result.data?.total || 0} 条数据`
                            : result.error || '同步失败'
                          }
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!isAvailable || status === 'syncing'}
                        onClick={() => handleSync(module.key)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        同步
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
