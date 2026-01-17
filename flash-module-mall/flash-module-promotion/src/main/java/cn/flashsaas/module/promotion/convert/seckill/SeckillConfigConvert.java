package cn.flashsaas.module.promotion.convert.seckill;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.promotion.controller.admin.seckill.vo.config.SeckillConfigCreateReqVO;
import cn.flashsaas.module.promotion.controller.admin.seckill.vo.config.SeckillConfigRespVO;
import cn.flashsaas.module.promotion.controller.admin.seckill.vo.config.SeckillConfigSimpleRespVO;
import cn.flashsaas.module.promotion.controller.admin.seckill.vo.config.SeckillConfigUpdateReqVO;
import cn.flashsaas.module.promotion.controller.app.seckill.vo.config.AppSeckillConfigRespVO;
import cn.flashsaas.module.promotion.dal.dataobject.seckill.SeckillConfigDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 秒杀时段 Convert
 *
 * @author FlashSaaS
 */
@Mapper
public interface SeckillConfigConvert {

    SeckillConfigConvert INSTANCE = Mappers.getMapper(SeckillConfigConvert.class);

    SeckillConfigDO convert(SeckillConfigCreateReqVO bean);

    SeckillConfigDO convert(SeckillConfigUpdateReqVO bean);

    SeckillConfigRespVO convert(SeckillConfigDO bean);

    List<SeckillConfigRespVO> convertList(List<SeckillConfigDO> list);

    List<SeckillConfigSimpleRespVO> convertList1(List<SeckillConfigDO> list);

    PageResult<SeckillConfigRespVO> convertPage(PageResult<SeckillConfigDO> page);

    List<AppSeckillConfigRespVO> convertList2(List<SeckillConfigDO> list);

    AppSeckillConfigRespVO convert1(SeckillConfigDO filteredConfig);
}
