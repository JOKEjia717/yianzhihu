package com.zhihu.contants;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @param
 * @return
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Messages implements Serializable {
    private final String role="user";
    private String content;
}
