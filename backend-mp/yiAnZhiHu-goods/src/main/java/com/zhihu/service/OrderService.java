package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.OrderSaveDto;
import com.zhihu.po.Orders;
import com.zhihu.vo.OrderLogisticsVo;
import com.zhihu.vo.PayOrderItemVo;
import com.zhihu.vo.PayOrderVo;

import java.util.List;

public interface OrderService extends IService<Orders> {

    String add(OrderSaveDto orderSaveDto);

    void again(Long id);

    void delete(Long id);

    List<PayOrderVo> ilist();

    PayOrderVo  get(String ids);

    List<OrderLogisticsVo> logistics(String elderId);

//    void shipments(Long id);
//
//    void comment(Long id,String content,String finalFilePath);
}
