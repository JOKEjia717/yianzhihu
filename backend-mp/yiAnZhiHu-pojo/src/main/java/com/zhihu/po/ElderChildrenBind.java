package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 老人和子女的多对多绑定关系表
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("elder_children_bind")
public class ElderChildrenBind implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "elder_children_bind_id", type = IdType.ASSIGN_ID)
    private Long elderChildrenBindId;

    private Long elderId;

    private Long childrenId;

    private LocalDateTime createdTime;
}
