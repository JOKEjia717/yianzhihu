package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.po.PayOrder;

public interface PayOrderService extends IService<PayOrder> {

    void pay(String id);

    void put(Long id);

    void Timeout(Long id);
}
