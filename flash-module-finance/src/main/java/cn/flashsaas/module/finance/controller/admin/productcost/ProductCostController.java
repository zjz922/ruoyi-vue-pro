package cn.flashsaas.module.finance.controller.admin.productcost;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.common.util.object.BeanUtils;
import cn.flashsaas.module.finance.controller.admin.productcost.vo.ProductCostCreateReqVO;
import cn.flashsaas.module.finance.controller.admin.productcost.vo.ProductCostPageReqVO;
import cn.flashsaas.module.finance.controller.admin.productcost.vo.ProductCostRespVO;
import cn.flashsaas.module.finance.controller.admin.productcost.vo.ProductCostUpdateReqVO;
import cn.flashsaas.module.finance.dal.dataobject.ProductCostDO;
import cn.flashsaas.module.finance.service.ProductCostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 商品成本管理 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 商品成本管理")
@RestController
@RequestMapping("/finance/product-cost")
@Validated
public class ProductCostController {

    @Resource
    private ProductCostService productCostService;

    @PostMapping
    @Operation(summary = "创建商品成本")
    @PreAuthorize("@ss.hasPermission('finance:productCost:create')")
    public CommonResult<Long> createProductCost(@Valid @RequestBody ProductCostCreateReqVO createReqVO) {
        return success(productCostService.createProductCost(createReqVO));
    }

    @PutMapping
    @Operation(summary = "更新商品成本")
    @PreAuthorize("@ss.hasPermission('finance:productCost:update')")
    public CommonResult<Boolean> updateProductCost(@Valid @RequestBody ProductCostUpdateReqVO updateReqVO) {
        productCostService.updateProductCost(updateReqVO);
        return success(true);
    }

    @DeleteMapping
    @Operation(summary = "删除商品成本")
    @Parameter(name = "id", description = "商品成本ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:productCost:delete')")
    public CommonResult<Boolean> deleteProductCost(@RequestParam("id") Long id) {
        productCostService.deleteProductCost(id);
        return success(true);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取商品成本")
    @Parameter(name = "id", description = "商品成本ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:productCost:query')")
    public CommonResult<ProductCostRespVO> getProductCost(@PathVariable("id") Long id) {
        ProductCostDO productCost = productCostService.getProductCost(id);
        return success(BeanUtils.toBean(productCost, ProductCostRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获取商品成本分页")
    @PreAuthorize("@ss.hasPermission('finance:productCost:query')")
    public CommonResult<PageResult<ProductCostRespVO>> getProductCostPage(@Valid ProductCostPageReqVO pageReqVO) {
        PageResult<ProductCostDO> pageResult = productCostService.getProductCostPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, ProductCostRespVO.class));
    }

}
