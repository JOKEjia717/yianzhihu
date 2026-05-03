package com.zhihu.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface GoodsMapper extends BaseMapper<Item> {
    List<Item> searchItems(Map<String, Object> params);

    @Update("update item set sold = #{newSold} and stock=#{newNum} where id=#{itemId}")
    void updateSoldAndNum(Integer newSold, Integer newNum,Long itemId);
}
