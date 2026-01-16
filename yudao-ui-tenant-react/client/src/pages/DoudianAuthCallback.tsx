/**
 * 抖店授权回调页面
 * 
 * @description 处理抖店OAuth授权回调
 * @author Manus AI
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useDoudianAuth } from '@/hooks/useDoudianAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type CallbackStatus = 'processing' | 'success' | 'error';

/**
 * 授权回调页面
 */
export default function DoudianAuthCallback() {
  const [, navigate] = useLocation();
  const { handleCallback } = useDoudianAuth();
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [message, setMessage] = useState('');
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code || !state) {
        setStatus('error');
        setMessage('无效的授权回调参数');
        return;
      }

      try {
        const result = await handleCallback(code, state);
        setStatus('success');
        setShopName(result.shopName || '未知店铺');
        setMessage('授权成功！');
        
        // 3秒后跳转到首页
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : '授权失败，请重试');
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center">
          {status === 'processing' && (
            <>
              <div className="mx-auto mb-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              <CardTitle>正在处理授权</CardTitle>
              <CardDescription>请稍候...</CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <CardTitle className="text-green-600">授权成功</CardTitle>
              <CardDescription>
                店铺「{shopName}」已成功授权
              </CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-red-600">授权失败</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent>
          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                3秒后自动跳转到首页...
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                立即跳转
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                返回首页
              </Button>
              <Button onClick={() => window.location.reload()}>
                重试
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
