package com.zhihu.contants;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @param
 * @return
 */
@lombok.Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Data implements Serializable {
    private String model;
    private List<Messages> messages;
//    private final String stream="True";
}
