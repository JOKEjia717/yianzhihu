package com.zhihu.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient("children-service")
public interface ChildrenClient {

    @PostMapping("/children/newmoney")
    void money(@RequestBody Integer newMoney);

    @GetMapping("/children/money")
    Integer getMoney();
}