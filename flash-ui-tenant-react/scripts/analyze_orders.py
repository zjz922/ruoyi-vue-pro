#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析抖店订单数据，生成统计汇总
"""

import pandas as pd
import json
from datetime import datetime
from collections import defaultdict

# 读取CSV文件
csv_path = '/home/ubuntu/upload/1768222209_84d85539418136390ef30277ca67bc04zaHCLELw.csv'
df = pd.read_csv(csv_path, dtype=str)

# 清理列名中的BOM
df.columns = [col.strip().replace('\ufeff', '') for col in df.columns]

# 清理数据中的制表符
for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = df[col].str.strip().str.replace('\t', '')

print("=" * 60)
print("抖店订单数据分析报告")
print("=" * 60)
print(f"\n店铺名称: 滋栈官方旗舰店")
print(f"总订单数: {len(df)}")

# 转换数值列
numeric_cols = ['商品数量', '商品单价', '订单应付金额', '运费', '优惠总金额', '手续费']
for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

# 时间范围
df['订单提交时间'] = pd.to_datetime(df['订单提交时间'], errors='coerce')
min_date = df['订单提交时间'].min()
max_date = df['订单提交时间'].max()
print(f"时间范围: {min_date.strftime('%Y-%m-%d')} ~ {max_date.strftime('%Y-%m-%d')}")

# 订单状态统计
print("\n" + "-" * 40)
print("订单状态分布:")
status_counts = df['订单状态'].value_counts()
for status, count in status_counts.items():
    print(f"  {status}: {count}")

# 金额统计
total_amount = df['订单应付金额'].sum()
total_freight = df['运费'].sum()
total_discount = df['优惠总金额'].sum()
total_fee = df['手续费'].sum()

print("\n" + "-" * 40)
print("金额统计:")
print(f"  订单总金额: ¥{total_amount:,.2f}")
print(f"  运费总额: ¥{total_freight:,.2f}")
print(f"  优惠总额: ¥{total_discount:,.2f}")
print(f"  手续费总额: ¥{total_fee:,.2f}")

# 已完成订单统计
completed_df = df[df['订单状态'] == '已完成']
completed_amount = completed_df['订单应付金额'].sum()
print(f"\n已完成订单:")
print(f"  订单数: {len(completed_df)}")
print(f"  金额: ¥{completed_amount:,.2f}")

# 已关闭订单统计（退款）
closed_df = df[df['订单状态'] == '已关闭']
refund_amount = closed_df['订单应付金额'].sum()
print(f"\n已关闭订单（退款）:")
print(f"  订单数: {len(closed_df)}")
print(f"  金额: ¥{refund_amount:,.2f}")

# 按日期统计
print("\n" + "-" * 40)
print("按日期统计:")
df['日期'] = df['订单提交时间'].dt.strftime('%Y-%m-%d')
daily_stats = df.groupby('日期').agg({
    '主订单编号': 'count',
    '订单应付金额': 'sum'
}).rename(columns={'主订单编号': '订单数', '订单应付金额': '销售额'})
daily_stats = daily_stats.sort_index(ascending=False)

print(f"\n最近10天数据:")
for date, row in daily_stats.head(10).iterrows():
    print(f"  {date}: {int(row['订单数'])}单, ¥{row['销售额']:,.2f}")

# 支付方式统计
print("\n" + "-" * 40)
print("支付方式分布:")
pay_counts = df['支付方式'].value_counts()
for pay, count in pay_counts.head(10).items():
    print(f"  {pay}: {count}")

# 流量来源统计
print("\n" + "-" * 40)
print("流量来源分布:")
source_counts = df['流量来源'].value_counts()
for source, count in source_counts.items():
    print(f"  {source}: {count}")

# 省份分布
print("\n" + "-" * 40)
print("省份分布TOP10:")
province_counts = df['省'].value_counts()
for province, count in province_counts.head(10).items():
    print(f"  {province}: {count}")

# 达人统计
print("\n" + "-" * 40)
print("达人销售TOP10:")
influencer_stats = df[df['达人昵称'].notna() & (df['达人昵称'] != '-')].groupby('达人昵称').agg({
    '主订单编号': 'count',
    '订单应付金额': 'sum'
}).rename(columns={'主订单编号': '订单数', '订单应付金额': '销售额'})
influencer_stats = influencer_stats.sort_values('销售额', ascending=False)
for name, row in influencer_stats.head(10).iterrows():
    print(f"  {name}: {int(row['订单数'])}单, ¥{row['销售额']:,.2f}")

# 生成JSON数据供前端使用
print("\n" + "=" * 60)
print("生成前端数据...")

# 按日期汇总数据
daily_data = []
for date, group in df.groupby('日期'):
    completed = group[group['订单状态'] == '已完成']
    closed = group[group['订单状态'] == '已关闭']
    pending = group[group['订单状态'].isin(['待发货', '已发货'])]
    
    daily_data.append({
        'date': date,
        'totalOrders': len(group),
        'completedOrders': len(completed),
        'closedOrders': len(closed),
        'pendingOrders': len(pending),
        'salesAmount': round(group['订单应付金额'].sum(), 2),
        'completedAmount': round(completed['订单应付金额'].sum(), 2),
        'refundAmount': round(closed['订单应付金额'].sum(), 2),
        'freight': round(group['运费'].sum(), 2),
        'discount': round(group['优惠总金额'].sum(), 2),
        'serviceFee': round(group['手续费'].sum(), 2),
    })

daily_data.sort(key=lambda x: x['date'], reverse=True)

# 保存日统计数据
with open('/home/ubuntu/doudian-finance-prototype/scripts/daily_stats.json', 'w', encoding='utf-8') as f:
    json.dump(daily_data, f, ensure_ascii=False, indent=2)

print(f"日统计数据已保存: {len(daily_data)}天")

# 生成订单明细数据（取最近的100条）
order_details = []
recent_orders = df.sort_values('订单提交时间', ascending=False).head(100)

for _, row in recent_orders.iterrows():
    order_details.append({
        'mainOrderNo': str(row['主订单编号']).strip(),
        'subOrderNo': str(row['子订单编号']).strip(),
        'productName': str(row['选购商品']).strip(),
        'productSpec': str(row['商品规格']).strip(),
        'quantity': int(row['商品数量']) if pd.notna(row['商品数量']) else 1,
        'sku': str(row['商家编码']).strip(),
        'unitPrice': float(row['商品单价']) if pd.notna(row['商品单价']) else 0,
        'payAmount': float(row['订单应付金额']) if pd.notna(row['订单应付金额']) else 0,
        'freight': float(row['运费']) if pd.notna(row['运费']) else 0,
        'totalDiscount': float(row['优惠总金额']) if pd.notna(row['优惠总金额']) else 0,
        'serviceFee': float(row['手续费']) if pd.notna(row['手续费']) else 0,
        'payMethod': str(row['支付方式']).strip() if pd.notna(row['支付方式']) else '',
        'receiver': str(row['收件人']).strip() if pd.notna(row['收件人']) else '',
        'province': str(row['省']).strip() if pd.notna(row['省']) else '',
        'city': str(row['市']).strip() if pd.notna(row['市']) else '',
        'orderTime': str(row['订单提交时间']) if pd.notna(row['订单提交时间']) else '',
        'completeTime': str(row['订单完成时间']).strip() if pd.notna(row['订单完成时间']) else '',
        'payTime': str(row['支付完成时间']).strip() if pd.notna(row['支付完成时间']) else '',
        'status': str(row['订单状态']).strip() if pd.notna(row['订单状态']) else '',
        'afterSaleStatus': str(row['售后状态']).strip() if pd.notna(row['售后状态']) else '',
        'cancelReason': str(row['取消原因']).strip() if pd.notna(row['取消原因']) else '',
        'appChannel': str(row['APP渠道']).strip() if pd.notna(row['APP渠道']) else '',
        'trafficSource': str(row['流量来源']).strip() if pd.notna(row['流量来源']) else '',
        'orderType': str(row['订单类型']).strip() if pd.notna(row['订单类型']) else '',
        'influencerId': str(row['达人ID']).strip() if pd.notna(row['达人ID']) else '',
        'influencerName': str(row['达人昵称']).strip() if pd.notna(row['达人昵称']) else '',
        'flagColor': str(row['旗帜颜色']).strip() if pd.notna(row['旗帜颜色']) else '',
        'merchantRemark': str(row['商家备注']).strip() if pd.notna(row['商家备注']) else '',
    })

with open('/home/ubuntu/doudian-finance-prototype/scripts/order_details.json', 'w', encoding='utf-8') as f:
    json.dump(order_details, f, ensure_ascii=False, indent=2)

print(f"订单明细数据已保存: {len(order_details)}条")

# 汇总统计
summary = {
    'shopName': '滋栈官方旗舰店',
    'dateRange': {
        'start': min_date.strftime('%Y-%m-%d'),
        'end': max_date.strftime('%Y-%m-%d')
    },
    'totalOrders': len(df),
    'completedOrders': len(completed_df),
    'closedOrders': len(closed_df),
    'totalSalesAmount': round(total_amount, 2),
    'completedAmount': round(completed_amount, 2),
    'refundAmount': round(refund_amount, 2),
    'refundRate': round(refund_amount / total_amount * 100, 2) if total_amount > 0 else 0,
    'totalFreight': round(total_freight, 2),
    'totalDiscount': round(total_discount, 2),
    'totalServiceFee': round(total_fee, 2),
    'avgOrderAmount': round(total_amount / len(df), 2) if len(df) > 0 else 0,
    'statusCounts': status_counts.to_dict(),
    'payMethodCounts': pay_counts.to_dict(),
    'trafficSourceCounts': source_counts.to_dict(),
    'provinceCounts': province_counts.head(20).to_dict(),
}

with open('/home/ubuntu/doudian-finance-prototype/scripts/summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

print(f"汇总统计数据已保存")
print("\n" + "=" * 60)
print("数据分析完成!")
