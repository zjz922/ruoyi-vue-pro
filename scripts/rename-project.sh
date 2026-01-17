#!/bin/bash
# ========================================
# 项目重命名脚本
# 将 yudao/ruoyi 重命名为 flash-saas
# ========================================

set -e

PROJECT_DIR="/home/ubuntu/ruoyi-vue-pro-scaffold"
NEW_PROJECT_DIR="/home/ubuntu/flash-saas"

echo "=========================================="
echo "开始项目重命名: yudao/ruoyi -> flash-saas"
echo "=========================================="

# 重命名规则
# yudao -> flash (模块前缀)
# ruoyi-vue-pro -> flash-saas (项目名)
# cn.iocoder.yudao -> cn.flashsaas (包名)
# YunaiV -> flashsaas (作者)
# 芋道 -> 闪电帐 (中文名)

# 1. 复制项目到新目录
echo "[1/8] 复制项目到新目录..."
cp -r "$PROJECT_DIR" "$NEW_PROJECT_DIR"
cd "$NEW_PROJECT_DIR"

# 2. 重命名目录 (从深到浅)
echo "[2/8] 重命名目录结构..."

# 重命名 yudao-ui-tenant-react
if [ -d "yudao-ui-tenant-react" ]; then
    mv yudao-ui-tenant-react flash-ui-tenant-react
fi

# 重命名 yudao-ui 目录
if [ -d "yudao-ui" ]; then
    mv yudao-ui flash-ui
    if [ -d "flash-ui/yudao-ui-admin-vue3" ]; then
        mv flash-ui/yudao-ui-admin-vue3 flash-ui/flash-ui-admin-vue3
    fi
fi

# 重命名 yudao-server
if [ -d "yudao-server" ]; then
    mv yudao-server flash-server
fi

# 重命名 yudao-dependencies
if [ -d "yudao-dependencies" ]; then
    mv yudao-dependencies flash-dependencies
fi

# 重命名 yudao-framework 及其子模块
if [ -d "yudao-framework" ]; then
    cd yudao-framework
    for dir in yudao-*; do
        if [ -d "$dir" ]; then
            newdir=$(echo "$dir" | sed 's/yudao-/flash-/')
            mv "$dir" "$newdir"
        fi
    done
    cd ..
    mv yudao-framework flash-framework
fi

# 重命名所有 yudao-module-* 目录
for dir in yudao-module-*; do
    if [ -d "$dir" ]; then
        newdir=$(echo "$dir" | sed 's/yudao-module-/flash-module-/')
        mv "$dir" "$newdir"
    fi
done

echo "目录重命名完成"

# 3. 修改所有 pom.xml 文件
echo "[3/8] 修改 pom.xml 文件..."
find . -name "pom.xml" -type f -exec sed -i \
    -e 's/yudao-/flash-/g' \
    -e 's/ruoyi-vue-pro/flash-saas/g' \
    -e 's/cn\.iocoder\.yudao/cn.flashsaas/g' \
    -e 's/iocoder\.cn/flashsaas.cn/g' \
    {} \;

# 4. 修改 Java 包名 (重命名目录)
echo "[4/8] 修改 Java 包名..."
find . -type d -path "*/cn/iocoder/yudao" | while read dir; do
    parent=$(dirname "$dir")
    grandparent=$(dirname "$parent")
    if [ -d "$dir" ]; then
        mkdir -p "$grandparent/flashsaas"
        mv "$dir"/* "$grandparent/flashsaas/" 2>/dev/null || true
        rm -rf "$parent/iocoder" 2>/dev/null || true
    fi
done

# 5. 修改 Java 源文件中的包名
echo "[5/8] 修改 Java 源文件..."
find . -name "*.java" -type f -exec sed -i \
    -e 's/cn\.iocoder\.yudao/cn.flashsaas/g' \
    -e 's/package cn\.iocoder/package cn.flashsaas/g' \
    -e 's/import cn\.iocoder/import cn.flashsaas/g' \
    {} \;

# 6. 修改配置文件
echo "[6/8] 修改配置文件..."
find . -name "*.yml" -o -name "*.yaml" -o -name "*.properties" -o -name "*.xml" | xargs sed -i \
    -e 's/yudao/flash/g' \
    -e 's/ruoyi-vue-pro/flash-saas/g' \
    -e 's/cn\.iocoder\.yudao/cn.flashsaas/g' \
    2>/dev/null || true

# 7. 修改前端配置
echo "[7/8] 修改前端配置..."
find . -name "package.json" -o -name "*.ts" -o -name "*.vue" -o -name "*.js" | xargs sed -i \
    -e 's/yudao/flash/g' \
    -e 's/ruoyi-vue-pro/flash-saas/g' \
    2>/dev/null || true

# 8. 修改 README 和文档
echo "[8/8] 修改文档..."
find . -name "*.md" -type f -exec sed -i \
    -e 's/yudao/flash/g' \
    -e 's/ruoyi-vue-pro/flash-saas/g' \
    -e 's/芋道/闪电帐/g' \
    {} \;

echo "=========================================="
echo "项目重命名完成!"
echo "新项目路径: $NEW_PROJECT_DIR"
echo "=========================================="
