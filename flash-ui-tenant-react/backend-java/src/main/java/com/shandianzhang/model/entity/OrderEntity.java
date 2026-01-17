package com.shandianzhang.model.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 订单实体类
 * 
 * <p>对应数据库表：t_order</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
public class OrderEntity {

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 租户ID
     */
    private String tenantId;

    /**
     * 订单号（抖店订单号）
     */
    private String orderNo;

    /**
     * 父订单号
     */
    private String parentOrderNo;

    /**
     * 店铺ID
     */
    private String shopId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 商品ID
     */
    private String productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品规格
     */
    private String productSpec;

    /**
     * SKU编码
     */
    private String skuCode;

    /**
     * 商品数量
     */
    private Integer quantity;

    /**
     * 商品单价（元）
     */
    private BigDecimal unitPrice;

    /**
     * 订单金额（元）
     */
    private BigDecimal orderAmount;

    /**
     * 支付金额（元）
     */
    private BigDecimal paymentAmount;

    /**
     * 平台优惠金额（元）
     */
    private BigDecimal platformDiscount;

    /**
     * 商家优惠金额（元）
     */
    private BigDecimal merchantDiscount;

    /**
     * 达人优惠金额（元）
     */
    private BigDecimal influencerDiscount;

    /**
     * 运费（元）
     */
    private BigDecimal shippingFee;

    /**
     * 平台服务费（元）
     */
    private BigDecimal platformServiceFee;

    /**
     * 达人佣金（元）
     */
    private BigDecimal influencerCommission;

    /**
     * 技术服务费（元）
     */
    private BigDecimal techServiceFee;

    /**
     * 退款金额（元）
     */
    private BigDecimal refundAmount;

    /**
     * 实际收入（元）
     */
    private BigDecimal actualIncome;

    /**
     * 商品成本（元）
     */
    private BigDecimal productCost;

    /**
     * 毛利润（元）
     */
    private BigDecimal grossProfit;

    /**
     * 毛利率（%）
     */
    private BigDecimal grossProfitRate;

    /**
     * 订单状态
     * <p>1-待支付 2-已支付 3-已发货 4-已完成 5-已取消 6-已退款</p>
     */
    private Integer orderStatus;

    /**
     * 订单状态名称
     */
    private String orderStatusName;

    /**
     * 支付方式
     * <p>1-支付宝 2-微信 3-抖音支付 4-其他</p>
     */
    private Integer paymentMethod;

    /**
     * 支付方式名称
     */
    private String paymentMethodName;

    /**
     * 收货人姓名
     */
    private String receiverName;

    /**
     * 收货人电话
     */
    private String receiverPhone;

    /**
     * 收货省份
     */
    private String receiverProvince;

    /**
     * 收货城市
     */
    private String receiverCity;

    /**
     * 收货区县
     */
    private String receiverDistrict;

    /**
     * 收货详细地址
     */
    private String receiverAddress;

    /**
     * 达人ID
     */
    private String influencerId;

    /**
     * 达人名称
     */
    private String influencerName;

    /**
     * 达人头像URL
     */
    private String influencerAvatar;

    /**
     * 物流公司
     */
    private String logisticsCompany;

    /**
     * 物流单号
     */
    private String logisticsNo;

    /**
     * 下单时间
     */
    private Date orderTime;

    /**
     * 支付时间
     */
    private Date paymentTime;

    /**
     * 发货时间
     */
    private Date shippingTime;

    /**
     * 完成时间
     */
    private Date completeTime;

    /**
     * 数据来源
     * <p>1-抖店API同步 2-手动录入 3-Excel导入</p>
     */
    private Integer dataSource;

    /**
     * 同步时间
     */
    private Date syncTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除
     * <p>0-未删除 1-已删除</p>
     */
    private Integer deleted;

