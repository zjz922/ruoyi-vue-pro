package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.document.vo.*;

import java.util.List;

/**
 * 单据中心 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface DocumentService {

    /**
     * 获取单据列表（分页）
     *
     * @param reqVO 分页请求
     * @return 单据列表
     */
    PageResult<DocumentVO> getDocumentPage(DocumentPageReqVO reqVO);

    /**
     * 获取单据详情
     *
     * @param documentId 单据ID
     * @return 单据详情
     */
    DocumentDetailVO getDocumentDetail(Long documentId);

    /**
     * 创建单据
     *
     * @param reqVO 创建请求
     * @return 单据ID
     */
    Long createDocument(DocumentCreateReqVO reqVO);

    /**
     * 更新单据
     *
     * @param reqVO 更新请求
     */
    void updateDocument(DocumentUpdateReqVO reqVO);

    /**
     * 删除单据
     *
     * @param documentId 单据ID
     */
    void deleteDocument(Long documentId);

    /**
     * 关联订单
     *
     * @param documentId 单据ID
     * @param orderIds 订单ID列表
     */
    void linkOrders(Long documentId, List<Long> orderIds);

    /**
     * 取消关联订单
     *
     * @param documentId 单据ID
     * @param orderIds 订单ID列表
     */
    void unlinkOrders(Long documentId, List<Long> orderIds);

    /**
     * 获取单据关联的订单列表
     *
     * @param documentId 单据ID
     * @return 订单列表
     */
    List<DocumentOrderVO> getLinkedOrders(Long documentId);

    /**
     * 获取订单关联的单据列表
     *
     * @param orderId 订单ID
     * @return 单据列表
     */
    List<DocumentVO> getOrderDocuments(Long orderId);

    /**
     * 审核单据
     *
     * @param documentId 单据ID
     * @param approved 是否通过
     * @param remark 备注
     */
    void auditDocument(Long documentId, Boolean approved, String remark);

    /**
     * 作废单据
     *
     * @param documentId 单据ID
     * @param reason 作废原因
     */
    void voidDocument(Long documentId, String reason);

    /**
     * 获取单据类型列表
     *
     * @return 单据类型列表
     */
    List<DocumentTypeVO> getDocumentTypes();

    /**
     * 导出单据
     *
     * @param reqVO 导出请求
     * @return 导出文件URL
     */
    String exportDocuments(DocumentExportReqVO reqVO);

    /**
     * 获取单据统计
     *
     * @param shopId 店铺ID
     * @return 单据统计
     */
    DocumentStatVO getDocumentStat(Long shopId);

}
