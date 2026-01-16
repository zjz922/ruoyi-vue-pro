/**
 * 聚水潭ERP API客户端
 * 用于对接聚水潭开放平台，获取仓库入库数据和费用数据
 */
import crypto from 'crypto';

interface JstConfig {
  partnerId: string;
  partnerKey: string;
  token: string;
  baseUrl?: string;
}

interface JstApiResponse<T = any> {
  code: number;
  issuccess: boolean;
  msg: string;
  data?: T;
  datas?: T[];
  page_index?: number;
  page_size?: number;
  page_count?: number;
  has_next?: boolean;
  qty?: number;
}

// 入库单数据结构
interface PurchaseInData {
  io_id: number;
  po_id: number;
  warehouse: string;
  wh_id: number;
  supplier_id: number;
  supplier_name: string;
  status: string;
  io_date: string;
  type: string;
  remark?: string;
  items?: PurchaseInItemData[];
}

interface PurchaseInItemData {
  ioi_id: number;
  sku_id: string;
  name: string;
  qty: number;
  cost_price: number;
  cost_amount: number;
  remark?: string;
}

// 库存数据结构
interface InventoryData {
  sku_id: string;
  name: string;
  wh_id: number;
  warehouse: string;
  qty: number;
  lock_qty: number;
  available_qty: number;
}

// 店铺数据结构
interface ShopData {
  shop_id: number;
  shop_name: string;
  shop_site: string;
  shop_url: string;
  status: string;
}

export class JstApiClient {
  private config: JstConfig;
  private baseUrl: string;

  constructor(config: JstConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://open.erp321.com/api/open/query.aspx';
  }

  /**
   * 生成签名
   * 签名算法：将所有参数按ASCII码升序排列，拼接后追加密钥，MD5加密转大写
   */
  private generateSign(params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const paramStr = sortedKeys
      .map(key => `${key}=${params[key]}`)
      .join('&');
    const signStr = paramStr + this.config.partnerKey;
    return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
  }

  /**
   * 发起API请求
   */
  async request<T = any>(method: string, bizParams: Record<string, any> = {}): Promise<JstApiResponse<T>> {
    const ts = Math.floor(Date.now() / 1000);
    
    const params: Record<string, any> = {
      partnerid: this.config.partnerId,
      token: this.config.token,
      method,
      ts: ts.toString(),
    };

    // 将业务参数转为JSON字符串
    if (Object.keys(bizParams).length > 0) {
      params.jst_param = JSON.stringify(bizParams);
    }

    params.sign = this.generateSign(params);

    try {
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const result = await response.json();
      return result as JstApiResponse<T>;
    } catch (error) {
      console.error('聚水潭API请求失败:', error);
      throw error;
    }
  }

  /**
   * 查询采购入库单
   */
  async queryPurchaseIn(params: {
    modified_begin: string;
    modified_end: string;
    page_index?: number;
    page_size?: number;
    po_ids?: number[];
    status?: string;
  }): Promise<JstApiResponse<PurchaseInData>> {
    return this.request<PurchaseInData>('purchasein.query', {
      modified_begin: params.modified_begin,
      modified_end: params.modified_end,
      page_index: params.page_index || 1,
      page_size: params.page_size || 30,
      ...(params.po_ids && { po_ids: params.po_ids }),
      ...(params.status && { status: params.status }),
    });
  }

  /**
   * 查询库存
   */
  async queryInventory(params: {
    sku_ids?: string[];
    wh_id?: number;
    page_index?: number;
    page_size?: number;
  }): Promise<JstApiResponse<InventoryData>> {
    return this.request<InventoryData>('inventory.query', {
      page_index: params.page_index || 1,
      page_size: params.page_size || 30,
      ...(params.sku_ids && { sku_ids: params.sku_ids }),
      ...(params.wh_id && { wh_id: params.wh_id }),
    });
  }

  /**
   * 查询店铺
   */
  async queryShops(params: {
    page_index?: number;
    page_size?: number;
    shop_ids?: number[];
  } = {}): Promise<JstApiResponse<ShopData>> {
    return this.request<ShopData>('shops.query', {
      page_index: params.page_index || 1,
      page_size: params.page_size || 30,
      ...(params.shop_ids && { shop_ids: params.shop_ids }),
    });
  }

  /**
   * 查询仓库
   */
  async queryWarehouses(): Promise<JstApiResponse> {
    return this.request('wms.partner.query', {});
  }

  /**
   * 查询销售出库单
   */
  async querySaleOut(params: {
    modified_begin: string;
    modified_end: string;
    page_index?: number;
    page_size?: number;
  }): Promise<JstApiResponse> {
    return this.request('saleout.list.query', {
      modified_begin: params.modified_begin,
      modified_end: params.modified_end,
      page_index: params.page_index || 1,
      page_size: params.page_size || 30,
    });
  }

  /**
   * 查询API接口账单
   */
  async queryApiBill(params: {
    request_begin: string;
    request_end: string;
  }): Promise<JstApiResponse> {
    return this.request('api.bill', {
      request_begin: params.request_begin,
      request_end: params.request_end,
    });
  }

  /**
   * 验证配置是否有效
   */
  async validateConfig(): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await this.queryShops({ page_size: 1 });
      if (response.code === 0 && response.issuccess) {
        return { valid: true, message: '配置验证成功' };
      }
      return { valid: false, message: response.msg || '配置验证失败' };
    } catch (error) {
      return { valid: false, message: `配置验证异常: ${error}` };
    }
  }
}

export type { JstConfig, JstApiResponse, PurchaseInData, PurchaseInItemData, InventoryData, ShopData };
