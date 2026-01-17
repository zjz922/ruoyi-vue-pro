package cn.flashsaas.module.finance.controller.admin.cost;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.excel.core.util.ExcelUtils;
import cn.flashsaas.framework.operatelog.core.annotations.OperateLog;
import cn.flashsaas.module.finance.controller.admin.cost.vo.*;
import cn.flashsaas.module.finance.convert.cost.ProductCostConvert;
import cn.flashsaas.module.finance.dal.dataobject.cost.ProductCostDO;
import cn.flashsaas.module.finance.dal.dataobject.cost.ProductCostHistoryDO;
import cn.flashsaas.module.finance.service.cost.ProductCostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;
import static cn.flashsaas.framework.operatelog.core.enums.OperateTypeEnum.EXPORT;

/**
 * 管理后台 - 商品成本
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 商品成本")
@RestController
@RequestMapping("/finance/product-cost")
@Validated
public class ProductCostController {

    @Resource
    private ProductCostService productCostService;

    @PostMapping("/create")
    @Operation(summary = "创建商品成本")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:create')")
    public CommonResult<Long> createProductCost(@Valid @RequestBody ProductCostCreateReqVO createReqVO) {
        return success(productCostService.createProductCost(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新商品成本")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:update')")
    public CommonResult<Boolean> updateProductCost(@Valid @RequestBody ProductCostUpdateReqVO updateReqVO) {
        productCostService.updateProductCost(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除商品成本")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:product-cost:delete')")
    public CommonResult<Boolean> deleteProductCost(@RequestParam("id") Long id) {
        productCostService.deleteProductCost(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得商品成本")
    @Parameter(name = "id", description = "编号", required = true, example = "1024")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:query')")
    public CommonResult<ProductCostRespVO> getProductCost(@RequestParam("id") Long id) {
        ProductCostDO productCost = productCostService.getProductCost(id);
        return success(ProductCostConvert.INSTANCE.convert(productCost));
    }

    @GetMapping("/page")
    @Operation(summary = "获得商品成本分页")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:query')")
    public CommonResult<PageResult<ProductCostRespVO>> getProductCostPage(@Valid ProductCostPageReqVO pageVO) {
        PageResult<ProductCostDO> pageResult = productCostService.getProductCostPage(pageVO);
        return success(ProductCostConvert.INSTANCE.convertPage(pageResult));
    }

    @GetMapping("/export-excel")
    @Operation(summary = "导出商品成本 Excel")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:export')")
    @OperateLog(type = EXPORT)
    public void exportProductCostExcel(@Valid ProductCostPageReqVO pageVO,
                                       HttpServletResponse response) throws IOException {
        pageVO.setPageSize(PageResult.PAGE_SIZE_NONE);
        List<ProductCostDO> list = productCostService.getProductCostPage(pageVO).getList();
        // 导出 Excel
        ExcelUtils.write(response, "商品成本.xls", "数据", ProductCostExcelVO.class,
                ProductCostConvert.INSTANCE.convertList02(list));
    }

    @PostMapping("/import")
    @Operation(summary = "导入商品成本")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:import')")
    public CommonResult<ProductCostImportRespVO> importProductCosts(
            @RequestParam("file") MultipartFile file) throws IOException {
        List<ProductCostImportReqVO> list = ExcelUtils.read(file, ProductCostImportReqVO.class);
        return success(productCostService.importProductCosts(list));
    }

    @GetMapping("/history")
    @Operation(summary = "获得商品成本变更历史")
    @Parameter(name = "productCostId", description = "商品成本ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:product-cost:query')")
    public CommonResult<List<ProductCostHistoryRespVO>> getProductCostHistory(
            @RequestParam("productCostId") Long productCostId) {
        List<ProductCostHistoryDO> list = productCostService.getProductCostHistory(productCostId);
        return success(ProductCostConvert.INSTANCE.convertHistoryList(list));
    }

    @GetMapping("/shop-names")
    @Operation(summary = "获得店铺名称列表")
    @PreAuthorize("@ss.hasPermission('finance:product-cost:query')")
    public CommonResult<List<String>> getShopNames() {
        return success(productCostService.getShopNames());
    }

}
