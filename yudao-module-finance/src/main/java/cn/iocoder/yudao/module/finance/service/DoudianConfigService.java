package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianConfigDO;

import javax.validation.Valid;

/**
 * 抖店配置 Service 接口
 *
 * @author 闪电账PRO
 */
public interface DoudianConfigService {

    /**
     * 创建抖店配置
     *
     * @param createReqVO 创建信息
     * @return 抖店配置ID
     */
    Long createDoudianConfig(@Valid DoudianConfigCreateReqVO createReqVO);

    /**
     * 更新抖店配置
     *
     * @param updateReqVO 更新信息
     */
    void updateDoudianConfig(@Valid DoudianConfigUpdateReqVO updateReqVO);

    /**
     * 删除抖店配置
     *
     * @param id 抖店配置ID
     */
    void deleteDoudianConfig(Long id);

    /**
     * 获取抖店配置
     *
     * @param id 抖店配置ID
     * @return 抖店配置
     */
    DoudianConfigDO getDoudianConfig(Long id);

    /**
     * 获取抖店配置分页
     *
     * @param pageReqVO 分页请求
     * @return 抖店配置分页
     */
    PageResult<DoudianConfigDO> getDoudianConfigPage(DoudianConfigPageReqVO pageReqVO);

    /**
     * 获取店铺的抖店配置
     *
     * @param shopId 店铺ID
     * @return 抖店配置
     */
    DoudianConfigDO getDoudianConfigByShopId(Long shopId);

}
