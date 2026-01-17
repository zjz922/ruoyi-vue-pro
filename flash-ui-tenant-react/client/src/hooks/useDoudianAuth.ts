/**
 * 抖店授权Hook
 * 
 * @description 用于管理租户端的抖店授权状态
 * @author Manus AI
 */

import { useState, useCallback, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * 授权状态接口
 */
interface AuthState {
  /** 是否已授权 */
  isAuthorized: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 店铺ID */
  shopId: string | null;
  /** 店铺名称 */
  shopName: string | null;
  /** 授权过期时间 */
  expireTime: string | null;
  /** 错误信息 */
  error: string | null;
}

/**
 * 授权状态检查结果接口
 */
interface CheckAuthStatusResult {
  authorized: boolean;
  shopId: string | null;
  shopName: string | null;
  expireTime: string | null;
}

/**
 * 抖店授权Hook
 * 
 * @returns 授权状态和操作方法
 */
export function useDoudianAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthorized: false,
    isLoading: true,
    shopId: null,
    shopName: null,
    expireTime: null,
    error: null,
  });

  // 检查授权状态
  const checkAuthStatus = trpc.doudian.checkAuthStatus.useQuery(undefined, {
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 1,
  }) as {
    data: CheckAuthStatusResult | undefined;
    isLoading: boolean;
    error: { message: string } | null;
    refetch: () => void;
  };

  // 获取授权URL
  const getAuthUrlMutation = trpc.doudian.getAuthUrl.useMutation();

  // 处理授权回调
  const handleCallbackMutation = trpc.doudian.handleCallback.useMutation();

  // 更新状态
  useEffect(() => {
    if (checkAuthStatus.isLoading) {
      setState(prev => ({ ...prev, isLoading: true }));
    } else if (checkAuthStatus.error?.message) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthorized: false,
        error: checkAuthStatus.error?.message || '授权检查失败',
      }));
    } else if (checkAuthStatus.data) {
      setState({
        isAuthorized: checkAuthStatus.data.authorized,
        isLoading: false,
        shopId: checkAuthStatus.data.shopId,
        shopName: checkAuthStatus.data.shopName,
        expireTime: checkAuthStatus.data.expireTime,
        error: null,
      });
    }
  }, [checkAuthStatus.isLoading, checkAuthStatus.error, checkAuthStatus.data]);

  /**
   * 获取授权URL并跳转
   */
  const authorize = useCallback(async () => {
    try {
      const redirectUri = window.location.origin + '/doudian/callback';
      const result = await getAuthUrlMutation.mutateAsync({ redirectUri });
      // 保存state到localStorage用于验证
      localStorage.setItem('doudian_auth_state', result.state);
      window.location.href = result.authUrl;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取授权URL失败',
      }));
    }
  }, [getAuthUrlMutation]);

  /**
   * 处理授权回调
   */
  const handleCallback = useCallback(async (code: string, state: string) => {
    try {
      // 验证state
      const savedState = localStorage.getItem('doudian_auth_state');
      if (savedState && savedState !== state) {
        throw new Error('授权状态验证失败，请重新授权');
      }
      
      const result = await handleCallbackMutation.mutateAsync({ code, state });
      
      // 清除state
      localStorage.removeItem('doudian_auth_state');
      
      // 检查授权是否成功
      if (!result.success) {
        throw new Error(result.message || '授权失败');
      }
      
      setState(prev => ({
        ...prev,
        isAuthorized: true,
        shopId: result.shopId,
        shopName: result.shopName,
        error: null,
      }));
      
      // 刷新授权状态
      checkAuthStatus.refetch();
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '授权回调处理失败';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, [handleCallbackMutation, checkAuthStatus]);

  /**
   * 刷新授权状态
   */
  const refreshStatus = useCallback(() => {
    checkAuthStatus.refetch();
  }, [checkAuthStatus]);

  return {
    ...state,
    authorize,
    handleCallback,
    refreshStatus,
    isAuthorizing: getAuthUrlMutation.isPending,
    isProcessingCallback: handleCallbackMutation.isPending,
  };
}
