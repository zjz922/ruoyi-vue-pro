package cn.flashsaas.module.finance.dal.dataobject;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 渠道配置 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_channel")
@KeySequence("finance_channel_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDO extends BaseDO {

    /**
     * 渠道ID
     */
    @TableId
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
     * 渠道编码
     * 如：DOUDIAN-抖店, QIANCHUAN-千川, JST-聚水潭, ALIPAY-支付宝, WECHAT-微信
     */
    private String channelCode;

    /**
     * 渠道名称
     */
    private String channelName;

    /**
     * 渠道类型
     * 如：PLATFORM-平台, PAYMENT-支付, ERP-ERP系统
     */
    private String channelType;

    /**
     * 配置信息（JSON格式）
     * 示例：{"appKey": "xxx", "appSecret": "xxx", "apiUrl": "https://xxx"}
     */
    private String config;

    /**
     * 是否启用
     */
    private Boolean enabled;

}
