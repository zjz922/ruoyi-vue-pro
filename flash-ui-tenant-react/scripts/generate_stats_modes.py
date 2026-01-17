#!/usr/bin/env python3
"""
生成两种统计模式的数据：
1. 按创建时间统计（订单提交时间）
2. 按付款时间统计（承诺发货时间）
"""

import csv
import json
from collections import defaultdict
from datetime import datetime

# CSV文件路径
CSV_FILE = '/home/ubuntu/upload/1768222209_84d85539418136390ef30277ca67bc04zaHCLELw.csv'

# 读取CSV数据
def read_csv_data():
    orders = []
    with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            orders.append(row)
    return orders

# 解析金额
def parse_amount(value):
    try:
        if not value or value == '-':
            return 0.0
        return float(value)
    except:
        return 0.0

# 解析日期（只取日期部分）
def parse_date(value):
    if not value:
        return None
    try:
        # 格式: 2025-04-30 23:58:58
        dt = datetime.strptime(value.strip(), '%Y-%m-%d %H:%M:%S')
        return dt.strftime('%Y-%m-%d')
    except:
        try:
            # 尝试只有日期的格式
            dt = datetime.strptime(value.strip()[:10], '%Y-%m-%d')
            return dt.strftime('%Y-%m-%d')
        except:
            return None

# 按创建时间统计（订单提交时间）
def stats_by_create_time(orders):
    daily_stats = defaultdict(lambda: {
        'totalOrders': 0,
        'shippedOrders': 0,
        'completedOrders': 0,
        'closedOrders': 0,
        'salesAmount': 0.0,
        'shippedAmount': 0.0,
        'completedAmount': 0.0,
        'refundAmount': 0.0,
        'discount': 0.0,
    })
    
    for order in orders:
        # 使用订单提交时间作为统计日期
        date = parse_date(order.get('订单提交时间', ''))
        if not date:
            continue
        
        stats = daily_stats[date]
        stats['totalOrders'] += 1
        
        # 订单状态
        status = order.get('订单状态', '')
        amount = parse_amount(order.get('订单应付金额', 0))
        discount = parse_amount(order.get('优惠总金额', 0))
        
        # 计算退款：如果订单状态包含"退款"或"已关闭"，则退款金额等于订单金额
        refund = 0
        if '退款' in status or '已关闭' in status:
            refund = amount
        
        stats['salesAmount'] += amount
        stats['refundAmount'] += refund
        stats['discount'] += discount
        
        # 发货状态
        ship_time = order.get('发货时间', '')
        if ship_time:
            stats['shippedOrders'] += 1
            stats['shippedAmount'] += amount
        
        # 完成状态
        if '已完成' in status:
            stats['completedOrders'] += 1
            stats['completedAmount'] += amount
        elif '已关闭' in status:
            stats['closedOrders'] += 1
    
    return daily_stats

# 按付款时间统计（承诺发货时间）
def stats_by_payment_time(orders):
    daily_stats = defaultdict(lambda: {
        'totalOrders': 0,
        'shippedOrders': 0,
        'completedOrders': 0,
        'closedOrders': 0,
        'salesAmount': 0.0,
        'shippedAmount': 0.0,
        'completedAmount': 0.0,
        'refundAmount': 0.0,
        'discount': 0.0,
    })
    
    for order in orders:
        # 使用承诺发货时间作为统计日期
        date = parse_date(order.get('承诺发货时间', ''))
        if not date:
            # 如果没有承诺发货时间，使用订单提交时间
            date = parse_date(order.get('订单提交时间', ''))
        if not date:
            continue
        
        stats = daily_stats[date]
        stats['totalOrders'] += 1
        
        # 订单状态
        status = order.get('订单状态', '')
        amount = parse_amount(order.get('订单应付金额', 0))
        discount = parse_amount(order.get('优惠总金额', 0))
        
        # 计算退款：如果订单状态包含"退款"或"已关闭"，则退款金额等于订单金额
        refund = 0
        if '退款' in status or '已关闭' in status:
            refund = amount
        
        stats['salesAmount'] += amount
        stats['refundAmount'] += refund
        stats['discount'] += discount
        
        # 发货状态
        ship_time = order.get('发货时间', '')
        if ship_time:
            stats['shippedOrders'] += 1
            stats['shippedAmount'] += amount
        
        # 完成状态
        if '已完成' in status:
            stats['completedOrders'] += 1
            stats['completedAmount'] += amount
        elif '已关闭' in status:
            stats['closedOrders'] += 1
    
    return daily_stats

