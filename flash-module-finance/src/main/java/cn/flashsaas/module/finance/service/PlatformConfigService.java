package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.platform.vo.*;

/**
 * 平台集成配置 Service 接口
 * 
 * 包含抖店、千川、聚水潭三个平台的配置管理
 */
public interface PlatformConfigService {

    // ==================== 抖店配置 ====================

    /**
     * 获取抖店配置分页
     */
    PageResult<DoudianConfigRespVO> getDoudianConfigPage(DoudianConfigPageReqVO pageVO);

    /**
     * 获取抖店配置详情
     */
    DoudianConfigRespVO getDoudianConfig(Long id);

    /**
     * 创建抖店配置
     */
    Long createDoudianConfig(DoudianConfigCreateReqVO createReqVO);

    /**
     * 更新抖店配置
     */
    void updateDoudianConfig(DoudianConfigUpdateReqVO updateReqVO);

    /**
     * 删除抖店配置
     */
    void deleteDoudianConfig(Long id);

    /**
     * 测试抖店连接
     */
    Boolean testDoudianConnection(Long id);

    /**
     * 刷新抖店Token
     */
    void refreshDoudianToken(Long id);

    // ==================== 千川配置 ====================

    /**
     * 获取千川配置分页
     */
    PageResult<QianchuanConfigRespVO> getQianchuanConfigPage(QianchuanConfigPageReqVO pageVO);

    /**
     * 获取千川配置详情
     */
    QianchuanConfigRespVO getQianchuanConfig(Long id);

    /**
     * 创建千川配置
     */
    Long createQianchuanConfig(QianchuanConfigCreateReqVO createReqVO);

    /**
     * 更新千川配置
     */
    void updateQianchuanConfig(QianchuanConfigUpdateReqVO updateReqVO);

    /**
     * 删除千川配置
     */
    void deleteQianchuanConfig(Long id);

    /**
     * 测试千川连接
     */
    Boolean testQianchuanConnection(Long id);

    /**
     * 刷新千川Token
     */
    void refreshQianchuanToken(Long id);

    // ==================== 聚水潭配置 ====================

    /**
     * 获取聚水潭配置分页
     */
    PageResult<JushuitanConfigRespVO> getJushuitanConfigPage(JushuitanConfigPageReqVO pageVO);

    /**
     * 获取聚水潭配置详情
     */
    JushuitanConfigRespVO getJushuitanConfig(Long id);

    /**
     * 创建聚水潭配置
     */
    Long createJushuitanConfig(JushuitanConfigCreateReqVO createReqVO);

    /**
     * 更新聚水潭配置
     */
    void updateJushuitanConfig(JushuitanConfigUpdateReqVO updateReqVO);

    /**
     * 删除聚水潭配置
     */
    void deleteJushuitanConfig(Long id);

    /**
     * 测试聚水潭连接
     */
    Boolean testJushuitanConnection(Long id);

    /**
     * 刷新聚水潭Token
     */
    void refreshJushuitanToken(Long id);
}
