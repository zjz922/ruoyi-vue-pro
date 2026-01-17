package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 数据同步日志数据对象
 *
 * @author 闪电账PRO
 */
@TableName("finance_sync_log")
@KeySequence("finance_sync_log_seq")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncLogDO extends BaseDO {

    /**
     * 同步日志ID
     */
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 店铺ID
     */
    private Long shopId;

    /**
     * 同步类型 (订单、商品、资金流水等)
     */
    private String syncType;

    /**
     * 数据来源 (doudian、qianchuan、jst等)
     */
    private String dataSource;

    /**
     * 同步状态 (进行中、成功、失败)
     */
    private String syncStatus;

    /**
     * 同步状态（兼容字段）
     */
    private String status;

    /**
     * 同步开始日期
     */
    private java.time.LocalDate startDate;

    /**
     * 同步结束日期
     */
    private java.time.LocalDate endDate;

    /**
     * 同步开始时间
     */
    private LocalDateTime startTime;

    /**
     * 同步结束时间
     */
    private LocalDateTime endTime;

    /**
     * 同步数量
     */
    private Integer syncCount;

    /**
     * 成功数量
     */
    private Integer successCount;

    /**
     * 失败数量
     */
    private Integer failCount;

    /**
     * 错误信息
     */
    private String errorMessage;

    /**
     * 同步参数
     */
    private String syncParams;

    /**
     * 备注
     */
    private String remark;

    /**
     * 删除标志 (0 未删除, 1 已删除)
     */
    private Integer delFlag;
}
