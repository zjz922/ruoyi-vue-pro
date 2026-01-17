/**
 * 商品成本数据导入脚本
 * 从CSV文件导入商品成本数据到数据库
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import iconv from 'iconv-lite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'doudian_finance',
};

// 解析CSV行
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// 读取并解析CSV文件
function readCSV(filePath) {
  // 读取文件并转换编码
  const buffer = fs.readFileSync(filePath);
  const content = iconv.decode(buffer, 'gbk');
  
  const lines = content.split('\n').filter(line => line.trim());
  
  // 跳过第一行（商家编号行）和第二行（表头）
  const dataLines = lines.slice(2);
  
  const records = [];
  for (const line of dataLines) {
    const fields = parseCSVLine(line);
    if (fields.length >= 10) {
      records.push({
        productId: fields[0]?.replace('#', '') || '',
        sku: fields[1]?.replace('#', '') || '0',
        title: fields[2] || '',
        effectiveDate: fields[3] || null,
        cost: parseFloat(fields[4]) || 0,
        merchantCode: fields[5] || null,
        price: parseFloat(fields[6]) || 0,
        customName: fields[7] || null,
        stock: parseInt(fields[8]) || 0,
        status: parseInt(fields[9]) || 0,
      });
    }
  }
  
  return records;
}

async function importData() {
  const csvPath = path.join(__dirname, '滋栈官方旗舰店_商品成本.csv');
  
  console.log('读取CSV文件...');
  const records = readCSV(csvPath);
  console.log(`解析到 ${records.length} 条记录`);
  
  console.log('\n连接数据库...');
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // 清空现有数据
    console.log('清空现有数据...');
    await connection.execute('DELETE FROM product_costs WHERE shopName = ?', ['滋栈官方旗舰店']);
    
    // 插入新数据
    console.log('导入新数据...');
    const insertSQL = `
      INSERT INTO product_costs 
      (productId, sku, title, cost, merchantCode, price, customName, stock, status, effectiveDate, shopName)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const record of records) {
      try {
        const effectiveDate = record.effectiveDate ? new Date(record.effectiveDate) : null;
        
        await connection.execute(insertSQL, [
          record.productId,
          record.sku,
          record.title,
          record.cost,
          record.merchantCode,
          record.price,
          record.customName,
          record.stock,
          record.status,
          effectiveDate,
          '滋栈官方旗舰店'
        ]);
        successCount++;
      } catch (err) {
        console.error(`导入失败: ${record.title}`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n导入完成！`);
    console.log(`成功: ${successCount} 条`);
    console.log(`失败: ${errorCount} 条`);
    
    // 验证导入结果
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM product_costs');
    console.log(`\n数据库中共有 ${rows[0].count} 条商品成本记录`);
    
  } finally {
    await connection.end();
  }
}

importData().catch(console.error);
