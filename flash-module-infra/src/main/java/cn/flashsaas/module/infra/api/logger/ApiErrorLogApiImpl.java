package cn.flashsaas.module.infra.api.logger;

import cn.flashsaas.framework.common.biz.infra.logger.ApiErrorLogCommonApi;
import cn.flashsaas.framework.common.biz.infra.logger.dto.ApiErrorLogCreateReqDTO;
import cn.flashsaas.module.infra.service.logger.ApiErrorLogService;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;

/**
 * API 访问日志的 API 接口
 *
 * @author 芋道源码
 */
@Service
@Validated
public class ApiErrorLogApiImpl implements ApiErrorLogCommonApi {

    @Resource
    private ApiErrorLogService apiErrorLogService;

    @Override
    public void createApiErrorLog(ApiErrorLogCreateReqDTO createDTO) {
        apiErrorLogService.createApiErrorLog(createDTO);
    }

}
