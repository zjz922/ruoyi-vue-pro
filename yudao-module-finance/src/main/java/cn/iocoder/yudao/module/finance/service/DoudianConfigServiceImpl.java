package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianConfigDO;
import cn.iocoder.yudao.module.finance.dal.mysql.DoudianConfigMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 抖店配置 Service 实现类
 *
 * @author 闪电账PRO
 */
@Service
public class DoudianConfigServiceImpl implements DoudianConfigService {

    @Resource
    private DoudianConfigMapper doudianConfigMapper;

    @Override
    @Transactional
    public Long createDoudianConfig(@Valid DoudianConfigCreateReqVO createReqVO) {
        DoudianConfigDO doudianConfig = BeanUtils.toBean(createReqVO, DoudianConfigDO.class);
        doudianConfigMapper.insert(doudianConfig);
        return doudianConfig.getId();
    }

    @Override
    @Transactional
    public void updateDoudianConfig(@Valid DoudianConfigUpdateReqVO updateReqVO) {
        DoudianConfigDO doudianConfig = BeanUtils.toBean(updateReqVO, DoudianConfigDO.class);
        doudianConfigMapper.updateById(doudianConfig);
    }

    @Override
    @Transactional
    public void deleteDoudianConfig(Long id) {
        doudianConfigMapper.deleteById(id);
    }

    @Override
    public DoudianConfigDO getDoudianConfig(Long id) {
        return doudianConfigMapper.selectById(id);
    }

    @Override
    public PageResult<DoudianConfigDO> getDoudianConfigPage(DoudianConfigPageReqVO pageReqVO) {
        LambdaQueryWrapper<DoudianConfigDO> queryWrapper = Wrappers.lambdaQuery(DoudianConfigDO.class)
                .eq(pageReqVO.getShopId() != null, DoudianConfigDO::getShopId, pageReqVO.getShopId())
                .like(pageReqVO.getShopName() != null, DoudianConfigDO::getShopName, pageReqVO.getShopName())
                .eq(pageReqVO.getAuthStatus() != null, DoudianConfigDO::getAuthStatus, pageReqVO.getAuthStatus())
                .orderByDesc(DoudianConfigDO::getCreateTime);
        
        return doudianConfigMapper.selectPage(pageReqVO, queryWrapper);
    }

    @Override
    public DoudianConfigDO getDoudianConfigByShopId(Long shopId) {
        LambdaQueryWrapper<DoudianConfigDO> queryWrapper = Wrappers.lambdaQuery(DoudianConfigDO.class)
                .eq(DoudianConfigDO::getShopId, shopId);
        
        return doudianConfigMapper.selectOne(queryWrapper);
    }

}
