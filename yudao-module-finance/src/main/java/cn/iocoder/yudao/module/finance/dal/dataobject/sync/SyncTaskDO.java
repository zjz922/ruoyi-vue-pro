package cn.iocoder.yudao.module.finance.dal.dataobject.sync;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 同步任务 DO
 */
@TableName("finance_sync_task")
@KeySequence("finance_sync_task_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncTaskDO extends BaseDO {

    /**
     * 任务编号
     */
    @TableId
    private Long id;

    /**
     * 租户编号
     */
    private Long tenantId;

    /**
     * 任务名称
     */
    private String taskName;

    /**
     * 平台类型：1-抖店 2-千川 3-聚水潭
     */
    private Integer platformType;

    /**
     * 任务类型：1-抖店订单 2-抖店结算 3-千川消耗 4-聚水潭库存
     */
    private Integer taskType;

    /**
     * 关联配置ID
     */
    private Long configId;

    /**
     * Cron表达式
     */
    private String cronExpression;

    /**
     * 状态：0-停用 1-启用
     */
    private Integer status;

    /**
     * 上次执行时间
     */
    private LocalDateTime lastExecuteTime;

    /**
     * 上次执行结果：0-失败 1-成功
     */
    private Integer lastExecuteResult;
}
