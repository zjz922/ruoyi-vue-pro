package cn.flashsaas.module.finance.service.doudian;

import cn.flashsaas.module.finance.controller.admin.doudian.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.doudian.DoudianConfigDO;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 抖店API Service 接口
 *
 * @author 闪电账PRO
 */
public interface DoudianService {

    /**
     * 创建抖店配置
     *
     * @param createReqVO 创建信息
     * @return 编号
     */
    Long createConfig(@Valid DoudianConfigCreateReqVO createReqVO);

    /**
     * 更新抖店配置
     *
     * @param updateReqVO 更新信息
     */
    void updateConfig(@Valid DoudianConfigUpdateReqVO updateReqVO);

    /**
     * 删除抖店配置
     *
     * @param id 编号
     */
    void deleteConfig(Long id);

    /**
     * 获得抖店配置
     *
     * @param id 编号
     * @return 抖店配置
     */
    DoudianConfigDO getConfig(Long id);

    /**
     * 获得抖店配置列表
     *
     * @return 配置列表
     */
    List<DoudianConfigDO> getConfigList();

    /**
     * 检查API配置状态
     *
     * @return 配置状态
     */
    DoudianConfigCheckRespVO checkConfig();

    /**
     * 同步订单
     *
     * @param reqVO 同步请求
     * @return 同步结果
     */
    DoudianSyncRespVO syncOrders(@Valid DoudianSyncReqVO reqVO);

    /**
     * 获取订单详情
     *
     * @param accessToken 访问令牌
     * @param shopOrderId 订单ID
     * @return 订单详情
     */
    Map<String, Object> getOrderDetail(String accessToken, String shopOrderId);

    /**
     * 同步商品
     *
     * @param reqVO 同步请求
     * @return 同步结果
     */
    DoudianSyncRespVO syncProducts(@Valid DoudianSyncReqVO reqVO);

    /**
     * 获取商品详情
     *
     * @param accessToken 访问令牌
     * @param productId 商品ID
     * @return 商品详情
     */
    Map<String, Object> getProductDetail(String accessToken, String productId);

    /**
     * 获取结算账单
     *
     * @param reqVO 查询请求
     * @return 账单数据
     */
    Map<String, Object> getSettleBill(@Valid DoudianBillReqVO reqVO);

    /**
     * 获取资金流水
     *
     * @param reqVO 查询请求
     * @return 流水数据
     */
    Map<String, Object> getAccountFlow(@Valid DoudianBillReqVO reqVO);

    /**
     * 获取达人佣金
     *
     * @param reqVO 查询请求
     * @return 佣金数据
     */
    Map<String, Object> getCommission(@Valid DoudianBillReqVO reqVO);

    /**
     * 获取保险详情
     *
     * @param accessToken 访问令牌
     * @param orderId 订单ID
     * @return 保险详情
     */
    Map<String, Object> getInsurance(String accessToken, String orderId);

    /**
     * 获取售后列表
     *
     * @param reqVO 查询请求
     * @return 售后列表
     */
    Map<String, Object> getAfterSaleList(@Valid DoudianAfterSaleReqVO reqVO);

    /**
     * 获取售后详情
     *
     * @param accessToken 访问令牌
     * @param afterSaleId 售后ID
     * @return 售后详情
     */
    Map<String, Object> getAfterSaleDetail(String accessToken, String afterSaleId);

    /**
     * 生成API签名
     *
     * @param method API方法
     * @param params 请求参数
     * @param timestamp 时间戳
     * @return 签名字符串
     */
    String generateSign(String method, Map<String, Object> params, String timestamp);

}
