package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.OrderDto;
import com.zhihu.Dto.OrderSaveDto;
import com.zhihu.Mapper.*;
import com.zhihu.client.DeanClient;
import com.zhihu.context.BaseContext;
import com.zhihu.po.OrderDetail;
import com.zhihu.po.OrderLogistics;
import com.zhihu.po.Orders;
import com.zhihu.po.PayOrder;
import com.zhihu.service.OrderService;
import com.zhihu.vo.OrderLogisticsVo;
import com.zhihu.vo.PayOrderItemVo;
import com.zhihu.vo.PayOrderVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Orders> implements OrderService {

    private final OrderDetailMapper orderDetailMapper;

    private final OrderMapper orderMapper;

    private final PayOrderMapper payOrderMapper;


    private final OrderLogisticsMapper orderLogisticsMapper;

    private final DeanClient deanClient;

    private final GoodsMapper itemMapper;


    @Override
    @Transactional
    public String add(OrderSaveDto orderSaveDto) {
        List<OrderDto> orderDtolist = orderSaveDto.getOrderDtolist();
        int price = 0;
        Orders order = new Orders();
        for (OrderDto orderDto : orderDtolist) {
            price += orderDto.getTotalPrice();
        }
        //存入order表
        order.setTotalPrice(price);
        order.setPaymentType(1);
        order.setChildrenId(Long.parseLong(BaseContext.getCurrentId()));
        order.setStatus(1);
        order.setCreateTime(LocalDateTime.now());
        save(order);
        for (OrderDto orderDto : orderDtolist) {
            //存入orderdetail表
            OrderDetail orderDetail = new OrderDetail();
            BeanUtil.copyProperties(orderDto,orderDetail);
//            List<String> collect = ids.stream().map(String::valueOf).collect(Collectors.toList());
//            String id = String.join(",", collect);
            orderDetail.setPrice(orderDto.getTotalPrice());
            orderDetail.setOrderId(order.getId());
            orderDetail.setCreateTime(LocalDateTime.now());
            orderDetailMapper.insert(orderDetail);
        }
        //提交支付单，此时未支付
//        List<String> collect = orderIds.stream().map(String::valueOf).collect(Collectors.toList());
//        String bizOrderNo = String.join(",", collect);
        PayOrder payOrder = new PayOrder();
        payOrder.setBizOrderNo(String.valueOf(order.getId()));
        payOrder.setAmount(price);
        payOrder.setBizChildrenId(Long.parseLong(BaseContext.getCurrentId()));
        payOrder.setPayType(1);
        payOrder.setStatus(1);
        LocalDateTime now = LocalDateTime.now();
        payOrder.setCreateTime(now);
        payOrder.setPayOverTime(now.plusMinutes(15));
        payOrderMapper.insert(payOrder);
//        // 1.创建消息
//        Long message = payOrder.getId();
//        // 2.发送消息，利用消息后置处理器添加消息头
//        rabbitTemplate.convertAndSend("delay.direct", "delay", message, new MessagePostProcessor() {
//            @Override
//            public Message postProcessMessage(Message message) throws AmqpException {
//                // 添加延迟消息属性
//                message.getMessageProperties().setHeader("x-delay",150000);
//                return message;
//            }
//        });
//        Result<List<ElderVo>> listResult = deanClient.getByChildrenId();
//        ElderVo elderVo = listResult.getData().get(0);

        OrderLogistics orderLogistics = new OrderLogistics();
        orderLogistics.setOrderId(order.getId());
        orderLogistics.setChildrenId(Long.parseLong(BaseContext.getCurrentId()));
        orderLogistics.setElderId(Long.parseLong(orderSaveDto.getElderId()));
        orderLogistics.setLogisticsCompany("京东");
        orderLogistics.setContact(orderSaveDto.getElderName());
        orderLogistics.setMobile(orderSaveDto.getChildrenPhone());
        orderLogistics.setCreateTime(LocalDateTime.now());
        orderLogisticsMapper.insert(orderLogistics);
        return String.valueOf(payOrder.getId());
    }

    @Override
    @Transactional
    public void again(Long id) {
        Orders order = orderMapper.selectById(id);
        order.setId(null);
        order.setStatus(1);
        order.setCreateTime(LocalDateTime.now());
        save(order);
        LambdaQueryWrapper<OrderDetail> wrapper = new LambdaQueryWrapper<OrderDetail>()
                .eq(OrderDetail::getOrderId, id);
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(wrapper);
        for (OrderDetail orderDetail : orderDetails) {
            orderDetail.setId(null);
            orderDetail.setOrderId(order.getId());
            orderDetail.setCreateTime(LocalDateTime.now());
            orderDetailMapper.insert(orderDetail);
        }
        LambdaQueryWrapper<PayOrder> eq = new LambdaQueryWrapper<PayOrder>()
                .eq(PayOrder::getBizOrderNo, id);
        PayOrder payOrder = payOrderMapper.selectOne(eq);

        //提交支付单，此时未支付
        payOrder.setId(null);
        payOrder.setBizOrderNo(String.valueOf(order.getId()));
        payOrder.setStatus(1);
        LocalDateTime now = LocalDateTime.now();
        payOrder.setCreateTime(now);
        payOrder.setPayOverTime(now.plusMinutes(15));
//        PayOrder payOrder = new PayOrder();
//        payOrder.setBizOrderNo(String.valueOf(order.getId()));
//        payOrder.setAmount(orderDetail.getPrice());
//        payOrder.setBizUserId(Long.parseLong(BaseContext.getCurrentId()));
//        payOrder.setPayType(5);
//        payOrder.setStatus(1);
//        LocalDateTime now = LocalDateTime.now();
//        payOrder.setCreateTime(now);
//        payOrder.setCreater(Long.parseLong(BaseContext.getCurrentId()));
//        payOrder.setPayOverTime(now.plusMinutes(15));
        payOrderMapper.insert(payOrder);

    }

    @Override
    public void delete(Long id) {
        LambdaUpdateWrapper<Orders> wrapper = new LambdaUpdateWrapper<Orders>()
                .set(Orders::getStatus, 5)
                .set(Orders::getCloseTime, LocalDateTime.now())
                .set(Orders::getUpdateTime, LocalDateTime.now())
                .in(Orders::getId, id);
        update(null,wrapper);
        //软删除pay
        LambdaUpdateWrapper<PayOrder> updateWrapper = new LambdaUpdateWrapper<PayOrder>()
                .set(PayOrder::getStatus, 2)
                .set(PayOrder::getPayCancelTime, LocalDateTime.now())
                .set(PayOrder::getUpdateTime, LocalDateTime.now())
                .set(PayOrder::getIsDelete, 1)
                .in(PayOrder::getBizOrderNo, id);
        payOrderMapper.update(null,updateWrapper);
    }

    @Override
    public List<PayOrderVo> ilist() {
        //根据订单状态转化为支付状态
//        int paystatus = 1;
//        if (status > 1){
//            if (status == 5){
//                paystatus = 2;
//            }else {
//                paystatus = 3;
//            }
//        }
        //构建支付单查询条件
        LambdaQueryWrapper<PayOrder> queryWrapper = new LambdaQueryWrapper<PayOrder>()
                //.eq(PayOrder::getStatus, paystatus)
                .eq(PayOrder::getBizChildrenId,Long.parseLong(BaseContext.getCurrentId()));
        //拿到对应状态的支付数据
        List<PayOrder> payOrders = payOrderMapper.selectList(queryWrapper);
        List<PayOrderVo> payOrderVoList = new ArrayList<>();
        //为每个支付单赋值返回
        payOrders.forEach(payOrder -> {
            //拿到支付单包含的订单id，可能包含多个订单id
//            String bizOrderNo = payOrder.getBizOrderNo();
//            List<String> list= Arrays.asList(bizOrderNo.split(","));
//            List<Long> ids = list.stream().map(Long::parseLong).collect(Collectors.toList());
            PayOrderVo payOrderVo = new PayOrderVo();
            BeanUtil.copyProperties(payOrder,payOrderVo);
            //List<Orders> orders = new ArrayList<>();
            //如果查询未支付需要返回超时时间
            payOrderVo.setOverTime(payOrder.getPayOverTime());
//            if (payOrder.getStatus() == 1){
//                payOrderVo.setOverTime(payOrder.getPayOverTime());
//            }
//            LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<Orders>()
//                        .eq(Orders::getId, Long.parseLong(payOrder.getBizOrderNo()));
//                Orders order = getOne(wrapper);
//                BeanUtil.copyProperties(order, payOrderVo);
//            //将支付单包含的订单详细全部拿到
//            for (Long id : ids) {
//                LambdaQueryWrapper<Orders> wrapper = new LambdaQueryWrapper<Orders>()
//                        .eq(Orders::getId, id);
//                Orders order = getOne(wrapper);
//                orders.add(order);
//            }
            LambdaQueryWrapper<OrderDetail> eq = new LambdaQueryWrapper<OrderDetail>()
                    .eq(OrderDetail::getOrderId, Long.parseLong(payOrder.getBizOrderNo()));
            List<OrderDetail> orderDetails = orderDetailMapper.selectList(eq);
            List<PayOrderItemVo> payOrderItemVoList = new ArrayList<>();
            for (OrderDetail orderDetail : orderDetails) {
                PayOrderItemVo payOrderItemVo = new PayOrderItemVo();
                BeanUtil.copyProperties(orderDetail, payOrderItemVo);
                payOrderItemVo.setChildrenId(BaseContext.getCurrentId());
                payOrderItemVoList.add(payOrderItemVo);
            }

//            //将每个订单必要的信息返回
//            orders.forEach(order -> {
//                PayOrderItemVo payOrderItemVo = new PayOrderItemVo();
//                payOrderItemVo.setUserId(order.getUserId());
//                //拿到订单表对应的订单详情表
//                LambdaQueryWrapper<OrderDetail> wrapper = new LambdaQueryWrapper<OrderDetail>()
//                        .eq(OrderDetail::getOrderId, order.getId());
//                OrderDetail orderDetail = orderDetailMapper.selectOne(wrapper);
//                //从订单详情表获取必要的订单信息
//                BeanUtil.copyProperties(orderDetail,payOrderItemVo);
//                payOrderItemVo.setItemPrice(order.getItemPrice());
//                payOrderItemVo.setItemId(orderDetail.getItemId());
//                payOrderItemVo.setStatus(status);
//                //从订单详情表拿到该订单包含的单品id
//                String itemMinuteId = orderDetail.getItemMinuteId();
//                List<String> list1= Arrays.asList(itemMinuteId.split(","));
//                List<Long> ids2 = list1.stream().map(Long::parseLong).collect(Collectors.toList());
//                List<itemMinuteVo> itemMinuteVoList = new ArrayList<>();
//                //查询对应的单品并且将信息返回
//                ids2.forEach(id -> {
//                    ItemMinute itemMinute = itemMinuteMapper.selectById(id);
//                    itemMinuteVo itemMinuteVo = new itemMinuteVo();
//                    BeanUtil.copyProperties(itemMinute,itemMinuteVo);
//                    itemMinuteVoList.add(itemMinuteVo);
//                });
//                payOrderItemVo.setItemMinuteVoList(itemMinuteVoList);
//                payOrderItemVoList.add(payOrderItemVo);
//
//            });
            payOrderVo.setPayOrderItemVoList(payOrderItemVoList);
            payOrderVoList.add(payOrderVo);
        });
        return payOrderVoList;
    }

    @Override
    public PayOrderVo get(String strId) {
//        List<String> list= Arrays.asList(strId.split(","));
//        List<Long> ids = list.stream().map(Long::parseLong).collect(Collectors.toList());
        PayOrderVo payOrderVo = new PayOrderVo();
        LambdaQueryWrapper<PayOrder> eq = new LambdaQueryWrapper<PayOrder>()
                .eq(PayOrder::getBizOrderNo, strId);
        PayOrder payOrder = payOrderMapper.selectOne(eq);
        BeanUtil.copyProperties(payOrder, payOrderVo);
        LambdaQueryWrapper<OrderDetail> wrapper = new LambdaQueryWrapper<OrderDetail>()
                .eq(OrderDetail::getOrderId, Long.valueOf(strId));
        List<OrderDetail> orderDetails = orderDetailMapper.selectList(wrapper);
        List<PayOrderItemVo> payOrderItemVoList = new ArrayList<>();
        orderDetails.forEach(orderDetail -> {
            PayOrderItemVo payOrderItemVo = new PayOrderItemVo();
            BeanUtil.copyProperties(orderDetail, payOrderItemVo);
            payOrderItemVo.setChildrenId(BaseContext.getCurrentId());
            payOrderItemVoList.add(payOrderItemVo);
        });
        payOrderVo.setPayOrderItemVoList(payOrderItemVoList);
//        ids.forEach(id -> {
//
//            PayOrderItemVo payOrderItemVo = new PayOrderItemVo();
//            BeanUtil.copyProperties(orderDetail,payOrderItemVo);
//            BeanUtil.copyProperties(orders,payOrderItemVo);
//            //从订单详情表拿到该订单包含的单品id
//            String itemMinuteId = orderDetail.getItemMinuteId();
//            List<String> list1= Arrays.asList(itemMinuteId.split(","));
//            List<Long> ids2 = list1.stream().map(Long::parseLong).collect(Collectors.toList());
//            List<itemMinuteVo> itemMinuteVoList = new ArrayList<>();
//            //查询对应的单品并且将信息返回
//            ids2.forEach(id1 -> {
//                ItemMinute itemMinute = itemMinuteMapper.selectById(id1);
//                itemMinuteVo itemMinuteVo = new itemMinuteVo();
//                BeanUtil.copyProperties(itemMinute,itemMinuteVo);
//                itemMinuteVoList.add(itemMinuteVo);
//            });
//            payOrderItemVo.setItemMinuteVoList(itemMinuteVoList);
//            payOrderItemVoList.add(payOrderItemVo);
//        });
        return payOrderVo;
    }

    @Override
    public List<OrderLogisticsVo> logistics(String elderId) {
        LambdaQueryWrapper<OrderLogistics> eq = new LambdaQueryWrapper<OrderLogistics>()
                .eq(OrderLogistics::getElderId, Long.parseLong(elderId));
        List<OrderLogistics> orderLogisticsList = orderLogisticsMapper.selectList(eq);
        List<OrderLogisticsVo> orderLogisticsVos = new ArrayList<>();
        orderLogisticsList.forEach(orderLogistics -> {
            OrderLogisticsVo orderLogisticsVo = new OrderLogisticsVo();
            BeanUtil.copyProperties(orderLogistics, orderLogisticsVo);
            orderLogisticsVo.setLogisticsId(String.valueOf(orderLogistics.getLogisticsId()));
            orderLogisticsVo.setOrderId(String.valueOf(orderLogistics.getOrderId()));
            orderLogisticsVo.setChildrenId(String.valueOf(orderLogistics.getChildrenId()));
            orderLogisticsVo.setElderId(String.valueOf(orderLogistics.getElderId()));
            orderLogisticsVos.add(orderLogisticsVo);
        });
        return orderLogisticsVos;
    }

//    @Override
//    @Transactional
//    public void shipments(Long id) {
//        System.out.println("id = " + id);
//        Orders orders = getById(id);
//        LambdaQueryWrapper<Address> eq = new LambdaQueryWrapper<Address>()
//                .eq(Address::getUserId, orders.getUserId())
//                .eq(Address::getIsDefault, 1);
//        Address address = addressMapper.selectOne(eq);
//        OrderLogistics orderLogistics = new OrderLogistics();
//        BeanUtil.copyProperties(address,orderLogistics);
//        orderLogistics.setOrderId(id);
//        orderLogistics.setLogisticsCompany("顺丰");
//        orderLogistics.setLogisticsNumber(StpUtil.getLoginIdAsString());
//        LocalDateTime now = LocalDateTime.now();
//        orderLogistics.setCreateTime(now);
//        orderLogisticsMapper.insert(orderLogistics);
//        LambdaUpdateWrapper<Orders> in = new LambdaUpdateWrapper<Orders>()
//                .set(Orders::getStatus, 3)
//                .set(Orders::getConsignTime, now)
//                .set(Orders::getUpdateTime, now)
//                .in(Orders::getId, id);
//        update(null,in);
//
//    }

//    @Override
//    @Transactional
//    public void comment(Long id,String content,String finalFilePath) {
//        LambdaUpdateWrapper<Orders> in = new LambdaUpdateWrapper<Orders>()
//                .set(Orders::getCommentTime, LocalDateTime.now())
//                .set(Orders::getUpdateTime, LocalDateTime.now())
//                .set(Orders::getStatus,6)
//                .in(Orders::getId, id);
//        update(null,in);
//        LambdaQueryWrapper<OrderDetail> eq = new LambdaQueryWrapper<OrderDetail>()
//                .eq(OrderDetail::getOrderId, id);
//        OrderDetail orderDetail = orderDetailMapper.selectOne(eq);
//        Comment comment = new Comment();
//        comment.setItemId(orderDetail.getItemId());
//        comment.setImage(finalFilePath);
//        comment.setCreateTime(LocalDateTime.now());
//        comment.setUserId(StpUtil.getLoginIdAsLong());
//        comment.setContent(content);
//        commentMapper.insert(comment);
//        Item item = itemMapper.selectById(orderDetail.getItemId());
//        LambdaUpdateWrapper<Item> wrapper = new LambdaUpdateWrapper<Item>()
//                .set(Item::getCommentCount, item.getCommentCount() + 1)
//                .set(Item::getUpdateTime, LocalDateTime.now())
//                .in(Item::getId, orderDetail.getItemId());
//        itemMapper.update(null,wrapper);
//    }
}
