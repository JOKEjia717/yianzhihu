package com.zhihu.pulisher;


import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest
public class PublisherTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    void rabbitSendMassages2() throws InterruptedException {
        String toQueues = "yian.queue";
        String message = "向远程队列发送地址成功" ;
        System.out.println(rabbitTemplate);
        rabbitTemplate.convertAndSend(toQueues,message);
    }

    @Test
    void sendMessageObject(){
        Map<String,Object> msg = new HashMap<>();
        msg.put("id",123456);
        msg.put("name","lisi");

        rabbitTemplate.convertAndSend("yian.queue",msg);
    }

//    @Test
//    @RabbitListener(bindings = @QueueBinding(
//            value = @Queue(name = "yian.queue2",durable = "true"),
//            exchange = @Exchange(name = "hmall.direct",type = ExchangeTypes.DIRECT),
//            key = {"red","yellow"}
//    ))
//    public void listenerDirectQueuesMessage2(String msg) throws InterruptedException {
//
//        System.out.println("消费者2收到生产者发送的消息为routing为yellow：" + msg);
//    }
}
