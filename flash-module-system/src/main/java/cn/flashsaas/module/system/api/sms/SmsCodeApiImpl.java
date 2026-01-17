package cn.flashsaas.module.system.api.sms;

import cn.flashsaas.module.system.api.sms.dto.code.SmsCodeValidateReqDTO;
import cn.flashsaas.module.system.api.sms.dto.code.SmsCodeSendReqDTO;
import cn.flashsaas.module.system.api.sms.dto.code.SmsCodeUseReqDTO;
import cn.flashsaas.module.system.service.sms.SmsCodeService;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;

/**
 * 短信验证码 API 实现类
 *
 * @author FlashSaaS
 */
@Service
@Validated
public class SmsCodeApiImpl implements SmsCodeApi {

    @Resource
    private SmsCodeService smsCodeService;

    @Override
    public void sendSmsCode(SmsCodeSendReqDTO reqDTO) {
        smsCodeService.sendSmsCode(reqDTO);
    }

    @Override
    public void useSmsCode(SmsCodeUseReqDTO reqDTO) {
        smsCodeService.useSmsCode(reqDTO);
    }

    @Override
    public void validateSmsCode(SmsCodeValidateReqDTO reqDTO) {
        smsCodeService.validateSmsCode(reqDTO);
    }

}
