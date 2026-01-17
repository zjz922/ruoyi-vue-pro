import os
import sys
import psycopg2
from psycopg2 import sql

# 数据库连接信息从环境变量获取
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    # 从.env文件读取
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('DATABASE_URL='):
                DATABASE_URL = line.strip().split('=', 1)[1].strip('"\'')
                break

print(f"连接数据库...")

# 连接数据库
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# 获取所有批次文件
batch_dir = 'scripts/order_batches'
batch_files = sorted([f for f in os.listdir(batch_dir) if f.endswith('.sql')])

print(f"找到 {len(batch_files)} 个批次文件")

success_count = 0
error_count = 0

for i, batch_file in enumerate(batch_files):
    try:
        with open(os.path.join(batch_dir, batch_file), 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        cur.execute(sql_content)
        conn.commit()
        success_count += 1
        
        if (i + 1) % 50 == 0:
            print(f"已导入 {i + 1}/{len(batch_files)} 批次...")
    except Exception as e:
        error_count += 1
        print(f"批次 {batch_file} 导入失败: {e}")
        conn.rollback()

# 验证导入结果
cur.execute("SELECT COUNT(*) FROM orders")
total = cur.fetchone()[0]

print(f"\n导入完成!")
print(f"成功批次: {success_count}")
print(f"失败批次: {error_count}")
print(f"数据库中订单总数: {total}")

cur.close()
conn.close()
