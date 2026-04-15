package com.zhihu.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.PersonalItem;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * 老人私人物品管理表 Mapper 接口
 * </p>
 *
 * @author Campione
 * @since 2025-04-21
 */
@Mapper
public interface PersonalItemMapper extends BaseMapper<PersonalItem> {

}
