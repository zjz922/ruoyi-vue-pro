package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.alert.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.AlertRecordDO;
import cn.flashsaas.module.finance.dal.dataobject.AlertRuleDO;

import java.util.List;

/**
 * 预警通知 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface AlertService {

    /**
     * 创建预警规则
     *
     * @param reqVO 创建请求
     * @return 规则ID
     */
    Long createAlertRule(AlertRuleCreateReqVO reqVO);

    /**
     * 更新预警规则
     *
     * @param reqVO 更新请求
     */
    void updateAlertRule(AlertRuleUpdateReqVO reqVO);

    /**
     * 删除预警规则
     *
     * @param ruleId 规则ID
     */
    void deleteAlertRule(Long ruleId);

    /**
     * 获取预警规则列表
     *
     * @param shopId 店铺ID
     * @return 规则列表
     */
    List<AlertRuleDO> getAlertRules(Long shopId);

    /**
     * 获取预警规则详情
     *
     * @param ruleId 规则ID
     * @return 规则详情
     */
    AlertRuleDO getAlertRule(Long ruleId);

    /**
     * 启用/禁用预警规则
     *
     * @param ruleId 规则ID
     * @param enabled 是否启用
     */
    void setAlertRuleEnabled(Long ruleId, Boolean enabled);

    /**
     * 获取预警记录（分页）
     *
     * @param reqVO 分页请求
     * @return 预警记录列表
     */
    PageResult<AlertRecordDO> getAlertRecordPage(AlertRecordPageReqVO reqVO);

    /**
     * 获取未读预警数量
     *
     * @param tenantId 租户ID
     * @return 未读数量
     */
    Long getUnreadAlertCount(Long tenantId);

    /**
     * 标记预警为已读
     *
     * @param recordId 记录ID
     */
    void markAlertAsRead(Long recordId);

    /**
     * 批量标记预警为已读
     *
     * @param recordIds 记录ID列表
     */
    void batchMarkAlertAsRead(List<Long> recordIds);

    /**
     * 处理预警
     *
     * @param recordId 记录ID
     * @param handleType 处理类型
     * @param handleRemark 处理备注
     */
    void handleAlert(Long recordId, String handleType, String handleRemark);

    /**
     * 触发预警检查
     *
     * @param shopId 店铺ID
     * @return 触发的预警记录列表
     */
    List<AlertRecordDO> triggerAlertCheck(Long shopId);

    /**
     * 获取预警类型列表
     *
     * @return 预警类型列表
     */
    List<AlertTypeVO> getAlertTypes();

    /**
     * 获取预警统计
     *
     * @param shopId 店铺ID
     * @return 预警统计
     */
    AlertStatVO getAlertStat(Long shopId);

    /**
     * 配置通知方式
     *
     * @param reqVO 配置请求
     */
    void configNotification(NotificationConfigReqVO reqVO);

    /**
     * 获取通知配置
     *
     * @param shopId 店铺ID
     * @return 通知配置
     */
    NotificationConfigVO getNotificationConfig(Long shopId);

}