# 生成订单明细数据（包含两种时间字段）
def generate_order_details(orders):
    details = []
    for order in orders:
        create_date = parse_date(order.get('订单提交时间', ''))
        payment_date = parse_date(order.get('承诺发货时间', '')) or create_date
        
        if not create_date:
            continue
        
        status = order.get('订单状态', '')
        amount = parse_amount(order.get('订单应付金额', 0))
        
        # 计算退款
        refund = 0
        if '退款' in status or '已关闭' in status:
            refund = amount
        
        detail = {
            'orderId': order.get('订单编号', ''),
            'customerName': (order.get('收件人', '') or '')[:1] + '**' if order.get('收件人') else '***',
            'status': status,
            'payAmount': amount,
            'productCost': round(amount * 0.42, 2),  # 估算成本
            'serviceFee': 0,
            'commission': round(amount * 0.10, 2),  # 达人佣金约10%
            'insuranceFee': 0,
            'otherFee': 0,
            'freight': parse_amount(order.get('运费', 0)),
            'refund': refund,
            'settleAmount': amount if '已完成' in status else 0,
            'estimatedProfit': round(amount * 0.48, 2) if '已完成' in status else 0,
            'createTime': order.get('订单提交时间', ''),
            'completeTime': order.get('订单完成时间', '') or '-',
            'settleTime': order.get('订单完成时间', '') or '-',
            'createDate': create_date,  # 用于按创建时间筛选
            'paymentDate': payment_date,  # 用于按付款时间筛选
            'productName': order.get('商品名称', ''),
            'province': order.get('省', ''),
            'payMethod': order.get('支付方式', ''),
        }
        details.append(detail)
    
    # 按创建时间倒序排列
    details.sort(key=lambda x: x['createTime'], reverse=True)
    return details

def main():
    print("读取CSV数据...")
    orders = read_csv_data()
    print(f"共读取 {len(orders)} 条订单")
    
    print("\n生成按创建时间统计数据...")
    create_time_stats = stats_by_create_time(orders)
    
    print("生成按付款时间统计数据...")
    payment_time_stats = stats_by_payment_time(orders)
    
    print("生成订单明细数据...")
    order_details = generate_order_details(orders)
    
    # 转换为列表格式并排序
    create_time_list = []
    for date, stats in sorted(create_time_stats.items(), reverse=True):
        create_time_list.append({
            'date': date,
            **stats
        })
    
    payment_time_list = []
    for date, stats in sorted(payment_time_stats.items(), reverse=True):
        payment_time_list.append({
            'date': date,
            **stats
        })
    
    # 保存数据
    output_dir = '/home/ubuntu/doudian-finance-prototype/scripts'
    
    with open(f'{output_dir}/stats_by_create_time.json', 'w', encoding='utf-8') as f:
        json.dump(create_time_list, f, ensure_ascii=False, indent=2)
    print(f"保存按创建时间统计数据: {len(create_time_list)} 天")
    
    with open(f'{output_dir}/stats_by_payment_time.json', 'w', encoding='utf-8') as f:
        json.dump(payment_time_list, f, ensure_ascii=False, indent=2)
    print(f"保存按付款时间统计数据: {len(payment_time_list)} 天")
    
    with open(f'{output_dir}/order_details_with_dates.json', 'w', encoding='utf-8') as f:
        json.dump(order_details, f, ensure_ascii=False, indent=2)
    print(f"保存订单明细数据: {len(order_details)} 条")
    
    # 打印汇总对比
    print("\n=== 按创建时间统计汇总 ===")
    total_create = sum(s['totalOrders'] for s in create_time_list)
    total_create_sales = sum(s['salesAmount'] for s in create_time_list)
    total_create_refund = sum(s['refundAmount'] for s in create_time_list)
    print(f"总订单数: {total_create}")
    print(f"总销售额: ¥{total_create_sales:,.2f}")
    print(f"总退款额: ¥{total_create_refund:,.2f}")
    
    print("\n=== 按付款时间统计汇总 ===")
    total_payment = sum(s['totalOrders'] for s in payment_time_list)
    total_payment_sales = sum(s['salesAmount'] for s in payment_time_list)
    total_payment_refund = sum(s['refundAmount'] for s in payment_time_list)
    print(f"总订单数: {total_payment}")
    print(f"总销售额: ¥{total_payment_sales:,.2f}")
    print(f"总退款额: ¥{total_payment_refund:,.2f}")
    
    # 打印前5天数据对比
    print("\n=== 前5天数据对比 ===")
    print("日期\t\t按创建时间\t\t\t按付款时间")
    for i in range(min(5, len(create_time_list))):
        c = create_time_list[i]
        # 找到对应日期的付款时间统计
        p = next((x for x in payment_time_list if x['date'] == c['date']), {'totalOrders': 0, 'salesAmount': 0})
        print(f"{c['date']}\t{c['totalOrders']}单/¥{c['salesAmount']:,.0f}\t\t{p['totalOrders']}单/¥{p['salesAmount']:,.0f}")

if __name__ == '__main__':
    main()
