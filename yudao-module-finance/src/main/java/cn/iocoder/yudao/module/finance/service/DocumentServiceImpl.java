package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.document.vo.*;
import cn.iocoder.yudao.module.finance.dal.dataobject.DocumentOrderMappingDO;
import cn.iocoder.yudao.module.finance.dal.mysql.DocumentOrderMappingMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 单据中心 Service 实现类
 *
 * @author 闪电帐PRO
 */
@Service
@Validated
@Slf4j
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentOrderMappingMapper documentOrderMappingMapper;

    @Override
    public PageResult<DocumentVO> getDocumentPage(DocumentPageReqVO reqVO) {
        // TODO: 实现单据分页查询
        return new PageResult<>(new ArrayList<>(), 0L);
    }

    @Override
    public DocumentDetailVO getDocumentDetail(Long documentId) {
        // TODO: 实现单据详情查询
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createDocument(DocumentCreateReqVO reqVO) {
        // TODO: 实现单据创建
        log.info("创建单据, type: {}", reqVO.getDocumentType());
        return 0L;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateDocument(DocumentUpdateReqVO reqVO) {
        // TODO: 实现单据更新
        log.info("更新单据, documentId: {}", reqVO.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteDocument(Long documentId) {
        // TODO: 实现单据删除
        log.info("删除单据, documentId: {}", documentId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindOrderToDocument(Long documentId, List<String> orderIds) {
        for (String orderId : orderIds) {
            DocumentOrderMappingDO mappingDO = new DocumentOrderMappingDO();
            mappingDO.setDocumentId(documentId);
            mappingDO.setOrderId(orderId);
            mappingDO.setBindTime(LocalDateTime.now());
            documentOrderMappingMapper.insert(mappingDO);
        }
        log.info("绑定订单到单据, documentId: {}, orderCount: {}", documentId, orderIds.size());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unbindOrderFromDocument(Long documentId, String orderId) {
        documentOrderMappingMapper.deleteByDocumentAndOrder(documentId, orderId);
        log.info("解绑订单, documentId: {}, orderId: {}", documentId, orderId);
    }

    @Override
    public List<DocumentVO> getDocumentsByOrder(String orderId) {
        List<DocumentOrderMappingDO> mappings = documentOrderMappingMapper.selectByOrderId(orderId);
        List<DocumentVO> result = new ArrayList<>();
        
        for (DocumentOrderMappingDO mapping : mappings) {
            // TODO: 查询单据详情
            DocumentVO vo = new DocumentVO();
            vo.setId(mapping.getDocumentId());
            result.add(vo);
        }
        
        return result;
    }

    @Override
    public List<String> getOrdersByDocument(Long documentId) {
        List<DocumentOrderMappingDO> mappings = documentOrderMappingMapper.selectByDocumentId(documentId);
        List<String> orderIds = new ArrayList<>();
        
        for (DocumentOrderMappingDO mapping : mappings) {
            orderIds.add(mapping.getOrderId());
        }
        
        return orderIds;
    }

    @Override
    public DocumentStatVO getDocumentStat(Long tenantId, Long shopId) {
        DocumentStatVO vo = new DocumentStatVO();
        vo.setTenantId(tenantId);
        vo.setShopId(shopId);
        
        // TODO: 统计单据数据
        vo.setTotalDocuments(0);
        vo.setPendingDocuments(0);
        vo.setCompletedDocuments(0);
        vo.setCancelledDocuments(0);
        
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateDocumentStatus(Long documentId, String status) {
        // TODO: 更新单据状态
        log.info("更新单据状态, documentId: {}, status: {}", documentId, status);
    }

    @Override
    public byte[] exportDocuments(DocumentExportReqVO reqVO) {
        // TODO: 导出单据
        return new byte[0];
    }

    @Override
    public List<DocumentTypeVO> getDocumentTypes() {
        List<DocumentTypeVO> types = new ArrayList<>();
        
        DocumentTypeVO type1 = new DocumentTypeVO();
        type1.setCode("sales_order");
        type1.setName("销售单");
        types.add(type1);
        
        DocumentTypeVO type2 = new DocumentTypeVO();
        type2.setCode("purchase_order");
        type2.setName("采购单");
        types.add(type2);
        
        DocumentTypeVO type3 = new DocumentTypeVO();
        type3.setCode("return_order");
        type3.setName("退货单");
        types.add(type3);
        
        DocumentTypeVO type4 = new DocumentTypeVO();
        type4.setCode("adjustment");
        type4.setName("调整单");
        types.add(type4);
        
        return types;
    }

}
