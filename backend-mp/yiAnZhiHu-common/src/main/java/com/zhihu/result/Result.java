package com.zhihu.result;

import com.zhihu.exceptions.LoginFailedException;
import lombok.Data;
import org.springframework.http.HttpStatus;

import javax.security.auth.login.LoginException;
import java.io.Serializable;

/**
 * 后端统一返回结果
 * @param <T>
 */
@Data
public class Result<T> implements Serializable {

    private Integer code; //编码：1成功，0和其它数字为失败
    private String msg; //错误信息
    private T data; //数据

    public static <T> Result<T> success() {
        Result<T> result = new Result<T>();
        result.code = 1;
        return result;
    }

    public static <T> Result<T> success(T object) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 1;
        return result;
    }

    public static <T> Result<T> error(String msg) {
        Result<T> result = new Result<T>();
        result.msg = msg;
        result.code = 0;
        return result;
    }

    public static Result<String> unauthorized(LoginFailedException e){
        Result<String> result=new Result<String>();
        result.code= HttpStatus.UNAUTHORIZED.value();
        result.msg=e.getMessage();
        return result;
    }

}
