package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.qianchuan.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.QianchuanConfigDO;

import java.time.LocalDate;
import java.util.List;

/**
 * 千川集成 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface QianchuanService {

    /**
     * 获取授权URL
     *
     * @param userId 用户ID
     * @param redirectUri 回调地址
     * @return 授权URL
     */
    String getAuthUrl(Long userId, String redirectUri);

    /**
     * 处理授权回调
     *
     * @param code 授权码
     * @param userId 用户ID
     */
    void handleCallback(String code, Long userId);

    /**
     * 同步推广数据
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 同步结果
     */
    SyncResultVO syncPromotionData(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取推广费用
     *
     * @param shopId 店铺ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 推广费用列表
     */
    List<PromotionCostVO> getPromotionCosts(Long shopId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取推广效果统计
     *
     * @param shopId 店铺ID
     * @param date 日期
     * @return 推广效果统计
     */
    PromotionStatVO getPromotionStat(Long shopId, LocalDate date);

    /**
     * 获取配置
     *
     * @param shopId 店铺ID
     * @return 配置信息
     */
    QianchuanConfigDO getConfig(Long shopId);

    /**
     * 保存配置
     *
     * @param reqVO 配置请求
     * @return 配置ID
     */
    Long saveConfig(QianchuanConfigSaveReqVO reqVO);

    /**
     * 检查授权状态
     *
     * @param shopId 店铺ID
     * @return 授权状态
     */
    QianchuanAuthStatusVO checkAuthStatus(Long shopId);

    /**
     * 获取推广计划列表
     *
     * @param shopId 店铺ID
     * @param status 状态
     * @return 推广计划列表
     */
    List<PromotionPlanVO> getPromotionPlans(Long shopId, String status);

    /**
     * 获取推广数据分页
     *
     * @param reqVO 分页请求
     * @return 推广数据分页
     */
    PageResult<PromotionDataVO> getPromotionDataPage(PromotionDataPageReqVO reqVO);

}
