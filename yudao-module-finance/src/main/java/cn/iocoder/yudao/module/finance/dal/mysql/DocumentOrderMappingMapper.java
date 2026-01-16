package cn.iocoder.yudao.module.finance.dal.mysql;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.finance.dal.dataobject.DocumentOrderMappingDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 单据订单关联 Mapper
 *
 * @author 闪电帐PRO
 */
@Mapper
public interface DocumentOrderMappingMapper extends BaseMapperX<DocumentOrderMappingDO> {

    /**
     * 根据单据ID查询关联列表
     */
    default List<DocumentOrderMappingDO> selectListByDocumentId(Long documentId) {
        return selectList(new LambdaQueryWrapperX<DocumentOrderMappingDO>()
                .eq(DocumentOrderMappingDO::getDocumentId, documentId));
    }

    /**
     * 根据订单ID查询关联列表
     */
    default List<DocumentOrderMappingDO> selectListByOrderId(Long orderId) {
        return selectList(new LambdaQueryWrapperX<DocumentOrderMappingDO>()
                .eq(DocumentOrderMappingDO::getOrderId, orderId));
    }

    /**
     * 根据单据类型查询关联列表
     */
    default List<DocumentOrderMappingDO> selectListByDocumentType(Long tenantId, Long shopId, String documentType) {
        return selectList(new LambdaQueryWrapperX<DocumentOrderMappingDO>()
                .eq(DocumentOrderMappingDO::getTenantId, tenantId)
                .eq(DocumentOrderMappingDO::getShopId, shopId)
                .eq(DocumentOrderMappingDO::getDocumentType, documentType));
    }

    /**
     * 根据单据ID和订单ID查询
     */
    default DocumentOrderMappingDO selectByDocumentAndOrder(Long documentId, Long orderId) {
        return selectOne(new LambdaQueryWrapperX<DocumentOrderMappingDO>()
                .eq(DocumentOrderMappingDO::getDocumentId, documentId)
                .eq(DocumentOrderMappingDO::getOrderId, orderId));
    }

}
