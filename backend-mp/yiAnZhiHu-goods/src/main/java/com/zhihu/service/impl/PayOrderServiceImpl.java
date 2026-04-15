package com.zhihu.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Mapper.GoodsMapper;
import com.zhihu.Mapper.OrderDetailMapper;
import com.zhihu.Mapper.OrderMapper;
import com.zhihu.Mapper.PayOrderMapper;
import com.zhihu.client.ChildrenClient;
import com.zhihu.po.Item;
import com.zhihu.po.OrderDetail;
import com.zhihu.po.Orders;
import com.zhihu.po.PayOrder;
import com.zhihu.service.PayOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOrderServiceImpl extends ServiceImpl<PayOrderMapper, PayOrder> implements PayOrderService {

    private final ChildrenClient childrenClient;

    private final GoodsMapper itemMapper;

    private final OrderDetailMapper orderDetailMapper;

    private final OrderMapper orderMapper;

    @Override
    public void pay(String id) {
        PayOrder payOrder = getById(Long.parseLong(id));
        Integer money = childrenClient.getMoney();
        if (money >= payOrder.getAmount()){
            //更新支付状态
            LambdaUpdateWrapper<PayOrder> wrapper = new LambdaUpdateWrapper<PayOrder>()
                    .set(PayOrder::getPaySuccessTime, LocalDateTime.now())
                    .set(PayOrder::getStatus, 3)
                    .set(PayOrder::getUpdateTime, LocalDateTime.now())
                    .in(PayOrder::getId, Long.parseLong(id));
            update(null,wrapper);
            //用户余额扣减
            int newMoney = money - payOrder.getAmount();
            System.out.println("newMoney = " + newMoney);
            childrenClient.money(newMoney);
            //商品库存与销量更新
            String bizOrderNo = payOrder.getBizOrderNo();
//            List<String> list= Arrays.asList(bizOrderNo.split(","));
//            List<Long> ids = list.stream().map(Long::parseLong).collect(Collectors.toList());
            LambdaQueryWrapper<OrderDetail> queryWrapper = new LambdaQueryWrapper<OrderDetail>()
                    .eq(OrderDetail::getOrderId, bizOrderNo);
            List<OrderDetail> orderDetails = orderDetailMapper.selectList(queryWrapper);
            orderDetails.forEach(orderDetail -> {
                Long itemId = Long.valueOf(orderDetail.getItemId());
                Item item = itemMapper.selectById(itemId);
                System.out.println("item = " + item);
                Integer newSold=item.getSold() + orderDetail.getNum();
                Integer newNum=item.getStock() - orderDetail.getNum();
                itemMapper.updateSoldAndNum(newSold,newNum,itemId);
//                LambdaUpdateWrapper<Item> in = new LambdaUpdateWrapper<Item>()
//                        .set(Item::getSold, item.getSold() + orderDetail.getNum())
//                        .set(Item::getStock, item.getStock() - orderDetail.getNum())
//                        .in(Item::getId, itemId);
//                itemMapper.update(null,in);
                //更新单品状态
//                String itemMinuteId = orderDetail.getItemMinuteId();
//                List<String> list1= Arrays.asList(itemMinuteId.split(","));
//                List<Long> ids1 = list1.stream().map(Long::parseLong).collect(Collectors.toList());
//                ids1.forEach(i1 -> {
//
//                });

            });
            //更新订单状态
            LambdaUpdateWrapper<Orders> wrapper1 = new LambdaUpdateWrapper<Orders>()
                    .set(Orders::getStatus, 2)
                    .set(Orders::getPayTime, LocalDateTime.now())
                    .set(Orders::getUpdateTime, LocalDateTime.now())
                    .in(Orders::getId, Long.parseLong(bizOrderNo));
            orderMapper.update(null,wrapper1);
            //如果支付订单包含多个订单id，在支付成功后根据订单id个数生成对应的支付单，以保证后续查询
//            if (ids.size() > 1 ){
//                ids.forEach(i -> {
//                    PayOrder newPayOrder = getById(id);
//                    newPayOrder.setId(null);
//                    newPayOrder.setBizOrderNo(String.valueOf(i));
//                    Orders orders = orderMapper.selectById(i);
//                    newPayOrder.setAmount(orders.getTotalFee());
//                    save(newPayOrder);
//                });
//                removeById(id);
//            }

        }else {
            try {
                throw new Exception("余额不足！");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    @Override
    public void put(Long id) {
        //更新支付表
        LambdaUpdateWrapper<PayOrder> in = new LambdaUpdateWrapper<PayOrder>()
                .set(PayOrder::getStatus, 2)
                .set(PayOrder::getPayCancelTime, LocalDateTime.now())
                .set(PayOrder::getUpdateTime, LocalDateTime.now())
                .in(PayOrder::getId, id);
        update(null,in);
        PayOrder payOrder = getById(id);
        //更新订单表
        LambdaUpdateWrapper<Orders> wrapper = new LambdaUpdateWrapper<Orders>()
                .set(Orders::getStatus, 5)
                .set(Orders::getCloseTime, LocalDateTime.now())
                .set(Orders::getUpdateTime, LocalDateTime.now())
                .in(Orders::getId, Long.valueOf(payOrder.getBizOrderNo()));
        orderMapper.update(null,wrapper);
        //更新用户表
        childrenClient.money(childrenClient.getMoney() + payOrder.getAmount());
//        User user = childrenClient.selectById(payOrder.getBizUserId());
//        LambdaUpdateWrapper<User> in1 = new LambdaUpdateWrapper<User>()
//                .set(User::getMoney, user.getMoney() + payOrder.getAmount())
//                .in(User::getId, user.getId());
//        childrenClient.update(null,in1);
        //更新商品表
        LambdaQueryWrapper<OrderDetail> eq = new LambdaQueryWrapper<OrderDetail>()
                .eq(OrderDetail::getOrderId, Long.valueOf(payOrder.getBizOrderNo()));
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(eq);
        orderDetails.forEach(orderDetail -> {
            Item item = itemMapper.selectById(orderDetail.getItemId());
            LambdaUpdateWrapper<Item> in2 = new LambdaUpdateWrapper<Item>()
                    .set(Item::getStock, item.getStock() + orderDetail.getNum())
                    .set(Item::getSold, item.getSold() - orderDetail.getNum())
                    .in(Item::getId, item.getId());
            itemMapper.update(null,in2);
        });

    }

    @Override
    public void Timeout(Long id) {
        LambdaUpdateWrapper<PayOrder> in = new LambdaUpdateWrapper<PayOrder>()
                .set(PayOrder::getPayOverTime, LocalDateTime.now())
                .set(PayOrder::getUpdateTime, LocalDateTime.now())
                .set(PayOrder::getStatus, 2)
                .in(PayOrder::getId, id);
        update(null,in);
        PayOrder payOrder = getById(id);
        String bizOrderNo = payOrder.getBizOrderNo();
        List<String> list= Arrays.asList(bizOrderNo.split(","));
        List<Long> ids = list.stream().map(Long::parseLong).collect(Collectors.toList());
        ids.forEach(i -> {
            LambdaUpdateWrapper<Orders> wrapper = new LambdaUpdateWrapper<Orders>()
                    .set(Orders::getCloseTime, LocalDateTime.now())
                    .set(Orders::getUpdateTime, LocalDateTime.now())
                    .set(Orders::getStatus, 5)
                    .in(Orders::getId, i);
            orderMapper.update(null,wrapper);
        });
    }
}
