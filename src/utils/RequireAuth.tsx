import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Iprops{
    allowed:boolean;
    redirectTo:string;
    children:any
}

//通过RequireAuth这个自定义组件实现路由守卫
function RequireAuth({allowed,redirectTo,children}:Iprops){
    const {token}= useSelector((state:any)=>state.authSlice)
    const isLogin=token?true:false; //判断是否是否登录(token是否还是null)
    const navigate=useNavigate()
    useEffect(()=>{
        //allowed表示当前路由是否需要登录   isLogin表示用户是否登录
        if(allowed!==isLogin){
            navigate(redirectTo)  
        } //如果鉴权不成功进行跳转其他页面，不能进入该路由
    },[allowed,isLogin,redirectTo]) 

    return allowed===isLogin?<>{children}</>:<></>  //鉴权成功进入鉴权的子页面，即实际想要进入的页面
}

export default RequireAuth