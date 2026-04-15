package com.zhihu.interceptor;


import com.zhihu.context.BaseContext;
import io.netty.util.internal.StringUtil;
import org.springframework.web.servlet.HandlerInterceptor;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/**
 * @param
 * @return
 */
public class UserInfoInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //1获取登陆用户信息
        String userinfo = request.getHeader("user-info");
        String userinfo1 = userinfo;
        //2判断是否获取了用户，如果有，就存入ThreadLocal
        if (!StringUtil.isNullOrEmpty(userinfo)){
            int index = userinfo.indexOf(":");
            String userId = userinfo.substring(0,index);
            String role = userinfo1.substring(index + 1);
            BaseContext.setCurrentId(userId);
            BaseContext.setRole(role);
        }
        //3放行
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        //清理用户
        BaseContext.removeCurrentId();
    }
}
