/**
 * 店铺切换组件
 * 
 * @description 允许用户在已授权的多个抖店店铺之间进行选择和切换
 * @author Manus AI
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Store, ChevronDown, Check, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// 店铺类型定义
interface Shop {
  shopId: string;
  shopName: string;
  isCurrentShop?: boolean;
}

interface ShopListData {
  shops?: Shop[];
}

interface CurrentShopData {
  shopId?: string;
  shopName?: string;
  hasCurrentShop?: boolean;
}

interface SwitchShopResult {
  success: boolean;
  shopId: string | null;
  shopName: string | null;
  message: string;
}

interface ShopSwitcherProps {
  /** 是否显示完整店铺名称 */
  showFullName?: boolean;
  /** 切换店铺后的回调 */
  onShopChange?: (shopId: string, shopName: string) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 店铺切换下拉组件
 */
export function ShopSwitcher({ 
  showFullName = false, 
  onShopChange,
  className = '',
}: ShopSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 获取店铺列表
  const { data: shopListData, isLoading: isLoadingShops, refetch: refetchShops } = 
    trpc.doudian.getShopList.useQuery(undefined, {
      refetchOnWindowFocus: false,
    }) as {
      data: ShopListData | undefined;
      isLoading: boolean;
      refetch: () => void;
    };

  // 获取当前店铺
  const { data: currentShopData, isLoading: isLoadingCurrentShop, refetch: refetchCurrentShop } = 
    trpc.doudian.getCurrentShop.useQuery(undefined, {
      refetchOnWindowFocus: false,
    }) as {
      data: CurrentShopData | undefined;
      isLoading: boolean;
      refetch: () => void;
    };

  // 切换店铺
  const switchShopMutation = trpc.doudian.switchShop.useMutation({
    onSuccess: (data: SwitchShopResult) => {
      if (data.success) {
        toast.success(`已切换到 ${data.shopName}`);
        refetchCurrentShop();
        refetchShops();
        if (onShopChange && data.shopId) {
          onShopChange(data.shopId, data.shopName || '');
        }
      } else {
        toast.error(data.message || '切换失败');
      }
    },
    onError: (error) => {
      toast.error(error.message || '切换失败');
    },
  });

  const handleSwitchShop = (shopId: string) => {
    if (shopId === currentShopData?.shopId) {
      setIsOpen(false);
      return;
    }
    switchShopMutation.mutate({ shopId });
    setIsOpen(false);
  };

  const isLoading = isLoadingShops || isLoadingCurrentShop;
  const shops = shopListData?.shops || [];
  const hasShops = shops.length > 0;
  const currentShopName = currentShopData?.shopName || '选择店铺';

  // 截断店铺名称
  const displayName = showFullName 
    ? currentShopName 
    : currentShopName.length > 8 
      ? currentShopName.slice(0, 8) + '...' 
      : currentShopName;

  if (isLoading) {
    return (
      <Button variant="outline" disabled className={className}>
        <Store className="h-4 w-4 mr-2" />
        加载中...
      </Button>
    );
  }

  if (!hasShops) {
    return (
      <Button variant="outline" className={`text-muted-foreground ${className}`}>
        <AlertCircle className="h-4 w-4 mr-2" />
        暂无授权店铺
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`min-w-[140px] justify-between ${className}`}
          disabled={switchShopMutation.isPending}
        >
          <div className="flex items-center">
            <Store className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{displayName}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>切换店铺</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {shops.map((shop) => (
          <DropdownMenuItem
            key={shop.shopId}
            onClick={() => handleSwitchShop(shop.shopId)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center flex-1 min-w-0">
                <Store className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{shop.shopName}</span>
              </div>
              {shop.isCurrentShop && (
                <Check className="h-4 w-4 ml-2 flex-shrink-0 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // 跳转到授权页面添加新店铺
            window.location.href = '/settings/authorization';
          }}
          className="cursor-pointer text-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          添加新店铺
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * 店铺切换Hook
 * 提供店铺切换相关的状态和方法
 */
export function useShopSwitcher() {
  const { data: shopListData, isLoading: isLoadingShops, refetch: refetchShops } = 
    trpc.doudian.getShopList.useQuery(undefined, {
      refetchOnWindowFocus: false,
    }) as {
      data: ShopListData | undefined;
      isLoading: boolean;
      refetch: () => void;
    };

  const { data: currentShopData, isLoading: isLoadingCurrentShop, refetch: refetchCurrentShop } = 
    trpc.doudian.getCurrentShop.useQuery(undefined, {
      refetchOnWindowFocus: false,
    }) as {
      data: CurrentShopData | undefined;
      isLoading: boolean;
      refetch: () => void;
    };

  const switchShopMutation = trpc.doudian.switchShop.useMutation({
    onSuccess: () => {
      refetchCurrentShop();
      refetchShops();
    },
  });

  return {
    shops: shopListData?.shops || [],
    currentShopId: currentShopData?.shopId || null,
    currentShopName: currentShopData?.shopName || null,
    hasCurrentShop: currentShopData?.hasCurrentShop || false,
    isLoading: isLoadingShops || isLoadingCurrentShop,
    isSwitching: switchShopMutation.isPending,
    switchShop: (shopId: string) => switchShopMutation.mutateAsync({ shopId }),
    refetch: () => {
      refetchShops();
      refetchCurrentShop();
    },
  };
}

export default ShopSwitcher;
