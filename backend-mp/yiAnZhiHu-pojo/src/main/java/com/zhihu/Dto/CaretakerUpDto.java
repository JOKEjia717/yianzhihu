package com.zhihu.Dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * @description:
 * @author: Campione
 * @date 2025/4/25
 */
@Data
public class CaretakerUpDto {

    private String account;

    private String password;

    private String name;

    private MultipartFile avatar;

    private String phone;

    private String specialty;

}
