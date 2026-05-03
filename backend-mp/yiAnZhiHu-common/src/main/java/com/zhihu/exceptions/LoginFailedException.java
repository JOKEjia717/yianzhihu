package com.zhihu.exceptions;

/**
 * 登录失败
 */
public class LoginFailedException extends BaseException{
    public LoginFailedException(){
        super("账号或者密码错误!");
    }

    public LoginFailedException(String msg){
        super(msg);
    }
}
