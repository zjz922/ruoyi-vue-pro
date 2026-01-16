import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  PlayCircle,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  FileText,
  Settings,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Bell,
  Users,
  Database,
  Shield,
  Zap,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 帮助分类
const helpCategories = [
  { id: "getting-started", label: "快速入门", icon: Zap, color: "text-blue-600" },
  { id: "orders", label: "订单管理", icon: ShoppingCart, color: "text-green-600" },
  { id: "finance", label: "财务核算", icon: DollarSign, color: "text-orange-600" },
  { id: "reports", label: "报表分析", icon: BarChart3, color: "text-purple-600" },
  { id: "settings", label: "系统设置", icon: Settings, color: "text-gray-600" },
  { id: "security", label: "安全与权限", icon: Shield, color: "text-red-600" },
];

// 快速入门指南
const quickStartGuides = [
  {
    id: 1,
    title: "5分钟快速上手闪电帐PRO",
    description: "了解系统核心功能，快速开始使用",
    duration: "5分钟",
    steps: 5,
    isVideo: true,
  },
  {
    id: 2,
    title: "店铺授权与数据同步",
    description: "如何授权店铺并同步订单数据",
    duration: "3分钟",
    steps: 4,
    isVideo: true,
  },
  {
    id: 3,
    title: "成本配置与利润计算",
    description: "配置商品成本，自动计算订单利润",
    duration: "4分钟",
    steps: 6,
    isVideo: false,
  },
  {
    id: 4,
    title: "财务报表生成与导出",
    description: "生成各类财务报表并导出",
    duration: "3分钟",
    steps: 3,
    isVideo: false,
  },
];

// 常见问题
const faqs = [
  {
    category: "订单管理",
    questions: [
      {
        q: "如何批量导入历史订单？",
        a: "进入【订单管理】页面，点击右上角【导入订单】按钮，下载Excel模板，按格式填写订单数据后上传即可。系统支持一次导入最多5000条订单记录。",
      },
      {
        q: "订单同步失败怎么办？",
        a: "1. 检查店铺授权是否过期，如过期请重新授权；\n2. 确认网络连接正常；\n3. 查看同步日志了解具体错误原因；\n4. 如仍无法解决，请联系客服。",
      },
      {
        q: "如何标记特殊订单（样品、内购等）？",
        a: "在订单列表中选择需要标记的订单，点击【批量标记】或单个订单的【更多】→【标记特殊订单】，选择标记类型并填写备注即可。标记后的订单将按特定规则计算财务数据。",
      },
    ],
  },
  {
    category: "财务核算",
    questions: [
      {
        q: "利润计算公式是什么？",
        a: "订单利润 = 实付金额 - 商品成本 - 平台扣点 - 运费险 - 达人佣金 - 其他费用\n\n其中各项费用会根据平台规则自动计算，您也可以手动调整。",
      },
      {
        q: "如何设置多时段成本？",
        a: "进入【成本配置】页面，找到需要配置的商品，点击【编辑】，在弹窗中选择【指定时间】生效，设置新成本价和生效日期。系统会在指定日期自动切换成本价。",
      },
      {
        q: "平台扣点如何计算？",
        a: "系统会根据各平台的扣点规则自动计算。抖音平台默认扣点5%，淘宝根据类目不同为2%-5%，京东为3%-8%。您可以在【系统设置】→【扣点配置】中自定义扣点比例。",
      },
    ],
  },
  {
    category: "报表分析",
    questions: [
      {
        q: "如何生成月度财务报表？",
        a: "进入【报表中心】→【资金月报】，选择需要查看的月份，系统会自动生成包含收入、成本、利润等数据的月度报表。点击【导出】可下载Excel或PDF格式。",
      },
      {
        q: "报表数据与实际不符怎么办？",
        a: "1. 检查订单数据是否完整同步；\n2. 确认商品成本是否正确配置；\n3. 查看是否有特殊订单影响统计；\n4. 点击【刷新数据】重新计算。",
      },
    ],
  },
  {
    category: "系统设置",
    questions: [
      {
        q: "如何添加子账号？",
        a: "进入【系统设置】→【用户管理】，点击【添加用户】，填写账号信息并分配权限角色。子账号可以设置不同的数据查看范围和操作权限。",
      },
      {
        q: "如何备份数据？",
        a: "系统每日自动备份数据，您也可以在【系统设置】→【数据管理】中手动触发备份。备份文件保留30天，可随时下载或恢复。",
      },
    ],
  },
];

