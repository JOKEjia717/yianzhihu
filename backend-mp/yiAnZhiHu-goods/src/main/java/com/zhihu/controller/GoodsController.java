package com.zhihu.controller;


import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zhihu.Dto.ItemDto;
import com.zhihu.Dto.ItemQueryDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Item;
import com.zhihu.query.ItemQuery;
import com.zhihu.result.Result;
import com.zhihu.service.GoodsService;
import com.zhihu.vo.ItemVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.params.shadow.com.univocity.parsers.common.iterators.RecordIterator;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.zhihu.constants.RedisConstants.CACHE_ITEM;

@Slf4j
@RestController
@RequestMapping("/goods/")
@RequiredArgsConstructor
public class GoodsController {
    private final GoodsService goodsService;

    private final StringRedisTemplate redisTemplate;

    /**
     * 根据id查询物品信息
     *
     */
    @GetMapping("select/{id}")
    public Result<ItemVo> selectOne(@PathVariable("id") String id){

        Result itemVo = goodsService.getItemById(id);

        if (itemVo == null){
            return Result.error("商品不存在");
        }
        return itemVo;
    }
    /**
     * 新增商品，将新增的数据先存入数据库，在存入redis
     * @return
     */
    @PostMapping("insert")
    public Result insertItem(@RequestBody ItemDto item){

        //先在redis里面看是否存在
        String s = redisTemplate.opsForValue().get(CACHE_ITEM + Long.valueOf(item.getId()));
        //存在，不在添加
        if (!s.isEmpty()){
        return Result.error("商品已存在");
        }
        //不存在，添加
        goodsService.insertItemOne(item);
        return Result.success("添加成功");
    }
    /**
     * 根据id删除商品
     */
    @DeleteMapping("delete/{id}")
    public Result deleteOne(@PathVariable("id") String id){
        Item item = goodsService.getById(Long.valueOf(id));
        if(item == null)
            return Result.error("商品不存在");
        goodsService.deleteOne(Long.valueOf(id));
        return Result.success("删除成功");
    }
    /**
     * 根据id更新商品上线状态
     */
    @PostMapping("status/{id}/{status}")
    public Result updateStatus(@PathVariable("id") String id, @PathVariable("status") Integer status){
        Long id1 = Long.valueOf(id);

        goodsService.updateItemStatus(id1,status);
        return Result.success("更新成功");
    }

//    /**
//     * 模糊分页查询
//     */
//    @GetMapping("search")
//    public Result<Page<Item>> searchItems(@RequestBody ItemQueryDto queryDTO) {
//        Page<Item> result = goodsService.searchItems(queryDTO);
//        return Result.success(result);
//    }
    /**
     * 模糊分页查询
     */
    @GetMapping("search")
    public Result<PageDTO<ItemVo>> searchItems(ItemQuery itemQuery) {
        PageDTO<ItemVo> result = goodsService.searchItems(itemQuery);
        return Result.success(result);
    }
    /**
     * 更新商品信息
     */
    @PostMapping("update")
    public Result<ItemVo> updateItem(@RequestBody ItemDto itemDto){
        ItemVo item = goodsService.updateItem(itemDto);
        return Result.success(item);
    }
}
