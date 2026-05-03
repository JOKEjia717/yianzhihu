package com.zhihu.service;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.ItemDto;
import com.zhihu.Dto.ItemQueryDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Item;
import com.zhihu.query.ItemQuery;
import com.zhihu.result.Result;
import com.zhihu.vo.ItemVo;
import org.springframework.stereotype.Service;

@Service
public interface GoodsService extends IService<Item> {
    /**
     * 新增商品
     * @return
     */
    void insertItemOne(ItemDto item);

    void deleteOne(Long id);

    void updateItemStatus(Long id1, Integer status);

//    Page<Item> searchItems(ItemQueryDto queryDTO);

    ItemVo updateItem(ItemDto itemDto);

    PageDTO<ItemVo> searchItems(ItemQuery itemQuery);

    Result getItemById(String id);

}