// 视频教程
const videoTutorials = [
  {
    id: 1,
    title: "闪电帐PRO完整功能演示",
    duration: "15:30",
    views: 12580,
    thumbnail: "",
  },
  {
    id: 2,
    title: "多店铺数据汇总分析",
    duration: "08:45",
    views: 8920,
    thumbnail: "",
  },
  {
    id: 3,
    title: "出纳模块使用教程",
    duration: "12:20",
    views: 6540,
    thumbnail: "",
  },
  {
    id: 4,
    title: "税务管理与申报指南",
    duration: "10:15",
    views: 5280,
    thumbnail: "",
  },
];

export default function HelpCenter() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("guides");

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* 顶部搜索区域 */}
      <div className="flex-shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="p-8 max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">帮助中心</h1>
          <p className="text-muted-foreground mb-6">搜索问题或浏览帮助文档，快速找到答案</p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索问题，如：如何配置成本..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* 热门搜索 */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">热门搜索：</span>
            {["订单同步", "利润计算", "成本配置", "报表导出"].map(keyword => (
              <Badge 
                key={keyword} 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setSearchKeyword(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* 分类导航 */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {helpCategories.map(category => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className={cn(
                    "p-4 rounded-lg border border-border cursor-pointer transition-all text-center",
                    activeCategory === category.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-muted/50"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon className={cn("w-8 h-8 mx-auto mb-2", category.color)} />
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
              );
            })}
          </div>

          {/* 内容标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="guides" className="gap-2">
                <BookOpen className="w-4 h-4" />
                快速入门
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                常见问题
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <PlayCircle className="w-4 h-4" />
                视频教程
              </TabsTrigger>
            </TabsList>

            {/* 快速入门 */}
            <TabsContent value="guides">
              <div className="grid grid-cols-2 gap-4">
                {quickStartGuides.map(guide => (
                  <div
                    key={guide.id}
                    className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                        guide.isVideo ? "bg-red-100" : "bg-blue-100"
                      )}>
                        {guide.isVideo ? (
                          <PlayCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <FileText className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{guide.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {guide.duration}
                          </span>
                          <span>{guide.steps} 个步骤</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                ))}
              </div>

              {/* 功能文档列表 */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">功能使用文档</h2>
                <div className="bg-card rounded-lg border border-border divide-y divide-border">
                  {[
                    { title: "订单管理完整指南", desc: "订单导入、筛选、标记、导出等功能详解", icon: ShoppingCart },
                    { title: "财务核算操作手册", desc: "成本配置、利润计算、费用分摊等功能说明", icon: DollarSign },
                    { title: "报表中心使用说明", desc: "各类报表的生成、查看和导出方法", icon: BarChart3 },
                    { title: "出纳模块操作指南", desc: "资金流水、对账、差异分析等功能介绍", icon: Database },
                    { title: "系统设置与权限管理", desc: "账号管理、权限配置、数据备份等设置", icon: Settings },
                  ].map((doc, idx) => {
                    const Icon = doc.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">{doc.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* 常见问题 */}
            <TabsContent value="faq">
              <div className="space-y-6">
                {faqs.map((section, idx) => (
                  <div key={idx} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 font-medium">
                      {section.category}
                    </div>
                    <Accordion type="single" collapsible className="px-4">
                      {section.questions.map((item, qIdx) => (
                        <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                          <AccordionTrigger className="text-left">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="text-muted-foreground whitespace-pre-line">
                              {item.a}
                            </div>
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                              <span className="text-sm text-muted-foreground">这篇文章有帮助吗？</span>
                              <Button variant="outline" size="sm" className="gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                有帮助
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <ThumbsDown className="w-4 h-4" />
                                没帮助
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 视频教程 */}
            <TabsContent value="videos">
              <div className="grid grid-cols-2 gap-4">
                {videoTutorials.map(video => (
                  <div
                    key={video.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/80" />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{video.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{video.views.toLocaleString()} 次观看</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* 联系支持 */}
          <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">没有找到答案？</h3>
                <p className="text-sm text-muted-foreground">联系我们的客服团队，获取一对一帮助</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  在线客服
                </Button>
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  提交工单
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
