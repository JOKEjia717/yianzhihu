package com.zhihu.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.ItemStatusDto;
import com.zhihu.po.PersonalItem;
import com.zhihu.result.Result;

import java.util.List;

/**
 * <p>
 * 老人私人物品管理表 服务类
 * </p>
 *
 * @author Campione
 * @since 2025-04-21
 */
public interface IPersonalItemService extends IService<PersonalItem> {


    Result<List<PersonalItem>> items(Long aLong);

    Result getItems(String personalItemId);

    Result setStatus(ItemStatusDto itemStatusDto);
}
