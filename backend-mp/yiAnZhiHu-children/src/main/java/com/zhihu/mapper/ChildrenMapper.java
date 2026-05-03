package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.Children;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/3/3 14:24
 */
@Mapper
public interface ChildrenMapper extends BaseMapper<Children> {
    @Update("update children set money=#{newMoney} where children_id=#{currentId}")
    void updateMoney(String currentId,Integer newMoney);
}
