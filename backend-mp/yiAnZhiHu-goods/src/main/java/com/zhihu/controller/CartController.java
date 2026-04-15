package com.zhihu.controller;


import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.zhihu.Dto.CartSaveDto;
import com.zhihu.Mapper.CartMapper;
import com.zhihu.config.MybatisConfig;
import com.zhihu.context.BaseContext;
import com.zhihu.po.Cart;
import com.zhihu.result.Result;
import com.zhihu.service.CartService;
import com.zhihu.vo.CartVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.zhihu.constants.RedisConstants.CACHE_CART;
import static com.zhihu.constants.RedisConstants.CACHE_LIST;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/goods/cart/")
public class CartController {

    private final CartService cartService;

    private final StringRedisTemplate redisTemplate;
    private final CartMapper cartMapper;
    /**
     * 添加购物车 添加过后将数据存入redis
     * @param cartSaveDto
     * @return
     */
    @PostMapping("save")
    public Result save(@RequestBody CartSaveDto cartSaveDto){
//        //向redis查看购物中是否存在商品
//        String jsonStr = redisTemplate.opsForValue().get(CACHE_CART + Long.valueOf(cartSaveDto.getItemId()));
//        //判断redis中是否有数据
//        Cart cart1 = JSONUtil.toBean(jsonStr, Cart.class);
//        //判断redis里面的数据是否与要添加的是同一个
//        if (cart1.getItemId().equals(Long.valueOf(cartSaveDto.getItemId()))){
//            return Result.error("商品已经在购物车中");
//        }
//        //没有
//        if (jsonStr == null){
//            //向数据库查
//            //有便将数据返回并存入redis
//            Cart byId = cartService.getById(cartSaveDto.getItemId());
//            //判断数据库中是否有购物车数据
//            if (byId != null){
//                //有，返回提示信息
//                return Result.error("商品已经在购物车中");
//            }
            //有，将数据存入购物车
        //查看购物车是否已经拥有该数据，有就加一
        LambdaQueryWrapper<Cart>wrapper=new LambdaQueryWrapper<Cart>()
                .eq(Cart::getItemId, cartSaveDto.getItemId())
                .eq(Cart::getChildrenId,BaseContext.getCurrentId());
        Cart cart = cartMapper.selectOne(wrapper);
        if(cart!=null){
            UpdateWrapper<Cart> updateWrapper = new UpdateWrapper<Cart>()
                    .setSql("num = num + 1")
                    .in("item_id", cartSaveDto.getItemId())
                    .in("children_id",BaseContext.getCurrentId());
            cartService.update(updateWrapper);
        }else {
            cart = new Cart();
            BeanUtil.copyProperties(cartSaveDto,cart);
            cart.setChildrenId(Long.parseLong(BaseContext.getCurrentId()));
            cart.setCreateTime(LocalDateTime.now());
            //将分装好的数据对象存入redis
            // redisTemplate.opsForValue().set(CACHE_CART + Long.valueOf(cartSaveDto.getItemId()), JSONUtil.toJsonStr(cart));
            //存入mysql数据库
            cartService.save(cart);
        }

        return Result.success("添加成功");
        }
//        //有，
//        log.info("加入购物车：{}",cartSaveDto);
//        Cart cart = new Cart();
//        BeanUtil.copyProperties(cartSaveDto,cart);
//        cart.setChildrenId(Long.parseLong(BaseContext.getCurrentId()));
//        cart.setCreateTime(LocalDateTime.now());
//        //将分装好的数据对象存入redis
//        redisTemplate.opsForValue().set(CACHE_CART + Long.valueOf(cartSaveDto.getItemId()), JSONUtil.toJsonStr(cart));
//        //存入数据库
//        cartService.save(cart);




    /**
     * 商品购物车加一
     * @param id
     * @return
     */
    @PutMapping("add")
    public Result add(@RequestParam Long id){
        String childrenId = BaseContext.getCurrentId();
        log.info("购物车加一：{}",id);
        UpdateWrapper<Cart> wrapper = new UpdateWrapper<Cart>()
                .setSql("num = num + 1")
                .in("item_id", id)
                .in("children_id",childrenId);
        cartService.update(null,wrapper);
        return Result.success();
    }

    /**
     * 商品购物车减一
     * @param id
     * @return
     */
    @PutMapping("less")
    public Result less(@RequestParam Long id){
        log.info("购物车减一：{}",id);
        String childrenId = BaseContext.getCurrentId();
        UpdateWrapper<Cart> wrapper = new UpdateWrapper<Cart>()
                .setSql("num = num - 1")
                .in("item_id", id)
                .in("children_id",childrenId);
        cartService.update(null,wrapper);
        LambdaQueryWrapper<Cart>wrapper1=new LambdaQueryWrapper<Cart>()
                .eq(Cart::getItemId, id)
                .eq(Cart::getChildrenId,childrenId);
        List<Cart> carts = cartMapper.selectList(wrapper1);
        for(Cart cart:carts){
            if(cart.getNum()==0){
                cartService.removeById(cart.getId());
            }
        }
        return Result.success();
    }

    /**
     * 一键清空购物车
     * @return
     */
    @DeleteMapping("delete")
    public Result delete(){
        log.info("一键清空购物车：");
        QueryWrapper<Cart> wrapper = new QueryWrapper<Cart>()
                .in("children_id", Long.parseLong(BaseContext.getCurrentId()));
        //清除redis缓存
        //redisTemplate.delete(CACHE_CART);

        cartService.remove(wrapper);
        return Result.success();
    }

    /**
     * 查询购物车
     * @return
     */
    @GetMapping("get")
    public Result<List<CartVo>> get(){
        //Todo REDIS存取
//        //先向redis查购物车信息
//        String jsonList = redisTemplate.opsForValue().get(CACHE_LIST);
//        //判断是否有数据
//        if (jsonList != null){
//            //有数据，将数据封装返回
//            List<Cart> list = JSONUtil.toList(jsonList, Cart.class);
//            List<CartVo> cartVoList = new ArrayList<>();
//            list.forEach(cart -> {
//                CartVo cartVo = new CartVo();
//                BeanUtil.copyProperties(cart,cartVo);
//                cartVoList.add(cartVo);
//            });
//            return Result.success(cartVoList);
//        }
        //没有数据，向数据库查询
        log.info("查询购物车：{}",BaseContext.getCurrentId());
        QueryWrapper<Cart> wrapper = new QueryWrapper<Cart>()
                .in("children_id", Long.parseLong(BaseContext.getCurrentId()));
        List<Cart> cartList = cartService.list(wrapper);
        //判断购物车是否为空
        if (cartList == null){
            return Result.error("购物车为空");
        }
        redisTemplate.opsForValue().set(CACHE_LIST,JSONUtil.toJsonStr(cartList));
        List<CartVo> cartVoList = new ArrayList<>();
        cartList.forEach(cart -> {
            CartVo cartVo = new CartVo();
            BeanUtil.copyProperties(cart,cartVo);
            cartVoList.add(cartVo);
        });
        return Result.success(cartVoList);
    }
}
