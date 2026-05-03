package com.zhihu.service.impl;


import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.conditions.update.LambdaUpdateChainWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.ItemStatusDto;
import com.zhihu.mapper.PersonalItemMapper;
import com.zhihu.po.PersonalItem;
import com.zhihu.result.Result;
import com.zhihu.service.IPersonalItemService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 老人私人物品管理表 服务实现类
 * </p>
 *
 * @author Campione
 * @since 2025-04-21
 */
@Service
public class PersonalItemServiceImpl extends ServiceImpl<PersonalItemMapper, PersonalItem> implements IPersonalItemService {
    /**
     * 根据老人id查询对应的物品信息
     * @param elderId
     * @return
     */
    @Override
    public Result<List<PersonalItem>> items(Long elderId) {
        List<PersonalItem> items = lambdaQuery().eq(PersonalItem::getElderId, elderId).list();
        return !items.isEmpty() ? Result.success(items):Result.error("未找到数据");
    }

    /**
     * 根据物品id查询物品信息
     * @param personalItemId
     * @return
     */
    @Override
    public Result getItems(String personalItemId) {
        PersonalItem item = lambdaQuery().eq(PersonalItem::getPersonalItemId, personalItemId).one();
        return !(item ==null) ? Result.success(item):Result.error("物品信息为空");
    }

    /**
     * 更具物品id修改物品状态
     * @param itemStatusDto
     * @return
     */
    @Override
    public Result setStatus(ItemStatusDto itemStatusDto) {
        boolean success = lambdaUpdate()
                .eq(PersonalItem::getPersonalItemId, itemStatusDto.getPersonalItemId())
                .set(PersonalItem::getStatus, itemStatusDto.getStatus()).update();
        return success? Result.success():Result.error("修改失败或状态以为:"+itemStatusDto.getStatus());
    }


}
