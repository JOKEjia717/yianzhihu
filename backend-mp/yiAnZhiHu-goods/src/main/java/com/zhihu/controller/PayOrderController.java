package com.zhihu.controller;

import com.zhihu.client.ChildrenClient;
import com.zhihu.po.PayOrder;
import com.zhihu.result.Result;
import com.zhihu.service.PayOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/goods/pay/")
public class PayOrderController {

    private final PayOrderService payOrderService;
    private final ChildrenClient childrenClient;

    /**
     * 支付
     * @param id
     * @return
     */
    @PostMapping("ipay")
    public Result pay(@RequestParam String id){
        log.info("支付：{}",id);
        payOrderService.pay(id);
        return Result.success();
    }

    /**
     * 退款
     * @param id
     * @return
     */
    @PutMapping("put")
    public Result put(@RequestParam Long id){
        log.info("根据支付id退款：{}",id);
        payOrderService.put(id);
        return Result.success();
    }

    /**
     * 支付超时
     * @param id
     */
//    @RabbitListener(bindings = @QueueBinding(
//            value = @Queue(name = "delay.queue"),
//            exchange = @Exchange(name = "delay.direct", delayed = "true"),
//            key = "delay"
//    ))
//    public void Timeout(Long id){
//        log.info("支付超时：{}",id);
//        PayOrder payOrder = payOrderService.getById(id);
//        if (payOrder.getStatus() == 1){
//            payOrderService.Timeout(id);
//        }
//    }
}
