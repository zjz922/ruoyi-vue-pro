/**
 * 抖店授权提示组件
 * 
 * @description 当租户未授权时显示授权提示
 * @author Manus AI
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoudianAuth } from '@/hooks/useDoudianAuth';
import { ShieldCheck, Store, FileText, Users, DollarSign } from 'lucide-react';

/**
 * 授权提示组件
 */
export function DoudianAuthPrompt() {
  const { authorize, isAuthorizing } = useDoudianAuth();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50/50">
      <Card className="w-[480px] shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">授权访问抖店数据</CardTitle>
          <CardDescription className="text-base">
            为了获取您的店铺数据进行财务分析，需要您授权访问抖店账号
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 授权说明 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">授权后，我们将能够：</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Store className="w-4 h-4 text-blue-500" />
                <span>读取您的订单数据</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-green-500" />
                <span>读取您的商品数据</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-orange-500" />
                <span>读取您的结算数据</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="w-4 h-4 text-purple-500" />
                <span>读取您的达人佣金数据</span>
              </div>
            </div>
          </div>

          {/* 授权按钮 */}
          <Button 
            className="w-full h-11 text-base" 
            onClick={authorize}
            disabled={isAuthorizing}
          >
            {isAuthorizing ? '正在跳转...' : '立即授权'}
          </Button>

          {/* 安全提示 */}
          <p className="text-xs text-gray-400 text-center">
            我们承诺严格保护您的数据安全，不会泄露任何信息
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
