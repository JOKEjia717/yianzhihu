package com.zhihu.exceptions.exceptionHandler;
import com.zhihu.exceptions.BaseException;
import com.zhihu.exceptions.LoginFailedException;
import com.zhihu.exceptions.RoleException;
import com.zhihu.exceptions.RoleStatusException;
import com.zhihu.result.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理 
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
	/**
	 * 捕获其他异常
	 */
	@ExceptionHandler({BaseException.class})
	public Result<String>BaseException(BaseException e){
		return Result.error(e.getMessage());
	}

	/**
	 * 捕获token中的未登录异常
	 * @return
	 */
	@ExceptionHandler({LoginFailedException.class})
	public Result<String> unauthorized(LoginFailedException e){
		return Result.unauthorized(e);
	}

	/**
	 * 捕获用户状态异常
	 */
	@ExceptionHandler({RoleStatusException.class})
	public Result<String> roleStatusException(RoleStatusException e){
		return Result.error(e.getMessage());
	}

	/**
	 * 捕获用户角色异常
	 */
	@ExceptionHandler({RoleException.class})
	public Result<String> roleException(RoleException e){
		return Result.error(e.getMessage());
	}
	/**
	 * 捕获其他异常
	 */
	@ExceptionHandler({RuntimeException.class})
	public Result<String>Exception(RuntimeException e){
		return Result.error(e.getMessage());
	}

}
