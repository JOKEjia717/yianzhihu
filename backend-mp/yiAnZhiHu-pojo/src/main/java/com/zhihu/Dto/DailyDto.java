package com.zhihu.Dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;

/**
 * @author BangLin
 * @Date 2025/4/14 17:32
 */
@Data
public class DailyDto {

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
    @JsonFormat(pattern="yyyy-MM-dd")
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

    private String childrenId;

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

    private String deanId;

}
