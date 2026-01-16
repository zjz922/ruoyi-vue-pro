/**
 * 巨量千川API客户端
 * 用于调用千川开放平台API获取推广费用数据
 */

import crypto from 'crypto';

interface QianchuanConfig {
  appId: string;
  appSecret: string;
  accessToken?: string;
  refreshToken?: string;
  advertiserId?: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  advertiser_ids: number[];
  expires_in: number;
  refresh_token_expires_in: number;
}

interface ReportData {
  stat_datetime: string;
  stat_cost: number;
  show_cnt: number;
  click_cnt: number;
  pay_order_count: number;
  pay_order_amount: number;
  prepay_and_pay_order_roi?: number;
  [key: string]: any;
}

interface ReportResponse {
  list: ReportData[];
  page_info: {
    page: number;
    page_size: number;
    total_number: number;
    total_page: number;
  };
}

interface BalanceResponse {
  balance: number;
  valid_balance: number;
  frozen: number;
  cash: number;
  grant: number;
}

export class QianchuanApiClient {
  private config: QianchuanConfig;
  private baseUrl = 'https://ad.oceanengine.com/open_api';

  constructor(config: QianchuanConfig) {
    this.config = config;
  }

  /**
   * 生成授权链接
   */
  getAuthUrl(redirectUri: string, state: string, scope: string[]): string {
    const params = new URLSearchParams({
      app_id: this.config.appId,
      state,
      scope: scope.join(','),
      redirect_uri: redirectUri,
    });
    return `https://ad.oceanengine.com/openapi/audit/oauth.html?${params.toString()}`;
  }

  /**
   * 使用授权码获取Access Token
   */
  async getAccessToken(authCode: string): Promise<ApiResponse<TokenResponse>> {
    const response = await fetch(`${this.baseUrl}/oauth2/access_token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: parseInt(this.config.appId),
        secret: this.config.appSecret,
        auth_code: authCode,
      }),
    });
    return response.json();
  }

  /**
   * 刷新Access Token
   */
  async refreshToken(): Promise<ApiResponse<TokenResponse>> {
    if (!this.config.refreshToken) {
      throw new Error('Refresh token not available');
    }

    const response = await fetch(`${this.baseUrl}/oauth2/refresh_token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: parseInt(this.config.appId),
        secret: this.config.appSecret,
        grant_type: 'refresh_token',
        refresh_token: this.config.refreshToken,
      }),
    });
    return response.json();
  }

  /**
   * 获取投放账户数据（推广费用）
   */
  async getAdvertiserReport(params: {
    advertiserId: string;
    startDate: string;
    endDate: string;
    fields?: string[];
    marketingGoal?: string;
    timeGranularity?: string;
  }): Promise<ApiResponse<ReportResponse>> {
    if (!this.config.accessToken) {
      throw new Error('Access token not available');
    }

    const fields = params.fields || [
      'stat_cost',
      'show_cnt',
      'click_cnt',
      'pay_order_count',
      'pay_order_amount',
      'prepay_and_pay_order_roi',
    ];

    const queryParams = new URLSearchParams({
      advertiser_id: params.advertiserId,
      start_date: params.startDate,
      end_date: params.endDate,
      fields: JSON.stringify(fields),
      filtering: JSON.stringify({
        marketing_goal: params.marketingGoal || 'ALL',
      }),
    });

    if (params.timeGranularity) {
      queryParams.append('time_granularity', params.timeGranularity);
    } else {
      queryParams.append('time_granularity', 'TIME_GRANULARITY_DAILY');
    }

    const response = await fetch(
      `${this.baseUrl}/v1.0/qianchuan/report/advertiser/get/?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Access-Token': this.config.accessToken,
        },
      }
    );
    return response.json();
  }

  /**
   * 获取账户余额
   */
  async getAccountBalance(advertiserId: string): Promise<ApiResponse<BalanceResponse>> {
    if (!this.config.accessToken) {
      throw new Error('Access token not available');
    }

    const response = await fetch(
      `${this.baseUrl}/v1.0/qianchuan/account/balance/get/?advertiser_id=${advertiserId}`,
      {
        method: 'GET',
        headers: {
          'Access-Token': this.config.accessToken,
        },
      }
    );
    return response.json();
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<QianchuanConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// 导出单例实例（用于定时任务）
let clientInstance: QianchuanApiClient | null = null;

export function getQianchuanClient(config?: QianchuanConfig): QianchuanApiClient {
  if (!clientInstance && config) {
    clientInstance = new QianchuanApiClient(config);
  }
  if (!clientInstance) {
    throw new Error('Qianchuan client not initialized');
  }
  return clientInstance;
}

export function initQianchuanClient(config: QianchuanConfig): QianchuanApiClient {
  clientInstance = new QianchuanApiClient(config);
  return clientInstance;
}
