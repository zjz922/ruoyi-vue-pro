import os
import sys
import mysql.connector
from mysql.connector import Error

# 从drizzle配置获取数据库连接信息
# mysql://user:pass@host:port/database?ssl
import re

# 读取.env文件中的DATABASE_URL
database_url = None
try:
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('DATABASE_URL='):
                database_url = line.strip().split('=', 1)[1].strip('"\'')
                break
except:
    pass

if not database_url:
    print("无法读取DATABASE_URL")
    sys.exit(1)

# 解析MySQL URL
# mysql://user:pass@host:port/database?ssl
match = re.match(r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)', database_url)
if not match:
    print(f"无法解析数据库URL: {database_url}")
    sys.exit(1)

user, password, host, port, database = match.groups()
print(f"连接到 {host}:{port}/{database}")

# 连接数据库
try:
    conn = mysql.connector.connect(
        host=host,
        port=int(port),
        user=user,
        password=password,
        database=database,
        ssl_disabled=False,
        ssl_verify_cert=False
    )
    cursor = conn.cursor()
    print("数据库连接成功!")
except Error as e:
    print(f"数据库连接失败: {e}")
    sys.exit(1)

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
        
        cursor.execute(sql_content)
        conn.commit()
        success_count += 1
        
        if (i + 1) % 50 == 0:
            print(f"已导入 {i + 1}/{len(batch_files)} 批次...")
    except Error as e:
        error_count += 1
        if error_count <= 3:
            print(f"批次 {batch_file} 导入失败: {e}")
        conn.rollback()

# 验证导入结果
cursor.execute("SELECT COUNT(*) FROM orders")
total = cursor.fetchone()[0]

print(f"\n导入完成!")
print(f"成功批次: {success_count}")
print(f"失败批次: {error_count}")
print(f"数据库中订单总数: {total}")

cursor.close()
conn.close()
