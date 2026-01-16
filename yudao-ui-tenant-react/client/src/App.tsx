import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages - 抖店财务应用原型页面
import FinanceCommandCenter from "./pages/FinanceCommandCenter";
import Accounting from "./pages/Accounting";
import Funds from "./pages/Funds";
import Inventory from "./pages/Inventory";
import Analysis from "./pages/Analysis";
import Expense from "./pages/Expense";
import Tax from "./pages/Tax";

// 订单管理模块页面
import OrderManagement from "./pages/OrderManagement";
import OrderStatistics from "./pages/OrderStatistics";
import OrderThirtyDays from "./pages/OrderThirtyDays";
import OrderMonthlyStats from "./pages/OrderMonthlyStats";
import OrderYearlyStats from "./pages/OrderYearlyStats";
import OrderDetail from "./pages/OrderDetail";
import CostConfig from "./pages/CostConfig";
import DocumentCenter from "./pages/DocumentCenter";
import DoudianSync from "./pages/DoudianSync";
import QianchuanSync from "./pages/QianchuanSync";
import JstSync from "./pages/JstSync";
import ReconciliationDashboard from "./pages/ReconciliationDashboard";
import OrderReconciliation from "./pages/OrderReconciliation";
import DocumentLinking from "./pages/DocumentLinking";
import DoudianAuthCallback from "./pages/DoudianAuthCallback";

// 出纳模块页面
import CashierDashboard from "./pages/cashier/CashierDashboard";
import CashierCashflow from "./pages/cashier/CashierCashflow";
import CashierChannels from "./pages/cashier/CashierChannels";
import CashierReconciliation from "./pages/cashier/CashierReconciliation";
import CashierDifferences from "./pages/cashier/CashierDifferences";
import CashierDailyReport from "./pages/cashier/CashierDailyReport";
import CashierMonthlyReport from "./pages/cashier/CashierMonthlyReport";
import CashierShopReport from "./pages/cashier/CashierShopReport";
import CashierAlerts from "./pages/cashier/CashierAlerts";
import CashierAlertRules from "./pages/cashier/CashierAlertRules";

// 帮助中心
import HelpCenter from "./pages/HelpCenter";

function Router() {
  return (
    <Switch>
      {/* 抖店授权回调 */}
      <Route path="/doudian/callback" component={DoudianAuthCallback} />
      
      {/* 主页 - 经营概览 */}
      <Route path="/" component={FinanceCommandCenter} />
      
      {/* 财务核算 */}
      <Route path="/accounting" component={Accounting} />
      
      {/* 资金管理 */}
      <Route path="/funds" component={Funds} />
      
      {/* 库存成本 */}
      <Route path="/inventory" component={Inventory} />
      
      {/* 经营分析 */}
      <Route path="/analysis" component={Analysis} />
      
      {/* 费用中心 */}
      <Route path="/expense" component={Expense} />
      
      {/* 税务管理 */}
      <Route path="/tax" component={Tax} />
      
      {/* 订单管理模块路由 */}
      <Route path="/orders" component={OrderManagement} />
      <Route path="/order-statistics" component={OrderStatistics} />
      <Route path="/order-thirty-days" component={OrderThirtyDays} />
      <Route path="/order-monthly-stats" component={OrderMonthlyStats} />
      <Route path="/order-yearly-stats" component={OrderYearlyStats} />
      <Route path="/order-detail" component={OrderDetail} />
      <Route path="/cost-config" component={CostConfig} />
      <Route path="/documents" component={DocumentCenter} />
      <Route path="/doudian-sync" component={DoudianSync} />
      <Route path="/qianchuan-sync" component={QianchuanSync} />
      <Route path="/jst-sync" component={JstSync} />
      <Route path="/reconciliation" component={ReconciliationDashboard} />
      <Route path="/order-reconciliation" component={OrderReconciliation} />
      <Route path="/document-linking" component={DocumentLinking} />
      
      {/* 出纳模块路由 */}
      <Route path="/cashier" component={CashierDashboard} />
      <Route path="/cashier/cashflow" component={CashierCashflow} />
      <Route path="/cashier/channels" component={CashierChannels} />
      <Route path="/cashier/reconciliation" component={CashierReconciliation} />
      <Route path="/cashier/differences" component={CashierDifferences} />
      <Route path="/cashier/daily-report" component={CashierDailyReport} />
      <Route path="/cashier/monthly-report" component={CashierMonthlyReport} />
      <Route path="/cashier/shop-report" component={CashierShopReport} />
      <Route path="/cashier/alerts" component={CashierAlerts} />
      <Route path="/cashier/alert-rules" component={CashierAlertRules} />
      
      {/* 帮助中心 */}
      <Route path="/help" component={HelpCenter} />
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// 默认浅色主题 - 专业财务风格
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
