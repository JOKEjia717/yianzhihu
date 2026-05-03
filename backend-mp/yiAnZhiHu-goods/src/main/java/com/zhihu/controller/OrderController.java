package com.zhihu.controller;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.zhihu.Dto.OrderSaveDto;
import com.zhihu.result.Result;
import com.zhihu.service.OrderService;
import com.zhihu.vo.OrderLogisticsVo;
import com.zhihu.vo.PayOrderVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import com.zhihu.po.Orders;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/goods/order/")
public class OrderController {

    private final OrderService orderService;

    /**
     * 下单
     * @param orderSaveDto
     * @return
     */
    @PostMapping("add")
    public Result<String> add(@RequestBody OrderSaveDto orderSaveDto){
        log.info("下单：{}",orderSaveDto);
        String orderId=orderService.add(orderSaveDto);
        return Result.success(orderId);
    }

    /**
     * 根据订单id再来一单
     * @param id
     * @return
     */
    @PostMapping("again")
    public Result again(@RequestParam Long id){
        log.info("再来一单：{}",id);
        orderService.again(id);
        return Result.success();
    }

    /**
     * 撤销订单
     * @param id
     * @return
     */
    @PutMapping("delete")
    public Result delete(@RequestParam Long id){
        log.info("撤销订单：{}",id);
        orderService.delete(id);
        return Result.success();
    }

    /**
     * 批量查询订单
     * @param
     * @return
     */
    @GetMapping("list")
    public Result<List<PayOrderVo>> list(/*@RequestParam Integer status*/){
        log.info("批量查询订单:{}"/*status*/);
        List<PayOrderVo> payOrderVo = orderService.ilist();
        return Result.success(payOrderVo);
    }

    /**
     * 根据订单id查询订单详情
     * @param ids
     * @return
     */
    @GetMapping("get")
    public Result<PayOrderVo> get(@RequestParam String ids){
        log.info("根据订单id查询订单详情：{}",ids);
        PayOrderVo payOrderVo= orderService.get(ids);
        return Result.success(payOrderVo);
    }

//    /**
//     * 根据订单id发货
//     * @param id
//     * @return
//     */
//    @PostMapping("shipments")
//    public Result shipments(@RequestParam Long id){
//        log.info("根据支付id发货:{}",id);
//        orderService.shipments(id);
//        return Result.success();
//    }

    /**
     * 根据订单id确认收货
     * @param id
     * @return
     */
    @PutMapping("receive")
    public Result receive(@RequestParam Long id){
        log.info("根据订单id确认收货:{}",id);
        LambdaUpdateWrapper<Orders> in = new LambdaUpdateWrapper<Orders>()
                .set(Orders::getStatus, 4)
                .set(Orders::getEndTime, LocalDateTime.now())
                .in(Orders::getId, id);
        orderService.update(null,in);
        return Result.success();
    }

//    /**
//     * 根据订单id评论
//     * @param id
//     * @return
//     */
//    @PostMapping("comment")
//    public Result comment(@RequestParam Long id,@RequestParam String content/*,@RequestParam List<MultipartFile> image*/){
////        String filePath="";
////        String finalFilePath="";
////        for (MultipartFile file1:image){
////            try {
////                //原始文件名
////                String originalFilename = file1.getOriginalFilename();
////                String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
////                String objectname = UUID.randomUUID().toString() + extention;
////                filePath = aliOssUtil.upload(file1.getBytes(), objectname);
////                finalFilePath+=filePath+",";
////            }catch (Exception e){
////                throw new UpLoadFailedException("文件上传失败！");
////            }
////        }
//        String finalFilePath="这是图片";
//        log.info("根据订单id评论:{},{},{}",id,content,finalFilePath);
//        orderService.comment(id,content,finalFilePath);
//        return Result.success();
//    }

    /**
     * 根据订单id超时订单自动取消
     * @param id
     * @return
     */
    @PutMapping("put")
    public Result put(@RequestParam Long id){
        log.info("超时订单自动取消：{}",id);
        delete(id);
        return Result.success();
    }

    @GetMapping("logistics")
    public Result<List<OrderLogisticsVo>> logistics (@RequestParam String elderId) {
        log.info("批量查询老人的物流信息");
        List<OrderLogisticsVo> orderLogisticsVos = orderService.logistics(elderId);
        return Result.success(orderLogisticsVos);
    }

}
