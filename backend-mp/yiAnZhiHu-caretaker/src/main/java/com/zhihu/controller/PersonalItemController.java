package com.zhihu.controller;


import com.zhihu.Dto.ItemStatusDto;
import com.zhihu.po.PersonalItem;
import com.zhihu.result.Result;
import com.zhihu.service.IPersonalItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 老人私人物品管理表 前端控制器
 * </p>
 *
 * @author Campione
 * @since 2025-04-21
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/personal-item")
public class PersonalItemController {
    private final IPersonalItemService personalItemService;

    /**
     * 根据老人id查询对应的物品信息
     * @param elderId
     * @return
     */
    @GetMapping("items/{elderId}")
    public Result<List<PersonalItem>> items(@PathVariable String elderId){
        return personalItemService.items(Long.valueOf(elderId));
    }

    /**
     * 根据物品id查询物品信息
     * @param personalItemId
     * @return
     */
    @GetMapping("items")
    public Result getItems(@RequestParam String personalItemId){
        return personalItemService.getItems(personalItemId);
    }

    @PostMapping("status")
    public Result setStatus(@RequestBody ItemStatusDto itemStatusDto){
        return  personalItemService.setStatus(itemStatusDto);
    }

}
