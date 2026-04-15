package com.zhihu.constants;

import javax.swing.*;

/**
 * @author : YiMing
 * @description :redis关键字
 * @createDate : 2025/3/3 17:14
 */
public class RedisConstants {
     public static final String CHILDREN_LOGIN_CACHE ="children:";

     public static final String ADMIN_LOGIN_CACHE="admin:";

     public static final String DEAN_LOGIN_CACHE="dean:";

     public static final String CARETAKER_LOGIN_CACHE="caretaker:";

     public static final String CACHE_ITEM="cache:item:";

     public static final String CACHE_CART="cache:cart:";

     public static final String CACHE_LIST="cache:list:";
     /**
      * 30天
      */
     public static final Long LOGIN_USER_TTL = 2592000L;

     public static final Long MAX_LOCK_WAIT_SECONDS = 10L;
     public static final String ACTIVITY_APPROVE_CACHE_PREFIX="activity:approve:";
     public static final String DEEPSEEK_API_KEY = "sk-8f3f235dd172417eb863b9b7d50ee53f";

     public static final String DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
}
