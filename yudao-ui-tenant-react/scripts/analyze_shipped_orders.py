#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析抖店订单数据，按发货时间统计已发货订单数量
"""

import csv
import json
from collections import defaultdict
from datetime import datetime

# 读取CSV文件
csv_file = '/home/ubuntu/upload/1768222209_84d85539418136390ef30277ca67bc04zaHCLELw.csv'
csv_encoding = 'utf-8-sig'

# 统计数据
shipped_by_date = defaultdict(lambda: {
    'shipped_orders': 0,  # 已发货订单数
    'shipped_amount': 0,  # 已发货金额
    'total_orders': 0,    # 总订单数（按下单时间）
    'total_amount': 0,    # 总金额
})

# 按下单时间统计（用于对比）
order_by_date = defaultdict(lambda: {
    'total_orders': 0,
    'shipped_orders': 0,
    'total_amount': 0,
    'shipped_amount': 0,
})

total_shipped = 0
total_orders = 0

with open(csv_file, 'r', encoding=csv_encoding, errors='replace') as f:
    reader = csv.DictReader(f)
    for row in reader:
        total_orders += 1
        
        # 获取订单提交时间
        order_time_str = row.get('订单提交时间', '').strip().strip('\t')
        # 获取发货时间
        ship_time_str = row.get('发货时间', '').strip().strip('\t')
        # 获取订单金额
        amount_str = row.get('订单应付金额', '0').strip().strip('\t')
        try:
            amount = float(amount_str) if amount_str and amount_str != '-' else 0
        except:
            amount = 0
        
        # 解析下单日期
        order_date = None
        if order_time_str and order_time_str != '-':
            try:
                order_date = datetime.strptime(order_time_str, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
            except:
                pass
        
        # 按下单时间统计总订单
        if order_date:
            order_by_date[order_date]['total_orders'] += 1
            order_by_date[order_date]['total_amount'] += amount
        
        # 解析发货日期
        ship_date = None
        if ship_time_str and ship_time_str != '-':
            try:
                ship_date = datetime.strptime(ship_time_str, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
                total_shipped += 1
            except:
                pass
        
        # 按发货时间统计已发货订单
        if ship_date:
            shipped_by_date[ship_date]['shipped_orders'] += 1
            shipped_by_date[ship_date]['shipped_amount'] += amount
            
            # 同时更新下单日期的已发货统计
            if order_date:
                order_by_date[order_date]['shipped_orders'] += 1
                order_by_date[order_date]['shipped_amount'] += amount

# 生成按发货时间统计的日数据
shipped_daily_stats = []
for date in sorted(shipped_by_date.keys(), reverse=True):
    data = shipped_by_date[date]
    shipped_daily_stats.append({
        'date': date,
        'shippedOrders': data['shipped_orders'],
        'shippedAmount': round(data['shipped_amount'], 2),
    })

# 生成按下单时间统计的日数据（包含已发货数量）
order_daily_stats = []
for date in sorted(order_by_date.keys(), reverse=True):
    data = order_by_date[date]
    order_daily_stats.append({
        'date': date,
        'totalOrders': data['total_orders'],
        'shippedOrders': data['shipped_orders'],
        'totalAmount': round(data['total_amount'], 2),
        'shippedAmount': round(data['shipped_amount'], 2),
    })

# 汇总数据
summary = {
    'totalOrders': total_orders,
    'totalShipped': total_shipped,
    'shippedRate': round(total_shipped / total_orders * 100, 2) if total_orders > 0 else 0,
}

# 输出结果
print("=" * 50)
print("订单发货统计分析")
print("=" * 50)
print(f"总订单数: {total_orders}")
print(f"已发货订单数: {total_shipped}")
print(f"发货率: {summary['shippedRate']}%")
print()
print("按发货时间统计（前10天）:")
for item in shipped_daily_stats[:10]:
    print(f"  {item['date']}: {item['shippedOrders']}单, ¥{item['shippedAmount']}")
print()
print("按下单时间统计（前10天）:")
for item in order_daily_stats[:10]:
    print(f"  {item['date']}: 总{item['totalOrders']}单, 已发货{item['shippedOrders']}单")

# 保存JSON数据
with open('/home/ubuntu/doudian-finance-prototype/scripts/shipped_by_date.json', 'w', encoding='utf-8') as f:
    json.dump(shipped_daily_stats, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/doudian-finance-prototype/scripts/order_with_shipped.json', 'w', encoding='utf-8') as f:
    json.dump(order_daily_stats, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/doudian-finance-prototype/scripts/shipped_summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

print()
print("数据已保存到:")
print("  - shipped_by_date.json (按发货时间统计)")
print("  - order_with_shipped.json (按下单时间统计，含已发货数)")
print("  - shipped_summary.json (汇总数据)")
