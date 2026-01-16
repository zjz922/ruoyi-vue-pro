import type { AppRouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/**
 * 财务管理模块路由配置
 * 
 * @author 闪电账PRO
 * @description 包含订单管理、资金流水、商品成本、对账管理、财务报表等功能
 */
const financeRoutes: AppRouteRecordRaw[] = [
  {
    path: '/finance',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Finance',
    meta: {
      title: t('router.finance'),
      icon: 'money',
      alwaysShow: true,
    },
    children: [
      // 订单管理
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/finance/order/index.vue'),
        meta: {
          title: t('router.order'),
          icon: 'list',
          noCache: false,
          link: null,
        },
      },
      // 资金流水
      {
        path: 'cashflow',
        name: 'Cashflow',
        component: () => import('@/views/finance/cashflow/index.vue'),
        meta: {
          title: t('router.cashflow'),
          icon: 'money',
          noCache: false,
          link: null,
        },
      },
      // 商品成本
      {
        path: 'productcost',
        name: 'ProductCost',
        component: () => import('@/views/finance/productcost/index.vue'),
        meta: {
          title: t('router.productcost'),
          icon: 'price',
          noCache: false,
          link: null,
        },
      },
      // 对账管理
      {
        path: 'reconciliation',
        name: 'Reconciliation',
        component: () => import('@/views/finance/reconciliation/index.vue'),
        meta: {
          title: t('router.reconciliation'),
          icon: 'check',
          noCache: false,
          link: null,
        },
      },
      // 财务报表
      {
        path: 'report',
        name: 'Report',
        component: () => import('@/views/finance/report/index.vue'),
        meta: {
          title: t('router.report'),
          icon: 'chart',
          noCache: false,
          link: null,
        },
        children: [
          // 日报表
          {
            path: 'daily',
            name: 'DailyReport',
            component: () => import('@/views/finance/report/daily.vue'),
            meta: {
              title: t('router.dailyReport'),
              noCache: false,
            },
          },
          // 周报表
          {
            path: 'weekly',
            name: 'WeeklyReport',
            component: () => import('@/views/finance/report/weekly.vue'),
            meta: {
              title: t('router.weeklyReport'),
              noCache: false,
            },
          },
          // 月报表
          {
            path: 'monthly',
            name: 'MonthlyReport',
            component: () => import('@/views/finance/report/monthly.vue'),
            meta: {
              title: t('router.monthlyReport'),
              noCache: false,
            },
          },
          // 毛利分析
          {
            path: 'profitanalysis',
            name: 'ProfitAnalysis',
            component: () => import('@/views/finance/report/profitanalysis.vue'),
            meta: {
              title: t('router.profitAnalysis'),
              noCache: false,
            },
          },
        ],
      },
      // 抖店配置
      {
        path: 'doudianconfig',
        name: 'DoudianConfig',
        component: () => import('@/views/finance/doudianconfig/index.vue'),
        meta: {
          title: t('router.doudianconfig'),
          icon: 'setting',
          noCache: false,
          link: null,
        },
      },
      // 数据同步
      {
        path: 'synclog',
        name: 'SyncLog',
        component: () => import('@/views/finance/synclog/index.vue'),
        meta: {
          title: t('router.synclog'),
          icon: 'sync',
          noCache: false,
          link: null,
        },
      },
    ],
  },
]

export default financeRoutes
