package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.ElderChildrenBind;
import org.apache.ibatis.annotations.Mapper;

/**
 * 老人-子女绑定关系 mapper
 */
@Mapper
public interface ElderChildrenBindMapper extends BaseMapper<ElderChildrenBind> {
}
