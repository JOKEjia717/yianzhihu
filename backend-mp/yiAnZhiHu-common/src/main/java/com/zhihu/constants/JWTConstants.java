package com.zhihu.constants;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/6 16:30
 */
public class JWTConstants {
    /**
     * 用户密钥
     */
    public static final String CHILDREN_SecretKey ="children";
    /**
     * 管理员密钥
     */
    public static final String ADMIN_SecretKey="admin";
    /**
     * 院长身份密钥
     */
    public static final String DEAN_SecretKey="dean";

    public static final String CARETAKER_SecretKey="caretaker";
    /**
     * 用户标识
     */
    public static final String CHILDREN_ID ="children_id";
    /**
     * 管理员标识
     */
    public static final String ADMIN_ID="admin_id";

    public static final String DEAN_ID="dean_id";

    public static final String CARETAKER_ID="caretaker_id";
    /**
     * 短token两小时
     */
    public static final Long ACCESS_TOKEN_TIME=7200000L;

    /**
     * 长token 7天
     */
    public static final Long REFRESH_TOKEN_TIME=604800000L;
}
