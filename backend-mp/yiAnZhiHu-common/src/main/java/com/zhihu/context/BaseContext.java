package com.zhihu.context;

public class BaseContext {

    public static ThreadLocal<String> threadLocal = new ThreadLocal<>();

    public static ThreadLocal<String> threadLocal2 = new ThreadLocal<>();

    public static void setCurrentId(String id) {
        threadLocal.set(id);
    }

    public static String getCurrentId() {
        return threadLocal.get();
    }

    public static void setRole(String role) { threadLocal2.set(role);}

    public static String getRole() { return threadLocal2.get();}

    public static void removeCurrentId() {
        threadLocal.remove();
    }

}
