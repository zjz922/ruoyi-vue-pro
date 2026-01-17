package cn.iocoder.yudao.module.finance.dal.dataobject.sync;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 同步异常 DO
 */
@TableName("finance_sync_exception")
@KeySequence("finance_sync_exception_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncExceptionDO extends BaseDO {

    /**
     * 异常编号
     */
    @TableId
    private Long id;

    /**
     * 任务编号
     */
    private Long taskId;

    /**
     * 日志编号
     */
    private Long logId;

    /**
     * 租户编号
     */
    private Long tenantId;

    /**
     * 平台类型：1-抖店 2-千川 3-聚水潭
     */
    private Integer platformType;

    /**
     * 异常类型：1-数据格式错误 2-网络超时 3-API限流 4-数据冲突 5-其他
     */
    private Integer exceptionType;

    /**
     * 异常信息
     */
    private String exceptionMessage;

    /**
     * 异常数据(JSON)
     */
    private String exceptionData;

    /**
     * 处理状态：0-待处理 1-已重试 2-已忽略 3-已解决
     */
    private Integer handleStatus;

    /**
     * 重试次数
     */
    private Integer retryCount;

    /**
     * 最后重试时间
     */
    private LocalDateTime lastRetryTime;

    /**
     * 处理备注
     */
    private String handleRemark;
}
