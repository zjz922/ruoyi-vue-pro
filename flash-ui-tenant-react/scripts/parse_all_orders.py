#!/usr/bin/env python3
"""
解析抖店订单CSV文件，生成完整的订单明细JSON数据
"""
import csv
import json
from datetime import datetime
from collections import defaultdict

# 读取CSV文件
csv_file = '/home/ubuntu/upload/1768222209_84d85539418136390ef30277ca67bc04zaHCLELw.csv'

orders = []
daily_order_counts = defaultdict(int)
daily_shipped_counts = defaultdict(int)

with open(csv_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        # 提取关键字段
        # 安全转换数字函数
        def safe_float(val):
            if not val or val == '-':
                return 0.0
            try:
                return float(str(val).strip())
            except:
                return 0.0
        
        def safe_int(val):
            if not val or val == '-':
                return 0
            try:
                return int(str(val).strip())
            except:
                return 0
        
        order = {
            'mainOrderNo': row.get('主订单编号', '').strip(),
            'subOrderNo': row.get('子订单编号', '').strip(),
            'productName': row.get('选购商品', '').strip(),
            'productSpec': row.get('商品规格', '').strip(),
            'quantity': safe_int(row.get('商品数量', 0)),
            'sku': row.get('商家编码', '').strip(),
            'unitPrice': safe_float(row.get('商品单价', 0)),
            'payAmount': safe_float(row.get('订单应付金额', 0)),
            'freight': safe_float(row.get('运费', 0)),
            'totalDiscount': safe_float(row.get('优惠总金额', 0)),
            'platformDiscount': safe_float(row.get('平台优惠', 0)),
            'merchantDiscount': safe_float(row.get('商家优惠', 0)),
            'influencerDiscount': safe_float(row.get('达人优惠', 0)),
            'serviceFee': safe_float(row.get('手续费', 0)),
            'payMethod': row.get('支付方式', '').strip(),
            'receiver': row.get('收件人', '').strip(),
            'province': row.get('省', '').strip(),
            'city': row.get('市', '').strip(),
            'district': row.get('区', '').strip(),
            'orderTime': row.get('订单提交时间', '').strip(),
            'payTime': row.get('支付完成时间', '').strip(),
            'shipTime': row.get('发货时间', '').strip(),
            'completeTime': row.get('订单完成时间', '').strip(),
            'status': row.get('订单状态', '').strip(),
            'afterSaleStatus': row.get('售后状态', '').strip(),
            'cancelReason': row.get('取消原因', '').strip(),
            'appChannel': row.get('APP渠道', '').strip(),
            'trafficSource': row.get('流量来源', '').strip(),
            'orderType': row.get('订单类型', '').strip(),
            'influencerId': row.get('达人ID', '').strip(),
            'influencerName': row.get('达人昵称', '').strip(),
            'flagColor': row.get('旗帜颜色', '').strip(),
            'merchantRemark': row.get('商家备注', '').strip(),
        }
        
        orders.append(order)
        
        # 统计每日订单数（按下单时间）
        if order['orderTime']:
            order_date = order['orderTime'].split(' ')[0]
            daily_order_counts[order_date] += 1
        
        # 统计每日发货数（按发货时间）
        if order['shipTime']:
            ship_date = order['shipTime'].split(' ')[0]
            daily_shipped_counts[ship_date] += 1

print(f"总订单数: {len(orders)}")
print(f"订单日期范围: {min(daily_order_counts.keys())} ~ {max(daily_order_counts.keys())}")
print(f"发货日期范围: {min(daily_shipped_counts.keys()) if daily_shipped_counts else 'N/A'} ~ {max(daily_shipped_counts.keys()) if daily_shipped_counts else 'N/A'}")

# 按下单时间排序
orders.sort(key=lambda x: x['orderTime'], reverse=True)

# 保存完整订单数据到JSON文件
output_file = '/home/ubuntu/doudian-finance-prototype/client/src/data/allOrders.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(orders, f, ensure_ascii=False, indent=2)

print(f"订单数据已保存到: {output_file}")

# 生成每日统计数据
daily_stats = []
for date in sorted(daily_order_counts.keys(), reverse=True):
    # 筛选该日期的订单
    day_orders = [o for o in orders if o['orderTime'].startswith(date)]
    
    # 计算各项统计
    total_orders = len(day_orders)
    shipped_orders = len([o for o in day_orders if o['shipTime']])
    completed_orders = len([o for o in day_orders if o['status'] == '已完成'])
    closed_orders = len([o for o in day_orders if o['status'] == '已关闭'])
    
    sales_amount = sum(o['payAmount'] for o in day_orders)
    shipped_amount = sum(o['payAmount'] for o in day_orders if o['shipTime'])
    completed_amount = sum(o['payAmount'] for o in day_orders if o['status'] == '已完成')
    
    # 退款金额（已关闭订单的金额）
    refund_amount = sum(o['payAmount'] for o in day_orders if o['status'] == '已关闭')
    
    discount = sum(o['totalDiscount'] for o in day_orders)
    
    daily_stats.append({
        'date': date,
        'totalOrders': total_orders,
        'shippedOrders': shipped_orders,
        'completedOrders': completed_orders,
        'closedOrders': closed_orders,
        'salesAmount': round(sales_amount, 2),
        'shippedAmount': round(shipped_amount, 2),
        'completedAmount': round(completed_amount, 2),
        'refundAmount': round(refund_amount, 2),
        'discount': round(discount, 2),
    })

# 保存每日统计数据
stats_file = '/home/ubuntu/doudian-finance-prototype/scripts/daily_stats_full.json'
with open(stats_file, 'w', encoding='utf-8') as f:
    json.dump(daily_stats, f, ensure_ascii=False, indent=2)

print(f"每日统计数据已保存到: {stats_file}")

# 打印汇总信息
print("\n=== 数据汇总 ===")
print(f"总订单数: {sum(d['totalOrders'] for d in daily_stats)}")
print(f"已发货订单: {sum(d['shippedOrders'] for d in daily_stats)}")
print(f"已完成订单: {sum(d['completedOrders'] for d in daily_stats)}")
print(f"已关闭订单: {sum(d['closedOrders'] for d in daily_stats)}")
print(f"总销售额: ¥{sum(d['salesAmount'] for d in daily_stats):,.2f}")
print(f"总退款额: ¥{sum(d['refundAmount'] for d in daily_stats):,.2f}")

# 打印每日统计（前5天）
print("\n=== 每日统计（前5天）===")
for stat in daily_stats[:5]:
    print(f"{stat['date']}: 订单{stat['totalOrders']}单, 发货{stat['shippedOrders']}单, 销售额¥{stat['salesAmount']:,.2f}")