    // ==================== Getter & Setter ====================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getParentOrderNo() {
        return parentOrderNo;
    }

    public void setParentOrderNo(String parentOrderNo) {
        this.parentOrderNo = parentOrderNo;
    }

    public String getShopId() {
        return shopId;
    }

    public void setShopId(String shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSpec() {
        return productSpec;
    }

    public void setProductSpec(String productSpec) {
        this.productSpec = productSpec;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public BigDecimal getPlatformDiscount() {
        return platformDiscount;
    }

    public void setPlatformDiscount(BigDecimal platformDiscount) {
        this.platformDiscount = platformDiscount;
    }

    public BigDecimal getMerchantDiscount() {
        return merchantDiscount;
    }

    public void setMerchantDiscount(BigDecimal merchantDiscount) {
        this.merchantDiscount = merchantDiscount;
    }

    public BigDecimal getInfluencerDiscount() {
        return influencerDiscount;
    }

    public void setInfluencerDiscount(BigDecimal influencerDiscount) {
        this.influencerDiscount = influencerDiscount;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getPlatformServiceFee() {
        return platformServiceFee;
    }

    public void setPlatformServiceFee(BigDecimal platformServiceFee) {
        this.platformServiceFee = platformServiceFee;
    }

    public BigDecimal getInfluencerCommission() {
        return influencerCommission;
    }

    public void setInfluencerCommission(BigDecimal influencerCommission) {
        this.influencerCommission = influencerCommission;
    }

    public BigDecimal getTechServiceFee() {
        return techServiceFee;
    }

    public void setTechServiceFee(BigDecimal techServiceFee) {
        this.techServiceFee = techServiceFee;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public BigDecimal getActualIncome() {
        return actualIncome;
    }

    public void setActualIncome(BigDecimal actualIncome) {
        this.actualIncome = actualIncome;
    }

    public BigDecimal getProductCost() {
        return productCost;
    }

    public void setProductCost(BigDecimal productCost) {
        this.productCost = productCost;
    }

    public BigDecimal getGrossProfit() {
        return grossProfit;
    }

    public void setGrossProfit(BigDecimal grossProfit) {
        this.grossProfit = grossProfit;
    }

    public BigDecimal getGrossProfitRate() {
        return grossProfitRate;
    }

    public void setGrossProfitRate(BigDecimal grossProfitRate) {
        this.grossProfitRate = grossProfitRate;
    }

    public Integer getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(Integer orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getOrderStatusName() {
        return orderStatusName;
    }

    public void setOrderStatusName(String orderStatusName) {
        this.orderStatusName = orderStatusName;
    }

    public Integer getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(Integer paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethodName() {
        return paymentMethodName;
    }

    public void setPaymentMethodName(String paymentMethodName) {
        this.paymentMethodName = paymentMethodName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getReceiverProvince() {
        return receiverProvince;
    }

    public void setReceiverProvince(String receiverProvince) {
        this.receiverProvince = receiverProvince;
    }

    public String getReceiverCity() {
        return receiverCity;
    }

    public void setReceiverCity(String receiverCity) {
        this.receiverCity = receiverCity;
    }

    public String getReceiverDistrict() {
        return receiverDistrict;
    }

    public void setReceiverDistrict(String receiverDistrict) {
        this.receiverDistrict = receiverDistrict;
    }

    public String getReceiverAddress() {
        return receiverAddress;
    }

    public void setReceiverAddress(String receiverAddress) {
        this.receiverAddress = receiverAddress;
    }

    public String getInfluencerId() {
        return influencerId;
    }

    public void setInfluencerId(String influencerId) {
        this.influencerId = influencerId;
    }

    public String getInfluencerName() {
        return influencerName;
    }

    public void setInfluencerName(String influencerName) {
        this.influencerName = influencerName;
    }

    public String getInfluencerAvatar() {
        return influencerAvatar;
    }

    public void setInfluencerAvatar(String influencerAvatar) {
        this.influencerAvatar = influencerAvatar;
    }

    public String getLogisticsCompany() {
        return logisticsCompany;
    }

    public void setLogisticsCompany(String logisticsCompany) {
        this.logisticsCompany = logisticsCompany;
    }

    public String getLogisticsNo() {
        return logisticsNo;
    }

    public void setLogisticsNo(String logisticsNo) {
        this.logisticsNo = logisticsNo;
    }

    public Date getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(Date orderTime) {
        this.orderTime = orderTime;
    }

    public Date getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(Date paymentTime) {
        this.paymentTime = paymentTime;
    }

    public Date getShippingTime() {
        return shippingTime;
    }

    public void setShippingTime(Date shippingTime) {
        this.shippingTime = shippingTime;
    }

    public Date getCompleteTime() {
        return completeTime;
    }

    public void setCompleteTime(Date completeTime) {
        this.completeTime = completeTime;
    }

    public Integer getDataSource() {
        return dataSource;
    }

    public void setDataSource(Integer dataSource) {
        this.dataSource = dataSource;
    }

    public Date getSyncTime() {
        return syncTime;
    }

    public void setSyncTime(Date syncTime) {
        this.syncTime = syncTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getDeleted() {
        return deleted;
    }

    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }
}
