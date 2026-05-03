package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 17:27
 */
@Data
public class Daily {

    /**
     * 日报信息的唯一标识符
     * 使用 ASSIGN_ID 类型自动生成 ID
     */
    @TableId(type= IdType.ASSIGN_ID)
    private Long dailyId;

    /**
     * 老年人的唯一标识符
     * 用于关联老年人信息
     */
    private Long elderId;

    /**
     * 看护者的唯一标识符
     * 用于关联看护者信息
     */
    private Long caretakerId;

    /**
     * 日报的日期
     * 记录日报所属的具体日期
     */
    private LocalDate date;

    /**
     * 早餐照片的链接或路径
     * 用于记录和展示老年人的早餐情况
     */
    private String breakfastPhotos;

    /**
     * 午餐照片的链接或路径
     * 用于记录和展示老年人的午餐情况
     */
    private String lunchPhotos;

    /**
     * 晚餐照片的链接或路径
     * 用于记录和展示老年人的晚餐情况
     */
    private String dinnerPhotos;

    /**
     * 住宿照片的链接或路径
     * 用于记录和展示老年人的住宿环境
     */
    private String lodgingPhotos;

    /**
     * 衣着照片的链接或路径
     * 用于记录和展示老年人的衣着情况
     */
    private String clothingPhotos;

    /**
     * AI 评论
     * 记录 AI 对日报内容的分析和评论
     */
    private String aiComment;

    private Long childrenId;

    private Long deanId;
}
