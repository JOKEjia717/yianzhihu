package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import cn.hutool.log.Log;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.ItemDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.Mapper.GoodsMapper;
import com.zhihu.po.Item;
import com.zhihu.query.ItemQuery;
import com.zhihu.result.Result;
import com.zhihu.service.GoodsService;
import com.zhihu.vo.ItemVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.zhihu.constants.RedisConstants.CACHE_ITEM;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper,Item> implements GoodsService {

    private final GoodsMapper goodsMapper;

    private final StringRedisTemplate redisTemplate;

    /**
     * 根据id查询商品
     * @param id
     * @return
     */
    @Override
    public Result getItemById(String id) {
        //1.先从redis中查数据，看是否存在
        String jsonStr = redisTemplate.opsForValue().get(CACHE_ITEM + Long.valueOf(id));
        if (jsonStr == null){
            //不存在，向mysql查询，并将数据存入redis
            Item item1   = this.getById(Long.valueOf(id));
            log.info("查询到的商品数据为：{}",item1);
            if (item1 == null){
                return Result.error("商品不存在");
            }
            //数据库存在
            //存入redis
            redisTemplate.opsForValue().set(CACHE_ITEM + id ,JSONUtil.toJsonStr(item1));
            //返回数据
            ItemVo itemVo = new ItemVo();
            BeanUtil.copyProperties(item1,itemVo);
            return Result.success(itemVo);
        }
        //1.2存在，封装为VO返回
        //将json数据转化为Java对象
        Item item = JSONUtil.toBean(jsonStr, Item.class);
        ItemVo itemVo = new ItemVo();
        BeanUtil.copyProperties(item,itemVo);
        return Result.success(itemVo);
    }
    /**
     * 新增商品
     * @return
     */
    @Override
    public void insertItemOne(ItemDto item) {
        //添加商品的添加时间
        if (item.getCreateTime() == null) {
            item.setCreateTime(LocalDateTime.now());
        }
        //将Dto转化为Po
        Item itemPo = new Item();
        BeanUtil.copyProperties(item,itemPo);
        //将数据存入redis
        //将商品对象转化为json字符串并存入redis
        JSONUtil.toJsonStr(itemPo);
        redisTemplate.opsForValue().set(CACHE_ITEM + Long.valueOf(item.getId()), JSONUtil.toJsonStr(itemPo));
        //将数据存入mysql
        this.save(itemPo);
    }
    /**
     * 根据id删除商品
     */
    @Override
    public void deleteOne(Long id) {
        this.removeById(id);
    }
    /**
     * 根据id更新商品上线状态
     */
    @Override
    public void updateItemStatus(Long id1, Integer status) {
        //根据id查询商品信息
        Item item = this.getById(id1);
        //设置status
        item.setStatus(status);
        //更新商品信息
        this.updateById(item);
        //获取更新后的商品，查看商品状态
    }

//    /**
//     * 模糊分页查询
//     */
//    @Override
//    public Page<Item> searchItems(ItemQueryDto queryDTO) {
//        // 创建分页对象
//        Page<Item> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
//        // 构建查询条件
//        QueryWrapper<Item> wrapper = new QueryWrapper<>();
//        if (StrUtil.isNotBlank(queryDTO.getKeyword())) {
//            wrapper.like("name", queryDTO.getKeyword())    // 名称模糊匹配
//                    .or()
//                    .like("category", queryDTO.getKeyword()) // 分类模糊匹配
//                    .or()
//                    .like("brand", queryDTO.getKeyword()) // 品牌模糊匹配
//                    .or()
//                    .like("brand", queryDTO.getKeyword());  // 品牌模糊匹配
//        }
//        // 执行分页查询
//        return goodsMapper.selectPage(page, wrapper);
//    }
    /**
     * 更新商品信息
     */
    @Override
    public ItemVo updateItem(ItemDto itemDto) {
        Item item = new Item();
        BeanUtil.copyProperties(itemDto,item);
        this.updateById(item);
        ItemVo itemVo = new ItemVo();
        BeanUtil.copyProperties(item,itemVo);
        return itemVo;
    }

    @Override
    public PageDTO<ItemVo> searchItems(ItemQuery itemQuery) {
        Map<String, Object> params = new HashMap<>();
        params.put("page", itemQuery.getPageNo() - 1);
        params.put("size", itemQuery.getPageSize());
        params.put("name", itemQuery.getItemName());
        params.put("minPrice", itemQuery.getMinPrice());
        params.put("maxPrice", itemQuery.getMaxPrice());
        if (itemQuery.getIsAsc()) {
            params.put("isAsc","ASC");
        }else{
            params.put("isAsc","DESC");
        }
        List<Item>items=goodsMapper.searchItems(params);
        PageDTO<ItemVo> res = new PageDTO<>();
        List<ItemVo> itemVos = new ArrayList<>();
        items.forEach(item -> {
            ItemVo itemVo = new ItemVo();
            BeanUtil.copyProperties(item, itemVo);
            itemVo.setId(String.valueOf(item.getId()));
            itemVos.add(itemVo);
        });
        res.setList(itemVos);
        res.setTotal((long) items.size());
        res.setPages((itemQuery.getPageNo()- 1) / items.size());
        return res;
    }


}
