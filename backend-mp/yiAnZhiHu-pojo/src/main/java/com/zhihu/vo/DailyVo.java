package com.zhihu.vo;

import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 17:34
 */
@Data
public class DailyVo {

    private String dailyId;
    /**
     * 老年人的唯一标识符
     * 用于关联老年人信息
     */
    private String elderId;

    /**
     * 看护者的唯一标识符
     * 用于关联看护者信息
     */
    private String caretakerId;

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

    private String childrenId;

    private String deanId;
}
