package cn.flashsaas.module.finance.controller.admin.document;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 单据中心 Controller
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 单据中心")
@RestController
@RequestMapping("/finance/document")
@Validated
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/page")
    @Operation(summary = "获取单据分页列表")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<PageResult<Map<String, Object>>> getDocumentPage(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "documentNo", required = false) String documentNo,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return success(documentService.getDocumentPage(shopId, documentType, documentNo, status, startDate, endDate, pageNo, pageSize));
    }

    @GetMapping("/{documentId}")
    @Operation(summary = "获取单据详情")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<Map<String, Object>> getDocumentDetail(
            @PathVariable("documentId") Long documentId) {
        return success(documentService.getDocumentDetail(documentId));
    }

    @GetMapping("/order-mapping")
    @Operation(summary = "获取单据订单关联")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<Map<String, Object>> getOrderMapping(
            @RequestParam("documentNo") String documentNo) {
        return success(documentService.getOrderMapping(documentNo));
    }

    @PostMapping("/order-mapping/create")
    @Operation(summary = "创建单据订单关联")
    @PreAuthorize("@ss.hasPermission('finance:document:update')")
    public CommonResult<Boolean> createOrderMapping(@RequestBody Map<String, Object> reqVO) {
        documentService.createOrderMapping(reqVO);
        return success(true);
    }

    @DeleteMapping("/order-mapping/{mappingId}")
    @Operation(summary = "删除单据订单关联")
    @PreAuthorize("@ss.hasPermission('finance:document:delete')")
    public CommonResult<Boolean> deleteOrderMapping(
            @PathVariable("mappingId") Long mappingId) {
        documentService.deleteOrderMapping(mappingId);
        return success(true);
    }

    @GetMapping("/types")
    @Operation(summary = "获取单据类型列表")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<Map<String, Object>> getDocumentTypes() {
        return success(documentService.getDocumentTypes());
    }

    @GetMapping("/stat")
    @Operation(summary = "获取单据统计")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<Map<String, Object>> getDocumentStat(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(documentService.getDocumentStat(shopId, startDate, endDate));
    }

    @GetMapping("/export")
    @Operation(summary = "导出单据")
    @PreAuthorize("@ss.hasPermission('finance:document:export')")
    public CommonResult<Map<String, Object>> exportDocuments(
            @RequestParam("shopId") Long shopId,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return success(documentService.exportDocuments(shopId, documentType, startDate, endDate));
    }

    @PostMapping("/print")
    @Operation(summary = "打印单据")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<Map<String, Object>> printDocument(
            @RequestParam("documentId") Long documentId,
            @RequestParam(value = "templateId", required = false) Long templateId) {
        return success(documentService.printDocument(documentId, templateId));
    }

    @GetMapping("/print-templates")
    @Operation(summary = "获取打印模板列表")
    @PreAuthorize("@ss.hasPermission('finance:document:query')")
    public CommonResult<Map<String, Object>> getPrintTemplates(
            @RequestParam(value = "documentType", required = false) String documentType) {
        return success(documentService.getPrintTemplates(documentType));
    }

}
