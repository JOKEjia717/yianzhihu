package com.zhihu.util;

import com.zhihu.util.JwtUtil;
import com.zhihu.vo.extend.LoginVo;
import lombok.Data;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import java.util.*;
import java.util.function.Function;

public class TokenUtils {

    /*
     * 创建令牌并存储至Redis
     *
     * @param entity          用户实体对象
     * @param userIdExtractor 从实体中提取用户ID的方法
     * @param loginVo         需要设置令牌的VO对象
     * @param config          令牌配置参数
     * @param redisTemplate   Redis模板
     * @param tokenScript     Redis Lua脚本
     */

    /**
     *
     * @param entity 用户实体对象
     * @param userIdExtractor 从实体中提取用户ID的方法
     * @param loginVo 需要设置令牌的VO对象
     * @param config 令牌配置参数
     * @param redisTemplate  Redis模板
     * @param tokenScript Redis Lua脚本
     * @param <T> 实体类
     * @param <V> vo需要继承自loginvo
     */
    public static <T, V extends LoginVo> void createAndStoreToken(
            T entity,
            Function<T, Long> userIdExtractor,
            V loginVo,
            TokenConfig config,
            StringRedisTemplate redisTemplate,
            RedisScript<Long> tokenScript) {

        Long userId = userIdExtractor.apply(entity);
        Map<String, Object> claims = new HashMap<>();
        claims.put(config.roleId, userId);

        // 生成双令牌
        TokenPair tokenPair = generateTokens(claims, config);

        // 存储至Redis
        boolean storageSuccess = storeTokensInRedis(userId, tokenPair, config, redisTemplate, tokenScript);

        if (storageSuccess) {
            setTokensToVo(loginVo, tokenPair, config);
        } else {
            throw new TokenStorageException("在 Redis 中存储 Token 失败");
        }
    }

    private static TokenPair generateTokens(Map<String, Object> claims, TokenConfig config) {
        return new TokenPair(
                JwtUtil.createJWT(config.getSecretKey(), config.getAccessExpire(), claims),
                JwtUtil.createJWT(config.getSecretKey(), config.getRefreshExpire(), claims)
        );
    }

    private static boolean storeTokensInRedis(Long userId,
                                              TokenPair tokenPair,
                                              TokenConfig config,
                                              StringRedisTemplate redisTemplate,
                                              RedisScript<Long> tokenScript) {
        List<String> keys = Arrays.asList(
                config.getCachePrefix() + config.getAccount() + tokenPair.getAccessToken(),
                config.getCachePrefix() + config.getAccount() + tokenPair.getRefreshToken()
        );

        List<String> args = Arrays.asList(
                userId.toString(),
                String.valueOf(config.getAccessExpire()),
                String.valueOf(config.getRefreshExpire())
        );

        Long result = redisTemplate.execute(tokenScript, keys, args.toArray());
        return result != null && result == 1;
    }

    private static <V extends LoginVo> void setTokensToVo(V loginVo, TokenPair tokenPair, TokenConfig config) {
        loginVo.setAccessToken(config.getSecretKey()+ ":" + config.getAccount() + tokenPair.getAccessToken());
        loginVo.setRefreshToken(config.getSecretKey() + ":" + config.getAccount() + tokenPair.getRefreshToken());
    }


    // 配置参数类
    @Data
    public static class TokenConfig {
        private final String secretKey;
        private final long accessExpire;
        private final long refreshExpire;
        private final String cachePrefix;
        private final String  roleId;
        private final String account;

        /**
         *
         * @param secretKey 用户密钥
         * @param accessExpire 短token过期时间
         * @param refreshExpire 长token过期时间
         * @param cachePrefix redis前缀
         * @param roleId jwt用户表示
         */
        public TokenConfig(String secretKey, long accessExpire, long refreshExpire, String cachePrefix,String roleId,String account) {
            this.secretKey = secretKey;
            this.accessExpire = accessExpire;
            this.refreshExpire = refreshExpire;
            this.cachePrefix = cachePrefix;
            this.roleId=roleId;
            this.account = account + ":";
        }
    }

    // 令牌对值对象
    public static class TokenPair {
        private final String accessToken;
        private final String refreshToken;

        public TokenPair(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public String getAccessToken() { return accessToken; }
        public String getRefreshToken() { return refreshToken; }
    }

    // 自定义异常
    public static class TokenStorageException extends RuntimeException {
        public TokenStorageException(String message) {
            super(message);
        }
    }
}