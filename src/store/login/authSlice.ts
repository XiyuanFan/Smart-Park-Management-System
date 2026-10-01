import { createSlice } from "@reduxjs/toolkit";

export const authSlice=createSlice({
    name:"auth",
    initialState:{
        token:sessionStorage.getItem("token")||null, //默认是null
        menuList:[]
    },
    reducers:{
        setToken:(state,action)=>{
            state.token=action.payload; //登陆完成后把返回的用户token存储到redux里
            sessionStorage.setItem("token",action.payload)  //写入 sessionStorage
        },
        clearToken:state=>{
            state.token=null;
            sessionStorage.removeItem("token") 
        },
        setMenu:(state,action)=>{
            state.menuList=action.payload //保存菜单
        }
    }
})

export const{setToken,clearToken,setMenu}=authSlice.actions;
export default authSlice.reducer