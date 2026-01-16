#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基于原始Excel数据计算统计数据
数据源：
1. 订单数据 (18,700条) - 订单应付金额、运费、优惠等
2. 商品成本数据 - 商品ID与成本的映射
3. 达人佣金-服务费数据 - 订单级别的佣金和服务费

计算逻辑：
- 销售额 = 所有订单的"订单应付金额"总和（包含已退款订单）
- 退款额 = 订单状态为"已关闭"的订单金额总和
- 达人佣金 = 根据达人佣金-服务费文件匹配
"""

import csv
import json
from collections import defaultdict
from datetime import datetime

# 文件路径
ORDER_FILE = '/home/ubuntu/upload/1768222209_84d85539418136390ef30277ca67bc04zaHCLELw.csv'
COST_FILE = '/home/ubuntu/upload/滋栈官方旗舰店_商品成本.csv'
COMMISSION_FILE = '/home/ubuntu/upload/达人佣金-服务费.csv'
OUTPUT_DIR = '/home/ubuntu/doudian-finance-prototype/scripts'

def parse_float(value):
    """安全解析浮点数"""
    if not value or value == '-' or value.strip() == '':
        return 0.0
    try:
        return float(value.replace(',', '').strip())
    except:
        return 0.0

def parse_date(date_str):
    """解析日期字符串，返回YYYY-MM-DD格式"""
    if not date_str:
        return None
    date_str = date_str.strip().strip('\t')
    if not date_str:
        return None
    try:
        # 尝试解析 YYYY-MM-DD HH:MM:SS 格式
        dt = datetime.strptime(date_str[:10], '%Y-%m-%d')
        return dt.strftime('%Y-%m-%d')
    except:
        return None

def load_product_costs():
    """加载商品成本数据"""
    costs = {}
    with open(COST_FILE, 'r', encoding='gb18030') as f:
        reader = csv.reader(f)
        # 跳过第一行（商家编号信息）
        next(reader)
        # 第二行是真正的表头
        headers = next(reader)
        
        for row in reader:
            if len(row) >= 5 and row[0]:
                product_id = row[0].replace('#', '').strip()
                cost = parse_float(row[4])
                if product_id:
                    costs[product_id] = cost
    
    print(f"加载商品成本: {len(costs)} 条")
    return costs

def load_commission_data():
    """加载达人佣金和服务费数据"""
    commission_by_order = {}
    
    with open(COMMISSION_FILE, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            order_id = row.get('订单号', '').replace("'", '').strip()
            if not order_id or order_id == ' ':
                continue
            
            # 提取服务费和佣金（注意这些是负数，表示支出）
            service_fee = abs(parse_float(row.get('平台服务费', '0')))
            commission = abs(parse_float(row.get('达人佣金', '0')))
            settlement_amount = parse_float(row.get('结算金额', '0'))
            settlement_time = row.get('结算时间', '').strip()
            
            if order_id not in commission_by_order:
                commission_by_order[order_id] = {
                    'service_fee': 0,
                    'commission': 0,
                    'settlement_amount': 0,
                    'settlement_time': settlement_time
                }
            
            commission_by_order[order_id]['service_fee'] += service_fee
            commission_by_order[order_id]['commission'] += commission
            commission_by_order[order_id]['settlement_amount'] += settlement_amount
    
    print(f"加载佣金数据: {len(commission_by_order)} 条订单")
    return commission_by_order

def calculate_statistics():
    """计算统计数据"""
    # 加载辅助数据
    product_costs = load_product_costs()
    commission_data = load_commission_data()
    
    # 按日期统计（按订单提交时间）
    daily_stats_by_create = defaultdict(lambda: {
        'date': '',
        'order_count': 0,
        'shipped_count': 0,
        'sales_amount': 0.0,  # 销售额 = 所有订单应付金额（包含退款）
        'refund_amount': 0.0,  # 退款额 = 已关闭订单的金额
        'shipping_fee': 0.0,  # 快递费
        'small_payment': 0.0,  # 小额打款
        'commission': 0.0,  # 达人佣金
        'service_fee': 0.0,  # 平台服务费
        'product_cost': 0.0,  # 商品成本
        'operation_fee': 0.0,  # 代运营费
        'compensation': 0.0,  # 赔付
        'promotion_fee': 0.0,  # 推广费
        'other_fee': 0.0,  # 其他费用
        'insurance_fee': 0.0,  # 保险费
        'profit': 0.0,  # 预计利润
    })
    
    # 按日期统计（按承诺发货时间/付款时间）
    daily_stats_by_payment = defaultdict(lambda: {
        'date': '',
        'order_count': 0,
        'shipped_count': 0,
        'sales_amount': 0.0,
        'refund_amount': 0.0,
        'shipping_fee': 0.0,
        'small_payment': 0.0,
        'commission': 0.0,
        'service_fee': 0.0,
        'product_cost': 0.0,
        'operation_fee': 0.0,
        'compensation': 0.0,
        'promotion_fee': 0.0,
        'other_fee': 0.0,
        'insurance_fee': 0.0,
        'profit': 0.0,
    })
    
    # 订单明细列表
    all_orders = []
    
    # 统计变量
    total_orders = 0
    orders_with_commission = 0
    orders_with_cost = 0
    closed_orders = 0
    shipped_orders = 0
    
    with open(ORDER_FILE, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            total_orders += 1
            
            # 基本信息
            order_id = row.get('主订单编号', '').strip().strip('\t')
            sub_order_id = row.get('子订单编号', '').strip().strip('\t')
            product_id = row.get('商品ID', '').strip()
            product_name = row.get('选购商品', '').strip()
            product_spec = row.get('商品规格', '').strip()
            quantity = int(parse_float(row.get('商品数量', '1')) or 1)
            
            # 时间信息
            create_time = parse_date(row.get('订单提交时间', ''))
            promise_ship_time = parse_date(row.get('承诺发货时间', ''))
            ship_time = parse_date(row.get('发货时间', ''))
            
            # 订单状态
            order_status = row.get('订单状态', '').strip()
            is_shipped = order_status in ['已完成', '已发货'] or (ship_time is not None and ship_time != '')
            is_closed = order_status == '已关闭'
            
            if is_shipped:
                shipped_orders += 1
            if is_closed:
                closed_orders += 1
            
            # 金额信息
            order_amount = parse_float(row.get('订单应付金额', '0'))
            shipping_fee = parse_float(row.get('运费', '0'))
            
            # 获取佣金和服务费数据
            comm_info = commission_data.get(order_id, {})
            service_fee = comm_info.get('service_fee', 0)
            commission = comm_info.get('commission', 0)
            if service_fee > 0 or commission > 0:
                orders_with_commission += 1
            
            # 获取商品成本
            product_cost = product_costs.get(product_id, 0) * quantity
            if product_cost > 0:
                orders_with_cost += 1
            
            # 销售额 = 所有订单应付金额（包含退款订单）
            sales_amount = order_amount
            
            # 退款额 = 已关闭订单的金额
            refund_amount = order_amount if is_closed else 0
            
            # 创建订单明细记录
            order_detail = {
                'orderId': order_id,
                'subOrderId': sub_order_id,
                'productId': product_id,
                'productName': product_name,
                'productSpec': product_spec,
                'quantity': quantity,
                'customerName': row.get('收件人', '').strip()[:1] + '*' if row.get('收件人', '').strip() else '',
                'status': order_status,
                'orderAmount': order_amount,
                'shippingFee': shipping_fee,
                'serviceFee': service_fee,
                'commission': commission,
                'productCost': product_cost,
                'refundAmount': refund_amount,
                'profit': order_amount - refund_amount - service_fee - commission - product_cost - shipping_fee,
                'createTime': create_time,
                'promiseShipTime': promise_ship_time,
                'shipTime': ship_time,
                'isShipped': is_shipped,
                'isClosed': is_closed,
            }
            all_orders.append(order_detail)
            
            # 按创建时间统计
            if create_time:
                stats = daily_stats_by_create[create_time]
                stats['date'] = create_time
                stats['order_count'] += 1
                if is_shipped:
                    stats['shipped_count'] += 1
                stats['sales_amount'] += sales_amount  # 所有订单金额
                stats['refund_amount'] += refund_amount  # 已关闭订单金额
                stats['shipping_fee'] += shipping_fee
                stats['commission'] += commission
                stats['service_fee'] += service_fee
                stats['product_cost'] += product_cost
            
            # 按承诺发货时间统计
            if promise_ship_time:
                stats = daily_stats_by_payment[promise_ship_time]
                stats['date'] = promise_ship_time
                stats['order_count'] += 1
                if is_shipped:
                    stats['shipped_count'] += 1
                stats['sales_amount'] += sales_amount
                stats['refund_amount'] += refund_amount
                stats['shipping_fee'] += shipping_fee
                stats['commission'] += commission
                stats['service_fee'] += service_fee
                stats['product_cost'] += product_cost
    
    print(f"\n统计完成:")
    print(f"  总订单数: {total_orders}")
    print(f"  已发货订单: {shipped_orders}")
    print(f"  已关闭订单: {closed_orders}")
    print(f"  有佣金数据的订单: {orders_with_commission}")
    print(f"  有成本数据的订单: {orders_with_cost}")
    
    # 计算每日利润
    for date, stats in daily_stats_by_create.items():
        # 利润 = 销售额 - 退款额 - 各项费用
        stats['profit'] = (
            stats['sales_amount'] 
            - stats['refund_amount'] 
            - stats['shipping_fee'] 
            - stats['commission'] 
            - stats['service_fee'] 
            - stats['product_cost']
            - stats['promotion_fee']
            - stats['other_fee']
            - stats['insurance_fee']
        )
    
    for date, stats in daily_stats_by_payment.items():
        stats['profit'] = (
            stats['sales_amount'] 
            - stats['refund_amount'] 
            - stats['shipping_fee'] 
            - stats['commission'] 
            - stats['service_fee'] 
            - stats['product_cost']
            - stats['promotion_fee']
            - stats['other_fee']
            - stats['insurance_fee']
        )
    
    # 转换为列表并排序
    stats_by_create_list = sorted(daily_stats_by_create.values(), key=lambda x: x['date'], reverse=True)
    stats_by_payment_list = sorted(daily_stats_by_payment.values(), key=lambda x: x['date'], reverse=True)
    
    # 计算汇总数据
    summary = {
        'totalOrders': total_orders,
        'totalShipped': sum(s['shipped_count'] for s in stats_by_create_list),
        'totalSales': sum(s['sales_amount'] for s in stats_by_create_list),
        'totalRefund': sum(s['refund_amount'] for s in stats_by_create_list),
        'totalShippingFee': sum(s['shipping_fee'] for s in stats_by_create_list),
        'totalCommission': sum(s['commission'] for s in stats_by_create_list),
        'totalServiceFee': sum(s['service_fee'] for s in stats_by_create_list),
        'totalProductCost': sum(s['product_cost'] for s in stats_by_create_list),
        'totalPromotionFee': 0,  # 暂无数据
        'totalOtherFee': 0,  # 暂无数据
        'totalInsuranceFee': 0,  # 暂无数据
        'totalProfit': sum(s['profit'] for s in stats_by_create_list),
    }
    
    # 打印汇总数据
    print(f"\n汇总数据:")
    print(f"  总订单数: {summary['totalOrders']}")
    print(f"  总发货数: {summary['totalShipped']}")
    print(f"  总销售额: ¥{summary['totalSales']:,.2f}")
    print(f"  总退款额: ¥{summary['totalRefund']:,.2f}")
    print(f"  总运费: ¥{summary['totalShippingFee']:,.2f}")
    print(f"  总达人佣金: ¥{summary['totalCommission']:,.2f}")
    print(f"  总服务费: ¥{summary['totalServiceFee']:,.2f}")
    print(f"  总商品成本: ¥{summary['totalProductCost']:,.2f}")
    print(f"  总利润: ¥{summary['totalProfit']:,.2f}")
    
    # 打印前几天的数据对比
    print(f"\n按创建时间统计（前5天）:")
    for stats in stats_by_create_list[:5]:
        print(f"  {stats['date']}: 订单{stats['order_count']}单, 发货{stats['shipped_count']}单, 销售¥{stats['sales_amount']:,.2f}, 退款¥{stats['refund_amount']:,.2f}")
    
    # 保存结果
    with open(f'{OUTPUT_DIR}/calculated_stats_by_create.json', 'w', encoding='utf-8') as f:
        json.dump(stats_by_create_list, f, ensure_ascii=False, indent=2)
    
    with open(f'{OUTPUT_DIR}/calculated_stats_by_payment.json', 'w', encoding='utf-8') as f:
        json.dump(stats_by_payment_list, f, ensure_ascii=False, indent=2)
    
    with open(f'{OUTPUT_DIR}/calculated_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    with open(f'{OUTPUT_DIR}/calculated_orders.json', 'w', encoding='utf-8') as f:
        json.dump(all_orders, f, ensure_ascii=False, indent=2)
    
    print(f"\n结果已保存")
    
    # 与截图数据对比
    print(f"\n=== 与截图数据对比 ===")
    print(f"截图销售额: ¥619,571.24 vs 计算销售额: ¥{summary['totalSales']:,.2f}")
    print(f"截图退款额: ¥122,352.74 vs 计算退款额: ¥{summary['totalRefund']:,.2f}")

if __name__ == '__main__':
    calculate_statistics()
