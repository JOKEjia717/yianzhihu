package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.AdminLoginDto;
import com.zhihu.po.Admin;
import com.zhihu.vo.AdminLoginVo;

public interface AdminService extends IService<Admin> {
    AdminLoginVo login(AdminLoginDto adminLoginDto);
}
