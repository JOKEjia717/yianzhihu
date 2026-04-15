package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.Caretaker;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @author BangLin
 * @Date 2025/4/14 16:02
 */
@Mapper
public interface CaretakerMapper extends BaseMapper<Caretaker> {
    
    List<Caretaker> findCaretakerByPage(Map<String, Object> params);

    Long findCaretakerCount();

    int updateCaretakerSelective(
            @Param("filePath") String filePath,
            @Param("phone") String phone,
            @Param("specialty") String specialty,
            @Param("caretakerId") Long caretakerId
    );
}
