package cn.iocoder.yudao.module.finance.dal.dataobject.sync;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 同步日志 DO
 */
@TableName("finance_sync_log")
@KeySequence("finance_sync_log_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncLogDO extends BaseDO {

    /**
     * 日志编号
     */
    @TableId
    private Long id;

    /**
     * 任务编号
     */
    private Long taskId;

    /**
     * 租户编号
     */
    private Long tenantId;

    /**
     * 平台类型：1-抖店 2-千川 3-聚水潭
     */
    private Integer platformType;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;

    /**
     * 执行耗时(ms)
     */
    private Long duration;

    /**
     * 执行结果：0-失败 1-成功
     */
    private Integer result;

    /**
     * 同步条数
     */
    private Integer syncCount;

    /**
     * 成功条数
     */
    private Integer successCount;

    /**
     * 失败条数
     */
    private Integer failCount;

    /**
     * 错误信息
     */
    private String errorMessage;
}
