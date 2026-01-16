import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

/**
 * API响应数据结构
 */
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 分页响应数据结构
 */
interface PageResponse<T = any> {
  list: T[];
  total: number;
  pageNo: number;
  pageSize: number;
}

/**
 * 创建Axios实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 30000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 可以在这里添加token等认证信息
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { code, msg, data } = response.data;

      // 成功响应
      if (code === 0) {
        return data;
      }

      // 未授权
      if (code === 10001) {
        window.location.href = getLoginUrl();
        return Promise.reject(new Error('Please login'));
      }

      // 其他错误
      return Promise.reject(new Error(msg || 'Unknown error'));
    },
    (error) => {
      // 处理网络错误
      if (error.response?.status === 401) {
        window.location.href = getLoginUrl();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const request = createAxiosInstance();

/**
 * GET请求
 */
export const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return request.get<any, T>(url, config);
};

/**
 * POST请求
 */
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return request.post<any, T>(url, data, config);
};

/**
 * PUT请求
 */
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return request.put<any, T>(url, data, config);
};

/**
 * DELETE请求
 */
export const del = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return request.delete<any, T>(url, config);
};

/**
 * 分页请求
 */
export const getPage = <T = any>(
  url: string,
  pageNo: number = 1,
  pageSize: number = 10,
  config?: AxiosRequestConfig
) => {
  return get<PageResponse<T>>(url, {
    ...config,
    params: {
      ...config?.params,
      pageNo,
      pageSize,
    },
  });
};

export default request;
