package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.alert.vo.*;
import cn.flashsaas.module.finance.dal.dataobject.AlertRecordDO;
import cn.flashsaas.module.finance.dal.dataobject.AlertRuleDO;
import cn.flashsaas.module.finance.dal.mysql.AlertRecordMapper;
import cn.flashsaas.module.finance.dal.mysql.AlertRuleMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 预警通知 Service 实现类
 *
 * @author 闪电帐PRO
 */
@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRuleMapper alertRuleMapper;
    private final AlertRecordMapper alertRecordMapper;

    @Override
    public PageResult<AlertRuleVO> getAlertRulePage(AlertRulePageReqVO reqVO) {
        // TODO: 实现预警规则分页查询
        return new PageResult<>(new ArrayList<>(), 0L);
    }

    @Override
    public AlertRuleVO getAlertRule(Long ruleId) {
        AlertRuleDO ruleDO = alertRuleMapper.selectById(ruleId);
        if (ruleDO == null) {
            return null;
        }
        
        AlertRuleVO vo = new AlertRuleVO();
        vo.setId(ruleDO.getId());
        vo.setRuleName(ruleDO.getRuleName());
        vo.setRuleType(ruleDO.getRuleType());
        vo.setCondition(ruleDO.getCondition());
        vo.setThreshold(ruleDO.getThreshold());
        vo.setEnabled(ruleDO.getEnabled());
        vo.setNotifyType(ruleDO.getNotifyType());
        vo.setCreateTime(ruleDO.getCreateTime());
        
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createAlertRule(AlertRuleCreateReqVO reqVO) {
        AlertRuleDO ruleDO = new AlertRuleDO();
        ruleDO.setTenantId(reqVO.getTenantId());
        ruleDO.setShopId(reqVO.getShopId());
        ruleDO.setRuleName(reqVO.getRuleName());
        ruleDO.setRuleType(reqVO.getRuleType());
        ruleDO.setCondition(reqVO.getCondition());
        ruleDO.setThreshold(reqVO.getThreshold());
        ruleDO.setEnabled(reqVO.getEnabled());
        ruleDO.setNotifyType(reqVO.getNotifyType());
        ruleDO.setNotifyConfig(reqVO.getNotifyConfig());
        
        alertRuleMapper.insert(ruleDO);
        log.info("创建预警规则, ruleId: {}, ruleName: {}", ruleDO.getId(), ruleDO.getRuleName());
        
        return ruleDO.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAlertRule(AlertRuleUpdateReqVO reqVO) {
        AlertRuleDO ruleDO = alertRuleMapper.selectById(reqVO.getId());
        if (ruleDO == null) {
            throw new RuntimeException("预警规则不存在");
        }
        
        ruleDO.setRuleName(reqVO.getRuleName());
        ruleDO.setRuleType(reqVO.getRuleType());
        ruleDO.setCondition(reqVO.getCondition());
        ruleDO.setThreshold(reqVO.getThreshold());
        ruleDO.setEnabled(reqVO.getEnabled());
        ruleDO.setNotifyType(reqVO.getNotifyType());
        ruleDO.setNotifyConfig(reqVO.getNotifyConfig());
        
        alertRuleMapper.updateById(ruleDO);
        log.info("更新预警规则, ruleId: {}", reqVO.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAlertRule(Long ruleId) {
        alertRuleMapper.deleteById(ruleId);
        log.info("删除预警规则, ruleId: {}", ruleId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enableAlertRule(Long ruleId, Boolean enabled) {
        AlertRuleDO ruleDO = alertRuleMapper.selectById(ruleId);
        if (ruleDO != null) {
            ruleDO.setEnabled(enabled);
            alertRuleMapper.updateById(ruleDO);
            log.info("{}预警规则, ruleId: {}", enabled ? "启用" : "禁用", ruleId);
        }
    }

    @Override
    public PageResult<AlertRecordVO> getAlertRecordPage(AlertRecordPageReqVO reqVO) {
        // TODO: 实现预警记录分页查询
        return new PageResult<>(new ArrayList<>(), 0L);
    }

    @Override
    public AlertRecordVO getAlertRecord(Long recordId) {
        AlertRecordDO recordDO = alertRecordMapper.selectById(recordId);
        if (recordDO == null) {
            return null;
        }
        
        AlertRecordVO vo = new AlertRecordVO();
        vo.setId(recordDO.getId());
        vo.setRuleId(recordDO.getRuleId());
        vo.setAlertType(recordDO.getAlertType());
        vo.setAlertLevel(recordDO.getAlertLevel());
        vo.setTitle(recordDO.getTitle());
        vo.setContent(recordDO.getContent());
        vo.setStatus(recordDO.getStatus());
        vo.setCreateTime(recordDO.getCreateTime());
        vo.setReadTime(recordDO.getReadTime());
        
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAlertAsRead(Long recordId) {
        AlertRecordDO recordDO = alertRecordMapper.selectById(recordId);
        if (recordDO != null) {
            recordDO.setStatus("read");
            recordDO.setReadTime(LocalDateTime.now());
            alertRecordMapper.updateById(recordDO);
            log.info("标记预警已读, recordId: {}", recordId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAllAlertsAsRead(Long tenantId, Long shopId) {
        // TODO: 批量标记已读
        log.info("批量标记预警已读, tenantId: {}, shopId: {}", tenantId, shopId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAlertRecord(Long recordId) {
        alertRecordMapper.deleteById(recordId);
        log.info("删除预警记录, recordId: {}", recordId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long triggerAlert(AlertTriggerReqVO reqVO) {
        AlertRecordDO recordDO = new AlertRecordDO();
        recordDO.setTenantId(reqVO.getTenantId());
        recordDO.setShopId(reqVO.getShopId());
        recordDO.setRuleId(reqVO.getRuleId());
        recordDO.setAlertType(reqVO.getAlertType());
        recordDO.setAlertLevel(reqVO.getAlertLevel());
        recordDO.setTitle(reqVO.getTitle());
        recordDO.setContent(reqVO.getContent());
        recordDO.setStatus("unread");
        
        alertRecordMapper.insert(recordDO);
        
        // TODO: 发送通知（邮件、短信、站内信等）
        
        log.info("触发预警, recordId: {}, title: {}", recordDO.getId(), recordDO.getTitle());
        return recordDO.getId();
    }

    @Override
    public AlertStatVO getAlertStat(Long tenantId, Long shopId) {
        AlertStatVO vo = new AlertStatVO();
        vo.setTenantId(tenantId);
        vo.setShopId(shopId);
        
        Long unreadCount = alertRecordMapper.countUnreadByTenant(tenantId);
        vo.setUnreadCount(unreadCount.intValue());
        
        // TODO: 统计其他数据
        vo.setTotalCount(0);
        vo.setTodayCount(0);
        vo.setCriticalCount(0);
        vo.setWarningCount(0);
        vo.setInfoCount(0);
        
        return vo;
    }

    @Override
    public List<AlertRuleVO> getEnabledRules(Long tenantId, Long shopId) {
        List<AlertRuleDO> rules = alertRuleMapper.selectEnabledByTenantAndShop(tenantId, shopId);
        List<AlertRuleVO> result = new ArrayList<>();
        
        for (AlertRuleDO rule : rules) {
            AlertRuleVO vo = new AlertRuleVO();
            vo.setId(rule.getId());
            vo.setRuleName(rule.getRuleName());
            vo.setRuleType(rule.getRuleType());
            vo.setCondition(rule.getCondition());
            vo.setThreshold(rule.getThreshold());
            vo.setEnabled(rule.getEnabled());
            vo.setNotifyType(rule.getNotifyType());
            result.add(vo);
        }
        
        return result;
    }

    @Override
    public void checkAndTriggerAlerts(Long tenantId, Long shopId) {
        List<AlertRuleDO> rules = alertRuleMapper.selectEnabledByTenantAndShop(tenantId, shopId);
        
        for (AlertRuleDO rule : rules) {
            try {
                // TODO: 根据规则类型检查条件并触发预警
                log.debug("检查预警规则, ruleId: {}, ruleName: {}", rule.getId(), rule.getRuleName());
            } catch (Exception e) {
                log.error("检查预警规则失败, ruleId: {}", rule.getId(), e);
            }
        }
    }

}
