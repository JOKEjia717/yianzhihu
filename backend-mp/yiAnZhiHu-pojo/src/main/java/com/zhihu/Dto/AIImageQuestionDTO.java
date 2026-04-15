package com.zhihu.Dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 * @param
 * @return
 */
@Data
public class AIImageQuestionDTO implements Serializable {
    private MultipartFile file;
    private String msg;
}
