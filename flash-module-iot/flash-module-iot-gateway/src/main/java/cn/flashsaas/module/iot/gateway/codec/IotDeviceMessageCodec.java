package cn.flashsaas.module.iot.gateway.codec;

import cn.flashsaas.module.iot.core.mq.message.IotDeviceMessage;

/**
 * {@link cn.flashsaas.module.iot.core.mq.message.IotDeviceMessage} 的编解码器
 *
 * @author FlashSaaS
 */
public interface IotDeviceMessageCodec {

    /**
     * 编码消息
     *
     * @param message 消息
     * @return 编码后的消息内容
     */
    byte[] encode(IotDeviceMessage message);

    /**
     * 解码消息
     *
     * @param bytes 消息内容
     * @return 解码后的消息内容
     */
    IotDeviceMessage decode(byte[] bytes);

    /**
     * @return 数据格式（编码器类型）
     */
    String type();

}
